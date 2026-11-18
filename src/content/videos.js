// Copied from smileclub-kids (tested question set). Edit content here; the web app reads it as-is.
import { L } from '../lib/i18n';

// Animated videos: each scene = one picture (k, drawn in components/Scenes.jsx) + one line read aloud (c)
export const EPISODES = [
  {
    icon: '👋', color: 'mint',
    t: L('Meet Chamku', 'चमकू से मिलो'),
    scenes: [
      { k: 'intro', c: L("Hi! I'm Chamku, your tooth friend!", 'नमस्ते! मैं चमकू हूँ, तुम्हारा दाँतों वाला दोस्त!') },
      { k: 'eatTalkSmile', c: L('Teeth help you eat, talk and smile.', 'दाँत खाने, बोलने और मुस्कुराने में मदद करते हैं।') },
      { k: 'twiceDay', c: L('Brush two times every day: in the morning and at night.', 'हर दिन दो बार ब्रश करो: सुबह और रात को।') },
      { k: 'nightStar', c: L('The night brush is the most important one!', 'रात वाला ब्रश सबसे ज़रूरी है!') }
    ]
  },
  {
    icon: '🪥', color: 'sky',
    t: L('How to brush', 'ब्रश कैसे करें'),
    scenes: [
      { k: 'holdBrush', c: L('Hold your brush like this, tilted towards your gums.', 'ब्रश को ऐसे पकड़ो, मसूड़ों की तरफ़ झुकाकर।') },
      { k: 'circles', c: L('Make small, gentle circles on every tooth.', 'हर दाँत पर छोटे-छोटे, हल्के गोले बनाओ।') },
      { k: 'zones', c: L('Brush the outside, the inside, and the chewing tops.', 'बाहर, अंदर, और चबाने वाली सतह, सब जगह ब्रश करो।') },
      { k: 'tongue', c: L('Clean your tongue gently too.', 'जीभ को भी हल्के से साफ़ करो।') },
      { k: 'timer2', c: L("Keep going for two whole minutes. Use Chamku's timer!", 'पूरे दो मिनट तक ब्रश करो। चमकू का टाइमर इस्तेमाल करो!') }
    ]
  },
  {
    icon: '🧴', color: 'lemon',
    t: L('The right toothpaste', 'सही टूथपेस्ट'),
    scenes: [
      { k: 'fluorideTube', c: L('Use a toothpaste with fluoride. It makes teeth strong.', 'फ्लोराइड वाला टूथपेस्ट लगाओ। यह दाँतों को मज़बूत बनाता है।') },
      { k: 'peaSize', c: L('Just a pea-sized bit is enough. Not the whole brush!', 'बस मटर के दाने जितना काफ़ी है। पूरा ब्रश नहीं!') },
      { k: 'grownupHelps', c: L('Little ones: a grown-up puts the toothpaste on.', 'छोटे बच्चों के लिए: टूथपेस्ट कोई बड़ा लगाए।') }
    ]
  },
  {
    icon: '💦', color: 'lilac',
    t: L("Spit, don't rinse", 'थूको, कुल्ला नहीं'),
    scenes: [
      { k: 'spitFoam', c: L('When you finish, spit out the foam.', 'ब्रश ख़त्म होने पर झाग थूक दो।') },
      { k: 'noRinse', c: L("Don't rinse with water.", 'पानी से कुल्ला मत करो।') },
      { k: 'shield', c: L('The fluoride stays on your teeth like a shield!', 'फ्लोराइड दाँतों पर ढाल की तरह रहता है!') }
    ]
  },
  {
    icon: '🦠', color: 'peach',
    t: L('Sugar bugs', 'शुगर बग'),
    scenes: [
      { k: 'sugarBugs', c: L('Sugar bugs love sweets. They make holes in teeth.', 'शुगर बग को मीठा बहुत पसंद है। वे दाँतों में छेद करते हैं।') },
      { k: 'manySnacks', c: L('Sweets again and again give them a party all day!', 'बार-बार मीठा खाने से उनकी दिन भर पार्टी होती है!') },
      { k: 'swaps', c: L('Try fruit, peanuts, roasted chana and water instead.', 'इसकी जगह फल, मूँगफली, भुने चने और पानी लो।') },
      { k: 'withMeals', c: L('Keep sweets for mealtimes only.', 'मीठा सिर्फ़ खाने के समय खाओ।') }
    ]
  },
  {
    icon: '🌙', color: 'pink',
    t: L('Bedtime and the dentist', 'सोने का समय और डेंटिस्ट'),
    scenes: [
      { k: 'bedtime', c: L('Brush last thing at night. After that, only water.', 'रात में सबसे आख़िर में ब्रश करो। उसके बाद सिर्फ़ पानी।') },
      { k: 'dentist', c: L("The dentist is your teeth's best friend. Visit every 6 months.", 'डेंटिस्ट तुम्हारे दाँतों के सबसे अच्छे दोस्त हैं। हर 6 महीने में मिलने जाओ।') },
      { k: 'outro', c: L("You're a Smile Club star! Keep brushing!", 'तुम स्माइल क्लब के स्टार हो! ब्रश करते रहो!') }
    ]
  }
];

// Chamku's tip of the day, two per week
export const TIPS = [
  [L('Brush in the morning and before bed today!', 'आज सुबह और सोने से पहले ब्रश करना!'), L('The night brush is the most important one!', 'रात वाला ब्रश सबसे ज़रूरी है!')],
  [L('Small circles on every tooth!', 'हर दाँत पर छोटे-छोटे गोले!'), L('Can you brush for 2 whole minutes today?', 'क्या आज तुम पूरे 2 मिनट ब्रश कर सकते हो?')],
  [L('Is there fluoride in your toothpaste? Ask a grown-up to check!', 'क्या तुम्हारे टूथपेस्ट में फ्लोराइड है? किसी बड़े से देखने को कहो!'), L('Just a pea-sized bit of toothpaste!', 'बस मटर के दाने जितना टूथपेस्ट!')],
  [L("Spit, don't rinse!", 'थूको, कुल्ला नहीं!'), L('Leave the toothpaste shield on your teeth.', 'टूथपेस्ट की ढाल दाँतों पर रहने दो।')],
  [L('Try fruit instead of a sweet snack today.', 'आज मीठे की जगह फल खाकर देखो।'), L('Water is the best drink for teeth!', 'दाँतों के लिए पानी सबसे अच्छा पेय है!')],
  [L('After night brushing, only water!', 'रात के ब्रश के बाद, सिर्फ़ पानी!'), L('Show your grown-up your sticker book!', 'अपने बड़ों को अपनी स्टिकर बुक दिखाओ!')]
];

export const STICKERS = ['🦷', '⭐', '🌈', '🦁', '🐘', '🐯', '🦜', '🍎', '🥕', '🚀', '🎈', '🏆', '🌻', '🐬', '🦋', '🍉', '🐼', '🦒', '🌟', '🎨', '🪁', '🐢', '🍌', '👑'];
