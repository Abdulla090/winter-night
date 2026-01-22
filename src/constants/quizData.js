// Trivia Quiz - Questions Database
// Bilingual support: English (en) and Kurdish Sorani (ku)
// All data is stored locally - NO NETWORK REQUIRED

export const QUIZ_CATEGORIES = {
    general: {
        name: { en: 'General Knowledge', ku: 'زانیاری گشتی' },
        icon: 'bulb',
        questions: [
            { question: { en: "What is the capital of France?", ku: "پایتەختی فەرەنسا چییە؟" }, options: [{ en: "London", ku: "لەندەن" }, { en: "Berlin", ku: "بەرلین" }, { en: "Paris", ku: "پاریس" }, { en: "Madrid", ku: "مەدرید" }], answer: 2 },
            { question: { en: "Which planet is known as the Red Planet?", ku: "کام هەسارە بە هەسارەی سور ناسراوە؟" }, options: [{ en: "Venus", ku: "ڤینوس" }, { en: "Mars", ku: "مەریخ" }, { en: "Jupiter", ku: "یوپیتەر" }, { en: "Saturn", ku: "زوحەل" }], answer: 1 },
            { question: { en: "How many continents are there on Earth?", ku: "چەند کیشوەر لەسەر زەوی هەیە؟" }, options: [{ en: "5", ku: "٥" }, { en: "6", ku: "٦" }, { en: "7", ku: "٧" }, { en: "8", ku: "٨" }], answer: 2 },
            { question: { en: "What is the largest ocean on Earth?", ku: "گەورەترین زەریا لەسەر زەوی کامەیە؟" }, options: [{ en: "Atlantic", ku: "ئەتلەسی" }, { en: "Indian", ku: "هیندی" }, { en: "Arctic", ku: "ئارکتیک" }, { en: "Pacific", ku: "زەریای هێمن" }], answer: 3 },
            { question: { en: "Which element has the chemical symbol 'O'?", ku: "کام توخم هێمای کیمیاوی 'O' ی هەیە؟" }, options: [{ en: "Gold", ku: "زێڕ" }, { en: "Oxygen", ku: "ئۆکسجین" }, { en: "Silver", ku: "زیو" }, { en: "Osmium", ku: "ئۆسمیۆم" }], answer: 1 },
            { question: { en: "How many days are in a leap year?", ku: "چەند ڕۆژ لە ساڵی پڕدا هەیە؟" }, options: [{ en: "365", ku: "٣٦٥" }, { en: "366", ku: "٣٦٦" }, { en: "364", ku: "٣٦٤" }, { en: "367", ku: "٣٦٧" }], answer: 1 },
            { question: { en: "What is the smallest country in the world?", ku: "بچووکترین وڵات لە جیهاندا کامەیە؟" }, options: [{ en: "Monaco", ku: "مۆناکۆ" }, { en: "Vatican City", ku: "شاری ڤاتیکان" }, { en: "San Marino", ku: "سان مارینۆ" }, { en: "Liechtenstein", ku: "لیختنشتاین" }], answer: 1 },
            { question: { en: "Which animal is known as the King of the Jungle?", ku: "کام ئاژەڵ بە پاشای دارستان ناسراوە؟" }, options: [{ en: "Tiger", ku: "بەور" }, { en: "Elephant", ku: "فیل" }, { en: "Lion", ku: "شێر" }, { en: "Gorilla", ku: "گۆریلا" }], answer: 2 },
            { question: { en: "What is the largest mammal on Earth?", ku: "گەورەترین شیرەمەند لەسەر زەوی کامەیە؟" }, options: [{ en: "Elephant", ku: "فیل" }, { en: "Blue Whale", ku: "نەهەنگی شین" }, { en: "Giraffe", ku: "زەڕافە" }, { en: "Hippopotamus", ku: "ئەسپی دەریایی" }], answer: 1 },
            { question: { en: "How many colors are in a rainbow?", ku: "چەند ڕەنگ لە کەوانە هەیە؟" }, options: [{ en: "5", ku: "٥" }, { en: "6", ku: "٦" }, { en: "7", ku: "٧" }, { en: "8", ku: "٨" }], answer: 2 }
        ]
    },
    science: {
        name: { en: 'Science', ku: 'زانست' },
        icon: 'flask',
        questions: [
            { question: { en: "What is the chemical formula for water?", ku: "فۆرمولای کیمیاوی ئاو چییە؟" }, options: [{ en: "CO2", ku: "CO2" }, { en: "H2O", ku: "H2O" }, { en: "O2", ku: "O2" }, { en: "NaCl", ku: "NaCl" }], answer: 1 },
            { question: { en: "What is the speed of light?", ku: "خێرایی ڕووناکی چەندە؟" }, options: [{ en: "300,000 km/s", ku: "٣٠٠,٠٠٠ کم/چ" }, { en: "150,000 km/s", ku: "١٥٠,٠٠٠ کم/چ" }, { en: "450,000 km/s", ku: "٤٥٠,٠٠٠ کم/چ" }, { en: "600,000 km/s", ku: "٦٠٠,٠٠٠ کم/چ" }], answer: 0 },
            { question: { en: "What gas do plants absorb from the air?", ku: "ڕووەکەکان کام گاز لە هەوا دەمژن؟" }, options: [{ en: "Oxygen", ku: "ئۆکسجین" }, { en: "Nitrogen", ku: "نایترۆجین" }, { en: "Carbon Dioxide", ku: "کاربۆن دای ئۆکساید" }, { en: "Hydrogen", ku: "هایدرۆجین" }], answer: 2 },
            { question: { en: "How many bones are in the adult human body?", ku: "چەند ئێسک لە جەستەی مرۆڤی گەورەدا هەیە؟" }, options: [{ en: "187", ku: "١٨٧" }, { en: "206", ku: "٢٠٦" }, { en: "226", ku: "٢٢٦" }, { en: "256", ku: "٢٥٦" }], answer: 1 },
            { question: { en: "What is the largest organ in the human body?", ku: "گەورەترین ئەندام لە جەستەی مرۆڤدا کامەیە؟" }, options: [{ en: "Heart", ku: "دڵ" }, { en: "Liver", ku: "جگەر" }, { en: "Brain", ku: "مێشک" }, { en: "Skin", ku: "پێست" }], answer: 3 },
            { question: { en: "What planet has the most moons?", ku: "کام هەسارە زۆرترین مانگی هەیە؟" }, options: [{ en: "Jupiter", ku: "یوپیتەر" }, { en: "Saturn", ku: "زوحەل" }, { en: "Uranus", ku: "یورانۆس" }, { en: "Neptune", ku: "نێپتون" }], answer: 1 },
            { question: { en: "What is the hardest natural substance on Earth?", ku: "سەختترین مادەی سروشتی لەسەر زەوی چییە؟" }, options: [{ en: "Gold", ku: "زێڕ" }, { en: "Iron", ku: "ئاسن" }, { en: "Diamond", ku: "ئەڵماس" }, { en: "Platinum", ku: "پلاتین" }], answer: 2 },
            { question: { en: "What is the center of an atom called?", ku: "ناوەڕاستی ئەتۆم بە چی ناودەبرێت؟" }, options: [{ en: "Electron", ku: "ئیلیکترۆن" }, { en: "Proton", ku: "پرۆتۆن" }, { en: "Neutron", ku: "نیوترۆن" }, { en: "Nucleus", ku: "ناوک" }], answer: 3 },
            { question: { en: "What is the pH of pure water?", ku: "pH ی ئاوی پاک چەندە؟" }, options: [{ en: "5", ku: "٥" }, { en: "7", ku: "٧" }, { en: "9", ku: "٩" }, { en: "14", ku: "١٤" }], answer: 1 },
            { question: { en: "What galaxy is Earth located in?", ku: "زەوی لە کام گەلاکسی دایە؟" }, options: [{ en: "Andromeda", ku: "ئەندرۆمیدا" }, { en: "Milky Way", ku: "کاکێشان" }, { en: "Triangulum", ku: "سێگۆشەیی" }, { en: "Whirlpool", ku: "گەردەلول" }], answer: 1 }
        ]
    },
    history: {
        name: { en: 'History', ku: 'مێژوو' },
        icon: 'book',
        questions: [
            { question: { en: "In what year did World War II end?", ku: "جەنگی جیهانی دووەم لە کام ساڵ کۆتایی هات؟" }, options: [{ en: "1943", ku: "١٩٤٣" }, { en: "1944", ku: "١٩٤٤" }, { en: "1945", ku: "١٩٤٥" }, { en: "1946", ku: "١٩٤٦" }], answer: 2 },
            { question: { en: "Who was the first President of the United States?", ku: "یەکەم سەرۆکی ئەمریکا کێ بوو؟" }, options: [{ en: "Thomas Jefferson", ku: "تۆماس جێفەرسن" }, { en: "George Washington", ku: "جۆرج واشنتن" }, { en: "Abraham Lincoln", ku: "ئەبراهام لینکۆڵن" }, { en: "John Adams", ku: "جۆن ئادامز" }], answer: 1 },
            { question: { en: "Which ancient civilization built the pyramids?", ku: "کام شارستانی کۆن ئەهرامەکانی دروست کرد؟" }, options: [{ en: "Romans", ku: "ڕۆمانەکان" }, { en: "Greeks", ku: "یۆنانییەکان" }, { en: "Egyptians", ku: "میسرییەکان" }, { en: "Mayans", ku: "مایاکان" }], answer: 2 },
            { question: { en: "What year did the Titanic sink?", ku: "تایتانیک لە کام ساڵ نوقوم بوو؟" }, options: [{ en: "1910", ku: "١٩١٠" }, { en: "1912", ku: "١٩١٢" }, { en: "1914", ku: "١٩١٤" }, { en: "1916", ku: "١٩١٦" }], answer: 1 },
            { question: { en: "Who painted the Mona Lisa?", ku: "کێ مۆنا لیزای کێشا؟" }, options: [{ en: "Michelangelo", ku: "مایکڵ ئەنجلۆ" }, { en: "Raphael", ku: "رافائێل" }, { en: "Leonardo da Vinci", ku: "لیۆناردۆ دا ڤینچی" }, { en: "Donatello", ku: "دۆناتێڵۆ" }], answer: 2 },
            { question: { en: "Which empire was ruled by Genghis Khan?", ku: "کام ئیمپراتۆریە لەلایەن جەنگیز خانەوە ڕابەری دەکرا؟" }, options: [{ en: "Roman", ku: "ڕۆمانی" }, { en: "Ottoman", ku: "عوسمانی" }, { en: "Mongol", ku: "موغولی" }, { en: "Byzantine", ku: "بیزەنتینی" }], answer: 2 },
            { question: { en: "What ancient wonder was located in Egypt?", ku: "کام سەرسوڕهێنەری کۆن لە میسردا بوو؟" }, options: [{ en: "Colosseum", ku: "کۆلیسیۆم" }, { en: "Great Pyramid of Giza", ku: "ئەهرامە گەورەکەی گیزا" }, { en: "Hanging Gardens", ku: "باخچەکانی هەڵواسراو" }, { en: "Lighthouse", ku: "فانووسی دەریایی" }], answer: 1 },
            { question: { en: "Who discovered America in 1492?", ku: "کێ ئەمریکای دۆزییەوە لە ١٤٩٢؟" }, options: [{ en: "Vasco da Gama", ku: "ڤاسکۆ دا گاما" }, { en: "Ferdinand Magellan", ku: "فێردیناند ماگێلان" }, { en: "Christopher Columbus", ku: "کریستۆفەر کۆلۆمبۆس" }, { en: "Amerigo Vespucci", ku: "ئەمیریگۆ ڤێسپوتشی" }], answer: 2 },
            { question: { en: "What year did the French Revolution begin?", ku: "شۆڕشی فەرەنسا لە کام ساڵ دەستی پێکرد؟" }, options: [{ en: "1776", ku: "١٧٧٦" }, { en: "1789", ku: "١٧٨٩" }, { en: "1799", ku: "١٧٩٩" }, { en: "1804", ku: "١٨٠٤" }], answer: 1 },
            { question: { en: "Who was the first person to walk on the moon?", ku: "یەکەم کەس کێ بوو کە ڕێی کرد لەسەر مانگ؟" }, options: [{ en: "Buzz Aldrin", ku: "باز ئاڵدرین" }, { en: "Yuri Gagarin", ku: "یوری گاگارین" }, { en: "Neil Armstrong", ku: "نیل ئارمسترۆنگ" }, { en: "John Glenn", ku: "جۆن گلین" }], answer: 2 }
        ]
    },
    movies: {
        name: { en: 'Movies & TV', ku: 'فیلم و تەلەفزیۆن' },
        icon: 'film',
        questions: [
            { question: { en: "What movie features the quote 'I'll be back'?", ku: "کام فیلم ئەم قسەیەی تێدایە 'دەگەڕێمەوە'؟" }, options: [{ en: "Die Hard", ku: "دای هارد" }, { en: "Predator", ku: "پریدێتەر" }, { en: "The Terminator", ku: "تێرمینەیتەر" }, { en: "Rambo", ku: "ڕامبۆ" }], answer: 2 },
            { question: { en: "Who directed Titanic?", ku: "کێ تایتانیکی دەرهێنا؟" }, options: [{ en: "Steven Spielberg", ku: "ستیڤن سپیلبێرگ" }, { en: "James Cameron", ku: "جەیمس کامیرۆن" }, { en: "Christopher Nolan", ku: "کریستۆفەر نۆڵان" }, { en: "Martin Scorsese", ku: "مارتن سکۆرسیزی" }], answer: 1 },
            { question: { en: "What is the highest-grossing film of all time?", ku: "سەرکەوتووترین فیلم لە هەموو کاتەکاندا کامەیە؟" }, options: [{ en: "Titanic", ku: "تایتانیک" }, { en: "Avatar", ku: "ئەڤاتار" }, { en: "Avengers: Endgame", ku: "ئەڤێنجەرز: ئێندگەیم" }, { en: "Star Wars", ku: "ستار وۆرز" }], answer: 1 },
            { question: { en: "Who plays Harry Potter in the film series?", ku: "کێ ڕۆڵی هاری پۆتەر دەگێڕێت لە زنجیرە فیلمەکەدا؟" }, options: [{ en: "Rupert Grint", ku: "ڕوپێرت گرینت" }, { en: "Tom Felton", ku: "تۆم فێلتن" }, { en: "Daniel Radcliffe", ku: "دانیەڵ ڕادکلیف" }, { en: "Matt Lewis", ku: "مات لویس" }], answer: 2 },
            { question: { en: "In The Lion King, what is Simba's father's name?", ku: "لە شێرە پاشادا، ناوی باوکی سیمبا چییە؟" }, options: [{ en: "Mufasa", ku: "موفاسا" }, { en: "Scar", ku: "سکار" }, { en: "Zazu", ku: "زازو" }, { en: "Rafiki", ku: "رافیکی" }], answer: 0 },
            { question: { en: "What year was the first Star Wars movie released?", ku: "یەکەم فیلمی ستار وۆرز لە کام ساڵ دەرچوو؟" }, options: [{ en: "1975", ku: "١٩٧٥" }, { en: "1977", ku: "١٩٧٧" }, { en: "1979", ku: "١٩٧٩" }, { en: "1980", ku: "١٩٨٠" }], answer: 1 },
            { question: { en: "Who is the voice of Woody in Toy Story?", ku: "کێ دەنگی وودی بوو لە تۆی ستۆری؟" }, options: [{ en: "Tim Allen", ku: "تیم ئالەن" }, { en: "Tom Hanks", ku: "تۆم هانکس" }, { en: "Billy Crystal", ku: "بیلی کریستاڵ" }, { en: "John Ratzenberger", ku: "جۆن راتزنبێرگەر" }], answer: 1 },
            { question: { en: "What superhero is known as the 'Dark Knight'?", ku: "کام سوپەر هیرۆ بە 'شەوالیەی تاریک' ناسراوە؟" }, options: [{ en: "Superman", ku: "سوپەرمان" }, { en: "Spider-Man", ku: "سپایدەرمان" }, { en: "Batman", ku: "باتمان" }, { en: "Iron Man", ku: "ئایرۆن مان" }], answer: 2 },
            { question: { en: "Which movie features a character named 'Jack Dawson'?", ku: "کام فیلم کارەکتەرێکی بەناوی 'جاک داوسن' تێدایە؟" }, options: [{ en: "Pearl Harbor", ku: "پێرل هاربەر" }, { en: "Titanic", ku: "تایتانیک" }, { en: "The Notebook", ku: "دەفتەری یادگاری" }, { en: "A Walk to Remember", ku: "ڕێکردنێک بۆ یادگاری" }], answer: 1 },
            { question: { en: "What is the name of the fictional African country in Black Panther?", ku: "ناوی وڵاتە ئەفریقییە درۆکەکە چییە لە بلاک پانثەر؟" }, options: [{ en: "Zamunda", ku: "زاموندا" }, { en: "Wakanda", ku: "واکاندا" }, { en: "Gondor", ku: "گۆندۆر" }, { en: "Latveria", ku: "لاتڤیریا" }], answer: 1 }
        ]
    },
    sports: {
        name: { en: 'Sports', ku: 'وەرزش' },
        icon: 'football',
        questions: [
            { question: { en: "How many players are on a soccer team?", ku: "چەند یاریزان لە تیمی فوتبۆڵ هەیە؟" }, options: [{ en: "9", ku: "٩" }, { en: "10", ku: "١٠" }, { en: "11", ku: "١١" }, { en: "12", ku: "١٢" }], answer: 2 },
            { question: { en: "What sport is Serena Williams famous for?", ku: "سێرینا ویلیامز بەناوبانگە بۆ کام وەرزش؟" }, options: [{ en: "Golf", ku: "گۆڵف" }, { en: "Tennis", ku: "تێنس" }, { en: "Swimming", ku: "مەلەکردن" }, { en: "Gymnastics", ku: "جیمناستیک" }], answer: 1 },
            { question: { en: "Which country won the 2018 FIFA World Cup?", ku: "کام وڵات جامی جیهانی فیفا ٢٠١٨ ی بردەوە؟" }, options: [{ en: "Brazil", ku: "برازیل" }, { en: "Germany", ku: "ئەڵمانیا" }, { en: "France", ku: "فەرەنسا" }, { en: "Argentina", ku: "ئەرژەنتین" }], answer: 2 },
            { question: { en: "How many Grand Slam tennis tournaments are there each year?", ku: "چەند تورنەمێنتی گراند سلام هەیە لە ساڵێکدا؟" }, options: [{ en: "2", ku: "٢" }, { en: "3", ku: "٣" }, { en: "4", ku: "٤" }, { en: "5", ku: "٥" }], answer: 2 },
            { question: { en: "What is the maximum score in a single frame of bowling?", ku: "زۆرترین خاڵ لە یەک فرەیمی بۆلینگ چەندە؟" }, options: [{ en: "200", ku: "٢٠٠" }, { en: "250", ku: "٢٥٠" }, { en: "300", ku: "٣٠٠" }, { en: "350", ku: "٣٥٠" }], answer: 2 },
            { question: { en: "Which sport uses a shuttlecock?", ku: "کام وەرزش شەتڵکۆک بەکار دەهێنێت؟" }, options: [{ en: "Tennis", ku: "تێنس" }, { en: "Badminton", ku: "بادمینتۆن" }, { en: "Squash", ku: "سکواش" }, { en: "Table Tennis", ku: "تێنسی مێز" }], answer: 1 },
            { question: { en: "How long is a marathon in miles?", ku: "ماراتۆن چەند میل درێژە؟" }, options: [{ en: "20.2", ku: "٢٠.٢" }, { en: "24.2", ku: "٢٤.٢" }, { en: "26.2", ku: "٢٦.٢" }, { en: "28.2", ku: "٢٨.٢" }], answer: 2 },
            { question: { en: "What country is the sport of cricket most associated with?", ku: "کام وڵات زۆرترین پەیوەندی هەیە بە وەرزشی کریکێت؟" }, options: [{ en: "USA", ku: "ئەمریکا" }, { en: "England", ku: "ئینگلتەرا" }, { en: "France", ku: "فەرەنسا" }, { en: "Germany", ku: "ئەڵمانیا" }], answer: 1 },
            { question: { en: "How many holes are played in a standard round of golf?", ku: "چەند کون لە قۆناغێکی ئاسایی گۆڵفدا یاری دەکرێت؟" }, options: [{ en: "9", ku: "٩" }, { en: "12", ku: "١٢" }, { en: "18", ku: "١٨" }, { en: "21", ku: "٢١" }], answer: 2 },
            { question: { en: "Which sport is Michael Phelps famous for?", ku: "مایکڵ فێلپس بۆ کام وەرزش ناوبانگە؟" }, options: [{ en: "Diving", ku: "ڕێژە" }, { en: "Swimming", ku: "مەلەکردن" }, { en: "Water Polo", ku: "پۆلۆی ئاو" }, { en: "Rowing", ku: "بەلەم ڕاننان" }], answer: 1 }
        ]
    },
    music: {
        name: { en: 'Music', ku: 'میوزیک' },
        icon: 'musical-notes',
        questions: [
            { question: { en: "Who is known as the 'King of Pop'?", ku: "کێ بە 'پاشای پۆپ' ناسراوە؟" }, options: [{ en: "Elvis Presley", ku: "ئێلڤیس پرێسلی" }, { en: "Michael Jackson", ku: "مایکڵ جاکسن" }, { en: "Prince", ku: "پرینس" }, { en: "Freddie Mercury", ku: "فرێدی مێرکیوری" }], answer: 1 },
            { question: { en: "Which band performed 'Bohemian Rhapsody'?", ku: "کام باند 'بۆهیمیان ڕاپسۆدی' ی گوت؟" }, options: [{ en: "The Beatles", ku: "بیتڵز" }, { en: "Led Zeppelin", ku: "لێد زێپلین" }, { en: "Queen", ku: "کویین" }, { en: "Pink Floyd", ku: "پینک فلۆید" }], answer: 2 },
            { question: { en: "What instrument has 88 keys?", ku: "کام ئامێر ٨٨ کلیلی هەیە؟" }, options: [{ en: "Guitar", ku: "گیتار" }, { en: "Violin", ku: "ڤایۆلین" }, { en: "Drums", ku: "دەهۆڵ" }, { en: "Piano", ku: "پیانۆ" }], answer: 3 },
            { question: { en: "Who wrote the song 'Imagine'?", ku: "کێ گۆرانی 'ئیماجین' ی نووسی؟" }, options: [{ en: "Paul McCartney", ku: "پاوڵ مەکارتنی" }, { en: "John Lennon", ku: "جۆن لێنۆن" }, { en: "George Harrison", ku: "جۆرج هاریسن" }, { en: "Ringo Starr", ku: "ڕینگۆ ستار" }], answer: 1 },
            { question: { en: "What is the best-selling album of all time?", ku: "زۆرترین فرۆشراوی ئەلبوم لە هەموو کاتەکاندا کامەیە؟" }, options: [{ en: "Abbey Road", ku: "ئابی ڕۆد" }, { en: "Back in Black", ku: "باک ئین بلاک" }, { en: "Thriller", ku: "ثریلەر" }, { en: "The Dark Side of the Moon", ku: "لای تاریکی مانگ" }], answer: 2 },
            { question: { en: "How many strings does a standard guitar have?", ku: "گیتاری ئاسایی چەند تاری هەیە؟" }, options: [{ en: "4", ku: "٤" }, { en: "5", ku: "٥" }, { en: "6", ku: "٦" }, { en: "7", ku: "٧" }], answer: 2 },
            { question: { en: "What country did the Beatles come from?", ku: "بیتڵز لە کام وڵات هاتن؟" }, options: [{ en: "USA", ku: "ئەمریکا" }, { en: "England", ku: "ئینگلتەرا" }, { en: "Ireland", ku: "ئێرلەندا" }, { en: "Australia", ku: "ئوستورالیا" }], answer: 1 },
            { question: { en: "Who sang 'Rolling in the Deep'?", ku: "کێ 'ڕۆلینگ ئین دەپ' ی گوت؟" }, options: [{ en: "Beyoncé", ku: "بیۆنسێ" }, { en: "Rihanna", ku: "ڕیهانا" }, { en: "Adele", ku: "ئادێل" }, { en: "Lady Gaga", ku: "لەیدی گاگا" }], answer: 2 },
            { question: { en: "What musical term means 'gradually getting louder'?", ku: "کام زاراوەی میوزیکی واتای 'کەم کەم دەنگ بەرز دەبێتەوە'؟" }, options: [{ en: "Diminuendo", ku: "دیمینویندۆ" }, { en: "Staccato", ku: "ستەکاتۆ" }, { en: "Crescendo", ku: "کرەشێندۆ" }, { en: "Legato", ku: "لیگاتۆ" }], answer: 2 },
            { question: { en: "Which composer was deaf but still created symphonies?", ku: "کام کۆمپۆزەر نابیست بوو بەڵام هێشتا سیمفۆنی دروست دەکرد؟" }, options: [{ en: "Mozart", ku: "مۆزارت" }, { en: "Bach", ku: "باخ" }, { en: "Beethoven", ku: "بیتهۆڤن" }, { en: "Chopin", ku: "شۆپان" }], answer: 2 }
        ]
    }
};

// Helper to get text based on language
export const getText = (item, language = 'en') => {
    if (typeof item === 'string') return item;
    return item[language] || item.en;
};

// Get random questions from a category
export const getRandomQuestions = (categoryKey, count = 10, language = 'en') => {
    const category = QUIZ_CATEGORIES[categoryKey];
    if (!category) return [];

    const questions = [...category.questions];
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length)).map(q => ({
        question: getText(q.question, language),
        options: q.options.map(opt => getText(opt, language)),
        answer: q.answer,
    }));
};

// Get all categories
export const getAllQuizCategories = (language = 'en') => {
    return Object.entries(QUIZ_CATEGORIES).map(([key, value]) => ({
        key,
        name: getText(value.name, language),
        icon: value.icon,
        count: value.questions.length,
    }));
};

// Get category by key
export const getCategoryByKey = (key, language = 'en') => {
    const cat = QUIZ_CATEGORIES[key];
    if (!cat) return null;
    return {
        ...cat,
        name: getText(cat.name, language),
    };
};
