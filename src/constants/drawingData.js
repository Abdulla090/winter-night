// Draw & Guess - Drawing Words Database
// Bilingual support: English (en) and Kurdish Sorani (ku)
// All data is stored locally - NO NETWORK REQUIRED

// Time options for game rounds (in seconds)
export const TIME_OPTIONS = [30, 60, 90, 120];

export const DRAWING_CATEGORIES = {
    easy: {
        name: { en: 'Easy', ku: 'ئاسان' },
        icon: 'Smile',
        words: [
            { en: 'Dog', ku: 'سەگ' },
            { en: 'Cat', ku: 'پشیلە' },
            { en: 'House', ku: 'ماڵ' },
            { en: 'Tree', ku: 'دار' },
            { en: 'Sun', ku: 'خۆر' },
            { en: 'Moon', ku: 'مانگ' },
            { en: 'Star', ku: 'ئەستێرە' },
            { en: 'Flower', ku: 'گوڵ' },
            { en: 'Ball', ku: 'تۆپ' },
            { en: 'Car', ku: 'ئۆتۆمبیل' },
            { en: 'Fish', ku: 'ماسی' },
            { en: 'Bird', ku: 'باڵندە' },
            { en: 'Apple', ku: 'سێو' },
            { en: 'Pizza', ku: 'پیتزا' },
            { en: 'Ice Cream', ku: 'ئایسکرێم' },
            { en: 'Book', ku: 'کتێب' },
            { en: 'Chair', ku: 'کورسی' },
            { en: 'Table', ku: 'مێز' },
            { en: 'Bed', ku: 'قەرەوێڵە' },
            { en: 'Door', ku: 'دەرگا' },
            { en: 'Window', ku: 'پەنجەرە' },
            { en: 'Phone', ku: 'مۆبایل' },
            { en: 'Clock', ku: 'کاتژمێر' },
            { en: 'Shoe', ku: 'پێڵاو' },
            { en: 'Hat', ku: 'کڵاو' },
            { en: 'Cup', ku: 'پیاڵە' },
            { en: 'Spoon', ku: 'کەوچک' },
            { en: 'Fork', ku: 'چەتاڵ' },
            { en: 'Knife', ku: 'چەقۆ' },
            { en: 'Banana', ku: 'مۆز' },
            { en: 'Orange', ku: 'پرتەقاڵ' },
            { en: 'Strawberry', ku: 'شلیک' },
            { en: 'Grapes', ku: 'ترێ' },
            { en: 'Watermelon', ku: 'شووتی' },
            { en: 'Cupcake', ku: 'کاپکەیک' },
            { en: 'Donut', ku: 'دۆنەت' },
            { en: 'Ring', ku: 'مستیلە' },
            { en: 'Hand', ku: 'دەست' },
            { en: 'Foot', ku: 'پێ' },
            { en: 'Nose', ku: 'لووت' },
            { en: 'Eye', ku: 'چاو' },
            { en: 'Ear', ku: 'گوێ' },
            { en: 'Mouth', ku: 'دەم' },
            { en: 'Key', ku: 'کلیل' },
            { en: 'Lock', ku: 'قوفڵ' },
            { en: 'Heart', ku: 'دڵ' },
            { en: 'Cloud', ku: 'هەور' },
            { en: 'Rain', ku: 'باران' },
            { en: 'Snow', ku: 'بەفر' },
            { en: 'Candle', ku: 'مۆم' },
            { en: 'Lamp', ku: 'گڵۆپ' },
            { en: 'Pencil', ku: 'پێنووس' },
            { en: 'Scissors', ku: 'مەقەس' },
            { en: 'Bottle', ku: 'شووشە' },
            { en: 'Egg', ku: 'هێلکە' },
            { en: 'Cheese', ku: 'پەنیر' },
            { en: 'Carrot', ku: 'گێزەر' },
            { en: 'Corn', ku: 'گەنمەشامی' },
            { en: 'Mushroom', ku: 'قارچک' },
            { en: 'Cherry', ku: 'گێلاس' },
            { en: 'Lemon', ku: 'لیمۆ' },
            { en: 'Pear', ku: 'هەرمێ' },
            { en: 'Bread', ku: 'نان' },
            { en: 'Milk', ku: 'شیر' },
            { en: 'Glasses', ku: 'چاویلکە' },
            { en: 'Comb', ku: 'شانە' },
            { en: 'Brush', ku: 'فڵچە' },
            { en: 'Bell', ku: 'زەنگ' }
        ]
    },
    medium: {
        name: { en: 'Medium', ku: 'ناوەند' },
        icon: 'Zap',
        words: [
            { en: 'Bicycle', ku: 'پاسکیل' },
            { en: 'Airplane', ku: 'فڕۆکە' },
            { en: 'Helicopter', ku: 'هەلیکۆپتەر' },
            { en: 'Guitar', ku: 'گیتار' },
            { en: 'Piano', ku: 'پیانۆ' },
            { en: 'Drum', ku: 'دەهۆڵ' },
            { en: 'Camera', ku: 'کامێرا' },
            { en: 'Television', ku: 'تەلەفزیۆن' },
            { en: 'Computer', ku: 'کۆمپیوتەر' },
            { en: 'Elephant', ku: 'فیل' },
            { en: 'Giraffe', ku: 'زەڕافە' },
            { en: 'Lion', ku: 'شێر' },
            { en: 'Tiger', ku: 'بەور' },
            { en: 'Penguin', ku: 'پەنگوین' },
            { en: 'Butterfly', ku: 'پەپوولە' },
            { en: 'Umbrella', ku: 'چەتر' },
            { en: 'Rainbow', ku: 'پەلکەزێڕینە' },
            { en: 'Mountain', ku: 'شاخ' },
            { en: 'Ocean', ku: 'زەریا' },
            { en: 'Island', ku: 'دووڕگە' },
            { en: 'Castle', ku: 'قەڵا' },
            { en: 'Bridge', ku: 'پرد' },
            { en: 'Robot', ku: 'ڕۆبۆت' },
            { en: 'Rocket', ku: 'ڕۆکێت' },
            { en: 'Telescope', ku: 'دووربین' },
            { en: 'Microscope', ku: 'مایکرۆسکۆپ' },
            { en: 'Hamburger', ku: 'هامبەرگەر' },
            { en: 'Sandwich', ku: 'ساندویچ' },
            { en: 'Popcorn', ku: 'گەنمەشامی' },
            { en: 'Cake', ku: 'کەیک' },
            { en: 'Cookie', ku: 'بسکیت' },
            { en: 'Candy', ku: 'نوقوڵ' },
            { en: 'Compass', ku: 'قیبلەنما' },
            { en: 'Treasure', ku: 'گەنجینە' },
            { en: 'Train', ku: 'شەمەندەفەر' },
            { en: 'Truck', ku: 'بارهەڵگر' },
            { en: 'Bus', ku: 'پاس' },
            { en: 'Boat', ku: 'بەلەم' },
            { en: 'Ship', ku: 'کەشتی' },
            { en: 'Motorcycle', ku: 'ماتۆڕسکیل' },
            { en: 'Scooter', ku: 'سکۆتەر' },
            { en: 'Skateboard', ku: 'سکەیتبۆرد' },
            { en: 'Rollercoaster', ku: 'شەمەندەفەری خێرا' },
            { en: 'Ambulance', ku: 'ئەمبوڵانس' },
            { en: 'Fire Truck', ku: 'ئۆتۆمبێلی ئاگرکوژێنەرەوە' },
            { en: 'Anchor', ku: 'لەنگەر' },
            { en: 'Cactus', ku: 'کاکتەس' },
            { en: 'Crown', ku: 'تاج' },
            { en: 'Diamond', ku: 'ئەڵماس' },
            { en: 'Globe', ku: 'گۆی زەوی' },
            { en: 'Igloo', ku: 'ئیگلوو' },
            { en: 'Lighthouse', ku: 'فانووسی دەریایی' },
            { en: 'Snowman', ku: 'پیاوەبەفرینە' },
            { en: 'Windmill', ku: 'ئاشی با' },
            { en: 'Whale', ku: 'نەهەنگ' },
            { en: 'Octopus', ku: 'ئۆکتەپۆس' },
            { en: 'Shark', ku: 'قرش' },
            { en: 'Crocodile', ku: 'تمساح' },
            { en: 'Parrot', ku: 'تووتی' },
            { en: 'Owl', ku: 'کوندەپەپوو' },
            { en: 'Peacock', ku: 'تاووس' },
            { en: 'Camel', ku: 'وشتر' },
            { en: 'Kangaroo', ku: 'کانگرۆ' },
            { en: 'Panda', ku: 'پاندا' },
            { en: 'Scorpion', ku: 'دوپشک' },
            { en: 'Seahorse', ku: 'ئەسپی دەریایی' },
            { en: 'Turtle', ku: 'کیسەڵ' }
        ]
    },
    hard: {
        name: { en: 'Hard', ku: 'قورس' },
        icon: 'Skull',
        words: [
            { en: 'Astronaut', ku: 'کەشتیوانی ئاسمان' },
            { en: 'Submarine', ku: 'ژێردەریایی' },
            { en: 'Parachute', ku: 'پاڕاشوت' },
            { en: 'Volcano', ku: 'گڕکان' },
            { en: 'Tornado', ku: 'تۆرنادۆ' },
            { en: 'Lightning', ku: 'بروسکە' },
            { en: 'Dinosaur', ku: 'دایناسۆر' },
            { en: 'Dragon', ku: 'ئەژدیها' },
            { en: 'Mermaid', ku: 'پەری دەریا' },
            { en: 'Unicorn', ku: 'ئەسپی تاکشاخ' },
            { en: 'Magician', ku: 'جادووگەر' },
            { en: 'Wizard', ku: 'جادووگەر' },
            { en: 'Skeleton', ku: 'ئێسکپەیکەر' },
            { en: 'Ghost', ku: 'ڕۆح' },
            { en: 'Vampire', ku: 'خوێنمژ' },
            { en: 'Werewolf', ku: 'گورگەپیاو' },
            { en: 'Frankenstein', ku: 'فرانکنشتاین' },
            { en: 'Pyramid', ku: 'ئەهرام' },
            { en: 'Sphinx', ku: 'سفنکس' },
            { en: 'Colosseum', ku: 'کۆلیسیۆم' },
            { en: 'Eiffel Tower', ku: 'بورجی ئایفل' },
            { en: 'Statue of Liberty', ku: 'پەیکەری ئازادی' },
            { en: 'Great Wall', ku: 'دیواری چین' },
            { en: 'Aurora Borealis', ku: 'شەفەقی جەمسەری' },
            { en: 'Black Hole', ku: 'کونی ڕەش' },
            { en: 'Constellation', ku: 'کۆمەڵەئەستێرە' },
            { en: 'Galaxy', ku: 'گەلاکسی' },
            { en: 'Nebula', ku: 'نێبیولا' },
            { en: 'Supernova', ku: 'سوپەرنۆڤا' },
            { en: 'Wormhole', ku: 'کونە کرم' },
            { en: 'Eclipse', ku: 'خۆرگیران' },
            { en: 'Earthquake', ku: 'بوومەلەرزە' },
            { en: 'Tsunami', ku: 'تسونامی' },
            { en: 'Milky Way', ku: 'ڕێگای شیری' },
            { en: 'Meteor', ku: 'نەیزەک' },
            { en: 'Satellite', ku: 'مانگی دەستکرد' },
            { en: 'Spaceship', ku: 'کەشتی ئاسمانی' },
            { en: 'Alien', ku: 'بوونەوەری ئاسمانی' },
            { en: 'Meteorite', ku: 'بەردی ئاسمانی' }
        ]
    },
    actions: {
        name: { en: 'Actions', ku: 'کردارەکان' },
        icon: 'PersonStanding',
        words: [
            { en: 'Dancing', ku: 'سەماکردن' },
            { en: 'Singing', ku: 'گۆرانی گوتن' },
            { en: 'Swimming', ku: 'مەلەکردن' },
            { en: 'Running', ku: 'ڕاکردن' },
            { en: 'Jumping', ku: 'بازدان' },
            { en: 'Sleeping', ku: 'خەوتن' },
            { en: 'Eating', ku: 'خواردن' },
            { en: 'Cooking', ku: 'چێشتلێنان' },
            { en: 'Reading', ku: 'خوێندنەوە' },
            { en: 'Writing', ku: 'نووسین' },
            { en: 'Painting', ku: 'وێنەکێشان' },
            { en: 'Drawing', ku: 'کێشان' },
            { en: 'Playing', ku: 'یاری' },
            { en: 'Fishing', ku: 'ماسیگرتن' },
            { en: 'Climbing', ku: 'هەڵکشان' },
            { en: 'Skiing', ku: 'سکی' },
            { en: 'Surfing', ku: 'سێرفینگ' },
            { en: 'Driving', ku: 'شۆفێری' },
            { en: 'Flying', ku: 'فڕین' },
            { en: 'Crying', ku: 'گریان' },
            { en: 'Laughing', ku: 'پێکەنین' },
            { en: 'Sneezing', ku: 'پژمین' },
            { en: 'Yawning', ku: 'باوێشکدان' },
            { en: 'Waving', ku: 'دەست هەژاندن' },
            { en: 'Hugging', ku: 'باوەشکردن' },
            { en: 'Kissing', ku: 'ماچکردن' },
            { en: 'Thinking', ku: 'بیرکردنەوە' },
            { en: 'Dreaming', ku: 'خەوبینین' },
            { en: 'Fighting', ku: 'شەڕکردن' },
            { en: 'Hiding', ku: 'شاردنەوە' },
            { en: 'Building', ku: 'بیناکردن' },
            { en: 'Breaking', ku: 'شکاندن' },
            { en: 'Falling', ku: 'کەوتن' },
            { en: 'Throwing', ku: 'هاویشتن' },
            { en: 'Catching', ku: 'گرتنەوە' },
            { en: 'Pushing', ku: 'پاڵنان' },
            { en: 'Pulling', ku: 'ڕاکێشان' },
            { en: 'Lifting', ku: 'بەرزکردنەوە' },
            { en: 'Carrying', ku: 'هەڵگرتن' }
        ]
    },
    places: {
        name: { en: 'Places', ku: 'شوێنەکان' },
        icon: 'MapPin',
        words: [
            { en: 'Beach', ku: 'کەناری دەریا' },
            { en: 'Forest', ku: 'دارستان' },
            { en: 'Desert', ku: 'بیابان' },
            { en: 'Jungle', ku: 'جەنگەل' },
            { en: 'Farm', ku: 'کێڵگە' },
            { en: 'Zoo', ku: 'باخچەی ئاژەڵان' },
            { en: 'Aquarium', ku: 'ئاکواریۆم' },
            { en: 'Museum', ku: 'مۆزەخانە' },
            { en: 'Library', ku: 'کتێبخانە' },
            { en: 'School', ku: 'قوتابخانە' },
            { en: 'Hospital', ku: 'نەخۆشخانە' },
            { en: 'Airport', ku: 'فڕۆکەخانە' },
            { en: 'Stadium', ku: 'ستادیۆم' },
            { en: 'Restaurant', ku: 'چێشتخانە' },
            { en: 'Cinema', ku: 'سینەما' },
            { en: 'Theater', ku: 'شانۆ' },
            { en: 'Church', ku: 'کەنیسە' },
            { en: 'Mosque', ku: 'مزگەوت' },
            { en: 'Temple', ku: 'پەرستگا' },
            { en: 'Palace', ku: 'کۆشک' },
            { en: 'Tower', ku: 'بورج' },
            { en: 'Lighthouse', ku: 'فانووسی دەریایی' },
            { en: 'Waterfall', ku: 'ئاوشار' },
            { en: 'Cave', ku: 'ئەشکەوت' },
            { en: 'Volcano', ku: 'گڕکان' },
            { en: 'Glacier', ku: 'سەهۆڵ' },
            { en: 'Reef', ku: 'ڕیف' },
            { en: 'Swamp', ku: 'زەلکاو' },
            { en: 'Space Station', ku: 'وێستگەی ئاسمان' },
            { en: 'Planet', ku: 'هەسارە' },
            { en: 'Park', ku: 'پارک' },
            { en: 'Garden', ku: 'باخچە' },
            { en: 'Street', ku: 'شەقام' },
            { en: 'City', ku: 'شار' },
            { en: 'Village', ku: 'گوند' },
            { en: 'Bridge', ku: 'پرد' },
            { en: 'Tunnel', ku: 'تونێل' },
            { en: 'Market', ku: 'بازاڕ' },
            { en: 'Hotel', ku: 'هۆتێل' }
        ]
    },
    movies: {
        name: { en: 'Movies & TV', ku: 'فیلم و تەلەفزیۆن' },
        icon: 'Film',
        words: [
            { en: 'Batman', ku: 'باتمان' },
            { en: 'Superman', ku: 'سوپەرمان' },
            { en: 'Spider-Man', ku: 'سپایدەرمان' },
            { en: 'Harry Potter', ku: 'هاری پۆتەر' },
            { en: 'Frozen', ku: 'فرۆزن' },
            { en: 'Finding Nemo', ku: 'دۆزینەوەی نیمۆ' },
            { en: 'Toy Story', ku: 'تۆی ستۆری' },
            { en: 'Shrek', ku: 'شرێک' },
            { en: 'Minions', ku: 'مینیۆنز' },
            { en: 'SpongeBob', ku: 'سپۆنج بۆب' },
            { en: 'Mickey Mouse', ku: 'میکی ماوس' },
            { en: 'Donald Duck', ku: 'دۆناڵد داک' },
            { en: 'Pikachu', ku: 'پیکاچو' },
            { en: 'Mario', ku: 'ماریۆ' },
            { en: 'Sonic', ku: 'سۆنیک' },
            { en: 'Pac-Man', ku: 'پاک مان' },
            { en: 'Star Wars', ku: 'ستار وۆرز' },
            { en: 'Titanic', ku: 'تایتانیک' },
            { en: 'Jurassic Park', ku: 'جوراسیک پارک' },
            { en: 'King Kong', ku: 'کینگ کۆنگ' },
            { en: 'Godzilla', ku: 'گۆدزیڵا' },
            { en: 'Transformers', ku: 'تڕانسفۆرمەرز' },
            { en: 'Avatar', ku: 'ئەڤاتار' },
            { en: 'The Lion King', ku: 'شێرە پاشا' },
            { en: 'Aladdin', ku: 'عەلائەدین' },
            { en: 'Cinderella', ku: 'سێندێرێلا' },
            { en: 'Snow White', ku: 'بەفرین' },
            { en: 'Rapunzel', ku: 'ڕاپونزڵ' },
            { en: 'Moana', ku: 'مۆئانا' },
            { en: 'Elsa', ku: 'ئێلسا' },
            { en: 'The Matrix', ku: 'ماتریکس' },
            { en: 'Inception', ku: 'دەستپێک' },
            { en: 'Interstellar', ku: 'نێوان ئەستێرەکان' },
            { en: 'Joker', ku: 'جۆکەر' },
            { en: 'Wonder Woman', ku: 'ژنەی لێهاتوو' },
            { en: 'Iron Man', ku: 'پیاوی ئاسن' },
            { en: 'Captain America', ku: 'کاپتن ئەمریکا' },
            { en: 'Thor', ku: 'سۆڕ' },
            { en: 'Hulk', ku: 'هەڵک' }
        ]
    }
};

