import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { dayKey } from '../lib/time';
import { go } from '../lib/router';
import { speak, stopSpeaking } from '../lib/speech';
import { BrushArt } from '../ui/art';
import { IconChevron, IconClose, IconPause, IconPlay, IconSpeaker, IconSpeakerOff } from '../ui/icons';
import { Stars } from '../ui/components';

const TOTAL = 120; // seconds
const ZONE = 30; // one quarter of the mouth
const PER_TOOTH = 10; // three teeth per quarter
const COUNTDOWN = 3;

// Brushing goes clockwise around the mouth as seen on screen, and each quarter of the ring sits
// next to its teeth: top-left, top-right, bottom-right, bottom-left. Teeth are 0-5, left to right.
type Quarter = { row: 'top' | 'bottom'; side: 'left' | 'right'; teeth: number[] };
const BRUSH_ORDER: Quarter[] = [
  { row: 'top', side: 'left', teeth: [0, 1, 2] },
  { row: 'top', side: 'right', teeth: [3, 4, 5] },
  { row: 'bottom', side: 'right', teeth: [5, 4, 3] },
  { row: 'bottom', side: 'left', teeth: [2, 1, 0] }
];

// Preview hook for screenshots: ?demo&at=45 opens the timer already 45 seconds in
const previewAt = (() => {
  const q = new URLSearchParams(window.location.search);
  return q.has('demo') && q.has('at') ? Math.max(0, Math.min(TOTAL - 1, Number(q.get('at')) || 0)) : -1;
})();

// ---------- the mouth ----------
const UP_X = (i: number) => 33.5 + i * 26; // 6 top teeth, 23 wide
const UP_BOTTOM = [56, 60, 62, 62, 60, 56];
const LOW_X = (i: number) => 39.5 + i * 24; // 6 bottom teeth, 21 wide
const LOW_TOP = [84, 88, 90, 90, 88, 84];
const LIPS = 'M18 44C18 28 58 20 110 20S202 28 202 44C202 100 160 136 110 136S18 100 18 44Z';
// Four-point sparkle of radius r centred on (x, y), same shape as the sparkles elsewhere in the app
const SPARK = (x: number, y: number, r: number) => {
  const a = (r * 0.093).toFixed(2), b = (r * 0.535).toFixed(2), c = (r * 0.465).toFixed(2), d = (r * 0.907).toFixed(2);
  return `M${x} ${y - r}c${a} ${b} ${c} ${d} ${r} ${r}c-${b} ${a}-${d} ${c}-${r} ${r}c-${a}-${b}-${c}-${d}-${r}-${r}c${b}-${a} ${d}-${c} ${r}-${r}z`;
};
const QUARTER_SPARK: [number, number][] = [[6, 22], [214, 22], [210, 130], [10, 130]];

type ToothState = 'wait' | 'now' | 'clean';

