import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { makeLang } from './i18n';
import type { Lang } from './i18n';
import { dayKey, slotFor, studyWeek, themeFor } from './time';
import type { Slot, Theme } from './time';
import { clearOutbox, flush, queueEvent } from './sync';
import type { Auth, OutEvent } from './sync';
// @ts-ignore - plain JS content module
import { PLAN, INSTR, Q } from '../content/questions';

export type Mode = 'junior' | 'senior';
export type Profile = { id: string; group: 'A' | 'B'; mode: Mode; enrol: string };
export type Answers = Record<string, unknown>;
export type State = {
  lang: Lang;
  voice: boolean;
  profile: Profile;
  r: Record<string, Answers>;
  log: Record<string, { am?: boolean; pm?: boolean }>;
  sparkles: number;
  ev: { at: string; type: string; detail?: string }[];
  auth?: Auth; // set once a grown-up has entered the child's code and PIN
};
export type Task = { instr: string; rkey: string; count: number };
export type Enrolment = { code: string; group: 'A' | 'B'; mode: Mode; enrolled: string; token: string };

const KEY = 'smileclub_web_v1';

// Dev and demo overrides from the page URL: ?theme=day|night&mode=junior|senior&lang=en|hi&group=A|B
const qs = new URLSearchParams(window.location.search);

function initial(): State {
  let saved: Partial<State> = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { saved = {}; }
  const base: State = {
    lang: 'en', voice: true,
    profile: { id: 'DEMO-01', group: 'A', mode: 'junior', enrol: dayKey() },
    r: {}, log: {}, sparkles: 0, ev: []
  };
  const s: State = { ...base, ...saved, profile: { ...base.profile, ...(saved.profile || {}) } };
  if (qs.get('lang') === 'en' || qs.get('lang') === 'hi') s.lang = qs.get('lang') as Lang;
  // Mode and group come from the study database once enrolled, so the address bar can't change them
  if (!s.auth) {
    if (qs.get('mode') === 'junior' || qs.get('mode') === 'senior') s.profile.mode = qs.get('mode') as Mode;
    if (qs.get('group') === 'A' || qs.get('group') === 'B') s.profile.group = qs.get('group') as 'A' | 'B';
  }
  return s;
}

function questionCount(instr: string, group: string): number {
  return INSTR[instr].qs.filter((id: string) => !Q[id].grp || Q[id].grp === group).length;
}

export function nextQuestionnaire(s: State, week: number): Task | null {
  const plan = PLAN[s.profile.mode];
  const pick = (i: string, k: string): Task => ({ instr: i, rkey: k, count: questionCount(i, s.profile.group) });
  const base = plan.base.find(([i, k]: string[]) => !s.r[k] && !INSTR[i].optional) || plan.base.find(([, k]: string[]) => !s.r[k]);
  if (base) return pick(base[0], base[1]);
  if (week <= 6) {
    const k = 'check_w' + week;
    return s.r[k] ? null : pick(plan.check, k);
  }
  const f = plan.final.find(([, k]: string[]) => !s.r[k]);
  return f ? pick(f[0], f[1]) : null;
}

type Ctx = {
  s: State;
  update: (fn: (n: State) => void) => void;
  t: ReturnType<typeof makeLang>['t'];
  tx: ReturnType<typeof makeLang>['tx'];
  theme: Theme;
  slot: Slot;
  week: number;
  task: Task | null;
  streak: number;
  logEvent: (type: string, detail?: string) => void;
  send: (e: Omit<OutEvent, 'id' | 'at'>) => void;
  applyEnrolment: (r: Enrolment) => void;
};

const LAST_OPEN = 'smileclub_last_open';

const AppCtx = createContext<Ctx | null>(null);
export const useApp = (): Ctx => {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside provider');
  return c;
};

function streakOf(log: State['log']): number {
  let n = 0;
  const d = new Date();
  const full = (x: Date) => { const e = log[dayKey(x)]; return !!(e && e.am && e.pm); };
  if (!full(d)) d.setDate(d.getDate() - 1);
  while (full(d)) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [now, setNow] = useState(() => new Date());

  // Re-check the clock every minute so the app flips between day and night by itself
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id); }, []);

  const update = useCallback((fn: (n: State) => void) => {
    setS(prev => {
      const n: State = structuredClone(prev);
      fn(n);
      try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* storage full or blocked */ }
      return n;
    });
  }, []);

  const logEvent = useCallback((type: string, detail?: string) => {
    update(n => { n.ev.push({ at: new Date().toISOString(), type, detail }); });
  }, [update]);

  // ---- upload to the study database ----
  const authRef = useRef(s.auth);
  authRef.current = s.auth;
  const sync = useCallback(async (keepalive = false) => {
    const r = await flush(authRef.current, keepalive);
    // This phone was replaced by another one (or the PIN was reset): ask for the code and PIN again
    if (r === 'not_enrolled') update(n => { delete n.auth; });
  }, [update]);

  const send = useCallback((e: Omit<OutEvent, 'id' | 'at'>) => {
    if (!authRef.current) return; // demo use is never uploaded
    queueEvent(e);
    void sync();
  }, [sync]);

  const applyEnrolment = useCallback((r: Enrolment) => {
    update(n => {
      if (n.profile.id !== r.code) { n.r = {}; n.log = {}; n.sparkles = 0; n.ev = []; } // a different child: start fresh
      n.profile = { id: r.code, group: r.group, mode: r.mode, enrol: r.enrolled };
      n.auth = { code: r.code, token: r.token };
    });
    if (s.profile.id !== r.code) clearOutbox();
  }, [update, s.profile.id]);

  const enrolled = !!s.auth;
  useEffect(() => {
    if (!enrolled) return undefined;
    // Count an app open at most once every 30 minutes
    let last = 0;
    try { last = Number(localStorage.getItem(LAST_OPEN) || 0); } catch { /* blocked */ }
    if (Date.now() - last > 30 * 60000) {
      try { localStorage.setItem(LAST_OPEN, String(Date.now())); } catch { /* blocked */ }
      queueEvent({ kind: 'app_open', payload: { theme: themeFor(new Date()) } });
    }
    void sync();
    const id = setInterval(() => void sync(), 2 * 60000);
    const online = () => void sync();
    const hidden = () => { if (document.visibilityState === 'hidden') void sync(true); };
    window.addEventListener('online', online);
    document.addEventListener('visibilitychange', hidden);
    return () => { clearInterval(id); window.removeEventListener('online', online); document.removeEventListener('visibilitychange', hidden); };
  }, [enrolled, sync]);

  const forced = qs.get('theme');
  const theme: Theme = forced === 'day' || forced === 'night' ? forced : themeFor(now);
  const week = studyWeek(s.profile.enrol, now);

  const value = useMemo<Ctx>(() => {
    const { t, tx } = makeLang(s.lang);
    return { s, update, t, tx, theme, slot: slotFor(theme), week, task: nextQuestionnaire(s, week), streak: streakOf(s.log), logEvent, send, applyEnrolment };
  }, [s, update, theme, week, logEvent, send, applyEnrolment]);

  useEffect(() => {
    document.documentElement.lang = s.lang;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#1B1E4B' : '#FFE7B3');
  }, [s.lang, theme]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
