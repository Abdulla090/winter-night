// Emoji Puzzles Data
// Categories: Movies, Songs, Countries, Food, Animals, Phrases

export const emojiCategories = [
    {
        id: 'movies',
        title: { en: 'Movies', ku: 'فیلمەکان' },
        icon: '🎬',
        color: '#ef4444',
    },
    {
        id: 'songs',
        title: { en: 'Songs', ku: 'گۆرانییەکان' },
        icon: '🎵',
        color: '#8b5cf6',
    },
    {
        id: 'countries',
        title: { en: 'Countries', ku: 'وڵاتەکان' },
        icon: '🌍',
        color: '#10b981',
    },
    {
        id: 'food',
        title: { en: 'Food & Drinks', ku: 'خواردن و خواردنەوە' },
        icon: '🍕',
        color: '#f59e0b',
    },
    {
        id: 'phrases',
        title: { en: 'Phrases & Sayings', ku: 'پەندەکان' },
        icon: '💬',
        color: '#3b82f6',
    },
    {
        id: 'mixed',
        title: { en: 'Mixed Challenge', ku: 'تێکەڵ' },
        icon: '🎲',
        color: '#ec4899',
    },
];

export const emojiPuzzles = {
    movies: [
        { emojis: '🦁👑', answer: { en: 'The Lion King', ku: 'پاشا شێرەکە' }, difficulty: 1 },
        { emojis: '❄️👸', answer: { en: 'Frozen', ku: 'بەستراو' }, difficulty: 1 },
        { emojis: '🕷️🧑', answer: { en: 'Spider-Man', ku: 'پیاوی جاڵجاڵۆکە' }, difficulty: 1 },
        { emojis: '🦇🧑', answer: { en: 'Batman', ku: 'باتمان' }, difficulty: 1 },
        { emojis: '👻👻👻', answer: { en: 'Ghostbusters', ku: 'ڕاوچی تارماییەکان' }, difficulty: 2 },
        { emojis: '🚢❄️💔', answer: { en: 'Titanic', ku: 'تایتانیک' }, difficulty: 1 },
        { emojis: '🧙‍♂️💍', answer: { en: 'Lord of the Rings', ku: 'گەورەی ئەڵقەکان' }, difficulty: 2 },
        { emojis: '⭐⚔️', answer: { en: 'Star Wars', ku: 'جەنگی ئەستێرەکان' }, difficulty: 1 },
        { emojis: '🦈', answer: { en: 'Jaws', ku: 'جاوز' }, difficulty: 1 },
        { emojis: '👽📞🏠', answer: { en: 'E.T.', ku: 'ئی تی' }, difficulty: 2 },
        { emojis: '🤖❤️🌱', answer: { en: 'Wall-E', ku: 'والی' }, difficulty: 2 },
        { emojis: '🧒🏠🎄🎁', answer: { en: 'Home Alone', ku: 'بە تەنیا لە ماڵەوە' }, difficulty: 1 },
        { emojis: '🦖🌴', answer: { en: 'Jurassic Park', ku: 'پارکی جوراسیک' }, difficulty: 1 },
        { emojis: '🚗⚡', answer: { en: 'Cars', ku: 'ئۆتۆمبێلەکان' }, difficulty: 1 },
        { emojis: '🐠🔍', answer: { en: 'Finding Nemo', ku: 'گەڕان بەدوای نیمۆدا' }, difficulty: 1 },
        { emojis: '🎃✂️', answer: { en: 'Edward Scissorhands', ku: 'ئێدوارد دەست مەقەست' }, difficulty: 3 },
        { emojis: '💀🏴‍☠️🌊', answer: { en: 'Pirates of the Caribbean', ku: 'دزە دەریاییەکانی کاریبی' }, difficulty: 2 },
        { emojis: '🦸‍♂️🔨⚡', answer: { en: 'Thor', ku: 'تۆر' }, difficulty: 1 },
        { emojis: '🐝🎬', answer: { en: 'Bee Movie', ku: 'فیلمی هەنگ' }, difficulty: 2 },
        { emojis: '🧟‍♂️🌍', answer: { en: 'World War Z', ku: 'جەنگی جیهانی Z' }, difficulty: 2 },
        { emojis: '🔴💊🔵💊', answer: { en: 'The Matrix', ku: 'ماتریکس' }, difficulty: 2 },
        { emojis: '🦍🏙️', answer: { en: 'King Kong', ku: 'کینگ کۆنگ' }, difficulty: 1 },
        { emojis: '🧛‍♂️🩸', answer: { en: 'Dracula', ku: 'دراکولا' }, difficulty: 1 },
        { emojis: '🤖👮', answer: { en: 'RoboCop', ku: 'ڕۆبۆکۆپ' }, difficulty: 2 },
        { emojis: '🕷️🕸️🏠', answer: { en: 'Spider-Man: Homecoming', ku: 'پیاوی جاڵجاڵۆکە: گەڕانەوە بۆ ماڵ' }, difficulty: 2 },
        { emojis: '🧞‍♂️🪔', answer: { en: 'Aladdin', ku: 'عەلادین' }, difficulty: 1 },
        { emojis: '🐀👨‍🍳', answer: { en: 'Ratatouille', ku: 'ڕاتاتووی' }, difficulty: 2 },
        { emojis: '🏠⬆️🎈', answer: { en: 'Up', ku: 'سەرەوە' }, difficulty: 1 },
        { emojis: '🧊⛵🐻‍❄️', answer: { en: 'Ice Age', ku: 'سەردەمی بەستەڵەک' }, difficulty: 1 },
        { emojis: '👸🐸💋', answer: { en: 'The Princess and the Frog', ku: 'شازادە خاتوون و بۆقەکە' }, difficulty: 2 },
    ],
    songs: [
        { emojis: '🎤👸', answer: { en: 'Single Ladies - Beyoncé', ku: 'کچانی سینگڵ' }, difficulty: 2 },
        { emojis: '🌧️☔👩', answer: { en: "It's Raining Men", ku: 'پیاو دەبارێت' }, difficulty: 2 },
        { emojis: '🔥🎸', answer: { en: 'We Didn\'t Start the Fire', ku: 'ئێمە ئاگرەکەمان نەکردەوە' }, difficulty: 3 },
        { emojis: '💃🌙', answer: { en: 'Dancing in the Moonlight', ku: 'سەماکردن لەبەر تریفەی مانگ' }, difficulty: 2 },
        { emojis: '🚗🚗🚗', answer: { en: 'Drive - The Cars', ku: 'لێخوڕین' }, difficulty: 3 },
        { emojis: '👀🐅', answer: { en: 'Eye of the Tiger', ku: 'چاوی بەور' }, difficulty: 1 },
        { emojis: '🌈🌧️', answer: { en: 'Somewhere Over the Rainbow', ku: 'شوێنێک لەوبەری پەلکەزێڕینە' }, difficulty: 2 },
        { emojis: '💎✋', answer: { en: 'Diamonds - Rihanna', ku: 'ئەڵماس' }, difficulty: 2 },
        { emojis: '🎵🌊', answer: { en: 'Ocean Eyes - Billie Eilish', ku: 'چاوانی دەریایی' }, difficulty: 2 },
        { emojis: '🔥💃', answer: { en: 'Girl on Fire - Alicia Keys', ku: 'کچی ئاگرین' }, difficulty: 2 },
        { emojis: '🎶👋🌍', answer: { en: 'Hello - Adele', ku: 'سڵاو' }, difficulty: 1 },
        { emojis: '☀️😊', answer: { en: 'Happy - Pharrell', ku: 'دڵخۆش' }, difficulty: 1 },
        { emojis: '🚀👨', answer: { en: 'Rocket Man - Elton John', ku: 'پیاوی ڕۆکێت' }, difficulty: 2 },
        { emojis: '💜🌧️', answer: { en: 'Purple Rain - Prince', ku: 'بارانی وەنەوشەیی' }, difficulty: 2 },
        { emojis: '🎸🏨', answer: { en: 'Hotel California - Eagles', ku: 'هۆتێلی کالیفۆرنیا' }, difficulty: 2 },
        { emojis: '🌙🚶', answer: { en: 'Walking on the Moon - The Police', ku: 'پیاسەکردن لەسەر مانگ' }, difficulty: 2 },
        { emojis: '🎵🌊🏄', answer: { en: 'Surfin USA - Beach Boys', ku: 'سەرفینگ ئەمریکا' }, difficulty: 2 },
        { emojis: '💃👗', answer: { en: 'Material Girl - Madonna', ku: 'کچی مادی' }, difficulty: 2 },
        { emojis: '🎤🎭😢', answer: { en: 'Bohemian Rhapsody - Queen', ku: 'ڕاپسۆدی بۆهیمانی' }, difficulty: 2 },
        { emojis: '⭐🌃', answer: { en: 'Starboy - The Weeknd', ku: 'کوڕی ئەستێرە' }, difficulty: 2 },
    ],
    countries: [
        { emojis: '🗽', answer: { en: 'USA', ku: 'ئەمریکا' }, difficulty: 1 },
        { emojis: '🗼🥐', answer: { en: 'France', ku: 'فەڕەنسا' }, difficulty: 1 },
        { emojis: '🍕🍝', answer: { en: 'Italy', ku: 'ئیتاڵیا' }, difficulty: 1 },
        { emojis: '🦘🐨', answer: { en: 'Australia', ku: 'ئوسترالیا' }, difficulty: 1 },
        { emojis: '🍣🗻', answer: { en: 'Japan', ku: 'ژاپۆن' }, difficulty: 1 },
        { emojis: '🐉🏯', answer: { en: 'China', ku: 'چین' }, difficulty: 1 },
        { emojis: '🌮🌵', answer: { en: 'Mexico', ku: 'مەکسیک' }, difficulty: 1 },
        { emojis: '🐄🍀', answer: { en: 'Ireland', ku: 'ئایرلەندا' }, difficulty: 2 },
        { emojis: '🧀🌷', answer: { en: 'Netherlands', ku: 'هۆڵەندا' }, difficulty: 2 },
        { emojis: '🏔️🍫', answer: { en: 'Switzerland', ku: 'سویسرا' }, difficulty: 2 },
        { emojis: '🐫🏜️🕌', answer: { en: 'Egypt', ku: 'میسر' }, difficulty: 1 },
        { emojis: '🐘🕉️', answer: { en: 'India', ku: 'هیندستان' }, difficulty: 1 },
        { emojis: '🥋🇰🇷', answer: { en: 'South Korea', ku: 'کۆریای باشوور' }, difficulty: 1 },
        { emojis: '🐻❄️', answer: { en: 'Russia', ku: 'ڕووسیا' }, difficulty: 2 },
        { emojis: '🦁🌍', answer: { en: 'Kenya', ku: 'کینیا' }, difficulty: 2 },
        { emojis: '⚽🎉🏖️', answer: { en: 'Brazil', ku: 'برازیل' }, difficulty: 1 },
        { emojis: '🏰💂', answer: { en: 'England', ku: 'ئینگلتەرا' }, difficulty: 1 },
        { emojis: '🦅🍺🥨', answer: { en: 'Germany', ku: 'ئەڵمانیا' }, difficulty: 2 },
        { emojis: '🏖️🎶💃', answer: { en: 'Cuba', ku: 'کووبا' }, difficulty: 2 },
        { emojis: '🍁🏒', answer: { en: 'Canada', ku: 'کەنەدا' }, difficulty: 1 },
        { emojis: '🌋🌺', answer: { en: 'Hawaii', ku: 'هاوایی' }, difficulty: 2 },
        { emojis: '🏛️🫒', answer: { en: 'Greece', ku: 'یۆنان' }, difficulty: 2 },
        { emojis: '🐂💃🎸', answer: { en: 'Spain', ku: 'ئیسپانیا' }, difficulty: 2 },
    ],
    food: [
        { emojis: '🍕🧀🍅', answer: { en: 'Pizza', ku: 'پیتزا' }, difficulty: 1 },
        { emojis: '🍔🍟', answer: { en: 'Burger & Fries', ku: 'بەرگەر و فرایز' }, difficulty: 1 },
        { emojis: '🌭🥤', answer: { en: 'Hot Dog', ku: 'هۆت دۆگ' }, difficulty: 1 },
        { emojis: '🍣🥢', answer: { en: 'Sushi', ku: 'سوشی' }, difficulty: 1 },
        { emojis: '🌮🌯', answer: { en: 'Tacos & Burritos', ku: 'تاکۆ و بۆرریتۆ' }, difficulty: 1 },
        { emojis: '🍝🍅🧄', answer: { en: 'Spaghetti', ku: 'سپاگێتی' }, difficulty: 1 },
        { emojis: '🍜🥡', answer: { en: 'Noodles', ku: 'نوودڵ' }, difficulty: 1 },
        { emojis: '☕🥐', answer: { en: 'Coffee & Croissant', ku: 'قاوە و کرواسان' }, difficulty: 1 },
        { emojis: '🍦🍨', answer: { en: 'Ice Cream', ku: 'ئایسکریم' }, difficulty: 1 },
        { emojis: '🍿🎬', answer: { en: 'Popcorn', ku: 'پۆپکۆرن' }, difficulty: 1 },
        { emojis: '🥗🥒🍅', answer: { en: 'Salad', ku: 'زەڵاتە' }, difficulty: 1 },
        { emojis: '🍩☕', answer: { en: 'Donuts', ku: 'دۆناتس' }, difficulty: 1 },
        { emojis: '🥞🍯', answer: { en: 'Pancakes', ku: 'پانکەیک' }, difficulty: 1 },
        { emojis: '🍗🔥', answer: { en: 'Fried Chicken', ku: 'مریشکی سوورکراوە' }, difficulty: 1 },
        { emojis: '🧇🍓', answer: { en: 'Waffles', ku: 'وافڵ' }, difficulty: 1 },
        { emojis: '🥙🧅', answer: { en: 'Kebab', ku: 'کەباب' }, difficulty: 1 },
        { emojis: '🍲🥩🥔', answer: { en: 'Stew', ku: 'شلە' }, difficulty: 1 },
        { emojis: '🧁🎂', answer: { en: 'Cupcake', ku: 'کەپکەیک' }, difficulty: 1 },
        { emojis: '🥚🍳', answer: { en: 'Fried Egg', ku: 'هێلکەی سوورکراوە' }, difficulty: 1 },
        { emojis: '🫖🍵', answer: { en: 'Tea', ku: 'چا' }, difficulty: 1 },
    ],
    phrases: [
        { emojis: '💔', answer: { en: 'Heartbroken', ku: 'دڵشکاو' }, difficulty: 1 },
        { emojis: '🌧️🐱🐶', answer: { en: 'Raining Cats and Dogs', ku: 'بارانی بەهێز' }, difficulty: 2 },
        { emojis: '🐘🏠', answer: { en: 'Elephant in the Room', ku: 'کێشە نەگوتراوەکە' }, difficulty: 2 },
        { emojis: '🔥👖', answer: { en: 'Liar Liar Pants on Fire', ku: 'درۆزنەکە' }, difficulty: 2 },
        { emojis: '💡', answer: { en: 'Bright Idea', ku: 'بیرۆکەیەکی درەوشاوە' }, difficulty: 1 },
        { emojis: '🐝🧢', answer: { en: 'Bee in Your Bonnet', ku: 'هەنگ لە کڵاوەکەت' }, difficulty: 3 },
        { emojis: '🍰🍒', answer: { en: 'Cherry on Top', ku: 'شیرینییەکەی سەرەوە' }, difficulty: 2 },
        { emojis: '⏰💣', answer: { en: 'Time Bomb', ku: 'بۆمبی تەوقیتکراو' }, difficulty: 1 },
        { emojis: '🌈🦄', answer: { en: 'Rainbows and Unicorns', ku: 'پەلکەزێڕینە و ئەسپی قۆچدار' }, difficulty: 1 },
        { emojis: '🔑❤️', answer: { en: 'Key to My Heart', ku: 'کلیلی دڵم' }, difficulty: 1 },
        { emojis: '👁️👁️', answer: { en: 'Eye to Eye', ku: 'هاوڕا بوون' }, difficulty: 1 },
        { emojis: '🌍🔚', answer: { en: 'End of the World', ku: 'کۆتایی جیهان' }, difficulty: 1 },
        { emojis: '🧊❄️', answer: { en: 'Break the Ice', ku: 'سەهۆڵ شکاندن' }, difficulty: 2 },
        { emojis: '🌙⭐', answer: { en: 'Over the Moon', ku: 'لەوپەڕی دڵخۆشیدا' }, difficulty: 2 },
        { emojis: '🦋🤢', answer: { en: 'Butterflies in Stomach', ku: 'دڵەراوکێ (پەپوولەی سگ)' }, difficulty: 2 },
        { emojis: '🕐💰', answer: { en: 'Time is Money', ku: 'کات زێڕە' }, difficulty: 1 },
        { emojis: '🐺👕🐑', answer: { en: 'Wolf in Sheep Clothing', ku: 'گورگ لە پێستی مەڕدا' }, difficulty: 2 },
        { emojis: '🗡️🛡️', answer: { en: 'Sword and Shield', ku: 'شمشێر و قەڵغان' }, difficulty: 1 },
        { emojis: '🎭😂😢', answer: { en: 'Comedy and Tragedy', ku: 'کۆمیدی و تراژیدی' }, difficulty: 2 },
        { emojis: '🏃‍♂️💨', answer: { en: 'Run like the Wind', ku: 'وەک با ڕابکە' }, difficulty: 2 },
    ],
};

