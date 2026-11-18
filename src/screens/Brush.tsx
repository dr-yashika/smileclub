import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { dayKey } from '../lib/time';
import { go } from '../lib/router';
import { speak, stopSpeaking } from '../lib/speech';
import type { TKey } from '../lib/i18n';
import { IconClose, IconPause, IconPlay } from '../ui/icons';
import { Stars } from '../ui/components';

const TOTAL = 120;
const ZONE = 30;
const ZONES: TKey[] = ['zone1', 'zone2', 'zone3', 'zone4'];

// Front view of a smile: 6 top + 6 bottom teeth. Each half-row is one 30-second zone.
function Smile({ zone, started }: { zone: number; started: boolean }) {
  const up = [6, 2, 0, 0, 2, 6];
  const down = [0, 4, 6, 6, 4, 0];
  const fill = (z: number) => (!started ? 'var(--tooth-wait)' : z < zone ? '#FFFFFF' : z === zone ? '#3DD6B5' : 'var(--tooth-wait)');
  const toothZone = (row: 0 | 1, i: number) => row * 2 + (i < 3 ? 0 : 1);
  return (
    <svg viewBox="0 0 160 112" width="62%" aria-hidden="true">
      <rect x="6" y="10" width="148" height="40" rx="20" fill="#F48FA6" opacity=".9" />
      <rect x="6" y="58" width="148" height="44" rx="22" fill="#F48FA6" opacity=".9" />
      {up.map((o, i) => <rect key={'u' + i} x={13 + i * 23} y={20 + o} width="20" height="26" rx="8" fill={fill(toothZone(0, i))} />)}
      {down.map((o, i) => <rect key={'d' + i} x={13 + i * 23} y={60 + o} width="20" height="26" rx="8" fill={fill(toothZone(1, i))} />)}
      {started && zone > 0 && <path d="M30 4c.6 3.6 3.1 6.1 6.7 6.7-3.6.6-6.1 3.1-6.7 6.7-.6-3.6-3.1-6.1-6.7-6.7 3.6-.6 6.1-3.1 6.7-6.7z" fill="#FFCB45" />}
    </svg>
  );
}

export function Brush() {
  const { s, t, slot, theme, update, logEvent, send } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const started = running || elapsed > 0;
  const zone = Math.min(3, Math.floor(elapsed / ZONE));
  const left = TOTAL - elapsed;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setElapsed(e => Math.min(TOTAL, e + 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && s.voice) speak(`${t(ZONES[zone])}. ${t('circles')}.`, s.lang);
  }, [zone, running]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (elapsed < TOTAL) return;
    setRunning(false);
    const k = dayKey();
    update(n => {
      const first = !n.log[k]?.[slot];
      n.log[k] = { ...n.log[k], [slot]: true };
      if (first) n.sparkles += 2;
    });
    logEvent('brush', slot);
    send({ kind: 'brush', slot, payload: { secs: TOTAL } });
    go('/done?kind=brush');
  }, [elapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeaking(), []);

  const R = 140;
  const C = 2 * Math.PI * R;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div className="app">
      <Stars />
      <div className="flow" style={{ ['--tooth-wait' as string]: theme === 'night' ? 'rgba(255,255,255,.35)' : '#E3E6F5' }}>
        <div className="flow-head">
          <button className="icon-btn" aria-label={t('close')} onClick={() => go('/')}><IconClose size={18} color="var(--ink-3)" /></button>
          <div className="progress" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }} aria-hidden="true">
            {ZONES.map((_, i) => <span key={i} className={started && i < zone ? 'on' : ''} style={started && i === zone ? { background: `linear-gradient(90deg, var(--mint) ${((elapsed - i * ZONE) / ZONE) * 100}%, var(--track) 0)` } : undefined} />)}
          </div>
        </div>

        <div className="timer-wrap">
          <div className="timer">
            <svg viewBox="0 0 320 320" aria-hidden="true">
              <circle cx="160" cy="160" r={R} fill="none" stroke="var(--track)" strokeWidth="16" />
              <circle cx="160" cy="160" r={R} fill="none" stroke="var(--mint)" strokeWidth="16" strokeLinecap="round"
                strokeDasharray={`${(elapsed / TOTAL) * C} ${C}`} transform="rotate(-90 160 160)" style={{ transition: 'stroke-dasharray 1s linear' }} />
              {[0, 1, 2, 3].map(i => {
                const a = (i * 90 - 90) * Math.PI / 180;
                return <circle key={i} cx={160 + R * Math.cos(a)} cy={160 + R * Math.sin(a)} r="5" fill={started && elapsed >= i * ZONE ? 'var(--on-mint)' : 'var(--ink-3)'} />;
              })}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Smile zone={zone} started={started} />
              <div className="timer-time" aria-live="off">{mm}:{ss}</div>
            </div>
          </div>
          <div className="zone-pill" aria-live="polite">{started ? t(ZONES[zone]) : t('ready')}</div>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink-3)' }}>{t('circles')}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12 }}>
          <button className="round-btn" aria-label={running ? t('pause') : t('resume')} onClick={() => setRunning(r => !r)}>
            {running ? <IconPause size={36} color="var(--on-mint)" /> : <IconPlay size={36} color="var(--on-mint)" />}
          </button>
        </div>
      </div>
    </div>
  );
}
