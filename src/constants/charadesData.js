// Reverse Charades Data
// Categories: Actions, Animals, Movies, Jobs, Objects

export const charadesCategories = [
    {
        id: 'actions',
        title: { en: 'Actions', ku: 'کردارەکان' },
        icon: '🏃',
        color: '#ef4444',
    },
    {
        id: 'animals',
        title: { en: 'Animals', ku: 'ئاژەڵەکان' },
        icon: '🦁',
        color: '#f59e0b',
    },
    {
        id: 'movies',
        title: { en: 'Movies', ku: 'فیلمەکان' },
        icon: '🎬',
        color: '#8b5cf6',
    },
    {
        id: 'jobs',
        title: { en: 'Jobs', ku: 'پیشەکان' },
        icon: '👨‍⚕️',
        color: '#10b981',
    },
    {
        id: 'sports',
        title: { en: 'Sports', ku: 'وەرزش' },
        icon: '⚽',
        color: '#3b82f6',
    },
];

export const charadesData = {
    actions: [
        { word: { en: 'Dancing', ku: 'سەما کردن' } },
        { word: { en: 'Cooking', ku: 'چێشت لێنان' } },
        { word: { en: 'Swimming', ku: 'مەلەکردن' } },
        { word: { en: 'Driving', ku: 'لێخوڕین' } },
        { word: { en: 'Fishing', ku: 'ماسیکردن' } },
        { word: { en: 'Shower', ku: 'خۆشۆردن' } },
        { word: { en: 'Sleeping', ku: 'نوستن' } },
        { word: { en: 'Eating', ku: 'خواردن' } },
        { word: { en: 'Running', ku: 'ڕاکردن' } },
        { word: { en: 'Crying', ku: 'گریان' } },
        { word: { en: 'Laughing', ku: 'پێکەنین' } },
        { word: { en: 'Painting', ku: 'وێنەکێشان' } },
        { word: { en: 'Shopping', ku: 'بازاڕکردن' } },
        { word: { en: 'Fighting', ku: 'شەڕکردن' } },
        { word: { en: 'Singing', ku: 'گۆرانی وتنی' } },
    ],
    animals: [
        { word: { en: 'Elephant', ku: 'فیل' } },
        { word: { en: 'Monkey', ku: 'مەیموون' } },
        { word: { en: 'Snake', ku: 'مار' } },
        { word: { en: 'Lion', ku: 'شێر' } },
        { word: { en: 'Chicken', ku: 'مریشک' } },
        { word: { en: 'Frog', ku: 'قورواق' } },
        { word: { en: 'Kangaroo', ku: 'کانگارۆ' } },
        { word: { en: 'Bird', ku: 'باڵندە' } },
        { word: { en: 'Fish', ku: 'ماسی' } },
        { word: { en: 'Cat', ku: 'پشیلە' } },
        { word: { en: 'Dog', ku: 'سەگ' } },
        { word: { en: 'Cow', ku: 'مانگا' } },
        { word: { en: 'Horse', ku: 'ئەسپ' } },
        { word: { en: 'Penguin', ku: 'پەنگوین' } },
        { word: { en: 'Giraffe', ku: 'زەڕافە' } },
    ],
    movies: [
        { word: { en: 'Spider-Man', ku: 'سپسایدەرمان' } },
        { word: { en: 'Titanic', ku: 'تایتانیک' } },
        { word: { en: 'Harry Potter', ku: 'هاری پۆتەر' } },
        { word: { en: 'Superman', ku: 'سوپەرمان' } },
        { word: { en: 'Batman', ku: 'باتمان' } },
        { word: { en: 'Frozen', ku: 'فرۆزن' } },
        { word: { en: 'The Lion King', ku: 'شێرە شا' } },
        { word: { en: 'Toy Story', ku: 'تۆ‌ی ستۆری' } },
        { word: { en: 'Star Wars', ku: 'جەنگی ئەستێرەکان' } },
        { word: { en: 'Joker', ku: 'جۆکەر' } },
        { word: { en: 'Avatar', ku: 'ئاڤاتار' } },
        { word: { en: 'Shrek', ku: 'شرێک' } },
        { word: { en: 'Home Alone', ku: 'تەنها لە ماڵەوە' } },
        { word: { en: 'Matrix', ku: 'ماتریکس' } },
        { word: { en: 'Jurassic Park', ku: 'پارکی جوراسیک' } },
    ],
    jobs: [
        { word: { en: 'Doctor', ku: 'دکتۆر' } },
        { word: { en: 'Police', ku: 'پۆلیس' } },
        { word: { en: 'Teacher', ku: 'مامۆستا' } },
        { word: { en: 'Chef', ku: 'سەرچێشت' } },
        { word: { en: 'Firefighter', ku: 'ئاگرکوژێنەرەوە' } },
        { word: { en: 'Pilot', ku: 'فڕۆکەوان' } },
        { word: { en: 'Farmer', ku: 'جوتیار' } },
        { word: { en: 'Soldier', ku: 'سەرباز' } },
        { word: { en: 'Artist', ku: 'هونەرمەند' } },
        { word: { en: 'Singer', ku: 'گۆرانیبێژ' } },
        { word: { en: 'Clown', ku: 'پەڵەوان' } },
        { word: { en: 'Astronaut', ku: 'ئاسمانەوان' } },
        { word: { en: 'Judge', ku: 'دادوەر' } },
        { word: { en: 'Mechanic', ku: 'فییتەر' } },
        { word: { en: 'Barber', ku: 'سەرتاش' } },
    ],
    sports: [
        { word: { en: 'Soccer', ku: 'تۆپی پێ' } },
        { word: { en: 'Basketball', ku: 'باسکە' } },
        { word: { en: 'Tennis', ku: 'تێنس' } },
        { word: { en: 'Boxing', ku: 'بۆکسێن' } },
        { word: { en: 'Swimming', ku: 'مەلەوان' } },
        { word: { en: 'Golf', ku: 'گۆڵف' } },
        { word: { en: 'Volleyball', ku: 'بالە' } },
        { word: { en: 'Baseball', ku: 'بەیسبۆڵ' } },
        { word: { en: 'Skiing', ku: 'سکی' } },
        { word: { en: 'Surfing', ku: 'سێرفینگ' } },
        { word: { en: 'Weightlifting', ku: 'بەرزکردنەوەی قورسایی' } },
        { word: { en: 'Cycling', ku: 'بیسکیل سواری' } },
        { word: { en: 'Bowling', ku: 'بۆڵینگ' } },
        { word: { en: 'Yoga', ku: 'یۆگا' } },
        { word: { en: 'Karate', ku: 'کاریتێ' } },
    ],
};

// Get words by category
export const getCharadesWords = (categoryId, language = 'en') => {
    // If mixed, mix all
    if (categoryId === 'mixed') {
        const allWords = [];
        Object.keys(charadesData).forEach((key) => {
            allWords.push(...charadesData[key]);
        });
        return allWords.sort(() => Math.random() - 0.5);
    }

    const words = charadesData[categoryId] || [];
    return words.sort(() => Math.random() - 0.5);
};

export const getCategoryById = (id) => {
    return charadesCategories.find((cat) => cat.id === id);
};
