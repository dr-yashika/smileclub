export type Lang = 'en' | 'hi';
export type Text = { en: string; hi: string };

// Every piece of text is stored as { en, hi }
export const L = (en: string, hi: string): Text => ({ en, hi });

export const T = {
  checkin: L('This week', 'यह हफ़्ता'), // used by content/questions.js
  goodMorning: L('Good morning', 'सुप्रभात'),
  goodEvening: L('Good evening', 'शुभ संध्या'),
  morningBrush: L('Morning brush', 'सुबह का ब्रश'),
  nightBrush: L('Night brush', 'रात का ब्रश'),
  morningDone: L('Morning brush done', 'सुबह का ब्रश हो गया'),
  nightDone: L('Night brush done', 'रात का ब्रश हो गया'),
  seeYouTonight: L('See you tonight', 'रात को मिलते हैं'),
  seeYouMorning: L('See you in the morning', 'सुबह मिलते हैं'),
  min: L('{n} min', '{n} मिनट'),
  questions: L('{n} questions', '{n} सवाल'),
  today: L('Today', 'आज'),
  learn: L('Learn', 'सीखें'),
  journey: L('Journey', 'सफ़र'),
  rewards: L('Rewards', 'इनाम'),
  readAloud: L('Read this screen aloud', 'यह स्क्रीन पढ़कर सुनाओ'),
  grownUps: L('Grown-ups: press and hold', 'बड़े लोग: दबाकर रखें'),
  tapMoon: L('Tap the moon to start your night brush', 'रात का ब्रश शुरू करने के लिए चाँद पर टैप करो'),
  tapSun: L('Tap the sun to start your morning brush', 'सुबह का ब्रश शुरू करने के लिए सूरज पर टैप करो'),
  topTeeth: L('Top teeth', 'ऊपर के दाँत'),
  bottomTeeth: L('Bottom teeth', 'नीचे के दाँत'),
  otherSide: L('Now the other side', 'अब दूसरी तरफ़'),
  circles: L('Small circles on every tooth', 'हर दाँत पर छोटे-छोटे गोले'),
  getReady: L('Get your brush ready', 'ब्रश तैयार करो'),
  paused: L('Paused', 'रुका हुआ'),
  pause: L('Pause', 'रोको'),
  resume: L('Keep going', 'जारी रखो'),
  startNow: L('Start now', 'अभी शुरू करो'),
  soundOn: L('Turn the voice on', 'आवाज़ चालू करो'),
  soundOff: L('Turn the voice off', 'आवाज़ बंद करो'),
  close: L('Close', 'बंद करो'),
  superShine: L('Super shine!', 'शानदार चमक!'),
  thanks: L('Thank you!', 'धन्यवाद!'),
  done: L('Done', 'हो गया'),
  notSure: L('Not sure', 'पता नहीं'),
  hearAgain: L('Hear the question again', 'सवाल फिर से सुनो'),
  next: L('Next', 'आगे'),
  comingSoon: L('Coming in the next build', 'अगले संस्करण में आएगा'),
  earn: L('Earn {n} sparkles', '{n} चमक मिलेगी'),
  sparkles: L('{n} sparkles', '{n} चमक'),
  streak: L('{n} day streak', 'लगातार {n} दिन'),
  joinTitle: L('Join Smile Club', 'स्माइल क्लब से जुड़ें'),
  joinSub: L('For grown-ups: type the code and PIN from the study card', 'बड़ों के लिए: स्टडी कार्ड पर लिखा कोड और पिन लिखें'),
  childCode: L('Child code', 'बच्चे का कोड'),
  pin: L('6-digit PIN', '6 अंकों का पिन'),
  start: L('Start', 'शुरू करें'),
  checking: L('Checking…', 'जाँच हो रही है…'),
  wrongPin: L("Code or PIN doesn't match. Check the card.", 'कोड या पिन मेल नहीं खाता। कार्ड देखें।'),
  locked: L('Too many tries. Try again in 15 minutes.', 'बहुत बार कोशिश हुई। 15 मिनट बाद फिर कोशिश करें।'),
  offline: L('No internet. Connect and try again.', 'इंटरनेट नहीं है। जुड़कर फिर कोशिश करें।'),
  noNames: L('Only the code is saved, never a name.', 'सिर्फ़ कोड सेव होता है, कोई नाम नहीं।')
};

export const DAY_LETTERS: Record<Lang, string[]> = {
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  hi: ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र']
};

export type TKey = keyof typeof T;

export function makeLang(lang: Lang) {
  const tx = (o: Text | string | undefined | null): string => (o == null ? '' : typeof o === 'string' ? o : o[lang] || o.en);
  const t = (k: TKey, vars?: Record<string, string | number>): string => {
    let s = tx(T[k]);
    if (vars) for (const v in vars) s = s.replace('{' + v + '}', String(vars[v]));
    return s;
  };
  return { t, tx };
}
