import { useEffect, useRef, useState } from 'react';
import { useApp } from '../lib/store';
import { DAY_LETTERS } from '../lib/i18n';
import { dayKey, weekKeys } from '../lib/time';
import { speak, stopSpeaking } from '../lib/speech';
import { go } from '../lib/router';
import { IconFlame, IconHome, IconJourney, IconLearn, IconLock, IconRewards, IconSparkle, IconSpeaker, Wave } from './icons';

// quiet: leaves out the two sparkles, for text-heavy screens where they would sit on words
export function Stars({ quiet = false }: { quiet?: boolean }) {
  return (
    <svg className="stars" viewBox="0 0 390 600" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <circle cx="40" cy="150" r="1.6" fill="#fff" opacity=".7" /><circle cx="352" cy="128" r="1.4" fill="#fff" opacity=".6" />
      <circle cx="74" cy="430" r="1.4" fill="#fff" opacity=".5" /><circle cx="300" cy="200" r="1" fill="#fff" opacity=".5" />
      <circle cx="20" cy="330" r="1.2" fill="#fff" opacity=".5" /><circle cx="368" cy="380" r="1.2" fill="#fff" opacity=".5" />
      {!quiet && (
        <>
          <path d="M62 236c.8 4.6 4 7.8 8.6 8.6-4.6.8-7.8 4-8.6 8.6-.8-4.6-4-7.8-8.6-8.6 4.6-.8 7.8-4 8.6-8.6z" fill="#FFCB45" />
          <path d="M338 296c.6 3.4 2.9 5.7 6.3 6.3-3.4.6-5.7 2.9-6.3 6.3-.6-3.4-2.9-5.7-6.3-6.3 3.4-.6 5.7-2.9 6.3-6.3z" fill="#FFFFFF" opacity=".85" />
        </>
      )}
    </svg>
  );
}

// Press and hold for 2 seconds: keeps young children out of the grown-ups area
export function HoldButton({ label, onDone }: { label: string; onDone: () => void }) {
  const [p, setP] = useState(0);
  const raf = useRef(0);
  const t0 = useRef(0);
  const stop = () => { cancelAnimationFrame(raf.current); setP(0); };
  const tick = () => {
    const v = Math.min(1, (performance.now() - t0.current) / 2000);
    setP(v);
    if (v >= 1) { setP(0); onDone(); return; }
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <button className="icon-btn" aria-label={label} style={{ position: 'relative', touchAction: 'none' }}
      onPointerDown={e => { e.preventDefault(); t0.current = performance.now(); raf.current = requestAnimationFrame(tick); }}
      onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={e => e.preventDefault()}>
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {p > 0 && <circle cx="22" cy="22" r="20" fill="none" stroke="var(--mint)" strokeWidth="3" strokeDasharray={`${p * 125.7} 200`} transform="rotate(-90 22 22)" strokeLinecap="round" />}
      </svg>
      <IconLock size={20} color="var(--ink-3)" />
    </button>
  );
}

export function TopBar() {
  const { s, t, streak } = useApp();
  return (
    <div className="topbar">
      <HoldButton label={t('grownUps')} onDone={() => go('/grownups')} />
      <div className="pills">
        <span className="pill" aria-label={t('sparkles', { n: s.sparkles })}><IconSparkle size={22} color="var(--gold)" />{s.sparkles}</span>
        <span className="pill" aria-label={t('streak', { n: streak })}><IconFlame size={22} />{streak}</span>
      </div>
    </div>
  );
}

// Reads text aloud; shows a moving wave while speaking. autoOnce reads it once per app session.
const spokenOnce = new Set<string>();
export function SpeakButton({ text, label, autoOnce }: { text: string; label: string; autoOnce?: string }) {
  const { s } = useApp();
  const [on, setOn] = useState(false);
  const say = () => { setOn(true); if (!speak(text, s.lang, () => setOn(false))) setOn(false); };
  useEffect(() => {
    if (autoOnce && s.voice && !spokenOnce.has(autoOnce)) { spokenOnce.add(autoOnce); say(); }
    return () => stopSpeaking();
  }, [autoOnce]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <button className={'speak' + (on ? ' on' : '')} aria-label={label} onClick={say}>
      <IconSpeaker size={24} color="var(--accent-ink)" /><Wave color="var(--accent-ink)" />
    </button>
  );
}

export function Hill() {
  return (
    <svg className="hill" viewBox="0 0 390 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 38C70 2 150 2 214 20S330 42 390 10V40H0z" fill="var(--ground)" />
      <path d="M0 38C70 2 150 2 214 20S330 42 390 10" fill="none" stroke="var(--ground-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Seven split circles: left half = morning brush, right half = night brush
export function WeekStrip() {
  const { s, t } = useApp();
  const keys = weekKeys();
  const today = dayKey();
  const letters = DAY_LETTERS[s.lang];
  const full = keys.filter(k => s.log[k]?.am && s.log[k]?.pm).length;
  return (
    <section className="week" aria-label={t('streak', { n: full })}>
      {keys.map((k, i) => {
        const e = s.log[k] || {};
        const left = e.am ? 'var(--gold)' : 'var(--muted-dot)';
        const right = e.pm ? 'var(--lilac)' : 'var(--muted-dot)';
        return (
          <div key={k} className={k === today ? 'today' : ''}>
            <span className="dot" style={{ background: `linear-gradient(90deg, ${left} 50%, ${right} 50%)` }} />
            {letters[i]}
          </div>
        );
      })}
    </section>
  );
}

export function NavBar({ active }: { active: 'today' | 'learn' | 'journey' | 'rewards' }) {
  const { t } = useApp();
  const items = [
    { k: 'today', href: '#/', icon: IconHome, label: t('today') },
    { k: 'learn', href: '#/learn', icon: IconLearn, label: t('learn') },
    { k: 'journey', href: '#/journey', icon: IconJourney, label: t('journey') },
    { k: 'rewards', href: '#/rewards', icon: IconRewards, label: t('rewards') }
  ] as const;
  return (
    <nav className="nav">
      {items.map(({ k, href, icon: Ico, label }) => (
        <a key={k} href={href} className={active === k ? 'on' : ''} aria-current={active === k ? 'page' : undefined}>
          <Ico size={26} color={active === k ? 'var(--nav-active-ink)' : 'var(--ink-3)'} />{label}
        </a>
      ))}
    </nav>
  );
}
