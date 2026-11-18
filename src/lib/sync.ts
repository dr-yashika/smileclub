import { SUPABASE_KEY, SUPABASE_URL, hasBackend } from '../config';

// Every record is saved on the phone first (the outbox) and uploaded when there is internet.
// Each record has its own id, so an upload that is retried is never saved twice.

export type EventKind = 'brush' | 'answers' | 'app_open' | 'video' | 'consent' | 'family';
export type OutEvent = {
  id: string;
  kind: EventKind;
  at: string;
  slot?: string;
  rkey?: string;
  instr?: string;
  payload?: Record<string, unknown>;
};
export type Auth = { code: string; token: string };
export type FlushResult = 'ok' | 'idle' | 'busy' | 'offline' | 'failed' | 'not_enrolled';
export type EnrolResult =
  | { ok: true; code: string; group: 'A' | 'B'; mode: 'junior' | 'senior'; enrolled: string; token: string }
  | { ok: false; error: 'wrong' | 'locked' | 'offline' };

const OUTBOX = 'smileclub_outbox_v1';

function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 15) | 64;
  b[8] = (b[8] & 63) | 128;
  const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function readBox(): OutEvent[] {
  try { return JSON.parse(localStorage.getItem(OUTBOX) || '[]'); } catch { return []; }
}
function writeBox(box: OutEvent[]): void {
  try { localStorage.setItem(OUTBOX, JSON.stringify(box)); } catch { /* storage full or blocked */ }
}

export const pendingCount = (): number => readBox().length;
export const clearOutbox = (): void => writeBox([]);

export function queueEvent(e: Omit<OutEvent, 'id' | 'at'>): void {
  const box = readBox();
  box.push({ ...e, id: newId(), at: new Date().toISOString() });
  writeBox(box);
}

async function rpc(fn: string, body: unknown, keepalive = false): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: SUPABASE_KEY };
  // Older Supabase projects use a JWT "anon" key, which also goes in the Authorization header
  if (SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + SUPABASE_KEY;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers, body: JSON.stringify(body), keepalive });
  if (!res.ok) throw new Error(`${fn} returned ${res.status}`);
  return res.json();
}

export async function enrolDevice(code: string, pin: string): Promise<EnrolResult> {
  try {
    const r = await rpc('enrol', { p_code: code.trim().toUpperCase(), p_pin: pin.trim() });
    if (r.ok) return r as unknown as EnrolResult;
    return { ok: false, error: r.error === 'locked' ? 'locked' : 'wrong' };
  } catch {
    return { ok: false, error: 'offline' };
  }
}

let busy = false;

// Uploads the outbox in batches. keepalive lets the last upload finish while the page is closing (small batches only).
export async function flush(auth: Auth | undefined, keepalive = false): Promise<FlushResult> {
  if (!hasBackend() || !auth) return 'idle';
  if (busy) return 'busy';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  busy = true;
  try {
    for (let round = 0; round < 20; round++) {
      const batch = readBox().slice(0, keepalive ? 20 : 100);
      if (!batch.length) return 'ok';
      const r = await rpc('submit_events', { p_code: auth.code, p_token: auth.token, p_events: batch }, keepalive);
      if (!r.ok) return r.error === 'not_enrolled' ? 'not_enrolled' : 'failed';
      const sent = new Set(batch.map(e => e.id));
      writeBox(readBox().filter(e => !sent.has(e.id)));
    }
    return 'ok';
  } catch {
    return 'offline';
  } finally {
    busy = false;
  }
}
