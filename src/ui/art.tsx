// Illustrations: flat shapes, one darker underside, one light highlight. No characters.

// Toothbrush seen from the side; head at the origin, handle to the right.
export function BrushArt({ x = 0, y = 0, r = 0, s = 1 }: { x?: number; y?: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="0" y="-10" width="118" height="22" rx="11" fill="#1F9E83" />
      <rect x="0" y="-10" width="118" height="17" rx="8.5" fill="#3DD6B5" />
      <rect x="56" y="-6" width="48" height="4" rx="2" fill="#FFFFFF" opacity=".55" />
      <rect x="4" y="-36" width="44" height="28" rx="8" fill="#DCE0FF" />
      <rect x="4" y="-36" width="44" height="23" rx="8" fill="#FFFFFF" />
      <path d="M16 -33v18M26 -33v18M36 -33v18" stroke="#E4E7FF" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M3 -38c1-9 9-11 14-6 3-8 13-9 17-2 5-6 14-4 16 3 1 6-3 7-8 7H9c-5 0-6.5-1-6-2z" fill="#9FF0DD" />
    </g>
  );
}

// The big tap target on Today: a moon at night, a sun in the day.
export function OrbArt({ kind }: { kind: 'moon' | 'sun' }) {
  const id = 'glow-' + kind;
  return (
    <svg viewBox="-10 -10 300 300" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset=".62" stopColor={kind === 'moon' ? '#FFD86B' : '#FFC93C'} stopOpacity={kind === 'moon' ? 0.28 : 0.35} />
          <stop offset="1" stopColor={kind === 'moon' ? '#FFD86B' : '#FFC93C'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="140" cy="140" r="150" fill={`url(#${id})`} />
      {kind === 'sun' && (
        <g stroke="#FFC93C" strokeWidth="14" strokeLinecap="round">
          <path d="M140 8v18M140 254v18M8 140h18M254 140h18M46.7 46.7l12.7 12.7M220.6 220.6l12.7 12.7M46.7 233.3l12.7-12.7M220.6 59.4l12.7-12.7" />
        </g>
      )}
      <circle cx="140" cy="140" r="104" fill={kind === 'moon' ? '#EDB53F' : '#F2A91E'} />
      <circle cx="132" cy="132" r="97" fill={kind === 'moon' ? '#FFD86B' : '#FFC93C'} />
      <ellipse cx="96" cy="88" rx="22" ry="12" fill={kind === 'moon' ? '#FFF0B8' : '#FFE59A'} opacity=".8" transform="rotate(-35 96 88)" />
      {kind === 'moon' && <><circle cx="168" cy="94" r="12" fill="#F2C24E" opacity=".8" /><circle cx="190" cy="140" r="7" fill="#F2C24E" opacity=".7" /></>}
      <BrushArt x={52} y={212} r={-38} />
    </svg>
  );
}

// Close-up of a brush head with an amount of toothpaste
export function PasteBrush({ amount, w = 166 }: { amount: string; w?: number }) {
  const blob: Record<string, JSX.Element> = {
    smear: <><ellipse cx="58" cy="40" rx="8" ry="5.5" fill="#4FD9BC" /><ellipse cx="56" cy="38.5" rx="3" ry="1.6" fill="#fff" opacity=".8" /></>,
    pea: <><circle cx="58" cy="30" r="15" fill="#4FD9BC" /><path d="M50 26a9 9 0 0 1 9-5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" /></>,
    half: <><path d="M14 45V36a10 10 0 0 1 10-10h30a9 9 0 0 1 0 18H58l-2 1z" fill="#4FD9BC" /><path d="M54 26c8 0 11 7 6 12" stroke="#2FBF9F" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M24 31h22" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity=".85" /></>,
    full: <><path d="M10 45V35a10 10 0 0 1 10-10h82a10 10 0 0 1 0 20z" fill="#4FD9BC" /><path d="M102 25c9 0 12 9 5 15" stroke="#2FBF9F" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M22 30h64" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity=".85" /></>
  };
  return (
    <svg width={w} height={w * 110 / 166} viewBox="-16 0 166 110" aria-hidden="true">
      <rect x="6" y="80" width="170" height="26" rx="13" fill="#1F9E83" /><rect x="6" y="80" width="170" height="20" rx="10" fill="#3DD6B5" />
      <rect x="112" y="85" width="40" height="5" rx="2.5" fill="#fff" opacity=".55" />
      <rect x="12" y="44" width="92" height="40" rx="12" fill="#DCE0FF" /><rect x="12" y="44" width="92" height="34" rx="12" fill="#F4F5FF" />
      <path d="M28 49v26M44 49v26M60 49v26M76 49v26M92 49v26" stroke="#E2E5FF" strokeWidth="3" strokeLinecap="round" />
      {blob[amount]}
    </svg>
  );
}

// Faces for feeling scales: level 1 (very happy) .. 5 (very unhappy)
const FACE_FILL = ['#3DD6B5', '#A8E48F', '#FFCB45', '#FFAA7A', '#FF8A6B'];
const FACE_MOUTH = ['M14 26q10 12 20 0', 'M15 28q9 7 18 0', 'M15 30h18', 'M15 32q9-7 18 0', 'M14 34q10-11 20 0'];
export function FaceArt({ level, size = 64 }: { level: number; size?: number }) {
  const i = Math.min(5, Math.max(1, level)) - 1;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="25.5" r="21" fill="rgba(0,0,0,.12)" />
      <circle cx="24" cy="24" r="21" fill={FACE_FILL[i]} />
      <ellipse cx="17" cy="19" rx="2.6" ry="3.2" fill="#1B1E4B" /><ellipse cx="31" cy="19" rx="2.6" ry="3.2" fill="#1B1E4B" />
      <path d={FACE_MOUTH[i]} fill="none" stroke="#1B1E4B" strokeWidth="2.8" strokeLinecap="round" />
      {i === 4 && <path d="M34 23q2.2 4 0 6.2q-2.2-2.2 0-6.2z" fill="#4DA3FF" />}
    </svg>
  );
}

