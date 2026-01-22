// Who Am I - Character Database
// Bilingual support: English (en) and Kurdish Sorani (ku)

export const CATEGORIES = {
    celebrities: {
        name: { en: 'Celebrities', ku: 'ئەستێرەکان' },
        icon: 'star',
        items: [
            { en: 'Taylor Swift', ku: 'تەیلەر سویفت' },
            { en: 'Dwayne Johnson', ku: 'دوەین جۆنسن (ڕۆک)' },
            { en: 'Beyoncé', ku: 'بیۆنسێ' },
            { en: 'Leonardo DiCaprio', ku: 'لیۆناردۆ دیکاپریۆ' },
            { en: 'Oprah Winfrey', ku: 'ئۆپرا وینفری' },
            { en: 'Tom Hanks', ku: 'تۆم هانکس' },
            { en: 'Rihanna', ku: 'ڕیهانا' },
            { en: 'Brad Pitt', ku: 'براد پیت' },
            { en: 'Adele', ku: 'ئادێل' },
            { en: 'Will Smith', ku: 'ویل سمیث' },
            { en: 'Jennifer Lawrence', ku: 'جێنیفەر لۆرەنس' },
            { en: 'Chris Hemsworth', ku: 'کریس هێمزوۆرث' },
            { en: 'Lady Gaga', ku: 'لەیدی گاگا' },
            { en: 'Morgan Freeman', ku: 'مۆرگان فریمان' },
            { en: 'Scarlett Johansson', ku: 'سکارلێت جۆهانسن' },
            { en: 'Ryan Reynolds', ku: 'ڕایان ڕێنۆڵدز' },
            { en: 'Ariana Grande', ku: 'ئاریانا گراندی' },
            { en: 'Robert Downey Jr.', ku: 'ڕۆبێرت داونی' },
            { en: 'Emma Watson', ku: 'ئێما واتسن' },
            { en: 'Keanu Reeves', ku: 'کیانو ڕیڤز' },
        ],
    },
    movies: {
        name: { en: 'Movie Characters', ku: 'کارەکتەرەکانی فیلم' },
        icon: 'film',
        items: [
            { en: 'Harry Potter', ku: 'هاری پۆتەر' },
            { en: 'Darth Vader', ku: 'دارث ڤەیدەر' },
            { en: 'Jack Sparrow', ku: 'جاک سپارۆ' },
            { en: 'Iron Man', ku: 'ئایرۆن مان (پیاوی ئاسن)' },
            { en: 'Elsa (Frozen)', ku: 'ئێلسا (فرۆزن)' },
            { en: 'Batman', ku: 'باتمان (پیاوی شەوپەڕە)' },
            { en: 'Joker', ku: 'جۆکەر' },
            { en: 'Spider-Man', ku: 'سپایدەرمان (پیاوی جاڵجاڵۆکە)' },
            { en: 'Shrek', ku: 'شرێک' },
            { en: 'James Bond', ku: 'جەیمس بۆند' },
            { en: 'Gandalf', ku: 'گاندالف' },
            { en: 'Thanos', ku: 'ثانۆس' },
            { en: 'Forrest Gump', ku: 'فۆرێست گامپ' },
            { en: 'Terminator', ku: 'تێرمینەیتەر' },
            { en: 'Yoda', ku: 'یۆدا' },
            { en: 'Wonder Woman', ku: 'واندەر وومان (ژنی سەرسوڕهێنەر)' },
            { en: 'Deadpool', ku: 'دێدپوول' },
            { en: 'Black Panther', ku: 'بلاک پانثەر (پلنگی ڕەش)' },
            { en: 'Hermione Granger', ku: 'هێرمایۆنی گرەینجەر' },
            { en: 'Captain America', ku: 'کاپتن ئەمریکا' },
        ],
    },
    cartoons: {
        name: { en: 'Cartoon Characters', ku: 'کارەکتەرەکانی کارتۆن' },
        icon: 'happy',
        items: [
            { en: 'SpongeBob', ku: 'سپۆنج بۆب' },
            { en: 'Mickey Mouse', ku: 'میکی ماوس' },
            { en: 'Bugs Bunny', ku: 'باگز بانی' },
            { en: 'Pikachu', ku: 'پیکاچو' },
            { en: 'Homer Simpson', ku: 'هۆمەر سیمپسۆن' },
            { en: 'Scooby-Doo', ku: 'سکوبی دوو' },
            { en: 'Tom (Tom & Jerry)', ku: 'تۆم (تۆم و جێری)' },
            { en: 'Dora the Explorer', ku: 'دۆرا گەشتیار' },
            { en: 'Patrick Star', ku: 'پاتریک ئەستێرە' },
            { en: 'Bart Simpson', ku: 'بارت سیمپسۆن' },
            { en: 'Sonic the Hedgehog', ku: 'سۆنیک' },
            { en: 'Mario', ku: 'ماریۆ' },
            { en: 'Donald Duck', ku: 'دۆناڵد داک' },
            { en: 'Tweety Bird', ku: 'توویتی' },
            { en: 'Garfield', ku: 'گارفیڵد' },
            { en: 'Winnie the Pooh', ku: 'وینی پوو' },
            { en: 'Peppa Pig', ku: 'پێپا پیگ' },
            { en: 'Minions', ku: 'مینیۆنز' },
            { en: 'Elmo', ku: 'ئێلمۆ' },
            { en: 'Goku', ku: 'گۆکو' },
        ],
    },
    animals: {
        name: { en: 'Animals', ku: 'ئاژەڵەکان' },
        icon: 'paw',
        items: [
            { en: 'Lion', ku: 'شێر' },
            { en: 'Elephant', ku: 'فیل' },
            { en: 'Penguin', ku: 'پێنگوین' },
            { en: 'Dolphin', ku: 'دۆلفین' },
            { en: 'Giraffe', ku: 'زەڕافە' },
            { en: 'Tiger', ku: 'بەور' },
            { en: 'Panda', ku: 'پاندا' },
            { en: 'Kangaroo', ku: 'کانگرۆ' },
            { en: 'Eagle', ku: 'هەڵۆ' },
            { en: 'Shark', ku: 'قرش' },
            { en: 'Octopus', ku: 'هەشتپێ' },
            { en: 'Koala', ku: 'کۆئالا' },
            { en: 'Wolf', ku: 'گورگ' },
            { en: 'Owl', ku: 'کوندەپەپوو' },
            { en: 'Butterfly', ku: 'پەپوولە' },
            { en: 'Crocodile', ku: 'تمساح' },
            { en: 'Peacock', ku: 'تاووس' },
            { en: 'Sloth', ku: 'ئاژەڵی تەمبەڵ' },
            { en: 'Cheetah', ku: 'چیتا' },
            { en: 'Whale', ku: 'نەهەنگ' },
        ],
    },
    historical: {
        name: { en: 'Historical Figures', ku: 'کەسایەتییە مێژووییەکان' },
        icon: 'book',
        items: [
            { en: 'Albert Einstein', ku: 'ئەلبێرت ئاینشتاین' },
            { en: 'Cleopatra', ku: 'کلیۆپاترا' },
            { en: 'Leonardo da Vinci', ku: 'لیۆناردۆ دا ڤینچی' },
            { en: 'Abraham Lincoln', ku: 'ئەبراهام لینکۆڵن' },
            { en: 'Napoleon Bonaparte', ku: 'نەپۆلیۆن بۆناپارت' },
            { en: 'Queen Elizabeth I', ku: 'شاژن ئیلیزابێثی یەکەم' },
            { en: 'Mahatma Gandhi', ku: 'مەهاتما گاندی' },
            { en: 'Julius Caesar', ku: 'یولیۆس قەیسەر' },
            { en: 'Marie Curie', ku: 'ماری کوری' },
            { en: 'Martin Luther King Jr.', ku: 'مارتن لوثەر کینگ' },
            { en: 'Winston Churchill', ku: 'وینستن چێرچل' },
            { en: 'Mozart', ku: 'مۆزارت' },
            { en: 'Shakespeare', ku: 'شێکسپیر' },
            { en: 'Aristotle', ku: 'ئەرستۆ' },
            { en: 'Genghis Khan', ku: 'جەنگیز خان' },
            { en: 'Joan of Arc', ku: 'ژان دارک' },
            { en: 'Alexander the Great', ku: 'ئەسکەندەری گەورە' },
            { en: 'Nikola Tesla', ku: 'نیکۆلا تێسلا' },
            { en: 'Frida Kahlo', ku: 'فریدا کالۆ' },
            { en: 'Nelson Mandela', ku: 'نێلسن ماندێلا' },
        ],
    },
    professions: {
        name: { en: 'Professions', ku: 'پیشەکان' },
        icon: 'briefcase',
        items: [
            { en: 'Doctor', ku: 'پزیشک' },
            { en: 'Firefighter', ku: 'ئاگرکوژێنەوە' },
            { en: 'Astronaut', ku: 'ئاسمانەوان' },
            { en: 'Chef', ku: 'چێشتلێنەر' },
            { en: 'Police Officer', ku: 'پۆلیس' },
            { en: 'Teacher', ku: 'مامۆستا' },
            { en: 'Pilot', ku: 'فڕۆکەوان' },
            { en: 'Scientist', ku: 'زانا' },
            { en: 'Artist', ku: 'هونەرمەند' },
            { en: 'Musician', ku: 'میوزیکژەن' },
            { en: 'Farmer', ku: 'جوتیار' },
            { en: 'Detective', ku: 'لێکۆڵەر' },
            { en: 'Nurse', ku: 'پەرستار' },
            { en: 'Architect', ku: 'تەلارساز' },
            { en: 'Photographer', ku: 'وێنەگر' },
            { en: 'Veterinarian', ku: 'پزیشکی ئاژەڵ' },
            { en: 'Magician', ku: 'جادووگەر' },
            { en: 'Athlete', ku: 'وەرزشوان' },
            { en: 'Judge', ku: 'دادوەر' },
            { en: 'Sailor', ku: 'کەشتیوان' },
        ],
    },
};

// Helper to get item text based on language
export const getItemText = (item, language = 'en') => {
    if (typeof item === 'string') return item; // backwards compatibility
    return item[language] || item.en;
};

// Helper to get category name based on language
export const getCategoryName = (category, language = 'en') => {
    if (typeof category.name === 'string') return category.name;
    return category.name[language] || category.name.en;
};

export const getRandomCharacter = (categoryKey, language = 'en') => {
    const category = CATEGORIES[categoryKey];
    if (!category) return null;
    const items = category.items;
    const item = items[Math.floor(Math.random() * items.length)];
    return getItemText(item, language);
};

export const getAllCategories = (language = 'en') => {
    return Object.entries(CATEGORIES).map(([key, value]) => ({
        key,
        name: getCategoryName(value, language),
        icon: value.icon,
        count: value.items.length,
    }));
};
