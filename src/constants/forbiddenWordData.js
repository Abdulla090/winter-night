// Forbidden Word Data (Taboo-style game)
// Each word has a target word and 5 forbidden words you cannot use to describe it

export const forbiddenWordCategories = [
    {
        id: 'easy',
        title: { en: 'Easy', ku: 'ئاسان' },
        icon: '🟢',
        color: '#10b981',
    },
    {
        id: 'medium',
        title: { en: 'Medium', ku: 'مامناوەند' },
        icon: '🟡',
        color: '#f59e0b',
    },
    {
        id: 'hard',
        title: { en: 'Hard', ku: 'قورس' },
        icon: '🔴',
        color: '#ef4444',
    },
    {
        id: 'mixed',
        title: { en: 'Mixed', ku: 'تێکەڵ' },
        icon: '🎲',
        color: '#8b5cf6',
    },
];

export const forbiddenWords = {
    easy: [
        {
            target: { en: 'Beach', ku: 'کەناری دەریا' },
            forbidden: {
                en: ['Sand', 'Water', 'Ocean', 'Sun', 'Swim'],
                ku: ['خۆڵەمێش', 'ئاو', 'دەریا', 'خۆر', 'مەلەکردن']
            }
        },
        {
            target: { en: 'Pizza', ku: 'پیتزا' },
            forbidden: {
                en: ['Cheese', 'Italy', 'Pepperoni', 'Dough', 'Slice'],
                ku: ['پەنیر', 'ئیتاڵیا', 'پیپەڕۆنی', 'هەویر', 'پارچە']
            }
        },
        {
            target: { en: 'Dog', ku: 'سەگ' },
            forbidden: {
                en: ['Bark', 'Pet', 'Puppy', 'Walk', 'Tail'],
                ku: ['هاوکردن', 'ئاژەڵی ماڵەوە', 'بەچکە سەگ', 'پیاسە', 'کلک']
            }
        },
        {
            target: { en: 'Coffee', ku: 'قاوە' },
            forbidden: {
                en: ['Drink', 'Caffeine', 'Morning', 'Bean', 'Cup'],
                ku: ['خواردنەوە', 'کافیین', 'بەیانی', 'دەنک', 'فنجان']
            }
        },
        {
            target: { en: 'Birthday', ku: 'ڕۆژی لەدایکبوون' },
            forbidden: {
                en: ['Cake', 'Party', 'Gift', 'Candle', 'Age'],
                ku: ['کێک', 'ئاهەنگ', 'دیاری', 'مۆم', 'تەمەن']
            }
        },
        {
            target: { en: 'School', ku: 'قوتابخانە' },
            forbidden: {
                en: ['Teacher', 'Student', 'Learn', 'Class', 'Book'],
                ku: ['مامۆستا', 'قوتابی', 'فێربوون', 'پۆل', 'کتێب']
            }
        },
        {
            target: { en: 'Rain', ku: 'باران' },
            forbidden: {
                en: ['Water', 'Cloud', 'Wet', 'Umbrella', 'Storm'],
                ku: ['ئاو', 'هەور', 'تەڕ', 'چەتر', 'زریان']
            }
        },
        {
            target: { en: 'Phone', ku: 'مۆبایل' },
            forbidden: {
                en: ['Call', 'Text', 'Screen', 'Apple', 'Samsung'],
                ku: ['پەیوەندی', 'نامە', 'شاشە', 'ئەپڵ', 'سامسۆنگ']
            }
        },
        {
            target: { en: 'Soccer', ku: 'تۆپی پێ' },
            forbidden: {
                en: ['Ball', 'Goal', 'Kick', 'Team', 'Field'],
                ku: ['تۆپ', 'گۆڵ', 'لێدان', 'تیم', 'یاریگا']
            }
        },
        {
            target: { en: 'Hospital', ku: 'نەخۆشخانە' },
            forbidden: {
                en: ['Doctor', 'Nurse', 'Sick', 'Medicine', 'Patient'],
                ku: ['دکتۆر', 'پەرستار', 'نەخۆش', 'دەرمان', 'نەخۆش']
            }
        },
    ],
    medium: [
        {
            target: { en: 'Time Travel', ku: 'گەشتی کات' },
            forbidden: {
                en: ['Past', 'Future', 'Machine', 'Clock', 'History'],
                ku: ['ڕابردوو', 'داهاتوو', 'ئامێر', 'کاتژمێر', 'مێژوو']
            }
        },
        {
            target: { en: 'Vampire', ku: 'خوێنمژ' },
            forbidden: {
                en: ['Blood', 'Bite', 'Fangs', 'Night', 'Dracula'],
                ku: ['خوێن', 'گەزین', 'ددان', 'شەو', 'دراکولا']
            }
        },
        {
            target: { en: 'Wedding', ku: 'هەڵبژاردن' },
            forbidden: {
                en: ['Marriage', 'Bride', 'Ring', 'Love', 'Ceremony'],
                ku: ['هاوسەرگیری', 'بووک', 'ئەڵقە', 'خۆشەویستی', 'ئاهەنگ']
            }
        },
        {
            target: { en: 'Earthquake', ku: 'بوومەلەرزە' },
            forbidden: {
                en: ['Shake', 'Ground', 'Disaster', 'Richter', 'Building'],
                ku: ['هەژین', 'زەوی', 'کارەسات', 'ڕیکتەر', 'بینا']
            }
        },
        {
            target: { en: 'Astronaut', ku: 'ئاسمانەوان' },
            forbidden: {
                en: ['Space', 'Moon', 'Rocket', 'NASA', 'Suit'],
                ku: ['ئاسمان', 'مانگ', 'ڕۆکێت', 'ناسا', 'جل']
            }
        },
        {
            target: { en: 'Dictionary', ku: 'فەرهەنگ' },
            forbidden: {
                en: ['Words', 'Definition', 'Book', 'Language', 'Alphabet'],
                ku: ['وشەکان', 'پێناسە', 'کتێب', 'زمان', 'ئەلفوبا']
            }
        },
        {
            target: { en: 'Nightmare', ku: 'خەوی خراپ' },
            forbidden: {
                en: ['Dream', 'Scary', 'Sleep', 'Bad', 'Night'],
                ku: ['خەو', 'ترسناک', 'نوستن', 'خراپ', 'شەو']
            }
        },
        {
            target: { en: 'Rainbow', ku: 'کەوانەباران' },
            forbidden: {
                en: ['Colors', 'Rain', 'Sun', 'Sky', 'Arc'],
                ku: ['ڕەنگەکان', 'باران', 'خۆر', 'ئاسمان', 'کەوانە']
            }
        },
        {
            target: { en: 'Password', ku: 'وشەی نهێنی' },
            forbidden: {
                en: ['Secret', 'Login', 'Security', 'Username', 'Computer'],
                ku: ['نهێنی', 'چوونەژوورەوە', 'ئەمنیەت', 'ناوی بەکارهێنەر', 'کۆمپیوتەر']
            }
        },
        {
            target: { en: 'Firefighter', ku: 'ئاگرکوژێنەر' },
            forbidden: {
                en: ['Fire', 'Hose', 'Truck', 'Emergency', 'Hero'],
                ku: ['ئاگر', 'هۆز', 'سەیارە', 'فریاگوزاری', 'پاڵەوان']
            }
        },
    ],
    hard: [
        {
            target: { en: 'Procrastination', ku: 'دواخستن' },
            forbidden: {
                en: ['Delay', 'Later', 'Lazy', 'Tomorrow', 'Work'],
                ku: ['دواخستن', 'دواتر', 'تەمەڵ', 'سبەینێ', 'کار']
            }
        },
        {
            target: { en: 'Photosynthesis', ku: 'فۆتۆسینتێز' },
            forbidden: {
                en: ['Plant', 'Sun', 'Light', 'Oxygen', 'Green'],
                ku: ['ڕووەک', 'خۆر', 'ڕووناکی', 'ئۆکسجین', 'سەوز']
            }
        },
        {
            target: { en: 'Democracy', ku: 'دیمۆکراسی' },
            forbidden: {
                en: ['Vote', 'Election', 'People', 'Government', 'Freedom'],
                ku: ['دەنگدان', 'هەڵبژاردن', 'خەڵک', 'حکوومەت', 'ئازادی']
            }
        },
        {
            target: { en: 'Chameleon', ku: 'کامیلیۆن' },
            forbidden: {
                en: ['Color', 'Change', 'Lizard', 'Reptile', 'Hide'],
                ku: ['ڕەنگ', 'گۆڕانکاری', 'مارمێڵە', 'خشێندار', 'شاردنەوە']
            }
        },
        {
            target: { en: 'Cryptocurrency', ku: 'دراوی دیجیتاڵ' },
            forbidden: {
                en: ['Bitcoin', 'Money', 'Digital', 'Blockchain', 'Mining'],
                ku: ['بیتکۆین', 'پارە', 'دیجیتاڵ', 'بلۆکچەین', 'هەڵکۆڵین']
            }
        },
        {
            target: { en: 'Nostalgia', ku: 'بیرەوەری' },
            forbidden: {
                en: ['Past', 'Memory', 'Miss', 'Old', 'Remember'],
                ku: ['ڕابردوو', 'بیرەوەری', 'بیرکردنەوە', 'کۆن', 'یادکردنەوە']
            }
        },
        {
            target: { en: 'Paradox', ku: 'پارادۆکس' },
            forbidden: {
                en: ['Contradiction', 'Logic', 'Puzzle', 'Impossible', 'True'],
                ku: ['دژایەتی', 'لۆژیک', 'مەتەڵ', 'ناممکن', 'ڕاست']
            }
        },
        {
            target: { en: 'Stereotype', ku: 'ستیریۆتایپ' },
            forbidden: {
                en: ['Assume', 'Generalize', 'Judge', 'Group', 'Prejudice'],
                ku: ['گریمان', 'گشتگیرکردن', 'حوکم', 'گروپ', 'پێشداوەری']
            }
        },
        {
            target: { en: 'Placebo', ku: 'پلاسیبۆ' },
            forbidden: {
                en: ['Fake', 'Medicine', 'Effect', 'Sugar', 'Pill'],
                ku: ['ساختە', 'دەرمان', 'کاریگەری', 'شەکر', 'حەب']
            }
        },
        {
            target: { en: 'Existentialism', ku: 'ئیگزیستەنشیالیزم' },
            forbidden: {
                en: ['Philosophy', 'Meaning', 'Life', 'Existence', 'Purpose'],
                ku: ['فەلسەفە', 'مانا', 'ژیان', 'بوون', 'مەبەست']
            }
        },
        {
            target: { en: 'Diplomacy', ku: 'دیپلۆماسی' },
            forbidden: {
                en: ['Negotiate', 'Peace', 'Country', 'Ambassador', 'Treaty'],
                ku: ['دانوستان', 'ئاشتی', 'وڵات', 'باڵیۆز', 'ڕێککەوتن']
            }
        },
        {
            target: { en: 'Cryptocurrency', ku: 'کریپتۆکارەنسی' },
            forbidden: {
                en: ['Bitcoin', 'Digital', 'Money', 'Blockchain', 'Mining'],
                ku: ['بیتکۆین', 'دیجیتاڵ', 'پارە', 'بلۆکچەین', 'کوەڵان']
            }
        },
        {
            target: { en: 'Artificial Intelligence', ku: 'ژیرایی دەستکرد' },
            forbidden: {
                en: ['Robot', 'Computer', 'Machine', 'Learning', 'Smart'],
                ku: ['ڕۆبۆت', 'کۆمپیوتەر', 'ئامێر', 'فێربوون', 'زیرەک']
            }
        },
        {
            target: { en: 'Democracy', ku: 'دیموکراسی' },
            forbidden: {
                en: ['Vote', 'Election', 'People', 'Government', 'Freedom'],
                ku: ['دەنگدان', 'هەڵبژاردن', 'خەڵک', 'حکومەت', 'ئازادی']
            }
        },
        {
            target: { en: 'Photosynthesis', ku: 'فۆتۆسینتەسیز' },
            forbidden: {
                en: ['Plant', 'Sun', 'Light', 'Oxygen', 'Green'],
                ku: ['ڕووەک', 'خۆر', 'ڕووناکی', 'ئۆکسجین', 'سەوز']
            }
        },
        {
            target: { en: 'Renewable Energy', ku: 'وزەی نوێبووەوە' },
            forbidden: {
                en: ['Solar', 'Wind', 'Power', 'Clean', 'Green'],
                ku: ['خۆر', 'با', 'هێز', 'پاک', 'سەوز']
            }
        },
        {
            target: { en: 'Social Media', ku: 'تۆڕی کۆمەڵایەتی' },
            forbidden: {
                en: ['Facebook', 'Instagram', 'Post', 'Like', 'Share'],
                ku: ['فەیسبووک', 'ئینستاگرام', 'بڵاوکردنەوە', 'لایک', 'هاوبەشکردن']
            }
        },
    ],
};

// Get words by category
export const getForbiddenWords = (categoryId, language = 'en') => {
    if (categoryId === 'mixed') {
        // Get random words from all categories
        const allWords = [];
        Object.keys(forbiddenWords).forEach(cat => {
            forbiddenWords[cat].forEach(word => {
                allWords.push({ ...word, difficulty: cat });
            });
        });
        // Shuffle
        return allWords.sort(() => Math.random() - 0.5);
    }

    const words = forbiddenWords[categoryId] || [];
    return words.sort(() => Math.random() - 0.5);
};

export const getCategoryById = (id) => {
    return forbiddenWordCategories.find(cat => cat.id === id);
};