function Mouth({ state, brush, scrubbing }: {
  state: (row: 'top' | 'bottom', i: number) => ToothState;
  brush: { row: 'top' | 'bottom'; side: 'left' | 'right'; tooth: number } | null;
  scrubbing: boolean;
}) {
  const fill = (s: ToothState) => (s === 'clean' ? '#FFFFFF' : '#EBDDB2');
  const line = (s: ToothState) => (s === 'now' ? { stroke: '#3DD6B5', strokeWidth: 3.5 } : {});

  let brushStyle;
  if (brush) {
    const s = 0.44;
    const top = brush.row === 'top';
    const left = brush.side === 'left';
    const cx = top ? UP_X(brush.tooth) + 11.5 : LOW_X(brush.tooth) + 10.5;
    const ox = left ? cx + 26 * s : cx - 26 * s; // the head's centre is 26 units along the handle
    const oy = top ? UP_BOTTOM[brush.tooth] + 38 * s : LOW_TOP[brush.tooth] - 38 * s; // bristle tips touch the tooth
    brushStyle = { transform: `translate(${ox}px, ${oy}px) scale(${left ? -s : s}, ${top ? s : -s})` };
  }

  return (
    <svg x="29" y="60" width="262" height="161" viewBox="-12 -2 244 150" aria-hidden="true">
      <defs><clipPath id="mouth-in"><path d={LIPS} /></clipPath></defs>
      <path d={LIPS} fill="#4A1838" />
      <g clipPath="url(#mouth-in)">
        {UP_BOTTOM.map((b, i) => <rect key={'u' + i} x={UP_X(i)} y={18} width={23} height={b - 18} rx={9} fill={fill(state('top', i))} {...line(state('top', i))} />)}
        <path d="M0 0H220V36Q110 20 0 36Z" fill="#F27E96" />
        {LOW_TOP.map((t, i) => <rect key={'l' + i} x={LOW_X(i)} y={t} width={21} height={140 - t} rx={8} fill={fill(state('bottom', i))} {...line(state('bottom', i))} />)}
        <path d="M0 150H220V112Q110 132 0 112Z" fill="#F27E96" />
      </g>
      <path d={LIPS} fill="none" stroke="#FF8FA3" strokeWidth="9" strokeLinejoin="round" />
      {BRUSH_ORDER.map((q, k) => q.teeth.every(i => state(q.row, i) === 'clean') && (
        <path key={k} className="burst" d={SPARK(QUARTER_SPARK[k][0], QUARTER_SPARK[k][1], 9)} fill="#FFCB45" />
      ))}
      {brush && (
        <g className="brush-move" style={brushStyle}>
          <g className={scrubbing ? 'scrub' : undefined}><BrushArt /></g>
        </g>
      )}
    </svg>
  );
}

// ---------- the ring: four quarters, each next to its teeth ----------
const RING_R = 146;
function arc(i: number): string {
  const a0 = 180 + 90 * i + 5;
  const a1 = 270 + 90 * i - 5;
  const pt = (a: number) => `${(160 + RING_R * Math.cos((a * Math.PI) / 180)).toFixed(2)} ${(160 + RING_R * Math.sin((a * Math.PI) / 180)).toFixed(2)}`;
  return `M${pt(a0)}A${RING_R} ${RING_R} 0 0 1 ${pt(a1)}`;
}

