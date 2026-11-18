import { useApp } from '../lib/store';
import { dayKey } from '../lib/time';
import { go } from '../lib/router';
import { OrbArt } from '../ui/art';
import { IconChat, IconCheck, IconChevron, IconClock, IconPlay, IconSparkle } from '../ui/icons';
import { Hill, NavBar, SpeakButton, Stars, TopBar, WeekStrip } from '../ui/components';

export function Today() {
  const { s, t, theme, slot, task } = useApp();
  const doneNow = !!s.log[dayKey()]?.[slot];
  const greeting = theme === 'day' ? t('goodMorning') : t('goodEvening');
  const title = doneNow ? t(slot === 'am' ? 'morningDone' : 'nightDone') : t(slot === 'am' ? 'morningBrush' : 'nightBrush');
  const hint = doneNow ? t(slot === 'am' ? 'seeYouTonight' : 'seeYouMorning') : t(theme === 'day' ? 'tapSun' : 'tapMoon');

  return (
    <div className="app">
      <Stars />
      <TopBar />
      <div className="greet">
        <h1>{greeting}</h1>
        <SpeakButton text={`${greeting}. ${title}. ${hint}.`} label={t('readAloud')} autoOnce={s.profile.mode === 'junior' ? 'today-' + slot : undefined} />
      </div>

      <section className="hero">
        <button className="orb" aria-label={hint} onClick={() => go('/brush')}>
          <OrbArt kind={theme === 'day' ? 'sun' : 'moon'} />
          {!doneNow && <span className="orb-ring" aria-hidden="true" />}
          <span className={'orb-badge' + (doneNow ? ' done' : '')} aria-hidden="true">
            {doneNow ? <IconCheck size={32} color="#1B1E4B" /> : <IconPlay size={30} color="var(--on-mint)" />}
          </span>
        </button>
        <div className="hero-title">{title}</div>
        {!doneNow && (
          <div className="chips">
            <span className="chip"><IconClock size={18} color="var(--ink-2)" />{t('min', { n: 2 })}</span>
            <span className="chip gold" aria-label={t('earn', { n: 2 })}><IconSparkle size={18} color="var(--gold)" />+2</span>
          </div>
        )}
      </section>

      <section className="ground">
        <Hill />
        {task && (
          <button className="row-card" onClick={() => go(`/q?i=${task.instr}&k=${task.rkey}`)}>
            <span className="row-icon"><IconChat size={28} color="#1B1E4B" /><span className="row-dot" aria-hidden="true" /></span>
            <span className="row-text">
              <span className="row-title">{t('questions', { n: task.count })}</span>
              <span className="row-sub">{t('min', { n: Math.max(1, Math.round(task.count / 4)) })}</span>
            </span>
            <IconChevron size={24} color="var(--ink-3)" />
          </button>
        )}
        <WeekStrip />
      </section>
      <NavBar active="today" />
    </div>
  );
}
