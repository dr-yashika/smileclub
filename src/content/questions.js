// Copied from smileclub-kids (tested question set). Edit content here; the web app reads it as-is.
import { L } from '../lib/i18n';

// Option = [value, label, picture]. Picture is an emoji, 'f5-N' / 'f3-N' (faces) or 'paste-KIND'.
// A 4th element 'A' shows the option only to the app-program group.

// ---------- answer sets ----------
export const YN = [['yes', L('Yes', 'हाँ'), '👍'], ['no', L('No', 'नहीं'), '👎']];
export const TF_JUNIOR = [['T', L('True', 'सही'), '👍'], ['F', L('Not true', 'सही नहीं'), '👎'], ['dk', L("I don't know", 'पता नहीं'), '🤔']];
export const TF_SENIOR = [['T', L('True', 'सही'), '✅'], ['F', L('False', 'ग़लत'), '❌'], ['dk', L('Not sure', 'पक्का नहीं'), '🤔']];
export const FACES3 = [['0', L('No', 'नहीं'), 'f3-0'], ['1', L('A little', 'थोड़ा'), 'f3-1'], ['2', L('A lot', 'बहुत'), 'f3-2']];
// Facial Image Scale (5 faces, very happy to very unhappy)
export const FIS5 = [['1', L('Very happy', 'बहुत खुश'), 'f5-1'], ['2', L('Happy', 'खुश'), 'f5-2'], ['3', L('Okay', 'ठीक-ठाक'), 'f5-3'], ['4', L('Unhappy', 'दुखी'), 'f5-4'], ['5', L('Very unhappy', 'बहुत दुखी'), 'f5-5']];
// Modified Child Dental Anxiety Scale (faces) anchors
export const MCDAS5 = [['1', L('Relaxed', 'आराम से'), 'f5-1'], ['2', L('A tiny bit worried', 'थोड़ी सी चिंता'), 'f5-2'], ['3', L('Fairly worried', 'काफ़ी चिंता'), 'f5-3'], ['4', L('Worried a lot', 'बहुत चिंता'), 'f5-4'], ['5', L('Very worried', 'बहुत ज़्यादा चिंता'), 'f5-5']];
export const FREQ4 = [['0', L('Never', 'कभी नहीं'), 'f5-1'], ['1', L('Once or twice', 'एक-दो बार'), 'f5-2'], ['2', L('Sometimes', 'कभी-कभी'), 'f5-4'], ['3', L('Often', 'अक्सर'), 'f5-5']];
export const AGREE5 = [['1', L('Not true at all', 'बिल्कुल सही नहीं'), '👎'], ['2', L('Not really', 'ज़्यादा सही नहीं'), '🙁'], ['3', L('Not sure', 'पक्का नहीं'), '🤔'], ['4', L('A bit true', 'थोड़ा सही'), '🙂'], ['5', L('Very true', 'बिल्कुल सही'), '👍']];
const count = (max, pic) => Array.from({ length: max + 1 }, (_, n) => {
  const v = n === max ? max + '+' : String(n);
  return [v, L(n === max ? max + ' or more' : String(n), n === max ? max + ' या ज़्यादा' : String(n)), n === 0 ? '🚫' : pic.repeat(Math.min(n, 4))];
});
const WHEN = [['both', L('Morning and night', 'सुबह और रात'), '☀️🌙'], ['am', L('Only morning', 'सिर्फ़ सुबह'), '☀️'], ['pm', L('Only night', 'सिर्फ़ रात'), '🌙']];