// ---------- small pictures used as answers (64 x 64) ----------
const ICONS: Record<string, JSX.Element> = {
  sun: <g><g stroke="#FFC93C" strokeWidth="4.5" strokeLinecap="round"><path d="M32 4v7M32 53v7M4 32h7M53 32h7M12.2 12.2l5 5M46.8 46.8l5 5M12.2 51.8l5-5M46.8 17.2l5-5" /></g><circle cx="32" cy="32" r="15" fill="#F2A91E" /><circle cx="30.5" cy="30.5" r="13.5" fill="#FFC93C" /></g>,
  moon: <g><path d="M47 40A20 20 0 1 1 26 13a16 16 0 0 0 21 27z" fill="#8B7CF0" /><path d="M45 38A18 18 0 1 1 26.5 15a16 16 0 0 0 18.5 23z" fill="#A99BFF" /><circle cx="48" cy="16" r="2.5" fill="#FFCB45" /></g>,
  sunmoon: <g><g transform="translate(-6 -6) scale(.72)"><g stroke="#FFC93C" strokeWidth="4.5" strokeLinecap="round"><path d="M32 4v7M32 53v7M4 32h7M53 32h7M12.2 12.2l5 5M46.8 46.8l5 5M12.2 51.8l5-5M46.8 17.2l5-5" /></g><circle cx="32" cy="32" r="15" fill="#FFC93C" /></g><g transform="translate(22 22) scale(.68)"><path d="M47 40A20 20 0 1 1 26 13a16 16 0 0 0 21 27z" fill="#A99BFF" /></g></g>,
  calendarQ: <g><rect x="10" y="14" width="44" height="40" rx="8" fill="#FFFFFF" /><rect x="10" y="14" width="44" height="12" rx="6" fill="#FF8A6B" /><rect x="10" y="20" width="44" height="6" fill="#FF8A6B" /><path d="M27 36a5 5 0 1 1 6.5 4.8c-1 .4-1.5 1.2-1.5 2.2M32 48h.01" stroke="#1B1E4B" strokeWidth="3.4" strokeLinecap="round" fill="none" /></g>,
  child: <g><circle cx="32" cy="18" r="8" fill="#3DD6B5" /><path d="M20 52v-8a12 12 0 0 1 24 0v8z" fill="#3DD6B5" /></g>,
  adult: <g><circle cx="32" cy="14" r="8" fill="#A99BFF" /><path d="M18 56V36a14 14 0 0 1 28 0v20z" fill="#A99BFF" /></g>,
  together: <g><circle cx="24" cy="14" r="7.5" fill="#A99BFF" /><path d="M11 56V34a13 13 0 0 1 26 0v22z" fill="#A99BFF" /><circle cx="44" cy="26" r="6.5" fill="#3DD6B5" /><path d="M34 56v-9a10 10 0 0 1 20 0v9z" fill="#3DD6B5" /></g>,
  spit: <g><path d="M8 38h48a24 16 0 0 1-48 0z" fill="#CFE6FF" /><path d="M8 38h48" stroke="#8DB9EE" strokeWidth="4" strokeLinecap="round" /><circle cx="30" cy="16" r="5" fill="#FFFFFF" stroke="#9AA8B5" strokeWidth="2" /><circle cx="36" cy="26" r="4" fill="#FFFFFF" stroke="#9AA8B5" strokeWidth="2" /></g>,
  rinse: <g><path d="M16 10h32l-4 46H20z" fill="#E3F0FF" /><path d="M18.5 28h27l-2.6 28H21z" fill="#6FB2F5" /><path d="M16 10h32" stroke="#8DB9EE" strokeWidth="3" strokeLinecap="round" /></g>,
  swallow: <g><rect x="10" y="12" width="44" height="26" rx="13" fill="#FF8A6B" /><rect x="16" y="18" width="32" height="14" rx="7" fill="#C2533C" /><path d="M32 42v14M25 50l7 7 7-7" stroke="#1B1E4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>,
  candy: <g><path d="M8 24l10 8-10 8zM56 24l-10 8 10 8z" fill="#FF8A6B" /><circle cx="32" cy="32" r="14" fill="#FF8A6B" /><path d="M24 24c4 4 4 12 0 16M32 18c4 5 4 23 0 28M40 24c4 4 4 12 0 16" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity=".8" /></g>,
  juice: <g><rect x="16" y="16" width="30" height="42" rx="5" fill="#FFAA4D" /><rect x="16" y="16" width="30" height="10" rx="5" fill="#F28C28" /><rect x="22" y="32" width="18" height="16" rx="8" fill="#FFFFFF" opacity=".85" /><path d="M38 16l4-10h6" stroke="#FF6F61" strokeWidth="3.5" strokeLinecap="round" fill="none" /></g>,
  zero: <g><circle cx="32" cy="32" r="22" fill="none" stroke="#B9BDD6" strokeWidth="5" /><path d="M17 47L47 17" stroke="#B9BDD6" strokeWidth="5" strokeLinecap="round" /></g>,
  water: <g><path d="M32 6c10 14 18 23 18 33a18 18 0 0 1-36 0c0-10 8-19 18-33z" fill="#4DA3FF" /><path d="M24 40a8 8 0 0 0 6 8" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".8" /></g>,
  milk: <g><path d="M16 10h32l-4 46H20z" fill="#EEF1FA" /><path d="M18 22h28l-3.4 34H21.4z" fill="#FFFFFF" stroke="#D5DAEA" strokeWidth="2" /><path d="M16 10h32" stroke="#C8CEE3" strokeWidth="3" strokeLinecap="round" /></g>,
  cookie: <g><circle cx="32" cy="32" r="22" fill="#D9A15B" /><circle cx="31" cy="31" r="20" fill="#E8B872" /><circle cx="24" cy="24" r="3.5" fill="#6B4226" /><circle cx="38" cy="28" r="3" fill="#6B4226" /><circle cx="28" cy="40" r="3" fill="#6B4226" /><circle cx="41" cy="40" r="2.5" fill="#6B4226" /></g>,
  yes: <g><circle cx="32" cy="32" r="24" fill="#3DD6B5" /><path d="M21 33l8 8 15-17" stroke="#10142E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>,
  no: <g><circle cx="32" cy="32" r="24" fill="#FF8A6B" /><path d="M23 23l18 18M41 23L23 41" stroke="#1B1E4B" strokeWidth="5" strokeLinecap="round" fill="none" /></g>,
  unsure: <g><circle cx="32" cy="32" r="24" fill="#A99BFF" /><path d="M26 26a6 6 0 1 1 8 5.7c-1.3.5-2 1.4-2 2.6M32 42h.01" stroke="#1B1E4B" strokeWidth="4.5" strokeLinecap="round" fill="none" /></g>,
  noBrush: <g><g transform="translate(12 44) rotate(-35) scale(.42)"><rect x="0" y="-10" width="118" height="22" rx="11" fill="#9AA0C4" /><rect x="4" y="-36" width="44" height="28" rx="8" fill="#D6D9EC" /></g><path d="M12 52L52 12" stroke="#FF8A6B" strokeWidth="5" strokeLinecap="round" /></g>,
  timer: <g><circle cx="32" cy="36" r="20" fill="#FFFFFF" stroke="#4DA3FF" strokeWidth="5" /><path d="M32 36V24M26 8h12" stroke="#1B1E4B" strokeWidth="4.5" strokeLinecap="round" /></g>,
  timer2: <g><circle cx="32" cy="36" r="20" fill="#4DA3FF" /><path d="M26 8h12" stroke="#1B1E4B" strokeWidth="4.5" strokeLinecap="round" /><text x="32" y="44" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Nunito, sans-serif" fill="#FFFFFF">2</text></g>,
  calendar: <g><rect x="10" y="14" width="44" height="40" rx="8" fill="#FFFFFF" /><rect x="10" y="14" width="44" height="12" rx="6" fill="#4DA3FF" /><rect x="10" y="20" width="44" height="6" fill="#4DA3FF" /><circle cx="22" cy="36" r="3" fill="#B9BDD6" /><circle cx="32" cy="36" r="3" fill="#B9BDD6" /><circle cx="42" cy="36" r="3" fill="#B9BDD6" /><circle cx="22" cy="46" r="3" fill="#B9BDD6" /></g>,
  sparkle: <path d="M32 6c2.4 14.9 13.1 25.6 28 28-14.9 2.4-25.6 13.1-28 28-2.4-14.9-13.1-25.6-28-28C18.9 31.6 29.6 20.9 32 6z" fill="#FFCB45" />,
  video: <g><rect x="6" y="14" width="52" height="36" rx="9" fill="#4DA3FF" /><path d="M27 24v16l13-8z" fill="#FFFFFF" /></g>,
  chat: <g><path d="M54 30a22 20 0 0 1-31 18L10 52l4-11a22 20 0 1 1 40-11z" fill="#A99BFF" /></g>
};

