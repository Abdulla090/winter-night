// Imposter Word Game - Word Database
// Bilingual support: English (en) and Kurdish Sorani (ku)

export const WORD_CATEGORIES = {
    food: {
        name: { en: 'Food', ku: 'خواردن' },
        icon: 'Utensils',
        words: [
            { word: { en: 'Pizza', ku: 'پیتزا' }, hint: { en: 'Italian dish', ku: 'خواردنی ئیتاڵی' } },
            { word: { en: 'Sushi', ku: 'سوشی' }, hint: { en: 'Japanese food', ku: 'خواردنی ژاپۆنی' } },
            { word: { en: 'Burger', ku: 'بەرگەر' }, hint: { en: 'Fast food', ku: 'خواردنی خێرا' } },
            { word: { en: 'Pasta', ku: 'پاستا' }, hint: { en: 'Italian dish', ku: 'خواردنی ئیتاڵی' } },
            { word: { en: 'Ice Cream', ku: 'بەستەنی' }, hint: { en: 'Dessert', ku: 'شیرینی' } },
            { word: { en: 'Chocolate', ku: 'چکلێت' }, hint: { en: 'Sweet treat', ku: 'شیرینی' } },
            { word: { en: 'Sandwich', ku: 'ساندویچ' }, hint: { en: 'Lunch item', ku: 'خواردنی نیوەڕۆ' } },
            { word: { en: 'Pancakes', ku: 'پانکەیک' }, hint: { en: 'Breakfast food', ku: 'خواردنی بەیانی' } },
            { word: { en: 'Tacos', ku: 'تاکۆ' }, hint: { en: 'Mexican food', ku: 'خواردنی مەکسیکی' } },
            { word: { en: 'Popcorn', ku: 'گەنمەشامی' }, hint: { en: 'Movie snack', ku: 'خواردنی سینەما' } },
            { word: { en: 'Soup', ku: 'شۆربا' }, hint: { en: 'Hot liquid meal', ku: 'خواردنی شلی گەرم' } },
            { word: { en: 'Salad', ku: 'زەڵاتە' }, hint: { en: 'Healthy greens', ku: 'سەوزەی تەندروست' } },
            { word: { en: 'Steak', ku: 'ستێک' }, hint: { en: 'Grilled meat', ku: 'گۆشتی بریژاو' } },
            { word: { en: 'Rice', ku: 'برنج' }, hint: { en: 'Asian staple', ku: 'خواردنی ئاسیایی' } },
            { word: { en: 'Bread', ku: 'نان' }, hint: { en: 'Baked goods', ku: 'نانەوایی' } },
            { word: { en: 'Donut', ku: 'دۆنەت' }, hint: { en: 'Sweet fried dough', ku: 'هەویری سورکراوەی شیرین' } },
            { word: { en: 'Cake', ku: 'کەیک' }, hint: { en: 'Celebration dessert', ku: 'شیرینی ئاهەنگ' } },
            { word: { en: 'Cookie', ku: 'بسکیت' }, hint: { en: 'Baked snack', ku: 'خواردنی سووک' } },
            { word: { en: 'Burrito', ku: 'بۆریتۆ' }, hint: { en: 'Mexican wrap', ku: 'پێچراوەی مەکسیکی' } },
            { word: { en: 'Spaghetti', ku: 'سپاگێتی' }, hint: { en: 'Long pasta', ku: 'مەعکەرۆنی درێژ' } },
            { word: { en: 'Noodles', ku: 'نوودڵز' }, hint: { en: 'Asian pasta', ku: 'خواردنی ئاسیایی' } },
            { word: { en: 'Cheese', ku: 'پەنیر' }, hint: { en: 'Dairy product', ku: 'بەرهەمی شیر' } },
            { word: { en: 'Potato', ku: 'پەتاتە' }, hint: { en: 'Root vegetable', ku: 'سەوزەی ڕەگ' } },
            { word: { en: 'Carrot', ku: 'گێزەر' }, hint: { en: 'Orange vegetable', ku: 'سەوزەی پرتەقاڵی' } },
        ],
    },
    animals: {
        name: { en: 'Animals', ku: 'ئاژەڵەکان' },
        icon: 'PawPrint',
        words: [
            { word: { en: 'Elephant', ku: 'فیل' }, hint: { en: 'Large mammal', ku: 'شیرەمەندی گەورە' } },
            { word: { en: 'Penguin', ku: 'پێنگوین' }, hint: { en: 'Antarctic bird', ku: 'باڵندەی قوتبی' } },
            { word: { en: 'Dolphin', ku: 'دۆلفین' }, hint: { en: 'Ocean mammal', ku: 'شیرەمەندی دەریایی' } },
            { word: { en: 'Butterfly', ku: 'پەپوولە' }, hint: { en: 'Flying insect', ku: 'مێروی فڕۆک' } },
            { word: { en: 'Kangaroo', ku: 'کانگرۆ' }, hint: { en: 'Australian animal', ku: 'ئاژەڵی ئوستورالی' } },
            { word: { en: 'Giraffe', ku: 'زەڕافە' }, hint: { en: 'Tall animal', ku: 'ئاژەڵی درێژ' } },
            { word: { en: 'Octopus', ku: 'ئۆکتەپۆس' }, hint: { en: 'Sea creature', ku: 'ئاژەڵی دەریا' } },
            { word: { en: 'Peacock', ku: 'تاووس' }, hint: { en: 'Colorful bird', ku: 'باڵندەی ڕەنگاوڕەنگ' } },
            { word: { en: 'Tiger', ku: 'بەور' }, hint: { en: 'Big cat', ku: 'پشیلەی گەورە' } },
            { word: { en: 'Crocodile', ku: 'تمساح' }, hint: { en: 'Reptile', ku: 'خشۆک' } },
            { word: { en: 'Monkey', ku: 'مەیموون' }, hint: { en: 'Primate', ku: 'پریمات' } },
            { word: { en: 'Shark', ku: 'قرش' }, hint: { en: 'Ocean predator', ku: 'ڕاوکەری دەریا' } },
            { word: { en: 'Eagle', ku: 'هەڵۆ' }, hint: { en: 'Bird of prey', ku: 'باڵندەی ڕاوکەر' } },
            { word: { en: 'Snake', ku: 'مار' }, hint: { en: 'Slithering reptile', ku: 'خشۆکی خزۆک' } },
            { word: { en: 'Rabbit', ku: 'کەروێشک' }, hint: { en: 'Fluffy pet', ku: 'ئاژەڵی نەرم' } },
            { word: { en: 'Bear', ku: 'ورچ' }, hint: { en: 'Forest mammal', ku: 'شیرەمەندی دارستان' } },
            { word: { en: 'Wolf', ku: 'گورگ' }, hint: { en: 'Wild dog', ku: 'سەگی کێوی' } },
            { word: { en: 'Fox', ku: 'ڕێوی' }, hint: { en: 'Cunning animal', ku: 'ئاژەڵی فێڵباز' } },
            { word: { en: 'Panda', ku: 'پاندا' }, hint: { en: 'Black and white bear', ku: 'ورچی ڕەش و سپی' } },
            { word: { en: 'Zebra', ku: 'زێبرا' }, hint: { en: 'Striped horse', ku: 'ئەسپی هێڵدار' } },
            { word: { en: 'Koala', ku: 'کۆالا' }, hint: { en: 'Australian bear', ku: 'ورچی ئوستورالی' } },
            { word: { en: 'Frog', ku: 'قورواق' }, hint: { en: 'Amphibian', ku: 'ئاوی و وشکانی' } },
            { word: { en: 'Turtle', ku: 'کیسەڵ' }, hint: { en: 'Shell reptile', ku: 'خشۆکی کڵۆدار' } },
            { word: { en: 'Horse', ku: 'ئەسپ' }, hint: { en: 'Riding animal', ku: 'ئاژەڵی سواربوون' } },
        ],
    },
    places: {
        name: { en: 'Places', ku: 'شوێنەکان' },
        icon: 'MapPin',
        words: [
            { word: { en: 'Beach', ku: 'قەراغ دەریا' }, hint: { en: 'Sandy destination', ku: 'شوێنی لمین' } },
            { word: { en: 'Library', ku: 'کتێبخانە' }, hint: { en: 'Book building', ku: 'شوێنی کتێب' } },
            { word: { en: 'Hospital', ku: 'نەخۆشخانە' }, hint: { en: 'Medical facility', ku: 'دامەزراوەی پزیشکی' } },
            { word: { en: 'Airport', ku: 'فڕۆکەخانە' }, hint: { en: 'Travel hub', ku: 'شوێنی گەشت' } },
            { word: { en: 'Museum', ku: 'مۆزەخانە' }, hint: { en: 'Art building', ku: 'بینای هونەری' } },
            { word: { en: 'Restaurant', ku: 'چێشتخانە' }, hint: { en: 'Dining place', ku: 'شوێنی خواردن' } },
            { word: { en: 'School', ku: 'قوتابخانە' }, hint: { en: 'Learning place', ku: 'شوێنی فێربوون' } },
            { word: { en: 'Cinema', ku: 'سینەما' }, hint: { en: 'Movie theater', ku: 'هۆڵی فیلم' } },
            { word: { en: 'Gym', ku: 'یانەی وەرزش' }, hint: { en: 'Exercise place', ku: 'هۆڵی وەرزش' } },
            { word: { en: 'Park', ku: 'پارک' }, hint: { en: 'Outdoor area', ku: 'ناوچەی دەرەوە' } },
            { word: { en: 'Mall', ku: 'مۆڵ' }, hint: { en: 'Shopping center', ku: 'ناوەندی بازار' } },
            { word: { en: 'Church', ku: 'کەنیسە' }, hint: { en: 'Religious building', ku: 'بینای ئایینی' } },
            { word: { en: 'Zoo', ku: 'باخچەی ئاژەڵان' }, hint: { en: 'Animal exhibit', ku: 'نیشاندەری ئاژەڵ' } },
            { word: { en: 'Stadium', ku: 'ستادیۆم' }, hint: { en: 'Sports venue', ku: 'شوێنی وەرزش' } },
            { word: { en: 'Bakery', ku: 'فڕن' }, hint: { en: 'Bread shop', ku: 'دوکانی نان' } },
            { word: { en: 'Hotel', ku: 'هۆتێل' }, hint: { en: 'Place to stay', ku: 'شوێنی مانەوە' } },
            { word: { en: 'Bank', ku: 'بانک' }, hint: { en: 'Money place', ku: 'شوێنی پارە' } },
            { word: { en: 'Police Station', ku: 'بنکەی پۆلیس' }, hint: { en: 'Law enforcement', ku: 'جێبەجێکردنی یاسا' } },
            { word: { en: 'Fire Station', ku: 'بنکەی ئاگرکوژێنەوە' }, hint: { en: 'Firefighters base', ku: 'بنکەی ئاگرکوژێنەوە' } },
            { word: { en: 'Post Office', ku: 'پۆستەخانە' }, hint: { en: 'Mail place', ku: 'شوێنی نامە' } },
            { word: { en: 'Pharmacy', ku: 'دەرمانخانە' }, hint: { en: 'Medicine shop', ku: 'دوکانی دەرمان' } },
            { word: { en: 'Supermarket', ku: 'سووپەرمارکێت' }, hint: { en: 'Grocery store', ku: 'دوکانی خواردن' } },
            { word: { en: 'Cafe', ku: 'کافێ' }, hint: { en: 'Coffee shop', ku: 'دوکانی قاوە' } },
            { word: { en: 'Barbershop', ku: 'سەرتاشخانە' }, hint: { en: 'Haircut place', ku: 'شوێنی سەرتاشین' } },
        ],
    },
    objects: {
        name: { en: 'Objects', ku: 'شتەکان' },
        icon: 'Box',
        words: [
            { word: { en: 'Umbrella', ku: 'چەتر' }, hint: { en: 'Rain protection', ku: 'بۆ باران' } },
            { word: { en: 'Guitar', ku: 'گیتار' }, hint: { en: 'Musical instrument', ku: 'ئامێری میوزیک' } },
            { word: { en: 'Telescope', ku: 'دووربین' }, hint: { en: 'Stargazing tool', ku: 'بۆ بینینی ئەستێرەکان' } },
            { word: { en: 'Camera', ku: 'کامێرا' }, hint: { en: 'Photo device', ku: 'ئامێری وێنەگرتن' } },
            { word: { en: 'Piano', ku: 'پیانۆ' }, hint: { en: 'Keyboard instrument', ku: 'ئامێری کلیل' } },
            { word: { en: 'Bicycle', ku: 'پاسکیل' }, hint: { en: 'Two-wheeled transport', ku: 'گواستنەوەی دوو چەرخ' } },
            { word: { en: 'Microwave', ku: 'مایکرۆوەیڤ' }, hint: { en: 'Kitchen appliance', ku: 'مەکینەی چێشتخانە' } },
            { word: { en: 'Laptop', ku: 'لاپتۆپ' }, hint: { en: 'Portable computer', ku: 'کۆمپیوتەری لاپتۆپ' } },
            { word: { en: 'Backpack', ku: 'جانتای شان' }, hint: { en: 'Carry bag', ku: 'جانتای شان' } },
            { word: { en: 'Headphones', ku: 'هێدفۆن' }, hint: { en: 'Audio device', ku: 'بۆ گوێگرتن' } },
            { word: { en: 'Mirror', ku: 'ئاوێنە' }, hint: { en: 'Reflective surface', ku: 'بۆ خۆبینین' } },
            { word: { en: 'Candle', ku: 'مۆم' }, hint: { en: 'Light source', ku: 'بۆ ڕووناکی' } },
            { word: { en: 'Pillow', ku: 'سەرین' }, hint: { en: 'Sleep accessory', ku: 'بۆ خەوتن' } },
            { word: { en: 'Clock', ku: 'کاتژمێر' }, hint: { en: 'Time keeper', ku: 'بۆ کات' } },
            { word: { en: 'Blanket', ku: 'بەتانی' }, hint: { en: 'Cozy cover', ku: 'بۆ گەرمبوونەوە' } },
            { word: { en: 'Phone', ku: 'مۆبایل' }, hint: { en: 'Communication device', ku: 'ئامێری پەیوەندی' } },
            { word: { en: 'Watch', ku: 'کاتژمێری دەست' }, hint: { en: 'Wrist time', ku: 'کاتژمێری مەچەک' } },
            { word: { en: 'Glasses', ku: 'چاویلکە' }, hint: { en: 'Vision aid', ku: 'یارمەتیدەری بینین' } },
            { word: { en: 'Wallet', ku: 'جزدان' }, hint: { en: 'Money holder', ku: 'هەڵگری پارە' } },
            { word: { en: 'Keys', ku: 'کلیلەکان' }, hint: { en: 'Unlocker', ku: 'کردنەوە' } },
            { word: { en: 'Book', ku: 'کتێب' }, hint: { en: 'Reading material', ku: 'ماددەی خوێندنەوە' } },
            { word: { en: 'Chair', ku: 'کورسی' }, hint: { en: 'Sitting furniture', ku: 'مۆبیلیاتی دانیشتن' } },
            { word: { en: 'Table', ku: 'مێز' }, hint: { en: 'Flat surface', ku: 'ڕووی تەخت' } },
            { word: { en: 'Bed', ku: 'جێگا' }, hint: { en: 'Sleeping furniture', ku: 'مۆبیلیاتی خەوتن' } },
        ],
    },
    activities: {
        name: { en: 'Activities', ku: 'چالاکییەکان' },
        icon: 'Bike',
        words: [
            { word: { en: 'Swimming', ku: 'مەلەکردن' }, hint: { en: 'Water activity', ku: 'چالاکی ئاو' } },
            { word: { en: 'Dancing', ku: 'سەماکردن' }, hint: { en: 'Moving to music', ku: 'جووڵان بە میوزیک' } },
            { word: { en: 'Cooking', ku: 'چێشتلێنان' }, hint: { en: 'Making food', ku: 'دروستکردنی خواردن' } },
            { word: { en: 'Painting', ku: 'وێنەکێشان' }, hint: { en: 'Creating art', ku: 'دروستکردنی هونەر' } },
            { word: { en: 'Camping', ku: 'کامپکردن' }, hint: { en: 'Outdoor adventure', ku: 'ماجەرای دەرەوە' } },
            { word: { en: 'Reading', ku: 'خوێندنەوە' }, hint: { en: 'Book activity', ku: 'چالاکی کتێب' } },
            { word: { en: 'Singing', ku: 'گۆرانی گوتن' }, hint: { en: 'Vocal performance', ku: 'ئیشی دەنگ' } },
            { word: { en: 'Fishing', ku: 'ماسیگرتن' }, hint: { en: 'Catching fish', ku: 'گرتنی ماسی' } },
            { word: { en: 'Shopping', ku: 'کڕین' }, hint: { en: 'Buying things', ku: 'کڕینی شتەکان' } },
            { word: { en: 'Sleeping', ku: 'خەوتن' }, hint: { en: 'Resting', ku: 'پشوودان' } },
            { word: { en: 'Running', ku: 'ڕاکردن' }, hint: { en: 'Fast movement', ku: 'جووڵانی خێرا' } },
            { word: { en: 'Photography', ku: 'وێنەگری' }, hint: { en: 'Taking pictures', ku: 'گرتنی وێنە' } },
            { word: { en: 'Gardening', ku: 'باخچەوانی' }, hint: { en: 'Growing plants', ku: 'گەشەپێدانی ڕووەک' } },
            { word: { en: 'Yoga', ku: 'یۆگا' }, hint: { en: 'Exercise practice', ku: 'ڕاهێنانی وەرزش' } },
            { word: { en: 'Meditation', ku: 'تێڕامان' }, hint: { en: 'Mind relaxation', ku: 'پشوودانی مێشک' } },
            { word: { en: 'Hiking', ku: 'شاڕێی' }, hint: { en: 'Walking in nature', ku: 'ڕۆیشتن لە سروشت' } },
            { word: { en: 'Biking', ku: 'پاسکیلسواری' }, hint: { en: 'Riding a bike', ku: 'لێخوڕینی پاسکیل' } },
            { word: { en: 'Surfing', ku: 'سەرکێشی شەپۆل' }, hint: { en: 'Riding waves', ku: 'سواری شەپۆل' } },
            { word: { en: 'Skiing', ku: 'سکی' }, hint: { en: 'Sliding on snow', ku: 'خلیسکانی سەر بەفر' } },
            { word: { en: 'Skating', ku: 'خلیسکێنە' }, hint: { en: 'Gliding on ice/wheels', ku: 'خلیسکانی سەر سەهۆڵ/تەگە' } },
            { word: { en: 'Climbing', ku: 'هەڵکشان' }, hint: { en: 'Going up', ku: 'چوونە سەرەوە' } },
            { word: { en: 'Driving', ku: 'لێخوڕین' }, hint: { en: 'Operating a car', ku: 'کارپێکردنی ئۆتۆمبێل' } },
            { word: { en: 'Flying', ku: 'فڕین' }, hint: { en: 'Moving through air', ku: 'جووڵان بەناو هەوا' } },
            { word: { en: 'Writing', ku: 'نووسین' }, hint: { en: 'Creating text', ku: 'دروستکردنی دەق' } },
        ],
    },
};

// Helper to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

// Helper to get category name
export const getCategoryName = (category, language = 'en') => {
    if (typeof category.name === 'string') return category.name;
    return category.name[language] || category.name.en;
};

export const getRandomWord = (categoryKey, language = 'en') => {
    const category = WORD_CATEGORIES[categoryKey];
    if (!category) {
        const allCategories = Object.keys(WORD_CATEGORIES);
        const randomCat = allCategories[Math.floor(Math.random() * allCategories.length)];
        const words = WORD_CATEGORIES[randomCat].words;
        const wordObj = words[Math.floor(Math.random() * words.length)];
        return {
            word: getText(wordObj.word, language),
            hint: getText(wordObj.hint, language)
        };
    }
    const words = category.words;
    const wordObj = words[Math.floor(Math.random() * words.length)];
    return {
        word: getText(wordObj.word, language),
        hint: getText(wordObj.hint, language)
    };
};

export const getAllWordCategories = (language = 'en') => {
    return Object.entries(WORD_CATEGORIES).map(([key, value]) => ({
        key,
        name: getCategoryName(value, language),
        icon: value.icon,
        count: value.words.length,
    }));
};
