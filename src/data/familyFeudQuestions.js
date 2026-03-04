// Family Feud bilingual question packs
// Each question: survey of 100 people, 4-8 ranked answers
// Points = number of people who gave that answer (must total ~100)

export const familyFeudQuestions = {
    en: [
        // ──── ROUND 1 / 2 QUESTIONS (Standard) ────
        {
            question: "Name something you might find in a woman's purse.",
            answers: [
                { text: "Lipstick / Makeup", points: 32 },
                { text: "Keys", points: 22 },
                { text: "Wallet / Money", points: 18 },
                { text: "Phone", points: 14 },
                { text: "Tissues", points: 8 },
                { text: "Gum / Mints", points: 6 },
            ]
        },
        {
            question: "Name a reason someone might be late for work.",
            answers: [
                { text: "Overslept", points: 38 },
                { text: "Traffic", points: 28 },
                { text: "Car trouble", points: 14 },
                { text: "Kids / Family", points: 10 },
                { text: "Bad weather", points: 6 },
                { text: "Forgot something", points: 4 },
            ]
        },
        {
            question: "Name a popular pizza topping.",
            answers: [
                { text: "Pepperoni", points: 42 },
                { text: "Mushrooms", points: 18 },
                { text: "Sausage", points: 14 },
                { text: "Extra Cheese", points: 12 },
                { text: "Onions", points: 8 },
                { text: "Peppers", points: 6 },
            ]
        },
        {
            question: "Name something people bring to the beach.",
            answers: [
                { text: "Towel", points: 34 },
                { text: "Sunscreen", points: 26 },
                { text: "Umbrella / Shade", points: 14 },
                { text: "Cooler / Drinks", points: 12 },
                { text: "Swimsuit", points: 8 },
                { text: "Sunglasses", points: 6 },
            ]
        },
        {
            question: "Name an animal that is associated with bad luck.",
            answers: [
                { text: "Black Cat", points: 55 },
                { text: "Crow / Raven", points: 18 },
                { text: "Bat", points: 12 },
                { text: "Owl", points: 8 },
                { text: "Snake", points: 7 },
            ]
        },
        {
            question: "Name something you'd find in a doctor's office.",
            answers: [
                { text: "Stethoscope", points: 30 },
                { text: "Magazines", points: 22 },
                { text: "Scale", points: 16 },
                { text: "Exam table", points: 14 },
                { text: "Blood pressure cuff", points: 10 },
                { text: "Tongue depressor", points: 8 },
            ]
        },
        {
            question: "Name a fruit that's red.",
            answers: [
                { text: "Apple", points: 40 },
                { text: "Strawberry", points: 28 },
                { text: "Cherry", points: 14 },
                { text: "Watermelon", points: 10 },
                { text: "Raspberry", points: 8 },
            ]
        },
        {
            question: "Name a job that requires a uniform.",
            answers: [
                { text: "Police Officer", points: 32 },
                { text: "Doctor / Nurse", points: 24 },
                { text: "Firefighter", points: 18 },
                { text: "Military", points: 14 },
                { text: "Fast food worker", points: 8 },
                { text: "Pilot", points: 4 },
            ]
        },
        {
            question: "Name something people do on their birthday.",
            answers: [
                { text: "Eat cake", points: 35 },
                { text: "Open presents", points: 25 },
                { text: "Party / Celebrate", points: 18 },
                { text: "Go to dinner", points: 12 },
                { text: "Make a wish", points: 6 },
                { text: "Blow out candles", points: 4 },
            ]
        },
        {
            question: "Name something you'd bring on a camping trip.",
            answers: [
                { text: "Tent", points: 38 },
                { text: "Sleeping bag", points: 24 },
                { text: "Flashlight", points: 14 },
                { text: "Food / Snacks", points: 12 },
                { text: "Bug spray", points: 8 },
                { text: "Matches / Lighter", points: 4 },
            ]
        },
        // ──── MORE QUESTIONS FOR VARIETY ────
        {
            question: "Name a famous cartoon character.",
            answers: [
                { text: "Mickey Mouse", points: 35 },
                { text: "Bugs Bunny", points: 22 },
                { text: "SpongeBob", points: 18 },
                { text: "Tom & Jerry", points: 12 },
                { text: "Scooby-Doo", points: 8 },
                { text: "Homer Simpson", points: 5 },
            ]
        },
        {
            question: "Name something you'd find at a wedding.",
            answers: [
                { text: "Wedding cake", points: 32 },
                { text: "Flowers", points: 22 },
                { text: "Bride & Groom", points: 18 },
                { text: "Rings", points: 14 },
                { text: "Music / DJ", points: 8 },
                { text: "Champagne", points: 6 },
            ]
        },
        {
            question: "Name something people are afraid of.",
            answers: [
                { text: "Snakes", points: 28 },
                { text: "Spiders", points: 24 },
                { text: "Heights", points: 20 },
                { text: "Death", points: 12 },
                { text: "Dark", points: 10 },
                { text: "Public speaking", points: 6 },
            ]
        },
        {
            question: "Name a holiday where people give gifts.",
            answers: [
                { text: "Christmas", points: 52 },
                { text: "Birthday", points: 20 },
                { text: "Valentine's Day", points: 12 },
                { text: "Mother's / Father's Day", points: 8 },
                { text: "Easter", points: 5 },
                { text: "Anniversary", points: 3 },
            ]
        },
        {
            question: "Name something you eat with ketchup.",
            answers: [
                { text: "French fries", points: 45 },
                { text: "Hamburger", points: 22 },
                { text: "Hot dog", points: 15 },
                { text: "Eggs", points: 8 },
                { text: "Chicken nuggets", points: 6 },
                { text: "Meatloaf", points: 4 },
            ]
        },
        {
            question: "Name a type of weather that causes problems.",
            answers: [
                { text: "Snow / Blizzard", points: 30 },
                { text: "Hurricane / Tornado", points: 28 },
                { text: "Rain / Flood", points: 20 },
                { text: "Ice / Hail", points: 12 },
                { text: "Extreme heat", points: 6 },
                { text: "Fog", points: 4 },
            ]
        },
        {
            question: "Name something you do before going to bed.",
            answers: [
                { text: "Brush teeth", points: 35 },
                { text: "Watch TV / Phone", points: 22 },
                { text: "Take a shower / bath", points: 16 },
                { text: "Read a book", points: 12 },
                { text: "Set alarm", points: 8 },
                { text: "Say prayers", points: 7 },
            ]
        },
        {
            question: "Name a vehicle with flashing lights.",
            answers: [
                { text: "Police car", points: 38 },
                { text: "Ambulance", points: 28 },
                { text: "Fire truck", points: 22 },
                { text: "Tow truck", points: 8 },
                { text: "School bus", points: 4 },
            ]
        },
        {
            question: "Name something you see in a classroom.",
            answers: [
                { text: "Desks / Chairs", points: 30 },
                { text: "Whiteboard / Chalkboard", points: 26 },
                { text: "Teacher", points: 18 },
                { text: "Books", points: 12 },
                { text: "Computer", points: 8 },
                { text: "Clock", points: 6 },
            ]
        },
        {
            question: "Name a sport played with a ball.",
            answers: [
                { text: "Football / Soccer", points: 32 },
                { text: "Basketball", points: 28 },
                { text: "Baseball", points: 16 },
                { text: "Tennis", points: 12 },
                { text: "Golf", points: 8 },
                { text: "Volleyball", points: 4 },
            ]
        },
        {
            question: "Name something you'd find in a classroom.",
            answers: [
                { text: "Desks / Chairs", points: 32 },
                { text: "Whiteboard / Chalkboard", points: 24 },
                { text: "Books / Textbooks", points: 18 },
                { text: "Teacher", points: 12 },
                { text: "Clock", points: 8 },
                { text: "Computer", points: 6 },
            ]
        },
        {
            question: "Name a popular social media app.",
            answers: [
                { text: "Instagram", points: 32 },
                { text: "TikTok", points: 26 },
                { text: "Facebook", points: 18 },
                { text: "Snapchat", points: 12 },
                { text: "Twitter / X", points: 8 },
                { text: "YouTube", points: 4 },
            ]
        },
        {
            question: "Name something people are afraid of.",
            answers: [
                { text: "Spiders / Bugs", points: 28 },
                { text: "Heights", points: 24 },
                { text: "Snakes", points: 18 },
                { text: "Public Speaking", points: 14 },
                { text: "Darkness", points: 10 },
                { text: "Death", points: 6 },
            ]
        },
        {
            question: "Name a gift kids ask for at Christmas.",
            answers: [
                { text: "Video Games / Console", points: 32 },
                { text: "Toys", points: 24 },
                { text: "Phone / Tablet", points: 18 },
                { text: "Bicycle", points: 12 },
                { text: "Clothes", points: 8 },
                { text: "Money", points: 6 },
            ]
        },
        {
            question: "Name a vegetable kids refuse to eat.",
            answers: [
                { text: "Broccoli", points: 38 },
                { text: "Spinach", points: 22 },
                { text: "Brussels Sprouts", points: 16 },
                { text: "Peas", points: 12 },
                { text: "Cauliflower", points: 8 },
                { text: "Asparagus", points: 4 },
            ]
        },
        // ──── FAST MONEY QUESTIONS (5 per set, 4 sets) ────
    ],

    // Fast Money question sets (separate pool)
    enFastMoney: [
        [
            { question: "Name a color you'd paint a bedroom.", answers: [{ text: "Blue", points: 35 }, { text: "White", points: 22 }, { text: "Gray", points: 15 }, { text: "Green", points: 12 }, { text: "Beige", points: 8 }, { text: "Pink", points: 5 }, { text: "Yellow", points: 3 }] },
            { question: "Name something you lose often.", answers: [{ text: "Keys", points: 38 }, { text: "Phone", points: 22 }, { text: "Wallet", points: 16 }, { text: "Remote", points: 10 }, { text: "Glasses", points: 8 }, { text: "Socks", points: 6 }] },
            { question: "Name a month people go on vacation.", answers: [{ text: "July", points: 32 }, { text: "June", points: 24 }, { text: "August", points: 18 }, { text: "December", points: 14 }, { text: "March", points: 8 }, { text: "May", points: 4 }] },
            { question: "Name a food that's crunchy.", answers: [{ text: "Chips", points: 38 }, { text: "Celery", points: 18 }, { text: "Crackers", points: 16 }, { text: "Cereal", points: 12 }, { text: "Carrots", points: 10 }, { text: "Nuts", points: 6 }] },
            { question: "Name something you use every morning.", answers: [{ text: "Toothbrush", points: 32 }, { text: "Coffee maker", points: 24 }, { text: "Phone / Alarm", points: 18 }, { text: "Shower", points: 14 }, { text: "Mirror", points: 8 }, { text: "Comb / Brush", points: 4 }] },
        ],
        [
            { question: "Name a place with long lines.", answers: [{ text: "Grocery store", points: 30 }, { text: "Amusement park", points: 25 }, { text: "DMV", points: 18 }, { text: "Airport", points: 12 }, { text: "Bank", points: 8 }, { text: "Post office", points: 7 }] },
            { question: "Name something that has a remote control.", answers: [{ text: "TV", points: 55 }, { text: "Garage door", points: 15 }, { text: "Car", points: 12 }, { text: "AC / Fan", points: 8 }, { text: "Toy car", points: 6 }, { text: "Drone", points: 4 }] },
            { question: "Name a reason people move.", answers: [{ text: "New job", points: 35 }, { text: "More space", points: 22 }, { text: "Marriage", points: 16 }, { text: "Better schools", points: 12 }, { text: "Cheaper rent", points: 8 }, { text: "Weather", points: 7 }] },
            { question: "Name a breakfast food.", answers: [{ text: "Eggs", points: 32 }, { text: "Pancakes / Waffles", points: 22 }, { text: "Cereal", points: 18 }, { text: "Bacon", points: 14 }, { text: "Toast", points: 8 }, { text: "Oatmeal", points: 6 }] },
            { question: "Name something you plug in.", answers: [{ text: "Phone charger", points: 35 }, { text: "TV", points: 22 }, { text: "Lamp", points: 16 }, { text: "Computer", points: 12 }, { text: "Toaster", points: 8 }, { text: "Hair dryer", points: 7 }] },
        ],
        [
            { question: "Name a type of shoe.", answers: [{ text: "Sneakers", points: 35 }, { text: "Heels", points: 22 }, { text: "Boots", points: 18 }, { text: "Sandals", points: 12 }, { text: "Loafers", points: 8 }, { text: "Flip flops", points: 5 }] },
            { question: "Name a household chore.", answers: [{ text: "Dishes", points: 28 }, { text: "Laundry", points: 26 }, { text: "Vacuuming", points: 18 }, { text: "Mopping", points: 12 }, { text: "Cooking", points: 10 }, { text: "Taking out trash", points: 6 }] },
            { question: "Name something you see at a park.", answers: [{ text: "Trees", points: 30 }, { text: "Playground / Swings", points: 24 }, { text: "Dogs", points: 18 }, { text: "Bench", points: 12 }, { text: "Pond / Lake", points: 10 }, { text: "Joggers", points: 6 }] },
            { question: "Name a school subject.", answers: [{ text: "Math", points: 38 }, { text: "English", points: 22 }, { text: "Science", points: 18 }, { text: "History", points: 12 }, { text: "Art", points: 6 }, { text: "PE", points: 4 }] },
            { question: "Name something in a sandwich.", answers: [{ text: "Meat / Turkey", points: 35 }, { text: "Cheese", points: 24 }, { text: "Lettuce", points: 16 }, { text: "Tomato", points: 12 }, { text: "Mayo", points: 8 }, { text: "Bread", points: 5 }] },
        ],
    ],

    ku: [
        {
            question: "شتێک بڵێ کە هەمیشە لە گیرفانی پیاواندایە.",
            answers: [
                { text: "مۆبایل", points: 38, alts: ["موبایل", "تەلەفۆن", "تلفون", "فۆن", "گوشی"] },
                { text: "سویچی سەیارە", points: 26, alts: ["سويچ", "سوێچ", "كليلی سەيارە", "سوئیچ", "سویچ"] },
                { text: "جزدان / پارە", points: 18, alts: ["جزدان", "پارە", "پاره", "جزدان پارە", "جیزدان", "پول"] },
                { text: "کلیل", points: 10, alts: ["كلیل", "کلیلەکان", "كليل", "قفل"] },
                { text: "دەستەسڕ", points: 8, alts: ["دەستەسر", "دەستەسڕ", "دستەسڕ", "مەندیل", "مندیل", "دەسمال"] },
            ]
        },
        {
            question: "هۆکارێک بڵێ کە وا لە خوێندکار بکات درەنگ بچێت بۆ قوتابخانە.",
            answers: [
                { text: "خەوی لێکەوتووە", points: 42, alts: ["خەو", "خەوی لیکەوتوە", "خەوی لێکەوتوە", "لەخەو ماوە", "خەوکەوتوو"] },
                { text: "شەقام قەرەباڵغە", points: 24, alts: ["قەرەباڵغ", "ترافیک", "شەقامی قەرەباڵغ", "قەرەباڵخ", "ڕێگا بەندە"] },
                { text: "نەخۆشی", points: 14, alts: ["نەخوشی", "نەخۆش", "نخوشی", "نەخوش", "تەبایی"] },
                { text: "نانی بەیانی نەخواردووە", points: 10, alts: ["نانی بەیانی", "نان نەخواردووە", "نانی نەخواردووە", "بەرانان"] },
                { text: "ئەرکەکەی نەکردووە", points: 6, alts: ["ئەرک", "وانە", "وانەکەی نەکردووە", "تەکلیف نەکردووە"] },
                { text: "باران بارییوە", points: 4, alts: ["باران", "بارین", "هەوا خراپە", "بەفر"] },
            ]
        },
        {
            question: "ناوی خواردنێکی کوردەواری بڵێ.",
            answers: [
                { text: "دۆڵمە", points: 35, alts: ["دولمە", "دۆلمە", "دولمه", "دوڵمە"] },
                { text: "بریانی", points: 28, alts: ["بريانى", "برياني", "بریانى", "بریانی زەربراو"] },
                { text: "یاپراخ", points: 16, alts: ["ياپراخ", "یاپراغ", "ياپراغ", "دۆڵمەی یاپراخ"] },
                { text: "کوبە", points: 10, alts: ["كوبه", "كوبە", "کوبه", "کوبەی برنج"] },
                { text: "تاشکاوی", points: 7, alts: ["تاشکاوى", "تاشكاوى", "تاشكاوی", "تەشریب"] },
                { text: "کفتە", points: 4, alts: ["كفتە", "كفته", "کفته", "کفتەی برنج"] },
            ]
        },
        {
            question: "ناوی شتێک بڵێ کە دەیبەیت بۆ سەیران.",
            answers: [
                { text: "گۆشت بۆ برژاندن", points: 32, alts: ["گۆشت", "گوشت", "کەباب", "کباب", "منقەل", "مەشوی"] },
                { text: "خەڵوز و مەقەڵی", points: 22, alts: ["خەلوز", "مەقەلی", "خەڵوزومەقەڵی", "مەقەلى"] },
                { text: "چایە / قۆری", points: 18, alts: ["چایە", "چا", "قۆری", "قوری", "چای", "ئیستکان"] },
                { text: "بەتانی / فەرش", points: 14, alts: ["بەتانی", "فەرش", "بتانی", "برد", "فەرشە"] },
                { text: "تۆپ", points: 8, alts: ["توپ", "تۆپی پێ", "تۆپ"] },
                { text: "سپیکەر / مۆسیقا", points: 6, alts: ["سپیکەر", "سپيکەر", "مۆسیقا", "موسيقا", "میوزیک"] },
            ]
        },
        {
            question: "دیارییەک کە زۆرترین جار دەدرێت لە بۆنەکاندا.",
            answers: [
                { text: "بۆن (عەتر)", points: 38, alts: ["بۆن", "عەتر", "عەتری", "بون", "پەرفیوم", "ئەتر"] },
                { text: "کاتژمێر", points: 22, alts: ["ساعەت", "كاتژمیر", "ساعات", "کاتژمیر"] },
                { text: "گوڵ", points: 16, alts: ["گول", "گوڵی سوور", "گوڵ ڕۆز", "باخچە"] },
                { text: "پارە", points: 12, alts: ["پاره", "پول", "فلوس", "پارەی نەختینە"] },
                { text: "جلوبەرگ", points: 8, alts: ["جل", "جلوبەرگ", "پۆشاک", "بەرگ"] },
                { text: "شیرینی / شکۆلاتە", points: 4, alts: ["شیرینی", "شکۆلاتە", "شکولاتە", "چکلیت", "چوکلیت"] },
            ]
        },
        {
            question: "شتێک بڵێ کە خەڵکی بەیانی یەکەم کاری دەکەن.",
            answers: [
                { text: "دەستنوێژ / نوێژ", points: 35, alts: ["نوێژ", "نویژ", "دەستنوێژ", "نماز", "نوێژکردن"] },
                { text: "ئاو دەخۆنەوە", points: 22, alts: ["ئاو خواردنەوە", "ئاو دەخونەوە", "ئاو", "ئاوخواردنەوە"] },
                { text: "مۆبایل دەبینن", points: 18, alts: ["مۆبایل", "موبایل", "تەلەفۆن", "فۆن سەیرکردن"] },
                { text: "نانی بەیانی دەخۆن", points: 14, alts: ["نانی بەیانی", "نان خواردن", "بەرانان", "چاشت"] },
                { text: "سەرشۆری دەکەن", points: 7, alts: ["سەرشۆری", "شۆردنەوە", "حەمام", "دوش"] },
                { text: "چا دەکەن", points: 4, alts: ["چای", "چایی", "چا دەکەن", "چا"] },
            ]
        },
        {
            question: "شتێک بڵێ کە لە خانووبەرەدا هەمیشە وون دەبێت.",
            answers: [
                { text: "کلیل", points: 35, alts: ["كلیل", "كليل", "کلیلەکان", "کلیلی ماڵ"] },
                { text: "ڕیمۆتی تەلەفزیۆن", points: 24, alts: ["ڕیمۆت", "ریموت", "ريمۆت", "ڕیمۆتکۆنترۆل"] },
                { text: "مۆبایل", points: 18, alts: ["موبایل", "تەلەفۆن", "فۆن", "گوشی"] },
                { text: "گۆرەوی", points: 12, alts: ["گورەوی", "جوراو", "جۆراب", "گۆرەوی"] },
                { text: "چاویلکە", points: 7, alts: ["عەینک", "ئەینەک", "عەينەك", "چاويلکە"] },
                { text: "قەڵەم", points: 4, alts: ["قەلەم", "قلەم", "پێنووس", "پينوس"] },
            ]
        },
        {
            question: "ناوی وەرزشێک بڵێ کە بە تۆپ یاری دەکرێت.",
            answers: [
                { text: "تۆپی پێ (فوتبۆڵ)", points: 45, alts: ["فوتبۆل", "فوتبول", "فوتبال", "تۆپی پێ", "توپی پی"] },
                { text: "باسکەتبۆڵ", points: 22, alts: ["باسکەتبول", "باسکتبول", "باسکتبال", "سلە"] },
                { text: "ڤۆلیبۆڵ", points: 14, alts: ["ڤولیبول", "فۆلیبۆل", "والیبول", "والیبال"] },
                { text: "تێنس", points: 10, alts: ["تنس", "تينيس", "تینیس", "تێنیس"] },
                { text: "گۆڵف", points: 5, alts: ["گولف", "گۆلف"] },
                { text: "بلیارد", points: 4, alts: ["بلیار", "بلیەرد", "بليارد"] },
            ]
        },
        {
            question: "شتێک بڵێ کە خەڵکی لێی دەترسن.",
            answers: [
                { text: "مار", points: 32, alts: ["مار", "ماران"] },
                { text: "تاریکی", points: 22, alts: ["تاريکى", "تارکی", "تاریکى", "تاریکایەتی"] },
                { text: "بەرزایی", points: 18, alts: ["بەرزايى", "بلندایی", "بلندی"] },
                { text: "مردن", points: 14, alts: ["مەرگ", "مردن", "مرن"] },
                { text: "جاڵجاڵۆکە (پەپوولە)", points: 8, alts: ["جاڵجاڵۆکە", "پەپوولە", "عنکبوت", "تار جاڵ", "جالجالوکە"] },
                { text: "ئاگر", points: 6, alts: ["ئاگر", "ئاگير", "ئاگری"] },
            ]
        },
        {
            question: "هۆکارێک بڵێ کە جووتەکان بۆی شەڕ دەکەن.",
            answers: [
                { text: "پارە", points: 38, alts: ["پاره", "فلوس", "پول", "پارەی"] },
                { text: "خزم و کەسوکار", points: 20, alts: ["خزم", "کەسوکار", "خزمەکان", "ئایلە"] },
                { text: "حەسوودی", points: 16, alts: ["حەسودی", "غیرەتی", "ژانبێنی", "بەغل"] },
                { text: "منداڵەکان", points: 12, alts: ["منداڵ", "ئەوڵاد", "منالەکان", "زاروک"] },
                { text: "ماڵ نەشتنەوە", points: 8, alts: ["ماڵ نەشتنەوە", "خوارتن", "پیسی ماڵ", "ماڵ شتن"] },
                { text: "خواردن", points: 6, alts: ["خواردن", "خوارن", "نان"] },
            ]
        },
        {
            question: "شتێک بڵێ کە کاتی خەو پێویستت پێیە.",
            answers: [
                { text: "بالیف", points: 35, alts: ["بالیف", "سەرینی", "بالشت", "مەخەدە", "سرینی"] },
                { text: "لێف / بەتانی", points: 26, alts: ["لێف", "بەتانی", "لحاف", "لیف", "لحاف و بەتانی"] },
                { text: "تاریکی", points: 16, alts: ["تاريکى", "تارکی", "تاریکایەتی"] },
                { text: "بێدەنگی", points: 12, alts: ["بێدەنگی", "هێمنی", "بیدەنگی"] },
                { text: "AC / هەوای فێنک", points: 7, alts: ["ئەیسی", "AC", "ئاسی", "کولەر", "هەوای فێنک", "هەوای سارد"] },
                { text: "ئالارم", points: 4, alts: ["ئالارم", "زەنگ", "ئالارمی مۆبایل", "ساعەت"] },
            ]
        },
        {
            question: "شتێک بڵێ کە لە حەمامدا هەیە.",
            answers: [
                { text: "سابوون / شامپۆ", points: 32, alts: ["سابوون", "شامپۆ", "سابون", "شامپو", "صابون"] },
                { text: "حەولە", points: 24, alts: ["حەولە", "حوله", "تاوەل", "حوڵە", "خاولی"] },
                { text: "ئاوینە", points: 18, alts: ["ئاوینە", "ئاوينه", "میرات", "مرات", "مێرات"] },
                { text: "فرچە ددان", points: 14, alts: ["فرچەی ددان", "فرچەددان", "فرچەی دان", "فرچه ددان"] },
                { text: "فرچەی سەر", points: 8, alts: ["فرچە", "فرچەی مو", "مشتا", "برس"] },
                { text: "تایلەت پەیپەر", points: 4, alts: ["تایلەت پەیپەر", "کاغەز", "مەندیل", "کلینکس"] },
            ]
        },
        {
            question: "ناوی مۆبایلێکی بەناوبانگ بڵێ.",
            answers: [
                { text: "ئایفۆن (Apple)", points: 42, alts: ["ئایفۆن", "ایفون", "آیفون", "ئابڵ", "اپل", "iPhone", "Apple"] },
                { text: "سامسۆنگ", points: 28, alts: ["سامسونگ", "Samsung", "سامسونج", "سامسنگ"] },
                { text: "شاومی", points: 14, alts: ["شاوومی", "Xiaomi", "شاومي", "ردمی", "Redmi"] },
                { text: "هواوەی", points: 8, alts: ["هواوی", "Huawei", "هواوه", "هواوەى"] },
                { text: "ئۆپۆ", points: 5, alts: ["ئوپو", "Oppo", "اوپو"] },
                { text: "نۆکیا", points: 3, alts: ["نوکیا", "Nokia", "نوكيا"] },
            ]
        },
        {
            question: "شتێک بڵێ کە لە ئافرەت جوانتر دەکات.",
            answers: [
                { text: "مەیکئەپ / خەزانە", points: 32, alts: ["مەیکئەپ", "خەزانە", "میکاب", "میکاپ", "مەیکەپ", "خەزانه"] },
                { text: "جل و بەرگ", points: 24, alts: ["جل", "جلوبەرگ", "پۆشاک", "بەرگ", "لباس"] },
                { text: "مووی سەر", points: 18, alts: ["مووی سەر", "مو", "قژ", "مووی", "موی سەر"] },
                { text: "بۆن / عەتر", points: 12, alts: ["بۆن", "عەتر", "عەتری", "پەرفیوم", "بون"] },
                { text: "پێکەنین", points: 8, alts: ["پیکەنین", "خەنین", "بزە", "پێکەنین", "پيکەنين"] },
                { text: "گوارە / زێڕ", points: 6, alts: ["گوارە", "زێڕ", "ئەلقە", "زير", "توقم", "خشڵ"] },
            ]
        },
        {
            question: "شتێک بڵێ لە سەر مێزی نان هەیە.",
            answers: [
                { text: "نان", points: 30, alts: ["نان", "نانی"] },
                { text: "ئاو / خواردنەوە", points: 24, alts: ["ئاو", "او", "خواردنەوە", "شووشەی ئاو"] },
                { text: "چەقو و چاتاڵ", points: 16, alts: ["چەقو", "چاتاڵ", "کاچوق", "کەفگیر", "قاشخ"] },
                { text: "خوێ", points: 14, alts: ["خوی", "خوێ", "مەلح", "سۆڵت"] },
                { text: "دەستەسڕ", points: 10, alts: ["دەستەسر", "مەندیل", "مندیل", "دەسمال"] },
                { text: "ماستە / ترشی", points: 6, alts: ["ماستە", "ترشی", "ماست", "ترشی و ماست"] },
            ]
        },
        {
            question: "ناوی ئاژەڵێک بڵێ کە لە ماڵەوە دەپەرێنرێت.",
            answers: [
                { text: "پشیلە", points: 32, alts: ["پشیلە", "پشيلە", "کتوو", "کتو", "گربە", "بسی"] },
                { text: "سەگ", points: 30, alts: ["سەگ", "سگ", "کەلب"] },
                { text: "باڵندە / تووتی", points: 16, alts: ["باڵندە", "تووتی", "توتی", "بلبل", "عسفور", "چۆلەکە"] },
                { text: "ماسی", points: 10, alts: ["ماسى", "ماسی ئاکواریم", "ماسی"] },
                { text: "کەروێشک", points: 8, alts: ["کەرویشک", "ئەرنەب", "خرگوش", "کروێشک"] },
                { text: "هامستەر", points: 4, alts: ["هامستر", "هەمستەر"] },
            ]
        },
        {
            question: "ناوی خواردنێکی خێرا (فاست فوود) بڵێ.",
            answers: [
                { text: "بەرگەر", points: 35, alts: ["بەرگەر", "بورگەر", "همبرگر", "برگر", "بەرگر"] },
                { text: "پیتزا", points: 24, alts: ["پیزا", "پيتزا", "pizza", "پيزا"] },
                { text: "شاورما", points: 18, alts: ["شاورمە", "شاورما", "شاورمه", "شەوەرمە"] },
                { text: "سەندویچ", points: 12, alts: ["سەندوویچ", "سانویچ", "ساندوتش", "سندويچ"] },
                { text: "فلافل", points: 7, alts: ["فەلافل", "فلافل", "فلافەل"] },
                { text: "فرایدچکن", points: 4, alts: ["فرایدچکن", "مریشکی برژاو", "چکن", "قەلیەی مریشک"] },
            ]
        },
        {
            question: "شوێنێک بڵێ کە خەڵکی بۆ گەشتوگوزار دەچن.",
            answers: [
                { text: "تورکیا / ئیستانبول", points: 35, alts: ["تورکیا", "توركيا", "ئیستانبول", "استانبول", "ترکیا", "ئةنتاليا"] },
                { text: "دوبەی", points: 25, alts: ["دوبەی", "دبی", "دبەی", "Dubai", "دوبي"] },
                { text: "ئەوروپا", points: 16, alts: ["اوروپا", "ئوروپا", "Europe", "ئةوروپا", "ئەوروپا"] },
                { text: "مالێزیا", points: 10, alts: ["مالیزیا", "ماليزيا", "Malaysia"] },
                { text: "مەسر", points: 8, alts: ["مصر", "مسر", "Egypt", "مەسر"] },
                { text: "ئێران", points: 6, alts: ["ئیران", "ایران", "إيران", "Iran"] },
            ]
        },
        {
            question: "شتێک بڵێ کە تشک یان بێزار ت دەکات.",
            answers: [
                { text: "دەنگی بەرز", points: 30, alts: ["دەنگ", "قسەی بەرز", "دەنگی بلند", "قیژە"] },
                { text: "قسەی خەڵکی", points: 22, alts: ["قسەی خەڵک", "غیبەت", "قسەوقسە", "باسی خەڵک"] },
                { text: "پلاستیک خواردن", points: 16, alts: ["پلاستیک خواردن", "خواردنی دەنگ", "ملچ ملچ"] },
                { text: "درەنگ هاتن", points: 14, alts: ["درەنگ", "دوا کەوتن", "درەنگ کەوتن"] },
                { text: "درۆ", points: 10, alts: ["درو", "درۆکردن", "درو کردن", "خەڵەتاندن"] },
                { text: "گەرمای هەوا", points: 8, alts: ["گەرما", "گەرمی", "هەوای گەرم", "گرمای هەوا"] },
            ]
        },
        {
            question: "شتێک بڵێ کە لە ئۆتۆمبێلدا هەیە.",
            answers: [
                { text: "ئاوینەی رووتان", points: 28, alts: ["ئاوینە", "مرات", "میرات", "ئاوینەی ناو سەیارە"] },
                { text: "ئایەری هەوا", points: 22, alts: ["ئایەری", "ئایاری هەوا", "ئەیەری هەوا", "بالۆنی هەوا", "ئەربەگ", "airbag"] },
                { text: "ڕادیۆ / سپیکەر", points: 18, alts: ["ڕادیۆ", "رادیو", "سپیکەر", "میوزیک"] },
                { text: "چاک / ئەسبابی تەندروستی", points: 14, alts: ["چاک", "ئەسباب", "فێرست ئەید", "سندوقی یارمەتی"] },
                { text: "شووشەی ئاو", points: 10, alts: ["شووشەی ئاو", "شوشەی ئاو", "ئاو", "بوتل"] },
                { text: "شارجەر", points: 8, alts: ["شارژەر", "شارجەری مۆبایل", "شارجر", "چارجەر"] },
            ]
        },
    ],

    // Kurdish Fast Money Questions
    kuFastMoney: [
        [
            {
                question: "ڕەنگێک بڵێ کە بۆ دیوار بەکاردەهێنرێت.", answers: [
                    { text: "سپی", points: 35, alts: ["سپى", "وایت", "white"] },
                    { text: "شین", points: 22, alts: ["شين", "ئاسمانی", "blue"] },
                    { text: "قاوەیی / کرێم", points: 18, alts: ["قاوەیی", "کرێم", "بەیج", "کریم"] },
                    { text: "ڕەش", points: 12, alts: ["رەش", "ڕەشی"] },
                    { text: "زەرد", points: 8, alts: ["زرد", "زەردی"] },
                    { text: "گوڵی", points: 5, alts: ["صورتی", "پینک", "pink"] },
                ]
            },
            {
                question: "شتێک بڵێ کە هەمیشە لێت وون دەبێت.", answers: [
                    { text: "کلیل", points: 38, alts: ["كلیل", "كليل", "کلیلی ماڵ"] },
                    { text: "مۆبایل", points: 24, alts: ["موبایل", "تەلەفۆن", "فۆن", "گوشی"] },
                    { text: "ئاوینە / چاویلکە", points: 16, alts: ["عەینک", "چاویلکە", "ئاوینە", "ئەینەک"] },
                    { text: "جزدان", points: 12, alts: ["جیزدان", "والیت"] },
                    { text: "ڕیمۆت", points: 6, alts: ["ریموت", "ڕیمۆتی"] },
                    { text: "قەڵەم", points: 4, alts: ["قەلەم", "پێنووس", "قلم"] },
                ]
            },
            {
                question: "مانگێک بڵێ کە تێیدا سەیران دەکرێت.", answers: [
                    { text: "نیسان (ئەپریل)", points: 35, alts: ["نیسان", "ئەپریل", "April"] },
                    { text: "ئایار (مای)", points: 25, alts: ["ئایار", "مای", "May"] },
                    { text: "حوزەیران (جوون)", points: 18, alts: ["حوزەیران", "جوون", "June"] },
                    { text: "تەمموز (جولای)", points: 10, alts: ["تەمموز", "جولای", "July"] },
                    { text: "ئەیلوول (سپتمبەر)", points: 8, alts: ["ئەیلوول", "سپتمبەر", "September"] },
                    { text: "ئاب (ئۆگست)", points: 4, alts: ["ئاب", "ئۆگست", "August"] },
                ]
            },
            {
                question: "خواردنێک بڵێ کە قرمچە.", answers: [
                    { text: "چیپس", points: 40, alts: ["چپس", "chips"] },
                    { text: "بسکیت", points: 22, alts: ["بسکویت", "کریکەر"] },
                    { text: "فستق / گوێز", points: 16, alts: ["فستق", "گوێز", "فسته", "بادام"] },
                    { text: "خیار", points: 10, alts: ["خیاری", "خيار"] },
                    { text: "سێو", points: 8, alts: ["سیو", "سیب"] },
                    { text: "پۆپکۆرن", points: 4, alts: ["پوپکورن", "popcorn"] },
                ]
            },
            {
                question: "شتێک بڵێ کە بەیانی بەکاری دەهێنیت.", answers: [
                    { text: "فرچەی ددان", points: 35, alts: ["فرچەددان", "فرچەی دان"] },
                    { text: "مۆبایل", points: 24, alts: ["موبایل", "تەلەفۆن", "فۆن"] },
                    { text: "سابوون / ئاو", points: 16, alts: ["سابوون", "سابون", "ئاو"] },
                    { text: "ئاوینە", points: 12, alts: ["ئاوينه", "مرات"] },
                    { text: "فرچەی سەر", points: 8, alts: ["فرچە", "مشتا", "برس"] },
                    { text: "قاوە / چا", points: 5, alts: ["قاوە", "چایی", "چای", "چا"] },
                ]
            },
        ],
        [
            {
                question: "شوێنێک بڵێ کە ڕیزی درێژ تێدایە.", answers: [
                    { text: "بانک", points: 30, alts: ["بانك", "bank"] },
                    { text: "نانەوایی", points: 24, alts: ["نانەوايى", "نانوایی"] },
                    { text: "نەخۆشخانە", points: 18, alts: ["نەخوشخانە", "خەستەخانە", "هۆسپیتاڵ"] },
                    { text: "فرۆکەخانە", points: 12, alts: ["فروکەخانە", "ئەیرپۆرت", "airport"] },
                    { text: "ڕێکخراوی حکومی", points: 10, alts: ["حکومەت", "فەرمانگە", "دائیرە"] },
                    { text: "سوپەرمارکێت", points: 6, alts: ["سوپەرمارکت", "مارکێت", "market"] },
                ]
            },
            {
                question: "شتێک بڵێ کە ڕیمۆتی هەیە.", answers: [
                    { text: "تەلەفزیۆن", points: 52, alts: ["تلفزیون", "TV", "تیڤی", "تەلەفزیون"] },
                    { text: "ئەیسی / کولەر", points: 18, alts: ["ئەیسی", "کولەر", "AC", "ئاسی"] },
                    { text: "سەیارە", points: 12, alts: ["ئۆتۆمبێل", "ماشین", "car"] },
                    { text: "پەنکە", points: 8, alts: ["فان", "fan"] },
                    { text: "درۆن", points: 6, alts: ["درون", "drone"] },
                    { text: "ئۆتۆمبێلی یاری", points: 4, alts: ["ماشێنی یاری", "RC car"] },
                ]
            },
            {
                question: "هۆکارێک بڵێ کە خەڵکی بۆی ماڵ دەگۆڕن.", answers: [
                    { text: "کار / ئیش", points: 32, alts: ["کار", "ئیش", "شوغل"] },
                    { text: "هاوسەرگیری", points: 24, alts: ["هاوسەرگیری", "عەروسی", "زەواج"] },
                    { text: "ماڵی گەورەتر", points: 18, alts: ["ماڵی گەورەتر", "شوێنی فراوانتر"] },
                    { text: "نرخی کرێ", points: 12, alts: ["کرێ", "ئیجارە", "نرخ"] },
                    { text: "قوتابخانەی باشتر", points: 8, alts: ["قوتابخانە", "خوێندنگا"] },
                    { text: "کێشەی دراوسێ", points: 6, alts: ["دراوسێ", "جێران", "کێشە"] },
                ]
            },
            {
                question: "خواردنێکی بەیانی بڵێ.", answers: [
                    { text: "نان و پەنیر", points: 35, alts: ["نان", "پەنیر", "پەنير", "نان و پنیر"] },
                    { text: "هێلکە", points: 24, alts: ["هيلكە", "هێلکەی برژاو"] },
                    { text: "بەڵا / قەیمەخ", points: 16, alts: ["بەڵا", "قەیمەخ", "قەیماخ", "بەلا"] },
                    { text: "عەسەل", points: 12, alts: ["هەنگوین", "عسل", "عەسەلی"] },
                    { text: "شیر", points: 8, alts: ["شير", "حەلیب"] },
                    { text: "کچکە (سەری شیر)", points: 5, alts: ["کچکە", "سەری شیر", "قشتە"] },
                ]
            },
            {
                question: "شتێک بڵێ کە بە کارەبا کار دەکات.", answers: [
                    { text: "تەلەفزیۆن", points: 30, alts: ["تلفزیون", "TV", "تیڤی"] },
                    { text: "مۆبایل / شارجەر", points: 24, alts: ["مۆبایل", "شارجەر", "موبایل", "شارژەر"] },
                    { text: "فریژ / ساردکەرەوە", points: 18, alts: ["فریژ", "ساردکەرەوە", "ثلاجة"] },
                    { text: "لایت / لامپە", points: 14, alts: ["لایت", "لامپە", "چرا", "ضوء"] },
                    { text: "ئەیسی", points: 8, alts: ["AC", "ئاسی", "کولەر"] },
                    { text: "جاڵجاڵە", points: 6, alts: ["جالجالە", "جەنگ جەنگ"] },
                ]
            },
        ],
    ],
};