// The content files still use emoji codes; map each to a drawn picture
const EMOJI_TO_ICON: Record<string, string> = {
  '☀️🌙': 'sunmoon', '☀️': 'sun', '🌙': 'moon', '🤷': 'calendarQ', '🧒': 'child', '👩‍👦': 'together', '👩': 'adult',
  '💦': 'spit', '🚰': 'rinse', '😋': 'swallow', '🚫': 'zero', '💧': 'water', '🥛': 'milk', '🍪': 'cookie',
  '👍': 'yes', '👎': 'no', '🤔': 'unsure', '✅': 'yes', '❌': 'no', '🙈': 'noBrush', '⏱️': 'timer', '⏱️⏱️': 'timer2',
  '📅': 'calendar', '⭐': 'sparkle', '🎬': 'video', '💬': 'chat'
};

export function IconArt({ name, size = 64 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">{ICONS[name] || null}</svg>;
}

// Renders an answer picture from the content's picture code
export function Picture({ pic, size = 64 }: { pic?: string; size?: number }) {
  if (!pic) return null;
  if (pic.startsWith('f5-')) return <FaceArt level={Number(pic.slice(3))} size={size} />;
  if (pic.startsWith('f3-')) return <FaceArt level={[1, 3, 5][Number(pic.slice(3))]} size={size} />;
  if (pic.startsWith('paste-')) return <PasteBrush amount={pic.slice(6)} w={size * 2.4} />;
  if (pic === '🙁') return <FaceArt level={4} size={size} />;
  if (pic === '🙂') return <FaceArt level={2} size={size} />;
  if (EMOJI_TO_ICON[pic]) return <IconArt name={EMOJI_TO_ICON[pic]} size={size} />;
  // Repeated item = a count (sweets, drinks): draw that many small pictures
  const parts = Array.from(pic);
  const unit = EMOJI_TO_ICON[parts[0]] || (parts[0] === '🍬' ? 'candy' : parts[0] === '🧃' ? 'juice' : '');
  if (unit) {
    const n = Math.min(parts.length, 4);
    const s = n === 1 ? size : size * 0.62;
    return (
      <span style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${n > 2 ? 2 : n}, auto)`, gap: 2 }}>
        {Array.from({ length: n }, (_, i) => <IconArt key={i} name={unit} size={s} />)}
      </span>
    );
  }
  return null;
}