const seenPuzzles = {};

export const getPuzzles = (categoryId, language = 'en', difficulty = null) => {
    let rawPuzzles = [];
    if (categoryId === 'mixed') {
        Object.keys(emojiPuzzles).forEach(cat => {
            emojiPuzzles[cat].forEach((puzzle, i) => {
                rawPuzzles.push({ ...puzzle, category: cat, originalCat: cat, originalIndex: i });
            });
        });
    } else {
        const catPuzzles = emojiPuzzles[categoryId] || [];
        rawPuzzles = catPuzzles.map((puzzle, i) => ({ ...puzzle, category: categoryId, originalCat: categoryId, originalIndex: i }));
    }

    if (difficulty) {
        rawPuzzles = rawPuzzles.filter(p => p.difficulty === difficulty);
    }
    
    // Sort random
    const shuffled = rawPuzzles.sort(() => Math.random() - 0.5);
    
    // Initialize tracking for this combo
    const trackKey = `${categoryId}-${difficulty || 'any'}`;
    if (!seenPuzzles[trackKey]) seenPuzzles[trackKey] = new Set();
    
    let unseen = shuffled.filter(p => !seenPuzzles[trackKey].has(`${p.originalCat}-${p.originalIndex}`));
    
    // If not enough unseen are left, reset the tracking and take from all shuffled
    if (unseen.length < 10) {
        seenPuzzles[trackKey].clear();
        unseen = shuffled;
    }
    
    // Take the top 10 (or however many requested)
    const result = unseen.slice(0, 10);
    
    // Mark them as seen
    result.forEach(p => seenPuzzles[trackKey].add(`${p.originalCat}-${p.originalIndex}`));
    
    return result;
};

export const getCategoryById = (id) => {
    return emojiCategories.find(cat => cat.id === id);
};