// Helper to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

const seenDrawings = {};

const getUnseenRandomIndex = (wordsArray, categoryKey) => {
    if (!seenDrawings[categoryKey]) seenDrawings[categoryKey] = new Set();
    
    let available = wordsArray.map((_, i) => i).filter(i => !seenDrawings[categoryKey].has(i));
    if (available.length === 0) {
        seenDrawings[categoryKey].clear();
        available = wordsArray.map((_, i) => i);
    }
    
    const randomIdx = available[Math.floor(Math.random() * available.length)];
    seenDrawings[categoryKey].add(randomIdx);
    return randomIdx;
};

// Get random word from a category
export const getRandomWord = (categoryKey = 'easy', language = 'en') => {
    let category = DRAWING_CATEGORIES[categoryKey];
    let catKey = categoryKey;
    if (!category) {
        const keys = Object.keys(DRAWING_CATEGORIES);
        catKey = keys[Math.floor(Math.random() * keys.length)];
        category = DRAWING_CATEGORIES[catKey];
    }
    const words = category.words;
    const randomIdx = getUnseenRandomIndex(words, catKey);
    return getText(words[randomIdx], language);
};

// Get random words from a category (multiple)
export const getRandomWords = (categoryKey = 'easy', count = 3, language = 'en') => {
    const category = DRAWING_CATEGORIES[categoryKey] || DRAWING_CATEGORIES.easy;
    const words = category.words;
    
    if (!seenDrawings[categoryKey]) seenDrawings[categoryKey] = new Set();
    
    let resultIdxs = [];
    for (let k = 0; k < Math.min(count, words.length); k++) {
        let available = words.map((_, i) => i).filter(i => !seenDrawings[categoryKey].has(i) && !resultIdxs.includes(i));
        if (available.length === 0) {
            seenDrawings[categoryKey].clear();
            available = words.map((_, i) => i).filter(i => !resultIdxs.includes(i));
        }
        const randomIdx = available[Math.floor(Math.random() * available.length)];
        seenDrawings[categoryKey].add(randomIdx);
        resultIdxs.push(randomIdx);
    }
    return resultIdxs.map(i => getText(words[i], language));
};

// Get all categories
export const getAllDrawingCategories = (language = 'en') => {
    return Object.entries(DRAWING_CATEGORIES).map(([key, value]) => ({
        key,
        name: getText(value.name, language),
        icon: value.icon,
        count: value.words.length,
    }));
};

// Get category by key
export const getCategoryByKey = (key, language = 'en') => {
    const cat = DRAWING_CATEGORIES[key];
    if (!cat) return null;
    return {
        ...cat,
        name: getText(cat.name, language),
    };
};
