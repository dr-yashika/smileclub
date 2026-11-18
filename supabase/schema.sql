-- Smile Club study database (Supabase / Postgres)
-- Run once on the project. Safe to run again.
--
-- Privacy by design:
--   * No names, phone numbers or addresses. Each child is a code (for example SC-001).
--     The list linking codes to names stays offline with the study team.
--   * The app cannot read or change tables. It can only call two functions:
--       enrol(code, pin)                  links one phone to one child
--       submit_events(code, token, list)  uploads brushing, answers and app use
--   * Researchers see everything in the Supabase dashboard (Table editor, export as CSV).

create extension if not exists pgcrypto with schema extensions;

-- ---------- tables ----------
create table if not exists public.participants (
  code              text primary key check (code ~ '^[A-Z0-9-]{3,20}$'),
  study_group       text not null check (study_group in ('A', 'B')),
  mode              text not null check (mode in ('junior', 'senior')),  -- junior 5-8 y, senior 9-12 y
  pin_hash          text not null,
  device_token_hash text,
  enrolled_at       timestamptz,
  withdrawn_at      timestamptz,
  failed_tries      int not null default 0,
  last_failed_at    timestamptz,
  note              text,
  created_at        timestamptz not null default now()
);
comment on table public.participants is 'One row per child. No names: the code-to-name list stays offline with the study team.';

create table if not exists public.events (
  id               bigint generated always as identity primary key,
  participant_code text not null references public.participants(code),
  client_id        uuid not null unique,              -- made on the phone, so a retried upload is never saved twice
  kind             text not null check (kind in ('brush', 'answers', 'app_open', 'video', 'consent', 'family')),
  slot             text check (slot in ('am', 'pm')), -- brushing: morning or night
  rkey             text,                               -- questionnaire round, for example hab_0, check_w3, quiz_6
  instr            text,                               -- questionnaire id, for example jhab, squiz
  payload          jsonb not null default '{}'::jsonb,
  happened_at      timestamptz not null,               -- phone clock
  received_at      timestamptz not null default now()
);
create index if not exists events_participant_idx on public.events (participant_code, happened_at);

alter table public.participants enable row level security;
alter table public.events enable row level security;
-- No policies on purpose: the public app key can't read or write these tables directly.
revoke all on public.participants, public.events from anon, authenticated;

-- ---------- researcher: add a child (run in the SQL editor) ----------
-- select * from public.add_participant('SC-001', 'A', 'junior');
-- Returns the code and a new 6-digit PIN. Write both on the study card. The PIN is not stored in readable form.
create or replace function public.add_participant(p_code text, p_group text, p_mode text, p_note text default null)
returns table (participant_code text, pin text)
language plpgsql security definer set search_path = public, extensions as $$
declare
  b bytea := gen_random_bytes(4);
  v_pin text := lpad(((get_byte(b, 0)::bigint * 16777216 + get_byte(b, 1) * 65536 + get_byte(b, 2) * 256 + get_byte(b, 3)) % 1000000)::text, 6, '0');
  v_code text := upper(trim(p_code));
begin
  insert into public.participants (code, study_group, mode, pin_hash, note)
  values (v_code, upper(trim(p_group)), lower(trim(p_mode)), crypt(v_pin, gen_salt('bf')), p_note);
  return query select v_code, v_pin;
end $$;

-- New PIN for a child (lost card, or a new phone). The old phone stops uploading.
create or replace function public.reset_pin(p_code text)
returns table (participant_code text, pin text)
language plpgsql security definer set search_path = public, extensions as $$
declare
  b bytea := gen_random_bytes(4);
  v_pin text := lpad(((get_byte(b, 0)::bigint * 16777216 + get_byte(b, 1) * 65536 + get_byte(b, 2) * 256 + get_byte(b, 3)) % 1000000)::text, 6, '0');
  v_code text := upper(trim(p_code));
begin
  update public.participants
     set pin_hash = crypt(v_pin, gen_salt('bf')), device_token_hash = null, failed_tries = 0, last_failed_at = null
   where code = v_code;
  if not found then raise exception 'No participant %', v_code; end if;
  return query select v_code, v_pin;
end $$;

