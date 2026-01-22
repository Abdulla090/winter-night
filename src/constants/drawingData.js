// Draw & Guess - Drawing Words Database
// Bilingual support: English (en) and Kurdish Sorani (ku)
// All data is stored locally - NO NETWORK REQUIRED

export const DRAWING_CATEGORIES = {
    easy: {
        name: { en: 'Easy', ku: 'ئاسان' },
        icon: 'happy-outline',
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
            { en: 'Ice Cream', ku: 'بەستەنی' },
            { en: 'Book', ku: 'کتێب' },
            { en: 'Chair', ku: 'کورسی' },
            { en: 'Table', ku: 'مێز' },
            { en: 'Bed', ku: 'نوستنگا' },
            { en: 'Door', ku: 'دەرگا' },
            { en: 'Window', ku: 'پەنجەرە' },
            { en: 'Phone', ku: 'مۆبایل' },
            { en: 'Clock', ku: 'کاتژمێر' },
            { en: 'Shoe', ku: 'پێڵاو' },
            { en: 'Hat', ku: 'کوڵاو' },
            { en: 'Cup', ku: 'پیاڵە' },
            { en: 'Spoon', ku: 'کەوچک' },
            { en: 'Fork', ku: 'چەتاڵ' },
            { en: 'Knife', ku: 'چەقۆ' },
            { en: 'Banana', ku: 'مۆز' },
            { en: 'Orange', ku: 'پرتەقاڵ' },
            { en: 'Strawberry', ku: 'تووفرینگی' },
            { en: 'Grapes', ku: 'ترێ' },
            { en: 'Watermelon', ku: 'شووتی' }
        ]
    },
    medium: {
        name: { en: 'Medium', ku: 'ناوەند' },
        icon: 'flash-outline',
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
            { en: 'Penguin', ku: 'پێنگوین' },
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
            { en: 'Treasure', ku: 'گەنج' }
        ]
    },
    hard: {
        name: { en: 'Hard', ku: 'قورس' },
        icon: 'skull-outline',
        words: [
            { en: 'Astronaut', ku: 'ئاسمانەوان' },
            { en: 'Submarine', ku: 'ژێردەریایی' },
            { en: 'Parachute', ku: 'پاڕاشوت' },
            { en: 'Volcano', ku: 'گڕکان' },
            { en: 'Tornado', ku: 'تۆرنادۆ' },
            { en: 'Lightning', ku: 'بروسکە' },
            { en: 'Dinosaur', ku: 'داینەسۆر' },
            { en: 'Dragon', ku: 'ئەژدیها' },
            { en: 'Mermaid', ku: 'بووکی دەریا' },
            { en: 'Unicorn', ku: 'ئەسپی تاکشاخ' },
            { en: 'Magician', ku: 'جادووگەر' },
            { en: 'Wizard', ku: 'جادووگەر' },
            { en: 'Skeleton', ku: 'ئێسکەلێت' },
            { en: 'Ghost', ku: 'ڕۆح' },
            { en: 'Vampire', ku: 'خوێنمژ' },
            { en: 'Werewolf', ku: 'مرۆڤەگورگ' },
            { en: 'Frankenstein', ku: 'فرانکنشتاین' },
            { en: 'Pyramid', ku: 'ئەهرام' },
            { en: 'Sphinx', ku: 'شێرەچن' },
            { en: 'Colosseum', ku: 'کۆلیسیۆم' },
            { en: 'Eiffel Tower', ku: 'بورجی ئایفل' },
            { en: 'Statue of Liberty', ku: 'پەیکەری ئازادی' },
            { en: 'Great Wall', ku: 'شووری گەورە' },
            { en: 'Aurora Borealis', ku: 'شەفەقی جەمسەری' },
            { en: 'Black Hole', ku: 'کونی ڕەش' },
            { en: 'Constellation', ku: 'کۆمەڵەئەستێرە' },
            { en: 'Galaxy', ku: 'گەلاکسی' },
            { en: 'Nebula', ku: 'نێبیولا' },
            { en: 'Supernova', ku: 'سوپەرنۆڤا' },
            { en: 'Wormhole', ku: 'کونی کرم' }
        ]
    },
    actions: {
        name: { en: 'Actions', ku: 'کردارەکان' },
        icon: 'walk-outline',
        words: [
            { en: 'Dancing', ku: 'سەماکردن' },
            { en: 'Singing', ku: 'گۆرانی گوتن' },
            { en: 'Swimming', ku: 'مەلەکردن' },
            { en: 'Running', ku: 'ڕاکردن' },
            { en: 'Jumping', ku: 'باز دان' },
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
            { en: 'Surfing', ku: 'سەرکێشی شەپۆل' },
            { en: 'Driving', ku: 'شۆفێری' },
            { en: 'Flying', ku: 'فڕین' },
            { en: 'Crying', ku: 'گریان' },
            { en: 'Laughing', ku: 'پێکەنین' },
            { en: 'Sneezing', ku: 'پژمین' },
            { en: 'Yawning', ku: 'باوێشکدان' },
            { en: 'Waving', ku: 'دەست هەژاندن' },
            { en: 'Hugging', ku: 'باوەش گرتن' },
            { en: 'Kissing', ku: 'ماچکردن' },
            { en: 'Thinking', ku: 'بیرکردنەوە' },
            { en: 'Dreaming', ku: 'خەو بینین' },
            { en: 'Fighting', ku: 'شەڕکردن' },
            { en: 'Hiding', ku: 'شاردنەوە' }
        ]
    },
    places: {
        name: { en: 'Places', ku: 'شوێنەکان' },
        icon: 'location-outline',
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
            { en: 'Space Station', ku: 'وێستگەی بۆشایی' },
            { en: 'Planet', ku: 'هەسارە' }
        ]
    },
    movies: {
        name: { en: 'Movies & TV', ku: 'فیلم و تەلەفزیۆن' },
        icon: 'film-outline',
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
            { en: 'Elsa', ku: 'ئێلسا' }
        ]
    }
};

// Helper to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

// Get random word from a category
export const getRandomWord = (categoryKey = 'easy', language = 'en') => {
    const category = DRAWING_CATEGORIES[categoryKey];
    if (!category) {
        // If category not found, use a random category
        const keys = Object.keys(DRAWING_CATEGORIES);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const words = DRAWING_CATEGORIES[randomKey].words;
        const word = words[Math.floor(Math.random() * words.length)];
        return getText(word, language);
    }
    const words = category.words;
    const word = words[Math.floor(Math.random() * words.length)];
    return getText(word, language);
};

// Get random words from a category (multiple)
export const getRandomWords = (categoryKey = 'easy', count = 3, language = 'en') => {
    const category = DRAWING_CATEGORIES[categoryKey] || DRAWING_CATEGORIES.easy;
    const shuffled = [...category.words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(w => getText(w, language));
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
