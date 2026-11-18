import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { go } from '../lib/router';
import { speak, stopSpeaking } from '../lib/speech';
import { Picture } from '../ui/art';
import { IconCheck, IconClose, IconQuestion, IconSpeaker } from '../ui/icons';
// @ts-ignore - plain JS content module
import { Q, INSTR } from '../content/questions';

type Opt = [string, { en: string; hi: string }, string?, string?];
const NOT_SURE = 'ns';

export function Questionnaire({ instr, rkey }: { instr: string; rkey: string }) {
  const { s, t, tx, update, logEvent, send } = useApp();
  const I = INSTR[instr];
  const group = s.profile.group;
  const junior = I.audience === 'junior';
  const [ans, setAns] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);

  const visibleFor = (a: Record<string, string>): string[] =>
    I.qs.filter((id: string) => { const q = Q[id]; if (q.grp && q.grp !== group) return false; return !q.show || q.show(a); });
  const qs = visibleFor(ans);
  const i = Math.min(idx, qs.length - 1);
  const id = qs[i];
  const q = Q[id];
  const v = ans[id];
  const last = i === qs.length - 1;
  const opts: Opt[] = (q.opts || []).filter((o: Opt) => !o[3] || o[3] === group);
  const qtext = tx(q.text);
  const hasDk = opts.some(o => ['dk', 'ns'].includes(o[0]));

  useEffect(() => { window.scrollTo(0, 0); if (junior && s.voice) speak(qtext, s.lang); }, [i, s.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopSpeaking(), []);

  const finish = (a: Record<string, string>) => {
    const rec: Record<string, unknown> = {};
    visibleFor(a).forEach(k => { if (a[k] != null && a[k] !== '') rec[k] = a[k]; });
    const quiz = I.qs.filter((k: string) => Q[k].ans);
    if (quiz.length) rec.score = quiz.filter((k: string) => rec[k] === Q[k].ans).length;
    rec._done = new Date().toISOString();
    update(n => { n.r[rkey] = rec as Record<string, unknown>; n.sparkles += 3; });
    logEvent('questions', rkey);
    send({ kind: 'answers', rkey, instr, payload: rec });
    stopSpeaking();
    go('/done?kind=q');
  };

  const pick = (val: string) => {
    const na = { ...ans, [id]: val };
    setAns(na);
    const nv = visibleFor(na);
    setTimeout(() => { if (i >= nv.length - 1) finish(na); else setIdx(cur => (cur === i ? i + 1 : cur)); }, 380);
  };

  // Choose the layout from the kind of answers
  const isFaces = opts.length > 0 && opts.every(o => o[2]?.startsWith('f5-') || o[2]?.startsWith('f3-'));
  const isCount = opts.length >= 5 && !isFaces;
  const hasPics = opts.some(o => o[2]);

  const tile = (o: Opt, extra = '') => {
    const sel = v === o[0];
    return (
      <button key={o[0]} role="radio" aria-checked={sel} className={'tile' + (sel ? ' sel' : '') + extra} onClick={() => pick(o[0])}>
        {sel && <span className="tick"><IconCheck size={18} color="var(--on-mint)" /></span>}
        {o[2] && <Picture pic={o[2]} size={isFaces ? 52 : extra.includes('wide') ? 56 : isCount ? 38 : 64} />}
        <span className="lbl">{tx(o[1])}</span>
      </button>
    );
  };

  let body;
  if (q.type === 'text') {
    body = (
      <>
        <textarea rows={4} value={v || ''} onChange={e => setAns(a => ({ ...a, [id]: e.target.value }))}
          style={{ width: '100%', borderRadius: 20, border: '2px solid var(--track)', background: 'var(--tile)', color: 'var(--ink)', font: 'inherit', fontSize: 18, padding: 14 }} />
        <button className="primary-btn" onClick={() => (last ? finish(ans) : setIdx(i + 1))}>{last ? t('done') : t('next')}</button>
      </>
    );
  } else if (!junior) {
    body = <div className="list" role="radiogroup" aria-label={qtext}>{opts.map(o => tile(o))}</div>;
  } else if (isFaces) {
    body = <div className="tiles faces" role="radiogroup" aria-label={qtext} style={{ ['--n' as string]: opts.length }}>{opts.map(o => tile(o))}</div>;
  } else if (isCount || !hasPics) {
    body = <div className="tiles count" role="radiogroup" aria-label={qtext}>{opts.map(o => tile(o))}</div>;
  } else {
    body = (
      <div className="tiles" role="radiogroup" aria-label={qtext}>
        {opts.map((o, k) => tile(o, opts.length % 2 === 1 && k === opts.length - 1 ? ' wide' : ''))}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="flow">
        <div className="flow-head">
          <button className="icon-btn" aria-label={t('close')} onClick={() => { stopSpeaking(); go('/'); }}><IconClose size={18} color="var(--ink-3)" /></button>
          <div className="progress" style={{ gridTemplateColumns: `repeat(${qs.length}, minmax(0, 1fr))` }} role="progressbar" aria-valuenow={i + 1} aria-valuemin={1} aria-valuemax={qs.length}>
            {qs.map((_, k) => <span key={k} className={k <= i ? 'on' : ''} />)}
          </div>
        </div>

        <div className="q-head">
          <button className="q-speak" aria-label={t('hearAgain')} onClick={() => speak(qtext, s.lang)}><IconSpeaker size={30} color="var(--on-mint)" /></button>
          <h1 className="q-title" style={junior ? undefined : { fontSize: 22, lineHeight: '28px' }}>{qtext}</h1>
        </div>

        {body}

        {junior && q.type !== 'text' && !hasDk && !isFaces && (
          <button className="ghost-btn" onClick={() => pick(NOT_SURE)}><IconQuestion size={24} color="var(--ink-3)" />{t('notSure')}</button>
        )}
      </div>
    </div>
  );
}