-- ---------- app: link this phone to a child ----------
create or replace function public.enrol(p_code text, p_pin text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  p public.participants;
  v_token text;
begin
  select * into p from public.participants where code = upper(trim(coalesce(p_code, '')));
  if not found or p.withdrawn_at is not null then
    return jsonb_build_object('ok', false, 'error', 'wrong');
  end if;
  -- 5 wrong PINs locks the code for 15 minutes
  if p.failed_tries >= 5 and p.last_failed_at > now() - interval '15 minutes' then
    return jsonb_build_object('ok', false, 'error', 'locked');
  end if;
  if p.pin_hash <> crypt(coalesce(p_pin, ''), p.pin_hash) then
    update public.participants
       set failed_tries = case when last_failed_at is null or last_failed_at < now() - interval '15 minutes' then 1 else failed_tries + 1 end,
           last_failed_at = now()
     where code = p.code;
    return jsonb_build_object('ok', false, 'error', 'wrong');
  end if;
  v_token := encode(gen_random_bytes(32), 'hex');
  update public.participants
     set device_token_hash = encode(digest(v_token, 'sha256'), 'hex'),
         enrolled_at = coalesce(enrolled_at, now()),
         failed_tries = 0, last_failed_at = null
   where code = p.code
  returning * into p;
  return jsonb_build_object('ok', true, 'code', p.code, 'group', p.study_group, 'mode', p.mode,
    'enrolled', to_char(p.enrolled_at at time zone 'Asia/Kolkata', 'YYYY-MM-DD'), 'token', v_token);
end $$;

-- ---------- app: upload records (up to 200 at a time) ----------
create or replace function public.submit_events(p_code text, p_token text, p_events jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_code text;
  n int;
begin
  select code into v_code from public.participants
   where code = upper(trim(coalesce(p_code, ''))) and withdrawn_at is null
     and device_token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
  if v_code is null then
    return jsonb_build_object('ok', false, 'error', 'not_enrolled');
  end if;
  if jsonb_typeof(p_events) is distinct from 'array' or jsonb_array_length(p_events) > 200 or pg_column_size(p_events) > 500000 then
    return jsonb_build_object('ok', false, 'error', 'bad_batch');
  end if;
  insert into public.events (participant_code, client_id, kind, slot, rkey, instr, payload, happened_at)
  select v_code, (e->>'id')::uuid, e->>'kind', e->>'slot', e->>'rkey', e->>'instr',
         coalesce(e->'payload', '{}'::jsonb), (e->>'at')::timestamptz
    from jsonb_array_elements(p_events) e
  on conflict (client_id) do nothing;
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'saved', n);
end $$;

-- Only enrol and submit_events are open to the app. Researcher functions are dashboard-only.
revoke execute on function public.add_participant(text, text, text, text) from public, anon, authenticated;
revoke execute on function public.reset_pin(text) from public, anon, authenticated;
revoke execute on function public.enrol(text, text) from public;
revoke execute on function public.submit_events(text, text, jsonb) from public;
grant execute on function public.enrol(text, text) to anon, authenticated;
grant execute on function public.submit_events(text, text, jsonb) to anon, authenticated;

-- ---------- researcher views (Table editor, export as CSV) ----------
create or replace view public.participant_summary with (security_invoker = true) as
select p.code, p.study_group, p.mode,
       p.enrolled_at at time zone 'Asia/Kolkata' as enrolled_ist,
       p.withdrawn_at,
       count(e.id) filter (where e.kind = 'brush') as brush_sessions,
       count(distinct e.rkey) filter (where e.kind = 'answers') as questionnaires_done,
       max(e.happened_at) at time zone 'Asia/Kolkata' as last_seen_ist
  from public.participants p
  left join public.events e on e.participant_code = p.code
 group by p.code;

create or replace view public.brushing_by_day with (security_invoker = true) as
select participant_code,
       (happened_at at time zone 'Asia/Kolkata')::date as day,
       bool_or(slot = 'am') as morning,
       bool_or(slot = 'pm') as night,
       count(*) as sessions
  from public.events
 where kind = 'brush'
 group by 1, 2;

create or replace view public.answers_long with (security_invoker = true) as
select e.participant_code,
       e.rkey as round,
       e.instr as questionnaire,
       kv.key as question,
       kv.value #>> '{}' as answer,
       e.happened_at at time zone 'Asia/Kolkata' as answered_ist
  from public.events e
 cross join lateral jsonb_each(e.payload) kv
 where e.kind = 'answers';

revoke all on public.participant_summary, public.brushing_by_day, public.answers_long from anon, authenticated;