export function Brush() {
  const { s, t, slot, update, logEvent, send } = useApp();
  const [phase, setPhase] = useState<'count' | 'run' | 'pause'>(previewAt >= 0 ? 'run' : 'count');
  const [count, setCount] = useState(COUNTDOWN);
  const [elapsed, setElapsed] = useState(Math.max(0, previewAt));
  const zone = Math.min(3, Math.floor(elapsed / ZONE));
  const step = Math.min(2, Math.floor((elapsed - zone * ZONE) / PER_TOOTH));
  const started = phase !== 'count';

  // 3, 2, 1 ... then brushing starts by itself
  useEffect(() => {
    if (phase !== 'count') return undefined;
    if (count === 0) { setPhase('run'); return undefined; }
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, count]);

  useEffect(() => {
    if (phase !== 'run') return undefined;
    const id = setInterval(() => setElapsed(e => Math.min(TOTAL, e + 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { if (s.voice && previewAt < 0) speak(t('getReady'), s.lang); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // New quarter: say where to brush, and buzz the phone (Android)
  useEffect(() => {
    if (phase !== 'run' || elapsed >= TOTAL) return;
    const say = [`${t('topTeeth')}. ${t('circles')}.`, t('otherSide'), t('bottomTeeth'), t('otherSide')][zone];
    if (s.voice) speak(say, s.lang);
    if (zone > 0) navigator.vibrate?.(70);
  }, [zone, phase === 'run']); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (elapsed < TOTAL) return;
    setPhase('pause');
    const k = dayKey();
    update(n => {
      const first = !n.log[k]?.[slot];
      n.log[k] = { ...n.log[k], [slot]: true };
      if (first) n.sparkles += 2;
    });
    logEvent('brush', slot);
    send({ kind: 'brush', slot, payload: { secs: TOTAL, complete: true } });
    go('/done?kind=brush');
  }, [elapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeaking(), []);

  const toothState = (row: 'top' | 'bottom', i: number): ToothState => {
    if (!started) return 'wait';
    for (let z = 0; z < 4; z++) {
      const q = BRUSH_ORDER[z];
      if (q.row !== row) continue;
      const j = q.teeth.indexOf(i);
      if (j < 0) continue;
      if (z < zone || (z === zone && j < step) || elapsed >= TOTAL) return 'clean';
      if (z === zone && j === step) return 'now';
      return 'wait';
    }
    return 'wait';
  };
  const q = BRUSH_ORDER[zone];
  const brush = { row: q.row, side: q.side, tooth: q.teeth[started ? step : 0] };

  const left = TOTAL - elapsed;
  const time = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  const label = q.row === 'top' ? t('topTeeth') : t('bottomTeeth');
  const arrow = <span className={'pill-arrow' + (q.side === 'left' ? ' flip' : '')}><IconChevron size={20} color="var(--mint)" /></span>;

  const toggle = () => setPhase(p => (p === 'run' ? 'pause' : 'run'));
  const toggleVoice = () => { if (s.voice) stopSpeaking(); update(n => { n.voice = !n.voice; }); };

  return (
    <div className="app">
      <Stars quiet />
      <div className="flow">
        <div className="flow-head" style={{ justifyContent: 'space-between' }}>
          <button className="icon-btn" aria-label={t('close')} onClick={() => { stopSpeaking(); go('/'); }}><IconClose size={18} color="var(--ink-3)" /></button>
          <button className="icon-btn" aria-label={s.voice ? t('soundOff') : t('soundOn')} aria-pressed={!s.voice} onClick={toggleVoice}>
            {s.voice ? <IconSpeaker size={22} color="var(--ink-3)" /> : <IconSpeakerOff size={22} color="var(--ink-3)" />}
          </button>
        </div>

        <div className="brush-wrap">
          <div className={'brush-ring' + (phase === 'pause' ? ' paused' : '')}>
            <svg viewBox="0 0 320 320" aria-hidden="true">
              {[0, 1, 2, 3].map(i => {
                const frac = started ? Math.max(0, Math.min(1, (elapsed - i * ZONE) / ZONE)) : 0;
                return (
                  <g key={i}>
                    <path d={arc(i)} fill="none" stroke="var(--track)" strokeWidth="14" strokeLinecap="round" />
                    {frac > 0 && <path className="ring-progress" d={arc(i)} pathLength={100} fill="none" stroke="var(--mint)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${frac * 100} 100`} />}
                  </g>
                );
              })}
              <Mouth state={toothState} brush={brush} scrubbing={phase === 'run'} />
              {started
                ? <text x="160" y="258" textAnchor="middle" className="ring-time">{time}</text>
                : <text key={count} x="160" y="270" textAnchor="middle" className="ring-count">{Math.max(1, count)}</text>}
            </svg>
          </div>

          <div className="zone-pill" aria-live="polite">
            {!started ? t('getReady') : phase === 'pause' ? t('paused') : (
              <>{q.side === 'left' && arrow}{label}{q.side === 'right' && arrow}</>
            )}
          </div>
          <p className="brush-hint">{t('circles')}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12 }}>
          <button className="round-btn" aria-label={phase === 'run' ? t('pause') : phase === 'count' ? t('startNow') : t('resume')}
            onClick={phase === 'count' ? () => setPhase('run') : toggle}>
            {phase === 'run' ? <IconPause size={36} color="var(--on-mint)" /> : <IconPlay size={36} color="var(--on-mint)" />}
          </button>
        </div>
      </div>
    </div>
  );
}
