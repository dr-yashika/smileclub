export type Theme = 'day' | 'night';
export type Slot = 'am' | 'pm';

const DAY_START = 5;
const DAY_END = 17;

// Morning brush theme from 05:00 to 16:59, night brush theme otherwise
export function themeFor(d: Date = new Date()): Theme {
  const h = d.getHours();
  return h >= DAY_START && h < DAY_END ? 'day' : 'night';
}

export const slotFor = (theme: Theme): Slot => (theme === 'day' ? 'am' : 'pm');

export function dayKey(d: Date = new Date()): string {
  const z = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
}

export function parseDay(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Keys for Monday..Sunday of the current week
export function weekKeys(d: Date = new Date()): string[] {
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return dayKey(x);
  });
}

// Study week: 1-6 = programme weeks, 7 = follow-up
export function studyWeek(enrol: string, d: Date = new Date()): number {
  const days = Math.floor((parseDay(dayKey(d)).getTime() - parseDay(enrol).getTime()) / 864e5);
  return Math.max(1, Math.min(7, Math.floor(days / 7) + 1));
}