// ---------- questions ----------
export const Q = {
  // ===== Parent (Grown-ups corner): 7 one-tap questions =====
  d1: { text: L("You are the child's...", 'बच्चे से आपका रिश्ता'), opts: [['mother', L('Mother', 'माँ')], ['father', L('Father', 'पिता')], ['grand', L('Grandparent', 'दादा-दादी / नाना-नानी')], ['other', L('Other', 'अन्य')]] },
  d2: { text: L('Your age', 'आपकी उम्र'), opts: [['u25', L('Under 25', '25 से कम')], ['25-29', L('25 to 29', '25 से 29')], ['30-34', L('30 to 34', '30 से 34')], ['35-39', L('35 to 39', '35 से 39')], ['40+', L('40 or more', '40 या अधिक')]] },
  d3: { text: L('How many children are in your family?', 'आपके परिवार में कितने बच्चे हैं?'), opts: [['1', L('1', '1')], ['2', L('2', '2')], ['3+', L('3 or more', '3 या अधिक')]] },
  d4: { text: L('Education of the head of the family', 'परिवार के मुखिया की शिक्षा'), opts: [['7', L('Professional or honours degree', 'प्रोफेशनल या ऑनर्स डिग्री')], ['6', L('Graduate', 'स्नातक')], ['5', L('12th pass or diploma', '12वीं पास या डिप्लोमा')], ['4', L('10th pass', '10वीं पास')], ['3', L('8th pass', '8वीं पास')], ['2', L('Primary (5th) or less', 'प्राइमरी (5वीं) या कम')], ['1', L('No schooling', 'पढ़ाई नहीं की')]] },
  d5: { text: L('Occupation of the head of the family', 'परिवार के मुखिया का काम'), opts: [['10', L('Professional (doctor, engineer, teacher...)', 'पेशेवर (डॉक्टर, इंजीनियर, शिक्षक...)')], ['6', L('Semi-professional', 'अर्ध-पेशेवर')], ['5', L('Clerk, shop owner or farmer', 'क्लर्क, दुकानदार या किसान')], ['4', L('Skilled worker', 'कुशल कामगार')], ['3', L('Semi-skilled worker', 'अर्ध-कुशल कामगार')], ['2', L('Unskilled worker', 'अकुशल मज़दूर')], ['1', L('Not working', 'काम नहीं करते')]] },
  // Income bands: replace with the latest CPI-updated Modified Kuppuswamy table before use
  d6: { text: L('Total monthly family income', 'परिवार की कुल मासिक आय'), opts: [['1', L('Below Rs 10,000', '10,000 रु. से कम')], ['2', L('Rs 10,000 to 29,999', '10,000 से 29,999 रु.')], ['3', L('Rs 30,000 to 49,999', '30,000 से 49,999 रु.')], ['4', L('Rs 50,000 to 74,999', '50,000 से 74,999 रु.')], ['5', L('Rs 75,000 to 99,999', '75,000 से 99,999 रु.')], ['6', L('Rs 1,00,000 to 1,99,999', '1,00,000 से 1,99,999 रु.')], ['7', L('Rs 2,00,000 or more', '2,00,000 रु. या अधिक')], ['na', L('Prefer not to say', 'नहीं बताना चाहते')]] },
  d7: { text: L('Where do you live?', 'आप कहाँ रहते हैं?'), opts: [['urban', L('City or town', 'शहर या कस्बा')], ['rural', L('Village', 'गाँव')]] },

  // ===== Child mode (5-8 y): picture questions, read aloud =====
  j1: { text: L('When do you brush your teeth?', 'तुम दाँत कब ब्रश करते हो?'), opts: [...WHEN, ['not', L('Not every day', 'रोज़ नहीं'), '🤷']] },
  j2: { text: L('Who brushes your teeth?', 'तुम्हारे दाँत कौन ब्रश करता है?'), opts: [['self', L('I do it myself', 'खुद से'), '🧒'], ['help', L('A grown-up helps me', 'कोई बड़ा मदद करता है'), '👩‍👦'], ['adult', L('A grown-up does it for me', 'कोई बड़ा ब्रश करता है'), '👩']] },
  j3: { text: L('Who puts toothpaste on your brush?', 'तुम्हारे ब्रश पर टूथपेस्ट कौन लगाता है?'), opts: [['me', L('Me', 'मैं'), '🧒'], ['adult', L('A grown-up', 'कोई बड़ा'), '👩']] },
  j4: { text: L('How much toothpaste do you use? Tap the picture.', 'तुम कितना टूथपेस्ट लगाते हो? तस्वीर पर टैप करो।'), opts: [['smear', L('A tiny bit', 'बहुत थोड़ा'), 'paste-smear'], ['pea', L('Like a pea', 'मटर जितना'), 'paste-pea'], ['half', L('Half the brush', 'आधा ब्रश'), 'paste-half'], ['full', L('The whole brush', 'पूरा ब्रश'), 'paste-full']] },
  j5: { text: L('What do you do after brushing?', 'ब्रश करने के बाद तुम क्या करते हो?'), opts: [['spit', L('Spit it out', 'थूक देना'), '💦'], ['rinse', L('Rinse with water, then spit', 'पानी से कुल्ला करके थूकना'), '🚰'], ['swallow', L('Swallow it', 'निगल जाना'), '😋']] },
  j6: { text: L('Yesterday, how many times did you eat sweet things? Biscuits, chocolate, toffee, mithai.', 'कल तुमने कितनी बार मीठी चीज़ें खाईं? बिस्कुट, चॉकलेट, टॉफ़ी, मिठाई।'), opts: count(4, '🍬'), grid: 3 },
  j7: { text: L('Yesterday, how many times did you have sweet drinks? Juice, cold drink, sweet milk, tea with sugar.', 'कल तुमने कितनी बार मीठे पेय पिए? जूस, कोल्ड ड्रिंक, मीठा दूध, चीनी वाली चाय।'), opts: count(3, '🧃'), grid: 2 },
  j8: { text: L('After brushing at night, do you eat or drink anything except water?', 'रात को ब्रश के बाद, क्या तुम पानी के अलावा कुछ खाते-पीते हो?'), opts: [['no', L('No, only water', 'नहीं, सिर्फ़ पानी'), '💧'], ['some', L('Sometimes', 'कभी-कभी'), '🥛'], ['often', L('Yes, often', 'हाँ, अक्सर'), '🍪']] },

  // Child-reported oral health quality of life (SOHO-5 child items, adapted)
  jf1: { text: L('Was it hard to eat because of your teeth?', 'क्या दाँतों की वजह से खाने में मुश्किल हुई?'), opts: FACES3, grid: 3 },
  jf2: { text: L('Was it hard to drink because of your teeth?', 'क्या दाँतों की वजह से पीने में मुश्किल हुई?'), opts: FACES3, grid: 3 },
  jf3: { text: L('Was it hard to talk because of your teeth?', 'क्या दाँतों की वजह से बोलने में मुश्किल हुई?'), opts: FACES3, grid: 3 },
  jf4: { text: L('Was it hard to play because of your teeth?', 'क्या दाँतों की वजह से खेलने में मुश्किल हुई?'), opts: FACES3, grid: 3 },
  jf5: { text: L('Was it hard to sleep because of your teeth?', 'क्या दाँतों की वजह से सोने में मुश्किल हुई?'), opts: FACES3, grid: 3 },
  jf6: { text: L('Did you not want to smile because your teeth hurt?', 'क्या दाँतों में दर्द की वजह से तुम्हारा मुस्कुराने का मन नहीं किया?'), opts: FACES3, grid: 3 },
  jf7: { text: L('Did you not want to smile because of how your teeth look?', 'क्या दाँत कैसे दिखते हैं, इस वजह से तुम्हारा मुस्कुराने का मन नहीं किया?'), opts: FACES3, grid: 3 },
  jfis: { text: L('How do you feel about going to the dentist? Tap a face.', 'डेंटिस्ट के पास जाने के बारे में तुम्हें कैसा लगता है? एक चेहरा चुनो।'), opts: FIS5, grid: 5 },

  // Picture quiz
  jq1: { ans: 'T', opts: TF_JUNIOR, grid: 3, text: L('We should brush our teeth two times every day.', 'हमें हर दिन दो बार दाँत ब्रश करने चाहिए।') },
  jq2: { ans: 'T', opts: TF_JUNIOR, grid: 3, text: L('Sweets and juice can make holes in our teeth.', 'मिठाई और जूस से दाँतों में छेद हो सकते हैं।') },
  jq3: { ans: 'F', opts: TF_JUNIOR, grid: 3, text: L('After brushing, we should rinse with lots of water.', 'ब्रश के बाद खूब सारे पानी से कुल्ला करना चाहिए।') },
  jq4: { ans: 'F', opts: TF_JUNIOR, grid: 3, text: L('We need toothpaste on the whole brush.', 'पूरे ब्रश पर टूथपेस्ट लगाना चाहिए।') },
  jq5: { ans: 'T', opts: TF_JUNIOR, grid: 3, text: L('Brushing before bed is very important.', 'सोने से पहले ब्रश करना बहुत ज़रूरी है।') },
  jq6: { ans: 'T', opts: TF_JUNIOR, grid: 3, text: L('The dentist helps keep our teeth strong.', 'डेंटिस्ट हमारे दाँतों को मज़बूत रखने में मदद करते हैं।') },

  // Weekly check-in (child mode)
  jc1: { text: L('Yesterday, when did you brush?', 'कल तुमने कब ब्रश किया?'), opts: [...WHEN, ['none', L("I didn't brush", 'ब्रश नहीं किया'), '🙈']] },
  jc2: { text: L('Yesterday, how many times did you eat sweet things?', 'कल तुमने कितनी बार मीठी चीज़ें खाईं?'), opts: count(4, '🍬'), grid: 3 },
  jc3: { text: L('Yesterday, how many times did you have sweet drinks?', 'कल तुमने कितनी बार मीठे पेय पिए?'), opts: count(3, '🧃'), grid: 2 },
  jc4: { text: L('Last night, after brushing, did you have anything except water?', 'कल रात ब्रश के बाद, क्या तुमने पानी के अलावा कुछ खाया-पिया?'), opts: YN, grid: 2 },

  // Final feedback (child mode)
  js1: { text: L("Did you like Chamku's app?", 'क्या तुम्हें चमकू का ऐप अच्छा लगा?'), opts: [['1', L('Loved it', 'बहुत अच्छा'), 'f5-1'], ['2', L('Liked it', 'अच्छा'), 'f5-2'], ['3', L('Okay', 'ठीक-ठाक'), 'f5-3'], ['4', L('Not much', 'ज़्यादा नहीं'), 'f5-4'], ['5', L('Did not like it', 'अच्छा नहीं लगा'), 'f5-5']], grid: 5 },
  js2: { text: L('What did you like the most?', 'तुम्हें सबसे अच्छा क्या लगा?'), opts: [['videos', L('Videos', 'वीडियो'), '🎬', 'A'], ['brush', L('Brushing game', 'ब्रश वाला खेल'), '⏱️', 'A'], ['stickers', L('Stickers', 'स्टिकर'), '⭐'], ['questions', L('Questions', 'सवाल'), '💬']] },

  // ===== Grown-up mode (9-12 y): the child reads and answers =====
  sh1: { text: L('How often do you brush your teeth?', 'तुम कितनी बार दाँत ब्रश करते हो?'), opts: [['never', L('Never', 'कभी नहीं'), '🚫'], ['lt1', L('Less than once a day', 'दिन में एक बार से कम'), '🤷'], ['1', L('Once a day', 'दिन में एक बार'), '☀️'], ['2', L('Twice a day', 'दिन में दो बार'), '☀️🌙'], ['2+', L('More than twice a day', 'दिन में दो बार से ज़्यादा'), '⭐']] },
  sh2: { text: L('Does your toothpaste have fluoride in it?', 'क्या तुम्हारे टूथपेस्ट में फ्लोराइड है?'), opts: [['yes', L('Yes', 'हाँ'), '✅'], ['no', L('No', 'नहीं'), '❌'], ['dk', L("Don't know", 'पता नहीं'), '🤔']] },
  sh3: { text: L('Who usually puts toothpaste on your brush?', 'तुम्हारे ब्रश पर आमतौर पर टूथपेस्ट कौन लगाता है?'), opts: [['me', L('Me', 'मैं'), '🧒'], ['adult', L('A grown-up', 'कोई बड़ा'), '👩']] },
  sh4: { text: L('How much toothpaste do you use?', 'तुम कितना टूथपेस्ट लगाते हो?'), opts: [['smear', L('A tiny smear', 'बहुत थोड़ा'), 'paste-smear'], ['pea', L('Pea size', 'मटर जितना'), 'paste-pea'], ['half', L('Half the brush', 'आधा ब्रश'), 'paste-half'], ['full', L('The whole brush', 'पूरा ब्रश'), 'paste-full']] },
  sh5: { text: L('What do you do after brushing?', 'ब्रश करने के बाद तुम क्या करते हो?'), opts: [['spit', L('Spit it out, no rinse', 'बस थूकना, कुल्ला नहीं'), '💦'], ['rinse', L('Rinse with water, then spit', 'पानी से कुल्ला करके थूकना'), '🚰'], ['swallow', L('Swallow it', 'निगल जाना'), '😋']] },
  sh6: { text: L('How long do you usually brush?', 'तुम आमतौर पर कितनी देर ब्रश करते हो?'), opts: [['lt1', L('Less than 1 minute', '1 मिनट से कम'), '⏱️'], ['1', L('About 1 minute', 'लगभग 1 मिनट'), '⏱️'], ['2', L('About 2 minutes or more', 'लगभग 2 मिनट या ज़्यादा'), '⏱️⏱️'], ['dk', L('Not sure', 'पता नहीं'), '🤔']] },
  sh7: { text: L('How many times a day do you eat sweet foods (biscuits, chocolate, toffee, mithai)?', 'तुम दिन में कितनी बार मीठी चीज़ें खाते हो (बिस्कुट, चॉकलेट, टॉफ़ी, मिठाई)?'), opts: count(4, '🍬') },
  sh8: { text: L('How many times a day do you have sweet drinks (juice, cold drink, sweet milk, tea with sugar)?', 'तुम दिन में कितनी बार मीठे पेय पीते हो (जूस, कोल्ड ड्रिंक, मीठा दूध, चीनी वाली चाय)?'), opts: count(3, '🧃') },
  sh9: { text: L('In the last 7 days, on how many nights did you eat or drink something other than water after brushing?', 'पिछले 7 दिनों में, कितनी रातों को तुमने ब्रश के बाद पानी के अलावा कुछ खाया या पिया?'), opts: Array.from({ length: 8 }, (_, n) => [String(n), L(String(n), String(n))]), grid: 4 },
  sh10: { text: L('When did you last visit a dentist?', 'तुम आख़िरी बार डेंटिस्ट के पास कब गए थे?'), opts: [['lt6', L('In the last 6 months', 'पिछले 6 महीनों में'), '📅'], ['6-12', L('6 to 12 months ago', '6 से 12 महीने पहले'), '📅'], ['gt12', L('More than a year ago', 'एक साल से ज़्यादा पहले'), '📅'], ['never', L('Never', 'कभी नहीं'), '🚫'], ['dk', L("I don't remember", 'याद नहीं'), '🤔']] },

  // Oral health quality of life (same 7 impacts, frequency scale)
  sf1: { text: L('In the last 3 months, how often was it hard to eat because of your teeth?', 'पिछले 3 महीनों में, दाँतों की वजह से कितनी बार खाने में मुश्किल हुई?'), opts: FREQ4 },
  sf2: { text: L('In the last 3 months, how often was it hard to drink because of your teeth?', 'पिछले 3 महीनों में, दाँतों की वजह से कितनी बार पीने में मुश्किल हुई?'), opts: FREQ4 },
  sf3: { text: L('In the last 3 months, how often was it hard to talk because of your teeth?', 'पिछले 3 महीनों में, दाँतों की वजह से कितनी बार बोलने में मुश्किल हुई?'), opts: FREQ4 },
  sf4: { text: L('In the last 3 months, how often was it hard to play because of your teeth?', 'पिछले 3 महीनों में, दाँतों की वजह से कितनी बार खेलने में मुश्किल हुई?'), opts: FREQ4 },
  sf5: { text: L('In the last 3 months, how often was it hard to sleep because of your teeth?', 'पिछले 3 महीनों में, दाँतों की वजह से कितनी बार सोने में मुश्किल हुई?'), opts: FREQ4 },
  sf6: { text: L('In the last 3 months, how often did you not want to smile because your teeth hurt?', 'पिछले 3 महीनों में, कितनी बार दाँतों में दर्द की वजह से मुस्कुराने का मन नहीं किया?'), opts: FREQ4 },
  sf7: { text: L('In the last 3 months, how often did you not want to smile because of how your teeth look?', 'पिछले 3 महीनों में, कितनी बार दाँत कैसे दिखते हैं, इस वजह से मुस्कुराने का मन नहीं किया?'), opts: FREQ4 },

  // Dental anxiety: MCDAS(f) items, faces scale
  sa1: { text: L('How do you feel about going to the dentist?', 'डेंटिस्ट के पास जाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa2: { text: L('How do you feel about having your teeth looked at?', 'जब डेंटिस्ट तुम्हारे दाँत देखते हैं, तो तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa3: { text: L('How do you feel about having your teeth cleaned and polished?', 'दाँत साफ़ और पॉलिश करवाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa4: { text: L('How do you feel about having an injection in your gum?', 'मसूड़े में इंजेक्शन लगवाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa5: { text: L('How do you feel about having a filling?', 'दाँत में फ़िलिंग करवाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa6: { text: L('How do you feel about being put to sleep for treatment?', 'इलाज के लिए सुलाए जाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa7: { text: L('How do you feel about having a tooth taken out?', 'दाँत निकलवाने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },
  sa8: { text: L('How do you feel about having gas to help you relax?', 'आराम के लिए गैस लेने के बारे में तुम्हें कैसा लगता है?'), opts: MCDAS5, grid: 5 },

  // Confidence (child-adapted COM-B)
  sc1: { text: L('I know how to brush my teeth the right way.', 'मुझे दाँत सही तरीके से ब्रश करना आता है।'), opts: AGREE5 },
  sc2: { text: L('Brushing for 2 whole minutes is easy for me.', 'पूरे 2 मिनट तक ब्रश करना मेरे लिए आसान है।'), opts: AGREE5 },
  sc3: { text: L('Saying no to sweets between meals is easy for me.', 'खाने के बीच मीठे को मना करना मेरे लिए आसान है।'), opts: AGREE5 },
  sc4: { text: L('Brushing every night before bed is a habit for me.', 'हर रात सोने से पहले ब्रश करना मेरी आदत है।'), opts: AGREE5 },

  // Quiz
  sq1: { ans: 'T', opts: TF_SENIOR, text: L('Fluoride in toothpaste helps protect teeth from decay.', 'टूथपेस्ट में फ्लोराइड दाँतों को सड़न से बचाने में मदद करता है।') },
  sq2: { ans: 'F', opts: TF_SENIOR, text: L('You should rinse your mouth with lots of water right after brushing.', 'ब्रश के तुरंत बाद खूब पानी से कुल्ला करना चाहिए।') },
  sq3: { ans: 'T', opts: TF_SENIOR, text: L('Eating sweets many times a day is worse than eating them once with a meal.', 'दिन में कई बार मीठा खाना, खाने के साथ एक बार खाने से ज़्यादा नुकसान करता है।') },
  sq4: { ans: 'F', opts: TF_SENIOR, text: L("Milk teeth don't matter because they fall out.", 'दूध के दाँत गिर जाते हैं, इसलिए उनकी परवाह ज़रूरी नहीं।') },
  sq5: { ans: 'T', opts: TF_SENIOR, text: L('Brushing twice a day for 2 minutes is recommended.', 'दिन में दो बार, 2 मिनट तक ब्रश करना चाहिए।') },
  sq6: { ans: 'F', opts: TF_SENIOR, text: L('Herbal toothpaste without fluoride protects teeth just as well.', 'बिना फ्लोराइड वाला हर्बल टूथपेस्ट भी दाँतों को उतना ही बचाता है।') },
  sq7: { ans: 'T', opts: TF_SENIOR, text: L('Bleeding gums when brushing can be a sign of gum problems.', 'ब्रश करते समय मसूड़ों से खून आना मसूड़ों की बीमारी का संकेत हो सकता है।') },
  sq8: { ans: 'F', opts: TF_SENIOR, text: L('Packaged fruit juice is good for teeth.', 'पैकेट वाला फलों का जूस दाँतों के लिए अच्छा है।') },

  // Weekly check-in (grown-up mode)
  sw1: { text: L('Yesterday, when did you brush?', 'कल तुमने कब ब्रश किया?'), opts: [...WHEN, ['none', L("I didn't brush", 'ब्रश नहीं किया'), '🙈']] },
  sw2: { text: L('Yesterday, did you brush for about 2 minutes each time?', 'कल क्या तुमने हर बार लगभग 2 मिनट ब्रश किया?'), opts: [['yes', L('Yes', 'हाँ'), '✅'], ['no', L('No', 'नहीं'), '❌'], ['dk', L('Not sure', 'पक्का नहीं'), '🤔']] },
  sw3: { text: L('Yesterday, how many times did you eat sweet things?', 'कल तुमने कितनी बार मीठी चीज़ें खाईं?'), opts: count(4, '🍬') },
  sw4: { text: L('Yesterday, how many times did you have sweet drinks?', 'कल तुमने कितनी बार मीठे पेय पिए?'), opts: count(3, '🧃') },
  sw5: { text: L('Last night, after brushing, did you have anything except water?', 'कल रात ब्रश के बाद, क्या तुमने पानी के अलावा कुछ खाया-पिया?'), opts: YN },

  // Final feedback (grown-up mode)
  ss1: { text: L('The app was easy to use.', 'ऐप इस्तेमाल करना आसान था।'), opts: AGREE5 },
  ss2: { grp: 'A', text: L('The videos and brushing timer helped me.', 'वीडियो और ब्रश टाइमर से मुझे मदद मिली।'), opts: AGREE5 },
  ss3: { type: 'text', optional: true, text: L('What would you change in the app?', 'तुम ऐप में क्या बदलना चाहोगे?') }
};

// ---------- instruments ----------
// audience: parent | junior | senior (sets the screen style)
export const INSTR = {
  demo: { audience: 'parent', icon: '👪', title: L('About your family', 'आपके परिवार के बारे में'), mins: 1, qs: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'] },
  jhab: { audience: 'junior', icon: '🪥', color: 'mint', title: L('My brushing', 'मेरा ब्रश'), mins: 2, qs: ['j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7', 'j8'] },
  jfeel: { audience: 'junior', icon: '😊', color: 'peach', title: L('My teeth and me', 'मेरे दाँत और मैं'), mins: 2, qs: ['jf1', 'jf2', 'jf3', 'jf4', 'jf5', 'jf6', 'jf7', 'jfis'] },
  jquiz: { audience: 'junior', icon: '🧠', color: 'lilac', title: L('Quiz time', 'क्विज़ टाइम'), mins: 1, qs: ['jq1', 'jq2', 'jq3', 'jq4', 'jq5', 'jq6'] },
  jcheck: { audience: 'junior', icon: '📅', color: 'sky', title: L('This week', 'यह हफ़्ता'), mins: 1, qs: ['jc1', 'jc2', 'jc3', 'jc4'] },
  jsat: { audience: 'junior', icon: '💌', color: 'pink', title: L('Tell Chamku', 'चमकू को बताओ'), mins: 1, qs: ['js1', 'js2'] },
  shab: { audience: 'senior', icon: '🪥', color: 'mint', title: L('My habits', 'मेरी आदतें'), mins: 3, qs: ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6', 'sh7', 'sh8', 'sh9', 'sh10'] },
  sfeel: { audience: 'senior', icon: '😊', color: 'peach', title: L('My teeth and me', 'मेरे दाँत और मैं'), mins: 2, qs: ['sf1', 'sf2', 'sf3', 'sf4', 'sf5', 'sf6', 'sf7'] },
  sanx: { audience: 'senior', icon: '🦷', color: 'sky', optional: true, title: L('Dentist feelings', 'डेंटिस्ट और मेरी भावनाएँ'), mins: 2, qs: ['sa1', 'sa2', 'sa3', 'sa4', 'sa5', 'sa6', 'sa7', 'sa8'] },
  sconf: { audience: 'senior', icon: '💪', color: 'lemon', title: L('How sure am I?', 'मुझे कितना भरोसा है?'), mins: 1, qs: ['sc1', 'sc2', 'sc3', 'sc4'] },
  squiz: { audience: 'senior', icon: '🧠', color: 'lilac', title: L('Quiz', 'क्विज़'), mins: 2, qs: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5', 'sq6', 'sq7', 'sq8'] },
  scheck: { audience: 'senior', icon: '📅', color: 'sky', title: L('This week', 'यह हफ़्ता'), mins: 1, qs: ['sw1', 'sw2', 'sw3', 'sw4', 'sw5'] },
  ssat: { audience: 'senior', icon: '💌', color: 'pink', title: L('Your feedback', 'तुम्हारी राय'), mins: 1, qs: ['ss1', 'ss2', 'ss3'] }
};

// What each mode answers: [instrument, response key]. Keys are shared so the CSV lines up.
export const PLAN = {
  junior: {
    base: [['jhab', 'hab_0'], ['jfeel', 'feel_0'], ['jquiz', 'quiz_0']],
    check: 'jcheck',
    final: [['jhab', 'hab_6'], ['jfeel', 'feel_6'], ['jquiz', 'quiz_6'], ['jsat', 'sat_6']]
  },
  senior: {
    base: [['shab', 'hab_0'], ['sfeel', 'feel_0'], ['sanx', 'anx_0'], ['sconf', 'conf_0'], ['squiz', 'quiz_0']],
    check: 'scheck',
    final: [['shab', 'hab_6'], ['sfeel', 'feel_6'], ['sanx', 'anx_6'], ['sconf', 'conf_6'], ['squiz', 'quiz_6'], ['ssat', 'sat_6']]
  }
};
