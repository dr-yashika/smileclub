// Line and solid UI icons (24px grid). Colour comes from `color` or currentColor.
type P = { size?: number; color?: string };
const S = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const });
const stroke = (c: string, w = 2.4) => ({ fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const IconLock = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color)}><rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
export const IconSpeaker = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color)}><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill={color} /><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>;
export const IconClock = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 2.6)}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M10 2h4" /></svg>;
export const IconSparkle = ({ size, color = 'currentColor' }: P) => <svg {...S(size)}><path d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5-.9-5.6-4.9-9.6-10.5-10.5C7.1 11.1 11.1 7.1 12 1.5z" fill={color} /></svg>;
export const IconFlame = ({ size = 22 }: P) => <svg width={size * 0.82} height={size} viewBox="0 0 20 24" aria-hidden="true"><path d="M10 1c1.2 5 7 7.2 7 13.6A7 7 0 0 1 3 14.6c0-3.4 1.7-5.6 3.6-7.4.2 2.8 1.2 4.1 3 5 .3-3.9-.9-7.3.4-11.2z" fill="#FF8A6B" /><path d="M10 13c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1.6 1.4-2.8 3-5z" fill="#FFCB45" /></svg>;
export const IconChat = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 2.6)}><path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.6A8.5 8.5 0 1 1 20.5 11.5z" /><path d="M9.8 9.3a2.3 2.3 0 1 1 3 2.2c-.6.2-.8.6-.8 1.1M12 15.6h.01" /></svg>;
export const IconChevron = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 3)}><path d="M9 5l7 7-7 7" /></svg>;
export const IconClose = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 3)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const IconCheck = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 3.4)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const IconPlay = ({ size, color = 'currentColor' }: P) => <svg {...S(size)}><path d="M7.5 4.6v14.8a1 1 0 0 0 1.5.86l12-7.4a1 1 0 0 0 0-1.72L9 3.74a1 1 0 0 0-1.5.86z" fill={color} /></svg>;
export const IconPause = ({ size, color = 'currentColor' }: P) => <svg {...S(size)}><rect x="6" y="4.5" width="4.5" height="15" rx="1.5" fill={color} /><rect x="13.5" y="4.5" width="4.5" height="15" rx="1.5" fill={color} /></svg>;
export const IconQuestion = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color, 2.6)}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.7-.9 1.3M12 16.5h.01" /></svg>;
export const IconHome = ({ size, color = 'currentColor' }: P) => <svg {...S(size)}><path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" fill={color} /></svg>;
export const IconLearn = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color)}><rect x="3" y="5" width="18" height="14" rx="4" /><path d="M10.5 9.5v5l4-2.5z" fill={color} /></svg>;
export const IconJourney = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color)}><circle cx="6" cy="19" r="2" /><path d="M8 19h5a3.5 3.5 0 0 0 0-7H11a3.5 3.5 0 0 1 0-7h4" /><path d="M17 9V3l4 1.6L17 6.2" /></svg>;
export const IconRewards = ({ size, color = 'currentColor' }: P) => <svg {...S(size)} {...stroke(color)}><path d="M12 2.5c.8 5 4.5 8.7 9.5 9.5-5 .8-8.7 4.5-9.5 9.5-.8-5-4.5-8.7-9.5-9.5 5-.8 8.7-4.5 9.5-9.5z" /></svg>;

export function Wave({ color = 'currentColor' }: P) {
  return (
    <svg className="wave" width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
      <rect x="0" y="6" width="3" height="4" rx="1.5" fill={color} /><rect x="6" y="2" width="3" height="12" rx="1.5" fill={color} />
      <rect x="12" y="4" width="3" height="8" rx="1.5" fill={color} /><rect x="18" y="6" width="3" height="4" rx="1.5" fill={color} />
    </svg>
  );
}
