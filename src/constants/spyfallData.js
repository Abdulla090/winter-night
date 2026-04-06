// Spyfall Game - Location Database
// Bilingual support: English (en) and Kurdish Sorani (ku)
// All data is stored locally - NO NETWORK REQUIRED

export const LOCATIONS = {
    theaterStage: {
        name: { en: 'Theater Stage', ku: 'شانۆ' },
        icon: 'Music',
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
        name: { en: 'Space Station', ku: 'وێستگەی ئاسمان' },
        icon: 'Globe',
        roles: [
            { en: 'Commander', ku: 'فەرماندە' },
            { en: 'Astronaut', ku: 'کەشتیوانی ئاسمان' },
            { en: 'Engineer', ku: 'ئەندازیار' },
            { en: 'Scientist', ku: 'زانا' },
            { en: 'Pilot', ku: 'فڕۆکەوان' },
            { en: 'Medical Officer', ku: 'پزیشکی وێستگە' },
            { en: 'Communications Officer', ku: 'ئەفسەری پەیوەندییەکان' },
            { en: 'Visitor', ku: 'سەردانکەر' },
        ],
    },
    submarine: {
        name: { en: 'Submarine', ku: 'ژێردەریایی' },
        icon: 'Ship',
        roles: [
            { en: 'Captain', ku: 'کاپتن' },
            { en: 'Navigator', ku: 'ڕێنیشاندەر' },
            { en: 'Sonar Operator', ku: 'چاودێری سۆنار' },
            { en: 'Cook', ku: 'چێشتلێنەر' },
            { en: 'Engineer', ku: 'ئەندازیار' },
            { en: 'Radio Operator', ku: 'کارمەندی ڕادیۆ' },
            { en: 'Weapons Specialist', ku: 'پسپۆڕی چەک' },
            { en: 'Diver', ku: 'غەواس' },
        ],
    },
    hospital: {
        name: { en: 'Hospital', ku: 'نەخۆشخانە' },
        icon: 'Stethoscope',
        roles: [
            { en: 'Doctor', ku: 'پزیشک' },
            { en: 'Nurse', ku: 'پەرستار' },
            { en: 'Patient', ku: 'نەخۆش' },
            { en: 'Surgeon', ku: 'پزیشکی نەشتەرگەری' },
            { en: 'Receptionist', ku: 'پرسگە' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Visitor', ku: 'سەردانکەر' },
            { en: 'Paramedic', ku: 'کارمەندی فریاگوزاری' },
        ],
    },
    pirateShip: {
        name: { en: 'Pirate Ship', ku: 'کەشتی چەتەکان' },
        icon: 'Skull',
        roles: [
            { en: 'Captain', ku: 'کاپتن' },
            { en: 'First Mate', ku: 'یاریدەدەری یەکەم' },
            { en: 'Navigator', ku: 'ڕێنیشاندەر' },
            { en: 'Cook', ku: 'چێشتلێنەر' },
            { en: 'Cannon Operator', ku: 'تۆپچی' },
            { en: 'Lookout', ku: 'چاودێر' },
            { en: 'Prisoner', ku: 'زیندانی' },
            { en: 'Treasure Hunter', ku: 'گەنجینە دۆزەرەوە' },
        ],
    },
    casino: {
        name: { en: 'Casino', ku: 'کازینۆ' },
        icon: 'Diamond',
        roles: [
            { en: 'Dealer', ku: 'دابەشکەر' },
            { en: 'Gambler', ku: 'قومارباز' },
            { en: 'Security Guard', ku: 'پاسەوان' },
            { en: 'Bartender', ku: 'کارمەندی باڕ' },
            { en: 'VIP Guest', ku: 'میوانی تایبەت' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Waitress', ku: 'گارسۆن' },
            { en: 'Entertainer', ku: 'نمایشکار' },
        ],
    },
    school: {
        name: { en: 'School', ku: 'قوتابخانە' },
        icon: 'GraduationCap',
        roles: [
            { en: 'Teacher', ku: 'مامۆستا' },
            { en: 'Student', ku: 'قوتابی' },
            { en: 'Principal', ku: 'بەڕێوەبەر' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Cafeteria Worker', Worker: 'کارمەندی کافتریا', ku: 'کارمەندی کافتریا' },
            { en: 'Coach', ku: 'ڕاهێنەر' },
            { en: 'Librarian', ku: 'کتێبخانەوان' },
            { en: 'Parent', ku: 'دایک / باوک' },
        ],
    },
    beach: {
        name: { en: 'Beach', ku: 'قەراغ دەریا' },
        icon: 'Sun',
        roles: [
            { en: 'Lifeguard', ku: 'ڕزگارکەر' },
            { en: 'Swimmer', ku: 'مەلەوان' },
            { en: 'Surfer', ku: 'سێرفەر' },
            { en: 'Ice Cream Vendor', ku: 'فرۆشیاری دۆندرمە' },
            { en: 'Sunbather', ku: 'خۆرەتاوگر' },
            { en: 'Beach Volleyball Player', ku: 'یاریزانی تۆپی بالە' },
            { en: 'Photographer', ku: 'وێنەگر' },
            { en: 'Tourist', ku: 'گەشتیار' },
        ],
    },
    airport: {
        name: { en: 'Airport', ku: 'فڕۆکەخانە' },
        icon: 'Plane',
        roles: [
            { en: 'Pilot', ku: 'فڕۆکەوان' },
            { en: 'Flight Attendant', ku: 'کارمەندی فڕۆکە' },
            { en: 'Passenger', ku: 'سەرنشین' },
            { en: 'Security Officer', ku: 'ئەفسەری ئاسایش' },
            { en: 'Customs Agent', ku: 'پۆلیسی گومرگ' },
            { en: 'Ticket Agent', ku: 'فرۆشیاری بلیت' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Air Traffic Controller', ku: 'چاودێری ئاسمانی' },
        ],
    },
    supermarket: {
        name: { en: 'Supermarket', ku: 'سوپەرمارکێت' },
        icon: 'ShoppingCart',
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
        icon: 'Tent',
        roles: [
            { en: 'Clown', ku: 'قۆشمەچی' },
            { en: 'Acrobat', ku: 'بەندباز' },
            { en: 'Lion Tamer', ku: 'ڕاهێنەری شێر' },
            { en: 'Magician', ku: 'جادووگەر' },
            { en: 'Audience Member', ku: 'بینەر' },
            { en: 'Ticket Seller', ku: 'فرۆشیاری بلیت' },
            { en: 'Ringmaster', ku: 'بەڕێوەبەری سیرک' },
            { en: 'Juggler', ku: 'تۆپ هەڵدەرەوە' },
        ],
    },
    restaurant: {
        name: { en: 'Restaurant', ku: 'چێشتخانە' },
        icon: 'UtensilsCrossed',
        roles: [
            { en: 'Chef', ku: 'سەرچێشتلێنەر' },
            { en: 'Waiter', ku: 'گارسۆن' },
            { en: 'Customer', ku: 'کڕیار' },
            { en: 'Hostess', ku: 'پێشوازیکەر' },
            { en: 'Dishwasher', ku: 'قاپشۆر' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Bartender', ku: 'کارمەندی باڕ' },
            { en: 'Food Critic', ku: 'ڕەخنەگری خواردن' },
        ],
    },
    movieStudio: {
        name: { en: 'Movie Studio', ku: 'ستۆدیۆی فیلم' },
        icon: 'Video',
        roles: [
            { en: 'Director', ku: 'دەرهێنەر' },
            { en: 'Actor', ku: 'ئەکتەر' },
            { en: 'Cameraman', ku: 'کامێرامان' },
            { en: 'Makeup Artist', ku: 'موکیاژکار' },
            { en: 'Stunt Double', ku: 'بەدیلی مەترسیدار' },
            { en: 'Producer', ku: 'بەرهەمهێنەر' },
            { en: 'Script Writer', ku: 'سیناریۆنووس' },
            { en: 'Extra', ku: 'ئەکتەری لاوەکی' },
        ],
    },
    policeStation: {
        name: { en: 'Police Station', ku: 'بنکەی پۆلیس' },
        icon: 'Shield',
        roles: [
            { en: 'Police Officer', ku: 'پۆلیس' },
            { en: 'Detective', ku: 'لێکۆڵەر' },
            { en: 'Criminal', ku: 'تاوانبار' },
            { en: 'Lawyer', ku: 'پارێزەر' },
            { en: 'Witness', ku: 'شایەتحاڵ' },
            { en: 'Chief', ku: 'بەڕێوەبەر' },
            { en: 'Receptionist', ku: 'پرسگە' },
            { en: 'Forensic Expert', ku: 'پسپۆڕی بەڵگەی تاوان' },
        ],
    },
    university: {
        name: { en: 'University', ku: 'زانکۆ' },
        icon: 'Library',
        roles: [
            { en: 'Professor', ku: 'پڕۆفیسۆر' },
            { en: 'Student', ku: 'قوتابی زانکۆ' },
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
        icon: 'Flag',
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
    bakery: {
        name: { en: 'Bakery', ku: 'فڕن' },
        icon: 'Cake',
        roles: [
            { en: 'Baker', ku: 'نانەوا' },
            { en: 'Pastry Chef', ku: 'وەستای شیرینی' },
            { en: 'Cashier', ku: 'کاشێر' },
            { en: 'Customer', ku: 'کڕیار' },
            { en: 'Delivery Driver', ku: 'شۆفێری دیلیڤەری' },
            { en: 'Decorator', ku: 'ڕازاندنەوەکار' },
            { en: 'Manager', ku: 'بەڕێوەبەر' },
            { en: 'Supplier', ku: 'دابینکەری کەلوپەل' },
        ],
    },
    gym: {
        name: { en: 'Gym', ku: 'هۆڵی وەرزش' },
        icon: 'Dumbbell',
        roles: [
            { en: 'Personal Trainer', ku: 'ڕاهێنەری تایبەت' },
            { en: 'Bodybuilder', ku: 'لەشجوانی' },
            { en: 'Yoga Instructor', ku: 'مامۆستای یۆگا' },
            { en: 'Receptionist', ku: 'پرسگە' },
            { en: 'Boxer', ku: 'بۆکسێنەر' },
            { en: 'Swimmer', ku: 'مەلەوان' },
            { en: 'Janitor', ku: 'پاککەرەوە' },
            { en: 'Member', ku: 'ئەندام' },
        ],
    },
    farm: {
        name: { en: 'Farm', ku: 'کێڵگە' },
        icon: 'Tractor',
        roles: [
            { en: 'Farmer', ku: 'جوتیار' },
            { en: 'Rancher', ku: 'خاوەن کێڵگە' },
            { en: 'Veterinarian', ku: 'پزیشکی ئاژەڵان' },
            { en: 'Tractor Driver', ku: 'شۆفێری تراکتۆر' },
            { en: 'Harvester', ku: 'دروێنەکار' },
            { en: 'Beekeeper', ku: 'هەنگەوان' },
            { en: 'Shepherd', ku: 'شوان' },
            { en: 'Buyer', ku: 'کڕیار' },
        ],
    },
    museum: {
        name: { en: 'Museum', ku: 'مۆزەخانە' },
        icon: 'Building',
        roles: [
            { en: 'Curator', ku: 'سەرپەرشتیار' },
            { en: 'Tour Guide', ku: 'ڕێبەری گەشتیاری' },
            { en: 'Security Guard', ku: 'پاسەوان' },
            { en: 'Artist', ku: 'هونەرمەند' },
            { en: 'Visitor', ku: 'سەردانکەر' },
            { en: 'Photographer', ku: 'وێنەگر' },
            { en: 'Restorer', ku: 'نۆژەنکەرەوە' },
            { en: 'Gift Shop Clerk', ku: 'فرۆشیاری دیاری' },
        ],
    },
};

// Helper function to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

const seenLocations = new Set();

// Get random location with roles for gameplay
export const getRandomLocation = (language = 'en') => {
    const keys = Object.keys(LOCATIONS);
    
    let available = keys.filter(k => !seenLocations.has(k));
    if (available.length === 0) {
        seenLocations.clear();
        available = keys;
    }
    
    const randomKey = available[Math.floor(Math.random() * available.length)];
    seenLocations.add(randomKey);
    
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
