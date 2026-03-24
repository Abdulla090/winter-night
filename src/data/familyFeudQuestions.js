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
            question: "Name something a teacher confiscates from students.",
            answers: [
                { text: "Phone", points: 42 },
                { text: "Gum", points: 20 },
                { text: "Toys", points: 14 },
                { text: "Notes / Letters", points: 10 },
                { text: "Candy", points: 8 },
                { text: "Earbuds", points: 6 },
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
            question: "Name something people check before leaving the house.",
            answers: [
                { text: "Phone / Wallet / Keys", points: 38 },
                { text: "Appearance / Mirror", points: 22 },
                { text: "Locked the door", points: 16 },
                { text: "Weather", points: 12 },
                { text: "Stove / Oven off", points: 8 },
                { text: "Time", points: 4 },
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
        {
            question: "Name something you'd find in a hotel room.",
            answers: [
                { text: "Bed", points: 35 },
                { text: "TV", points: 22 },
                { text: "Towels", points: 16 },
                { text: "Bible / Book", points: 10 },
                { text: "Mini fridge", points: 8 },
                { text: "Safe", points: 5 },
                { text: "Iron", points: 4 },
            ]
        },
        {
            question: "Name a reason someone might call in sick.",
            answers: [
                { text: "Cold / Flu", points: 38 },
                { text: "Headache", points: 20 },
                { text: "Stomach ache", points: 16 },
                { text: "Faking it", points: 12 },
                { text: "Doctor appointment", points: 8 },
                { text: "Back pain", points: 6 },
            ]
        },
        {
            question: "Name something that makes a lot of noise.",
            answers: [
                { text: "Construction", points: 28 },
                { text: "Baby crying", points: 22 },
                { text: "Dog barking", points: 18 },
                { text: "Car horn", points: 14 },
                { text: "Thunder", points: 10 },
                { text: "Alarm clock", points: 8 },
            ]
        },
        {
            question: "Name an excuse for speeding.",
            answers: [
                { text: "Late for work", points: 38 },
                { text: "Didn't see the sign", points: 22 },
                { text: "Emergency", points: 18 },
                { text: "Going with traffic", points: 12 },
                { text: "Bathroom urgency", points: 6 },
                { text: "New to area", points: 4 },
            ]
        },
        {
            question: "Name something at a gas station.",
            answers: [
                { text: "Gas pumps", points: 35 },
                { text: "Snacks / Candy", points: 22 },
                { text: "Drinks / Coffee", points: 16 },
                { text: "Restroom", points: 12 },
                { text: "Car wash", points: 8 },
                { text: "Lottery tickets", points: 7 },
            ]
        },
        {
            question: "Name a common new year's resolution.",
            answers: [
                { text: "Lose weight", points: 42 },
                { text: "Save money", points: 22 },
                { text: "Eat healthier", points: 14 },
                { text: "Quit smoking", points: 10 },
                { text: "Read more", points: 7 },
                { text: "Travel more", points: 5 },
            ]
        },
        {
            question: "Name something you take to the gym.",
            answers: [
                { text: "Water bottle", points: 32 },
                { text: "Towel", points: 24 },
                { text: "Phone / Headphones", points: 18 },
                { text: "Gym bag", points: 12 },
                { text: "Change of clothes", points: 8 },
                { text: "Protein shake", points: 6 },
            ]
        },
        {
            question: "Name a popular board game.",
            answers: [
                { text: "Monopoly", points: 38 },
                { text: "Chess", points: 22 },
                { text: "Scrabble", points: 14 },
                { text: "Clue", points: 10 },
                { text: "Risk", points: 8 },
                { text: "Checkers", points: 8 },
            ]
        },
        {
            question: "Name something in a kitchen drawer.",
            answers: [
                { text: "Knives / Utensils", points: 35 },
                { text: "Can opener", points: 20 },
                { text: "Batteries", points: 14 },
                { text: "Tape / Scissors", points: 12 },
                { text: "Menus / Flyers", points: 10 },
                { text: "Rubber bands", points: 5 },
                { text: "Pens", points: 4 },
            ]
        },
        {
            question: "Name something you'd find in a school backpack.",
            answers: [
                { text: "Books / Notebooks", points: 35 },
                { text: "Pencils / Pens", points: 22 },
                { text: "Lunch / Snacks", points: 16 },
                { text: "Phone", points: 12 },
                { text: "Water bottle", points: 8 },
                { text: "Calculator", points: 7 },
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
            question: "شتێک بڵێ کە زۆربەی پیاوان هەمیشە لە گیرفانیاندا هەڵیدەگرن.",
            answers: [
                { text: "مۆبایل", points: 38, alts: ["مۆبایل", "تەلەفۆن", "فۆن", "موبایل", "گۆشی"] },
                { text: "کلیل", points: 26, alts: ["کلیل", "کلیلی ماڵ", "سویچ", "سویچی سەیارە"] },
                { text: "جزدان", points: 18, alts: ["جزدان", "پارە", "قاپکێش"] },
                { text: "دەستەسڕ", points: 10, alts: ["دەستەسڕ", "کلینکس", "مەندیل"] },
                { text: "جگەرە و چەرخ", points: 8, alts: ["جگەرە", "چەرخ", "پاکەت"] }
            ]
        },
        {
            question: "هۆکارێک بڵێ کە وادەکات خوێندکارێک درەنگ بگاتە قوتابخانە.",
            answers: [
                { text: "خەوی لێکەوتووە", points: 42, alts: ["خەوی لێکەوتووە", "درەنگ هەستاوە", "خەو", "نووستووە"] },
                { text: "ترافیک", points: 24, alts: ["ترافیک", "قەرەباڵغی شەقام", "ڕێگا بەندە", "قەرەباڵغی"] },
                { text: "نەخۆشی", points: 14, alts: ["نەخۆشی", "نەخۆش کەوتووە", "تەندروستی"] },
                { text: "خراپی کەشوهەوا", points: 10, alts: ["کەشوهەوا", "باران", "بەفر", "سەرما"] },
                { text: "درەنگ ئامادەبوون", points: 6, alts: ["درەنگ خۆی گۆڕیوە", "نانی نەخواردووە", "دواکەوتووە لە خۆگۆڕین"] },
                { text: "پاس نەهاتووە", points: 4, alts: ["پاس", "سەیارە نەبووە", "خەت نەهاتووە"] }
            ]
        },
        {
            question: "ناوی ژەمە خواردنێکی بەناوبانگی کوردەواری بڵێ.",
            answers: [
                { text: "دۆڵمە / یاپراخ", points: 35, alts: ["دۆڵمە", "یاپراخ", "دۆلمە"] },
                { text: "بریانی", points: 28, alts: ["بریانی", "برنج و گۆشت"] },
                { text: "کەباب", points: 16, alts: ["کەباب", "گۆشتی برژاو", "تکە"] },
                { text: "کفتە", points: 10, alts: ["کفتە", "کفتەی برنج", "کفتەی گۆشت"] },
                { text: "سەروپێ", points: 7, alts: ["سەروپێ", "پاچە"] },
                { text: "قەلیە", points: 4, alts: ["قەلیە", "شلە", "برنج و شلە"] }
            ]
        },
        {
            question: "شتێک بڵێ کە خەڵکی دەیبەن بۆ سەیران و گەشت.",
            answers: [
                { text: "گۆشت و کەباب", points: 32, alts: ["گۆشت", "کەباب", "مریشک", "تکە"] },
                { text: "خەڵوز و مەقەڵی", points: 22, alts: ["خەڵوز", "مەقەڵی", "ئاگر", "شیش"] },
                { text: "چا و چادان", points: 18, alts: ["چا", "چادان", "قۆری", "کتری", "سەماوەر"] },
                { text: "بەتانی و فەرش", points: 14, alts: ["بەتانی", "فەرش", "حەسیر", "ڕایەخ"] },
                { text: "تۆپ و یاری", points: 8, alts: ["تۆپ", "یاری", "تۆپی پێ", "تاوڵە"] },
                { text: "سەماعە / مۆسیقا", points: 6, alts: ["سەماعە", "سپیکەر", "مۆسیقا", "دەنگ"] }
            ]
        },
        {
            question: "دیارییەک بڵێ کە زۆرجار لە بۆنەکاندا دەبەخشرێت.",
            answers: [
                { text: "بۆن / عەتر", points: 38, alts: ["بۆن", "عەتر", "پەرفیوم"] },
                { text: "پارە", points: 22, alts: ["پارە", "نەقد"] },
                { text: "گوڵ", points: 16, alts: ["گوڵ", "چەپکە گوڵ", "گوڵی سروشتی"] },
                { text: "جلوبەرگ", points: 12, alts: ["جل", "جلوبەرگ", "پۆشاک", "بەرگ"] },
                { text: "کاتژمێر", points: 8, alts: ["کاتژمێر", "سەعات"] },
                { text: "زێڕ و خشڵ", points: 4, alts: ["زێڕ", "خشڵ", "ملوانکە", "ئەڵقە"] }
            ]
        },
        {
            question: "یەکەم شت کە زۆربەی خەڵک بەیانیان دوای لەخەوهەستان دەیکەن چییە؟",
            answers: [
                { text: "دەموچاو شوشتن", points: 35, alts: ["دەموچاو شوشتن", "ئاو بەخۆداکردن", "ددان شوشتن", "حەمام"] },
                { text: "سەیرکردنی مۆبایل", points: 22, alts: ["سەیرکردنی مۆبایل", "تەلەفۆن", "سەیرکردنی کات"] },
                { text: "نوێژکردن", points: 18, alts: ["نوێژکردن", "نوێژ", "دەستنوێژ"] },
                { text: "ئاودەست / توالێت", points: 14, alts: ["توالێت", "ئاودەست", "چوونە توالێت"] },
                { text: "چاخواردنەوە", points: 7, alts: ["چاخواردنەوە", "چای", "ئاو خواردنەوە"] },
                { text: "نانی بەیانی", points: 4, alts: ["نانی بەیانی", "نان", "نان خواردن"] }
            ]
        },
        {
            question: "شتێک بڵێ کە زۆرجار لە ماڵەوە لێت ون دەبێت.",
            answers: [
                { text: "ڕیمۆتی تەلەفزیۆن", points: 35, alts: ["ڕیمۆت", "ڕیمۆن کۆنتڕۆڵ", "ڕیمۆتی تیڤی"] },
                { text: "کلیل", points: 24, alts: ["کلیل", "کلیلی ماڵ", "سویچ", "سویچی سەیارە"] },
                { text: "مۆبایل", points: 18, alts: ["مۆبایل", "تەلەفۆن", "گۆشی"] },
                { text: "گۆرەوی", points: 12, alts: ["گۆرەوی", "جووتێک گۆرەوی"] },
                { text: "چاویلکە", points: 7, alts: ["چاویلکە", "عەینەک", "منازر"] },
                { text: "قەڵەم", points: 4, alts: ["قەڵەم", "پێنووس"] }
            ]
        },
        {
            question: "ناوی وەرزشێک بڵێ کە بە تۆپ دەکرێت.",
            answers: [
                { text: "تۆپی پێ", points: 45, alts: ["تۆپی پێ", "فوتبۆڵ", "یاسە"] },
                { text: "باسکە", points: 22, alts: ["باسکە", "باسکەتبۆڵ", "سەلە"] },
                { text: "بالە", points: 14, alts: ["بالە", "ڤۆلیبۆڵ"] },
                { text: "تێنس", points: 10, alts: ["تێنس", "تێنسی سەرمێز", "تێنیسی زەوی"] },
                { text: "گۆڵف", points: 5, alts: ["گۆڵف"] },
                { text: "بلیارد", points: 4, alts: ["بلیارد", "پلارد"] }
            ]
        },
        {
            question: "شتێک بڵێ کە زۆربەی مرۆڤەکان لێی دەترسن.",
            answers: [
                { text: "مردن", points: 32, alts: ["مردن", "مەرگ", "کۆتایی ژیان"] },
                { text: "تاریکی", points: 22, alts: ["تاریکی", "شەو", "تاریک"] },
                { text: "بەرزی", points: 18, alts: ["بەرزی", "چوونە سەرەوە", "بەرزایی"] },
                { text: "مار و دووپشک", points: 14, alts: ["مار", "دووپشک", "حەشەرات", "زیندەوەر"] },
                { text: "نەخۆشی", points: 8, alts: ["نەخۆشی", "شێرپەنجە", "دەرد"] },
                { text: "هەژاری", points: 6, alts: ["هەژاری", "بێ پارەیی", "نەبوونی"] }
            ]
        },
        {
            question: "هۆکارێکی باو بڵێ کە ژن و مێرد شەڕی لەسەر دەکەن.",
            answers: [
                { text: "کێشەی دارایی و پارە", points: 38, alts: ["پارە", "هەژاری", "خەرجی", "بێ پارەیی"] },
                { text: "خزم و کەسوکار", points: 20, alts: ["خزم", "ماڵی خەزوور", "کەسوکار", "خێزان"] },
                { text: "ئیرەیی و گومان", points: 16, alts: ["ئیرەیی", "غیرە", "گومان", "مۆبایل سەیرکردن"] },
                { text: "پەروەردەی منداڵ", points: 12, alts: ["منداڵ", "داواکاری منداڵ", "گوێڕایەڵی منداڵ"] },
                { text: "ئیشی ماڵەوە", points: 8, alts: ["ئیشی ماڵ", "پاککردنەوە", "گرنگینەدان بە ماڵ"] },
                { text: "پشتگوێخستن", points: 6, alts: ["گرنگی نەدان", "بێباکی", "کاتی بەتاڵ"] }
            ]
        },
        {
            question: "شتێک بڵێ کە بۆ خەوێکی ئارام پێویستت پێیەتی.",
            answers: [
                { text: "تاریکی", points: 35, alts: ["تاریکی", "کوژاندنەوەی گڵۆپ", "تاریک"] },
                { text: "بێدەنگی", points: 26, alts: ["بێدەنگی", "هێمنی", "ئارامی"] },
                { text: "سەرین / باڵیف", points: 16, alts: ["سەرین", "باڵیف", "مەخەدە"] },
                { text: "دۆشەک / جێگە", points: 12, alts: ["جێگە", "قەرەوێڵە", "دۆشەک", "لێفە"] },
                { text: "پلەی گەرمی گونجاو", points: 7, alts: ["فێنکی", "سپلیت", "ئامێری فێنککەرەوە", "ساردی", "گەرمی"] },
                { text: "ماندوویەتی", points: 4, alts: ["ماندوویەتی", "هیلاکی", "خەواڵوویی"] }
            ]
        },
        {
            question: "ناوی ئامێرێک یان کەرەستەیەک بڵێ کە لە حەمامدا بەکاردێت.",
            answers: [
                { text: "شامپۆ / سابوون", points: 32, alts: ["شامپۆ", "سابوون"] },
                { text: "خاولی", points: 24, alts: ["خاولی", "خاولی سەر", "حەولە"] },
                { text: "ئیسفەنج / لک", points: 18, alts: ["ئیسفەنج", "لک", "فەرخە", "کیسە"] },
                { text: "ئاوێنە", points: 14, alts: ["ئاوێنە", "مەرا"] },
                { text: "گوێزان / مەکینە", points: 8, alts: ["گوێزان", "مەکینەی موتاشین", "مەکینە"] },
                { text: "فڵچەی ددان", points: 4, alts: ["فڵچەی ددان", "هەویری ددان"] }
            ]
        },
        {
            question: "شتێک بڵێ کە ئافرەتان بۆ جوانکاری بەکاری دەهێنن.",
            answers: [
                { text: "مەیکئەپ / مکیاژ", points: 42, alts: ["مەیکئەپ", "مکیاژ", "کرێم", "سوراو"] },
                { text: "بۆن و عەتر", points: 28, alts: ["بۆن", "عەتر"] },
                { text: "زێڕ و خشڵ", points: 14, alts: ["زێڕ", "خشڵ", "گەردانە", "ئەڵقە"] },
                { text: "بۆیەی نینۆک", points: 8, alts: ["بۆیەی نینۆک", "بۆیە", "نینۆک"] },
                { text: "بۆیەی قژ", points: 5, alts: ["بۆیەی قژ", "قژبڕین", "تسریحە"] },
                { text: "جلی جوان", points: 3, alts: ["جل", "قات", "عەزی", "جلوبەرگ"] }
            ]
        },
        {
            question: "ناوی ئاژەڵێکی ماڵی بڵێ کە مرۆڤ بەخێوی دەکات.",
            answers: [
                { text: "پشیلە", points: 32, alts: ["پشیلە", "کتک"] },
                { text: "سەگ", points: 30, alts: ["سەگ", "پاسەوان", "تووتکە"] },
                { text: "باڵندە / کۆتر", points: 16, alts: ["باڵندە", "کۆتر", "تووتی", "بولبول"] },
                { text: "مەڕ و بزن", points: 10, alts: ["مەڕ", "بزن", "ئاژەڵ", "مەڕوماڵات"] },
                { text: "مریشک", points: 8, alts: ["مریشک", "پەلەوەر", "قەل", "کەڵەشێر"] },
                { text: "مانگا", points: 4, alts: ["مانگا", "چێڵ"] }
            ]
        },
        {
            question: "ناوی جۆرێک لە خواردنی خێرا (فاست فوود) بڵێ.",
            answers: [
                { text: "بەرگر / هەمبەرگر", points: 35, alts: ["بەرگر", "هەمبەرگر"] },
                { text: "پیتزا", points: 24, alts: ["پیتزا"] },
                { text: "شەوارمە / گەس", points: 18, alts: ["شەوارمە", "گەس", "قەس"] },
                { text: "ساندویچ", points: 12, alts: ["ساندویچ", "لەفە"] },
                { text: "کنتاکی", points: 7, alts: ["کنتاکی", "فراید چکن", "مریشکی برژاو"] },
                { text: "فەلافل", points: 4, alts: ["فەلافل", "نۆک"] }
            ]
        },
        {
            question: "وڵاتێک بڵێ کە کورد زۆر بۆ گەشتیاری دەچنە ئەوێ.",
            answers: [
                { text: "تورکیا", points: 35, alts: ["تورکیا", "ئیستەنبوڵ", "ئەنتالیا"] },
                { text: "ئێران", points: 25, alts: ["ئێران", "تاران", "باکوور", "شیمال"] },
                { text: "ئیمارات", points: 16, alts: ["ئیمارات", "دوبەی"] },
                { text: "لوبنان", points: 10, alts: ["لوبنان", "بەیروت"] },
                { text: "میسر", points: 8, alts: ["میسر", "قاهیرە", "شەرم شێخ"] },
                { text: "ئەوروپا", points: 6, alts: ["ئەوروپا", "بەریتانیا", "ئەڵمانیا"] }
            ]
        },
        {
            question: "شتێک بڵێ کە مرۆڤ زۆر تووڕە و بێزار دەکات.",
            answers: [
                { text: "درۆکردن", points: 30, alts: ["درۆکردن", "درۆ", "خەڵەتاندن"] },
                { text: "دووڕوویی", points: 22, alts: ["دووڕوویی", "فێڵ", "مونافیقی"] },
                { text: "چاوەڕوانی", points: 16, alts: ["چاوەڕوانی", "درەنگ کەوتن", "دواکەوتن"] },
                { text: "دەنگی بەرز / ژاوەژاو", points: 14, alts: ["دەنگی بەرز", "ژاوەژاو", "هاوارکردن"] },
                { text: "بێڕێزی", points: 10, alts: ["بێڕێزی", "قسەی سووک", "بێ ئەدەبی"] },
                { text: "قەرەباڵغی ترافیک", points: 8, alts: ["ترافیک", "ئیزدحام", "شەقام"] }
            ]
        },
        {
            question: "بەشێکی سەرەکی لە ناوەوەی ئۆتۆمبێل بڵێ.",
            answers: [
                { text: "سوکان", points: 28, alts: ["سوکان", "ستێرن"] },
                { text: "کوشن", points: 22, alts: ["کوشن", "کورسی", "جێدانیشتن"] },
                { text: "دەشبول / شاشە", points: 18, alts: ["دەشبول", "شاشە", "ڕادیۆ", "سیستەمی دەنگ"] },
                { text: "ئاوێنە", points: 14, alts: ["ئاوێنە", "ئاوێنەی ناوەوە"] },
                { text: "گێڕ", points: 10, alts: ["گێڕ", "دەسکی گێڕ"] },
                { text: "پێداڵەکان", points: 8, alts: ["پێداڵ", "برێک", "بەنیزن", "کلەچ"] }
            ]
        },
        {
            question: "شوێنێک بڵێ کە زۆرجار قەرەباڵغی و ڕیزی تێدایە.",
            answers: [
                { text: "نەخۆشخانە", points: 30, alts: ["نەخۆشخانە", "نۆرینگە", "دکتۆر"] },
                { text: "بانک", points: 24, alts: ["بانک", "مووچە", "فەرمانگە"] },
                { text: "نانەوایی", points: 18, alts: ["نانەوایی", "سەمونخانە"] },
                { text: "فڕۆکەخانە", points: 12, alts: ["فڕۆکەخانە", "تەیارەخانە"] },
                { text: "بەنزینخانە", points: 10, alts: ["بەنزینخانە", "وێستگەی بەنزین"] },
                { text: "سوپەرمارکێت", points: 6, alts: ["سوپەرمارکێت", "مارکێت", "بازاڕ"] }
            ]
        },
        {
            question: "ماددەیەک بڵێ کە لە دروستکردنی زۆربەی شیرینییەکاندا هەیە.",
            answers: [
                { text: "شەکر", points: 40, alts: ["شەکر"] },
                { text: "ئارد", points: 25, alts: ["ئارد"] },
                { text: "ڕۆن / کەرە", points: 15, alts: ["ڕۆن", "کەرە", "زەیت"] },
                { text: "هێلکە", points: 10, alts: ["هێلکە"] },
                { text: "ڤانێلا", points: 6, alts: ["ڤانێلا", "ڤانێلیا"] },
                { text: "شیر", points: 4, alts: ["شیر", "ئاو"] }
            ]
        },
        {
            question: "شتێک بڵێ کە لە هاتنەوەی لە سەفەرەوە دەیکڕیت بۆ خزم.",
            answers: [
                { text: "شیرینی / شوکولاتە", points: 35, alts: ["شیرینی", "شوکولاتە", "حەلوا"] },
                { text: "جل و بەرگ", points: 22, alts: ["جل", "بەرگ", "پۆشاک"] },
                { text: "بۆن / عەتر", points: 18, alts: ["بۆن", "عەتر", "پەرفیوم"] },
                { text: "خشڵ و زێڕ", points: 12, alts: ["خشڵ", "زێڕ", "گەردانە"] },
                { text: "چا و قاوە", points: 8, alts: ["چا", "قاوە", "چای تورکی"] },
                { text: "ئامێری ئەلیکترۆنی", points: 5, alts: ["مۆبایل", "ئامێر"] }
            ]
        },
        {
            question: "ئامێرێک بڵێ کە خوێندکاران بەکاری دەهێنن لە قوتابخانە.",
            answers: [
                { text: "قەڵەم / پێنووس", points: 35, alts: ["قەڵەم", "پێنووس", "خۆدکار"] },
                { text: "دەفتەر", points: 24, alts: ["دەفتەر", "نووسینگە", "کتێب"] },
                { text: "ماسە / مەسکی", points: 16, alts: ["ماسە", "مەسکی", "لارق"] },
                { text: "ژمارەک", points: 10, alts: ["ژمارەک", "حاسیبە", "کالکولەیتەر"] },
                { text: "تابلێت / لاپتۆپ", points: 8, alts: ["تابلێت", "لاپتۆپ", "کۆمپیوتەر"] },
                { text: "جانتا", points: 7, alts: ["جانتا", "شانتا", "کیسە"] }
            ]
        },
        {
            question: "شتێک بڵێ کە لە بازاڕدا زۆر دەفرۆشرێت.",
            answers: [
                { text: "جل و بەرگ", points: 30, alts: ["جل", "بەرگ", "پۆشاک", "قات"] },
                { text: "میوە و سەوزە", points: 24, alts: ["میوە", "سەوزە", "تەرەوە"] },
                { text: "گۆشت", points: 18, alts: ["گۆشت", "مریشک", "ماسی"] },
                { text: "مۆبایل", points: 12, alts: ["مۆبایل", "گۆشی", "تەلەفۆن"] },
                { text: "خواردنی ئامادە", points: 8, alts: ["فاست فوود", "ساندویچ"] },
                { text: "زێڕ و خشڵ", points: 8, alts: ["زێڕ", "خشڵ", "ملوانکە"] }
            ]
        },
        {
            question: "شتێک بڵێ کە خەڵکی لە مانگی ڕەمەزاندا زیاتر دەیکەن.",
            answers: [
                { text: "نوێژکردن", points: 35, alts: ["نوێژکردن", "نوێژ", "عیبادەت"] },
                { text: "قورئان خوێندنەوە", points: 24, alts: ["قورئان", "خوێندنەوەی قورئان"] },
                { text: "خواردن ئامادەکردن", points: 16, alts: ["خواردن", "چێشت", "ئیفتار"] },
                { text: "سەردانی خزم", points: 12, alts: ["سەردانی خزم", "سەردان"] },
                { text: "صەدەقە و خێرخوازی", points: 8, alts: ["صەدەقە", "خێرخوازی", "زەکات"] },
                { text: "سەیرکردنی تەلەفزیۆن", points: 5, alts: ["تەلەفزیۆن", "سیریال"] }
            ]
        },
        {
            question: "شتێک بڵێ کە بۆ عەروسی پێویستە.",
            answers: [
                { text: "هۆڵی ئاهەنگ", points: 32, alts: ["هۆڵ", "هۆڵی عەروسی", "دەفتەر"] },
                { text: "جلی بووک و زاوا", points: 24, alts: ["جلی بووک", "قات", "کراس"] },
                { text: "گوڵ و ڕازاندنەوە", points: 16, alts: ["گوڵ", "ڕازاندنەوە", "دیکۆر"] },
                { text: "خواردن و کێک", points: 14, alts: ["خواردن", "کێک", "نان"] },
                { text: "مۆسیقا و گۆرانی", points: 8, alts: ["مۆسیقا", "گۆرانی", "دی جەی"] },
                { text: "ئاوێنە و مەیکئەپ", points: 6, alts: ["ئاوێنە", "مەیکئەپ"] }
            ]
        }
    ],

    // Kurdish Fast Money Questions
    kuFastMoney: [
        [
            {
                question: "ڕەنگێک بڵێ کە خەڵک حەز دەکەن دیواری ژوورەکەیانی پێ بۆیە بکەن.", answers: [
                    { text: "سپی", points: 35, alts: ["سپی"] },
                    { text: "کرێم / بێجی", points: 22, alts: ["کرێم", "بێجی", "قاوەیی کاڵ"] },
                    { text: "شین / ئاسمانی", points: 18, alts: ["شین", "ئاسمانی"] },
                    { text: "ڕەساسی / خۆڵەمێشی", points: 12, alts: ["ڕەساسی", "خۆڵەمێشی"] },
                    { text: "زەرد / پەمەیی", points: 8, alts: ["زەرد", "پەمەیی"] },
                    { text: "ڕەش", points: 5, alts: ["ڕەش"] }
                ]
            },
            {
                question: "میوەیەک بڵێ کە ڕەنگی سوورە.", answers: [
                    { text: "سێو", points: 38, alts: ["سێو", "سێوی سوور"] },
                    { text: "هەنار", points: 24, alts: ["هەنار"] },
                    { text: "شووتی", points: 16, alts: ["شووتی"] },
                    { text: "شلیک / فەراولە", points: 12, alts: ["شلیک", "فەراولە"] },
                    { text: "گێلاس", points: 6, alts: ["گێلاس", "قەیسی"] },
                    { text: "ترێ", points: 4, alts: ["ترێی سوور", "ترێ"] }
                ]
            },
            {
                question: "مانگێک بڵێ کە پشوو و سەیرانی تێدا زۆرە.", answers: [
                    { text: "نەورۆز / مانگی 3", points: 35, alts: ["نەورۆز", "ئازار", "مارت", "مانگی سێ"] },
                    { text: "نیسان / مانگی 4", points: 25, alts: ["نیسان", "ئەپریل", "مانگی چوار"] },
                    { text: "تەممووز / مانگی 7", points: 18, alts: ["تەممووز", "جولای", "مانگی حەوت"] },
                    { text: "ئاب / مانگی 8", points: 10, alts: ["ئاب", "ئۆگست", "مانگی هەشت"] },
                    { text: "ئایار / مانگی 5", points: 8, alts: ["ئایار", "مایس", "مانگی پێنج"] },
                    { text: "جوون / مانگی 6", points: 4, alts: ["حوزەیران", "جوون", "مانگی شەش"] }
                ]
            },
            {
                question: "خواردنێک بڵێ کە لەکاتی سەیرکردنی فیلمدا دەخورێت.", answers: [
                    { text: "گوڵەبەڕۆژە", points: 40, alts: ["گوڵەبەڕۆژە", "چەرەزات", "ناوکە کولەکە"] },
                    { text: "پۆپکۆڕن", points: 22, alts: ["پۆپکۆڕن", "گەنمەشامی", "شامی"] },
                    { text: "چیپس", points: 16, alts: ["چیپس", "پەتاتە"] },
                    { text: "شیرینی / شوکولاتە", points: 10, alts: ["شیرینی", "شوکولاتە", "نەستەلە"] },
                    { text: "فستق / بادەم", points: 8, alts: ["فستق", "بادەم", "گویز"] },
                    { text: "بسکیت / کێک", points: 4, alts: ["بسکیت", "کێک"] }
                ]
            },
            {
                question: "شتێک کە هەمیشە پێش خەوتن دەیکەیت چییە؟", answers: [
                    { text: "کوژاندنەوەی گڵۆپ", points: 35, alts: ["کوژاندنەوەی گڵۆپ", "تاریککردن", "بڕینی گڵۆپ"] },
                    { text: "ددان شوشتن", points: 24, alts: ["ددان شوشتن", "دەموچاو شوشتن", "غوسل"] },
                    { text: "دانانی ئالارم", points: 16, alts: ["ئالارم", "سەعات دانان"] },
                    { text: "سەیرکردنی مۆبایل", points: 12, alts: ["سەیرکردنی مۆبایل", "مۆبایل", "ئینتەرنێت"] },
                    { text: "نزای خەوتن", points: 8, alts: ["نزا", "دوعا", "سکاڵا", "قورئان"] },
                    { text: "ئاو خواردنەوە", points: 5, alts: ["ئاو خواردنەوە", "ئاو"] }
                ]
            }
        ],
        [
            {
                question: "ئامێرێکی کارەبایی بڵێ کە لە هەر ماڵێکدا پێویستە.", answers: [
                    { text: "سەلاجە", points: 30, alts: ["سەلاجە", "بەفرگر", "ساردکەرەوە"] },
                    { text: "جلشۆر", points: 24, alts: ["جلشۆر", "غەسالە"] },
                    { text: "تەلەفزیۆن", points: 18, alts: ["تەلەفزیۆن", "شاشە", "تیڤی"] },
                    { text: "سپلیت", points: 12, alts: ["سپلیت", "موبەریدە", "ئەیسی"] },
                    { text: "گڵۆپ", points: 10, alts: ["گڵۆپ", "کارەبا", "لایت"] },
                    { text: "ئوتوو", points: 6, alts: ["ئوتوو", "ئوتووی جل"] }
                ]
            },
            {
                question: "شتێک بڵێ کە بە کۆنتڕۆڵ (ڕیمۆت) کاردەکات.", answers: [
                    { text: "تەلەفزیۆن", points: 52, alts: ["تەلەفزیۆن", "شاشە", "تیڤی"] },
                    { text: "سپلیت / ئەیسی", points: 18, alts: ["سپلیت", "موبەریدە", "ئەیسی"] },
                    { text: "سەیارە", points: 12, alts: ["سەیارە", "ئۆتۆمبێل", "دەرگای گەراج"] },
                    { text: "ڕیسیڤەر", points: 8, alts: ["ڕیسیڤەر", "سەتەلایت", "ئامێری پەخش"] },
                    { text: "درۆن / فڕۆکەی یاری", points: 6, alts: ["درۆن", "یاری", "فڕۆکە"] },
                    { text: "پانکە", points: 4, alts: ["پانکە", "فان"] }
                ]
            },
            {
                question: "جۆرە خواردنەوەیەکی گەرم بڵێ بۆ زستان.", answers: [
                    { text: "چا", points: 32, alts: ["چا", "چای ڕەش", "چای کوردی"] },
                    { text: "قاوە / نسکافە", points: 24, alts: ["قاوە", "نسکافە", "کۆفی"] },
                    { text: "شۆربا", points: 18, alts: ["شۆربا", "نیسک", "سووپ"] },
                    { text: "شیر", points: 12, alts: ["شیر", "شیری گەرم", "حەلیب"] },
                    { text: "کاکاو", points: 8, alts: ["کاکاو", "هۆت چۆکلێت"] },
                    { text: "چای سەوز", points: 6, alts: ["چای سەوز", "زەنجەبیل", "لیمۆ"] }
                ]
            },
            {
                question: "ئامرازێک یان کەرەستەیەک بڵێ کە لەناو سەیارەدا هەمیشە هەڵدەگیرێت.", answers: [
                    { text: "تایەی یەدەگ / جەگ", points: 35, alts: ["تایەی یەدەگ", "جەگ", "ئامرازی تایە", "سپێر"] },
                    { text: "دەبە ئاو", points: 24, alts: ["دەبە ئاو", "ئاو"] },
                    { text: "ئاگرکوژێنەوە", points: 16, alts: ["ئاگرکوژێنەوە", "تەفایە"] },
                    { text: "کلینکس / دەستەسڕ", points: 12, alts: ["کلینکس", "پاککەرەوە", "دەستەسڕ"] },
                    { text: "سندووقی فریاگوزاری", points: 8, alts: ["سندووقی فریاگوزاری", "دەرمان", "پلاستر"] },
                    { text: "بەلەد", points: 5, alts: ["بەلەد", "کێبڵی پاتری", "اشتراک"] }
                ]
            },
            {
                question: "شوێنێک بڵێ کە خەڵکی بۆ پشوودان ڕووی تێدەکەن.", answers: [
                    { text: "سەیرانگا / چییا", points: 30, alts: ["سەیرانگا", "هاوینەهەوار", "شاخ", "دەرەوەی شار"] },
                    { text: "پاڕک / باخچە", points: 24, alts: ["پاڕک", "باخچە", "حەدیقە"] },
                    { text: "چێشتخانە / کافتریا", points: 18, alts: ["کافتریا", "ڕێستۆرانت", "قاوەخانە", "چایخانە"] },
                    { text: "دەرەوەی وڵات", points: 14, alts: ["گەشت", "سەفەر", "دەرەوەی وڵات", "تورکیا", "ئێران"] },
                    { text: "ماڵەوە", points: 8, alts: ["ماڵەوە", "ماڵ", "ژووری نووستن"] },
                    { text: "مەزەل", points: 6, alts: ["مەزەل", "شوێنی یاری", "مەلەوانگە"] }
                ]
            }
        ]
    ]
};
