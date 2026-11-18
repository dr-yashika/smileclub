import { useState } from 'react';
import type { FormEvent } from 'react';
import { useApp } from '../lib/store';
import { enrolDevice } from '../lib/sync';
import { OrbArt } from '../ui/art';
import { IconLock } from '../ui/icons';
import { Stars } from '../ui/components';

// One-time setup by a grown-up: links this phone to the child's study code
export function Enrol() {
  const { s, t, theme, update, applyEnrolment } = useApp();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'wrong' | 'locked' | 'offline'>('idle');
  const ready = code.length >= 3 && pin.length === 6 && state !== 'checking';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setState('checking');
    const r = await enrolDevice(code, pin);
    if (r.ok) applyEnrolment(r);
    else setState(r.error === 'locked' ? 'locked' : r.error === 'offline' ? 'offline' : 'wrong');
  };

  const err = state === 'wrong' ? t('wrongPin') : state === 'locked' ? t('locked') : state === 'offline' ? t('offline') : '';

  return (
    <div className="app">
      <Stars quiet />
      <div className="topbar" style={{ justifyContent: 'flex-end' }}>
        <div className="lang-switch" role="group" aria-label="Language / भाषा">
          <button type="button" className={s.lang === 'en' ? 'on' : ''} aria-pressed={s.lang === 'en'} onClick={() => update(n => { n.lang = 'en'; })}>English</button>
          <button type="button" className={s.lang === 'hi' ? 'on' : ''} aria-pressed={s.lang === 'hi'} lang="hi" onClick={() => update(n => { n.lang = 'hi'; })}>हिंदी</button>
        </div>
      </div>

      <form className="enrol" onSubmit={submit} noValidate>
        <div className="enrol-orb"><OrbArt kind={theme === 'day' ? 'sun' : 'moon'} /></div>
        <h1 className="enrol-title">{t('joinTitle')}</h1>
        <p className="enrol-sub">{t('joinSub')}</p>

        <div className="enrol-card">
          <label className="field">
            <span>{t('childCode')}</span>
            <input value={code} onChange={e => { setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20)); setState('idle'); }}
              autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="SC-001" aria-invalid={state === 'wrong'} />
          </label>
          <label className="field">
            <span>{t('pin')}</span>
            <input className="pin" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setState('idle'); }}
              inputMode="numeric" autoComplete="off" placeholder="••••••" aria-invalid={state === 'wrong'} />
          </label>
        </div>

        <p className="enrol-err" role="alert" aria-live="polite">{err}</p>

        <button className="primary-btn" type="submit" disabled={!ready}>{state === 'checking' ? t('checking') : t('start')}</button>
        <p className="enrol-note"><IconLock size={16} color="var(--ink-3)" />{t('noNames')}</p>
      </form>
    </div>
  );
}
