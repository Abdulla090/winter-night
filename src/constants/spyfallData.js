// Spyfall Game - Location Database
// Bilingual support: English (en) and Kurdish Sorani (ku)
// All data is stored locally - NO NETWORK REQUIRED

export const LOCATIONS = {
    theaterStage: {
        name: { en: 'Theater Stage', ku: 'شانۆ' },
        icon: 'musical-notes',
        roles: [
            { en: 'Actor', ku: 'ئەکتەر' },
            { en: 'Director', ku: 'دەرهێنەر' },
            { en: 'Stage Manager', ku: 'بەڕێوەبەری شانۆ' },
            { en: 'Costume Designer', ku: 'دیزاینەری جلوبەرگ' },
            { en: 'Lighting Technician', ku: 'تەکنیکاری ڕووناکی' },
            { en: 'Audience Member', ku: 'بینەر' },
            { en: 'Playwright', ku: 'شانۆنووس' },
            { en: 'Usher', ku: 'ڕێنیشاندەر' },
        ],
    },
    spaceStation: {
        name: { en: 'Space Station', ku: 'وێستگەی ئەفەزا' },
        icon: 'planet',
        roles: [
            { en: 'Commander', ku: 'فەرماندە' },
            { en: 'Astronaut', ku: 'ئاسمانەوان' },
            { en: 'Engineer', ku: 'ئەندازیار' },
            { en: 'Scientist', ku: 'زانا' },
            { en: 'Pilot', ku: 'فڕۆکەوان' },
            { en: 'Medical Officer', ku: 'ئەفسەری پزیشکی' },
            { en: 'Communications Officer', ku: 'ئەفسەری پەیوەندییەکان' },
            { en: 'Visitor', ku: 'سەردانکەر' },
        ],
    },
    submarine: {
        name: { en: 'Submarine', ku: 'ژێردەریایی' },
        icon: 'boat',
        roles: [
            { en: 'Captain', ku: 'کاپتن' },
            { en: 'Navigator', ku: 'ڕێنیشاندەر' },
            { en: 'Sonar Operator', ku: 'کارمەندی سۆنار' },
            { en: 'Cook', ku: 'چێشتلێنەر' },
            { en: 'Engineer', ku: 'ئەندازیار' },
            { en: 'Radio Operator', ku: 'کارمەندی ڕادیۆ' },
            { en: 'Weapons Specialist', ku: 'پسپۆڕی چەک' },
            { en: 'Diver', ku: 'مەلەوانی ژێرئاو' },
        ],
    },
    hospital: {
        name: { en: 'Hospital', ku: 'نەخۆشخانە' },
        icon: 'medkit',
        roles: [
            { en: 'Doctor', ku: 'پزیشک' },
            { en: 'Nurse', ku: 'پەرستار' },
            { en: 'Patient', ku: 'نەخۆش' },
            { en: 'Surgeon', ku: 'نەشتەرگەر' },
            { en: 'Receptionist', ku: 'پێشوازیکەر' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Visitor', ku: 'سەردانکەر' },
            { en: 'Paramedic', ku: 'فریاگوزار' },
        ],
    },
    pirateShip: {
        name: { en: 'Pirate Ship', ku: 'کەشتی چەتەکان' },
        icon: 'skull',
        roles: [
            { en: 'Captain', ku: 'کاپتن' },
            { en: 'First Mate', ku: 'یاریدەی یەکەم' },
            { en: 'Navigator', ku: 'ڕێنیشاندەر' },
            { en: 'Cook', ku: 'چێشتلێنەر' },
            { en: 'Cannon Operator', ku: 'تۆپچی' },
            { en: 'Lookout', ku: 'چاودێر' },
            { en: 'Prisoner', ku: 'زیندانی' },
            { en: 'Treasure Hunter', ku: 'گەنج دۆزەرەوە' },
        ],
    },
    casino: {
        name: { en: 'Casino', ku: 'کازینۆ' },
        icon: 'diamond',
        roles: [
            { en: 'Dealer', ku: 'دابەشکەر' },
            { en: 'Gambler', ku: 'قومارباز' },
            { en: 'Security Guard', ku: 'پاسەوان' },
            { en: 'Bartender', ku: 'کارمەندی بار' },
            { en: 'VIP Guest', ku: 'میوانی تایبەت' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Waitress', ku: 'خزمەتکار' },
            { en: 'Entertainer', ku: 'نمایشکار' },
        ],
    },
    school: {
        name: { en: 'School', ku: 'قوتابخانە' },
        icon: 'school',
        roles: [
            { en: 'Teacher', ku: 'مامۆستا' },
            { en: 'Student', ku: 'قوتابی' },
            { en: 'Principal', ku: 'بەڕێوەبەر' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Cafeteria Worker', ku: 'کارمەندی کافتریا' },
            { en: 'Coach', ku: 'ڕاهێنەر' },
            { en: 'Librarian', ku: 'کتێبخانەوان' },
            { en: 'Parent', ku: 'دایک/باوک' },
        ],
    },
    beach: {
        name: { en: 'Beach', ku: 'قەراغ دەریا' },
        icon: 'sunny',
        roles: [
            { en: 'Lifeguard', ku: 'ڕزگارکەر' },
            { en: 'Swimmer', ku: 'مەلەوان' },
            { en: 'Surfer', ku: 'سێرفەر' },
            { en: 'Ice Cream Vendor', ku: 'فرۆشیاری بەستەنی' },
            { en: 'Sunbather', ku: 'خۆرەتاوگر' },
            { en: 'Beach Volleyball Player', ku: 'یاریزانی تۆپی بالە' },
            { en: 'Photographer', ku: 'وێنەگر' },
            { en: 'Tourist', ku: 'گەشتیار' },
        ],
    },
    airport: {
        name: { en: 'Airport', ku: 'فڕۆکەخانە' },
        icon: 'airplane',
        roles: [
            { en: 'Pilot', ku: 'فڕۆکەوان' },
            { en: 'Flight Attendant', ku: 'میوانداری فڕۆکە' },
            { en: 'Passenger', ku: 'سەرنشین' },
            { en: 'Security Officer', ku: 'ئەفسەری پاسەوانی' },
            { en: 'Customs Agent', ku: 'مەئموری گومرگ' },
            { en: 'Ticket Agent', ku: 'بلیت بڕ' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Air Traffic Controller', ku: 'چاودێری ئاسمانی' },
        ],
    },
    supermarket: {
        name: { en: 'Supermarket', ku: 'سوپەرمارکێت' },
        icon: 'cart',
        roles: [
            { en: 'Cashier', ku: 'کاشێر' },
            { en: 'Shopper', ku: 'کڕیار' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Stocker', ku: 'کۆگادار' },
            { en: 'Butcher', ku: 'قەساب' },
            { en: 'Baker', ku: 'نانەوا' },
            { en: 'Security Guard', ku: 'پاسەوان' },
            { en: 'Delivery Driver', ku: 'شۆفێری دیلیڤەری' },
        ],
    },
    circus: {
        name: { en: 'Circus', ku: 'سیرک' },
        icon: 'balloon',
        roles: [
            { en: 'Clown', ku: 'پەڵەوان' },
            { en: 'Acrobat', ku: 'بەندباز' },
            { en: 'Lion Tamer', ku: 'ڕاهێنەری شێر' },
            { en: 'Magician', ku: 'جادووگەر' },
            { en: 'Audience Member', ku: 'بینەر' },
            { en: 'Ticket Seller', ku: 'فرۆشیاری بلیت' },
            { en: 'Ringmaster', ku: 'بەڕێوەبەری گۆڕەپان' },
            { en: 'Juggler', ku: 'یاریزانی دەستبەر' },
        ],
    },
    restaurant: {
        name: { en: 'Restaurant', ku: 'چێشتخانە' },
        icon: 'restaurant',
        roles: [
            { en: 'Chef', ku: 'سەرچێشتلێنەر' },
            { en: 'Waiter', ku: 'خزمەتکار' },
            { en: 'Customer', ku: 'کڕیار' },
            { en: 'Hostess', ku: 'پێشوازیکەر' },
            { en: 'Dishwasher', ku: 'قاپشۆر' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Bartender', ku: 'کارمەندی بار' },
            { en: 'Food Critic', ku: 'ڕەخنەگری خواردن' },
        ],
    },
    movieStudio: {
        name: { en: 'Movie Studio', ku: 'ستۆدیۆی فیلم' },
        icon: 'videocam',
        roles: [
            { en: 'Director', ku: 'دەرهێنەر' },
            { en: 'Actor', ku: 'ئەکتەر' },
            { en: 'Cameraman', ku: 'کامێرامان' },
            { en: 'Makeup Artist', ku: 'ئارایشتکەر' },
            { en: 'Stunt Double', ku: 'بەدیلی مەترسی' },
            { en: 'Producer', ku: 'بەرهەمهێنەر' },
            { en: 'Script Writer', ku: 'سیناریۆنووس' },
            { en: 'Extra', ku: 'ئەکتەری لاوەکی' },
        ],
    },
    policeStation: {
        name: { en: 'Police Station', ku: 'بنکەی پۆلیس' },
        icon: 'shield',
        roles: [
            { en: 'Police Officer', ku: 'پۆلیس' },
            { en: 'Detective', ku: 'لێکۆڵەر' },
            { en: 'Criminal', ku: 'تاوانبار' },
            { en: 'Lawyer', ku: 'پارێزەر' },
            { en: 'Witness', ku: 'شایەد' },
            { en: 'Chief', ku: 'سەرۆک' },
            { en: 'Receptionist', ku: 'پێشوازیکەر' },
            { en: 'Forensic Expert', ku: 'پسپۆڕی بەڵگە' },
        ],
    },
    university: {
        name: { en: 'University', ku: 'زانکۆ' },
        icon: 'library',
        roles: [
            { en: 'Professor', ku: 'پڕۆفیسۆر' },
            { en: 'Student', ku: 'خوێندکار' },
            { en: 'Dean', ku: 'ڕاگر' },
            { en: 'Librarian', ku: 'کتێبخانەوان' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Research Assistant', ku: 'یاریدەدەری توێژینەوە' },
            { en: 'Coach', ku: 'ڕاهێنەر' },
            { en: 'Campus Security', ku: 'پاسەوانی زانکۆ' },
        ],
    },
    embassy: {
        name: { en: 'Embassy', ku: 'باڵیۆزخانە' },
        icon: 'flag',
        roles: [
            { en: 'Ambassador', ku: 'باڵیۆز' },
            { en: 'Secretary', ku: 'سکرتێر' },
            { en: 'Tourist', ku: 'گەشتیار' },
            { en: 'Guard', ku: 'پاسەوان' },
            { en: 'Diplomat', ku: 'دیپلۆماتکار' },
            { en: 'Reporter', ku: 'ڕۆژنامەنووس' },
            { en: 'Translator', ku: 'وەرگێڕ' },
            { en: 'Visa Applicant', ku: 'داواکاری ڤیزا' },
        ],
    },
};

// Helper function to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

// Get random location with roles for gameplay
export const getRandomLocation = (language = 'en') => {
    const keys = Object.keys(LOCATIONS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const location = LOCATIONS[randomKey];
    return {
        key: randomKey,
        name: getText(location.name, language),
        icon: location.icon,
        roles: location.roles.map(role => getText(role, language)),
    };
};

// Get all locations for display
export const getAllLocations = (language = 'en') => {
    return Object.entries(LOCATIONS).map(([key, value]) => ({
        key,
        name: getText(value.name, language),
        icon: value.icon,
        rolesCount: value.roles.length,
    }));
};

// Get a specific location by key
export const getLocationByKey = (key, language = 'en') => {
    const location = LOCATIONS[key];
    if (!location) return null;
    return {
        key,
        name: getText(location.name, language),
        icon: location.icon,
        roles: location.roles.map(role => getText(role, language)),
    };
};
