import { useEffect } from 'react';
import { useApp } from '../lib/store';
import { go } from '../lib/router';
import { speak } from '../lib/speech';
import { OrbArt } from '../ui/art';
import { IconSparkle } from '../ui/icons';
import { Stars, WeekStrip } from '../ui/components';

// Celebration after a brush (+2 sparkles) or a set of questions (+3 sparkles)
export function Done({ kind }: { kind: string }) {
  const { s, t, theme } = useApp();
  const isBrush = kind === 'brush';
  const title = isBrush ? t('superShine') : t('thanks');
  const gain = isBrush ? 2 : 3;

  useEffect(() => { if (s.voice) speak(title, s.lang); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <Stars />
      <div className="flow">
        <div className="done-wrap">
          <div className="burst" style={{ width: 'min(64vw, 240px)', position: 'relative' }}>
            <OrbArt kind={theme === 'day' ? 'sun' : 'moon'} />
            <svg viewBox="0 0 240 240" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
              <path d="M30 40c1.2 7.4 6.4 12.6 13.8 13.8-7.4 1.2-12.6 6.4-13.8 13.8-1.2-7.4-6.4-12.6-13.8-13.8 7.4-1.2 12.6-6.4 13.8-13.8z" fill="#FFCB45" />
              <path d="M206 30c.9 5.4 4.6 9.1 10 10-5.4.9-9.1 4.6-10 10-.9-5.4-4.6-9.1-10-10 5.4-.9 9.1-4.6 10-10z" fill="#FFFFFF" />
              <path d="M214 170c1.2 7.4 6.4 12.6 13.8 13.8-7.4 1.2-12.6 6.4-13.8 13.8-1.2-7.4-6.4-12.6-13.8-13.8 7.4-1.2 12.6-6.4 13.8-13.8z" fill="#FFCB45" />
            </svg>
          </div>
          <h1 className="done-title">{title}</h1>
          <span className="chip gold" style={{ height: 44, fontSize: 22, padding: '0 18px 0 12px' }} aria-label={t('sparkles', { n: gain })}>
            <IconSparkle size={24} color="var(--gold)" />+{gain}
          </span>
        </div>
        <WeekStrip />
        <button className="primary-btn" onClick={() => go('/')}>{t('done')}</button>
      </div>
    </div>
  );
}
