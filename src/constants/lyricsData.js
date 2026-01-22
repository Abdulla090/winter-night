// Lyrics Challenge Data
// Categories: Pop, Rock, Rap, Kurdish, Classics

export const lyricsCategories = [
    {
        id: 'pop',
        title: { en: 'Pop Hits', ku: 'پۆپ' },
        icon: '🎤',
        color: '#ec4899',
    },
    {
        id: 'rock',
        title: { en: 'Rock Classics', ku: 'ڕۆک' },
        icon: '🎸',
        color: '#ef4444',
    },
    {
        id: 'rap',
        title: { en: 'Rap & Hip Hop', ku: 'ڕاپ' },
        icon: '🧢',
        color: '#f59e0b',
    },
    {
        id: 'kurdish',
        title: { en: 'Kurdish Songs', ku: 'گۆرانی کوردی' },
        icon: '☀️',
        color: '#10b981',
    },
    {
        id: 'classics',
        title: { en: 'Oldies / Classics', ku: 'کۆنەکان' },
        icon: '📻',
        color: '#8b5cf6',
    },
];

export const lyricsData = {
    pop: [
        { lyrics: "Baby, baby, baby oh", answer: "Justin Bieber - Baby", hint: "2010 massive hit" },
        { lyrics: "I came in like a wrecking ball", answer: "Miley Cyrus - Wrecking Ball", hint: "Swinging on a ball" },
        { lyrics: "Cause baby, you're a firework", answer: "Katy Perry - Firework", hint: "Explosive song" },
        { lyrics: "Oops, I did it again", answer: "Britney Spears - Oops!... I Did It Again", hint: "Played with your heart" },
        { lyrics: "I got new rules, I count 'em", answer: "Dua Lipa - New Rules", hint: "Don't pick up the phone" },
        { lyrics: "Hello from the other side", answer: "Adele - Hello", hint: "Flip phone in video" },
        { lyrics: "Shake it off, shake it off", answer: "Taylor Swift - Shake It Off", hint: "Haters gonna hate" },
        { lyrics: "I'm in love with the shape of you", answer: "Ed Sheeran - Shape of You", hint: "Boxer video" },
        { lyrics: "Thank you, next", answer: "Ariana Grande - Thank U, Next", hint: "Mean Girls reference" },
        { lyrics: "Is it too late now to say sorry?", answer: "Justin Bieber - Sorry", hint: "Dance video" },
        { lyrics: "Can't feel my face when I'm with you", answer: "The Weeknd - Can't Feel My Face", hint: "Numb" },
        { lyrics: "Call me maybe", answer: "Carly Rae Jepsen - Call Me Maybe", hint: "Give me your number" },
        { lyrics: "Shut up and dance with me", answer: "Walk the Moon - Shut Up and Dance", hint: "Don't dare look back" },
        { lyrics: "We found love in a hopeless place", answer: "Rihanna - We Found Love", hint: "Yellow diamonds" },
        { lyrics: "Despacito", answer: "Luis Fonsi - Despacito", hint: "Slowly in Spanish" },
    ],
    rock: [
        { lyrics: "Is this the real life? Is this just fantasy?", answer: "Queen - Bohemian Rhapsody", hint: "Mama, just killed a man" },
        { lyrics: "It's my life, it's now or never", answer: "Bon Jovi - It's My Life", hint: "Ain't gonna live forever" },
        { lyrics: "Hello darkness, my old friend", answer: "Simon & Garfunkel - The Sound of Silence", hint: "Disturbed cover too" },
        { lyrics: "Sweet child o' mine", answer: "Guns N' Roses - Sweet Child O' Mine", hint: "Iconic guitar riff" },
        { lyrics: "Don't stop believin'", answer: "Journey - Don't Stop Believin'", hint: "Hold on to that feeling" },
        { lyrics: "Another one bites the dust", answer: "Queen - Another One Bites the Dust", hint: "Bass line" },
        { lyrics: "Here comes the sun", answer: "The Beatles - Here Comes the Sun", hint: "Little darling" },
        { lyrics: "Smells like teen spirit", answer: "Nirvana - Smells Like Teen Spirit", hint: "Grunge anthem" },
        { lyrics: "We will, we will rock you", answer: "Queen - We Will Rock You", hint: "Stomp stomp clap" },
        { lyrics: "I love rock 'n' roll", answer: "Joan Jett - I Love Rock 'n' Roll", hint: "Put another dime in" },
        { lyrics: "Eye of the tiger", answer: "Survivor - Eye of the Tiger", hint: "Rocky movie" },
        { lyrics: "Livin' on a prayer", answer: "Bon Jovi - Livin' on a Prayer", hint: "Halfway there" },
        { lyrics: "Welcome to the jungle", answer: "Guns N' Roses - Welcome to the Jungle", hint: "We got fun and games" },
        { lyrics: "Highway to hell", answer: "AC/DC - Highway to Hell", hint: "No stop signs" },
        { lyrics: "Imagine all the people", answer: "John Lennon - Imagine", hint: "Living life in peace" },
    ],
    rap: [
        { lyrics: "His palms are sweaty, knees weak, arms are heavy", answer: "Eminem - Lose Yourself", hint: "Mom's spaghetti" },
        { lyrics: "I like it when you call me Big Poppa", answer: "Notorious B.I.G. - Big Poppa", hint: "Hands in the air" },
        { lyrics: "Started from the bottom now we here", answer: "Drake - Started From the Bottom", hint: "Whole team here" },
        { lyrics: "Gold digger", answer: "Kanye West - Gold Digger", hint: "She take my money" },
        { lyrics: "In da club", answer: "50 Cent - In Da Club", hint: "Go shawty" },
        { lyrics: "Empire state of mind", answer: "Jay-Z - Empire State of Mind", hint: "New York" },
        { lyrics: "Gangsta's paradise", answer: "Coolio - Gangsta's Paradise", hint: "Valley of the shadow of death" },
        { lyrics: "Hotline bling", answer: "Drake - Hotline Bling", hint: "Call me on my cell phone" },
        { lyrics: "Humble", answer: "Kendrick Lamar - HUMBLE.", hint: "Sit down" },
        { lyrics: "Old town road", answer: "Lil Nas X - Old Town Road", hint: "Horses in the back" },
        { lyrics: "This looks like a job for me", answer: "Eminem - Without Me", hint: "Guess who's back" },
        { lyrics: "God's plan", answer: "Drake - God's Plan", hint: "I only love my bed" },
        { lyrics: "Super bass", answer: "Nicki Minaj - Super Bass", hint: "Boom badoom boom" },
        { lyrics: "California love", answer: "2Pac - California Love", hint: "Knows how to party" },
        { lyrics: "Hey ya!", answer: "OutKast - Hey Ya!", hint: "Shake it like a polaroid" },
    ],
    kurdish: [
        { lyrics: "Nazdar nazdar nazdary mn", answer: "Hassan Zirak - Nazdar", hint: "Classic folk song" },
        { lyrics: "Ke dabe, ke dabe", answer: "Hardy Salami - Ke Dabe", hint: "Modern pop" },
        { lyrics: "Amro sale taza ya", answer: "Newroz Song", hint: "Spring celebration" },
        { lyrics: "Xozga xozga", answer: "Xozga - Famous Ballad", hint: "Wishful thinking" },
        { lyrics: "Baran barana", answer: "Baran - Folk", hint: "Rain rain" },
        { lyrics: "Lorke lorke", answer: "Lorke - Dance Song", hint: "Wedding favorite" },
        { lyrics: "Ay felek boche", answer: "Ay Felek - Sad Song", hint: "Complaining to destiny" },
        { lyrics: "Shirin shirin", answer: "Shirin - Love Song", hint: "Sweet sweet" },
        { lyrics: "Wara wara", answer: "Wara - Invitation", hint: "Come come" },
        { lyrics: "Gula baxan", answer: "Gula Baxan", hint: "Garden flowers" },
        { lyrics: "Saz leyda", answer: "Saz - Instrument", hint: "Play the instrument" },
        { lyrics: "Krash", answer: "Navid Zardi - Krash", hint: "Modern hit" },
        { lyrics: "Zana zana", answer: "Zana - Dance", hint: "Energetic beat" },
        { lyrics: "Lem bbura", answer: "Lem Bbura - Apology", hint: "Forgive me" },
        { lyrics: "Dli mn", answer: "Dli Mn - My Heart", hint: "Romantic" },
    ],
    classics: [
        { lyrics: "My heart will go on", answer: "Celine Dion - My Heart Will Go On", hint: "Titanic theme" },
        { lyrics: "I will always love you", answer: "Whitney Houston - I Will Always Love You", hint: "And I..." },
        { lyrics: "Billie Jean is not my lover", answer: "Michael Jackson - Billie Jean", hint: "Kid is not my son" },
        { lyrics: "Take on me", answer: "a-ha - Take On Me", hint: "High note" },
        { lyrics: "Girls just want to have fun", answer: "Cyndi Lauper - Girls Just Want to Have Fun", hint: "Phone rings in the middle of the night" },
        { lyrics: "Sweet dreams are made of this", answer: "Eurythmics - Sweet Dreams", hint: "Who am I to disagree" },
        { lyrics: "Every breath you take", answer: "The Police - Every Breath You Take", hint: "I'll be watching you" },
        { lyrics: "Beat it", answer: "Michael Jackson - Beat It", hint: "No one wants to be defeated" },
        { lyrics: "Like a prayer", answer: "Madonna - Like a Prayer", hint: "Down on my knees" },
        { lyrics: "Total eclipse of the heart", answer: "Bonnie Tyler - Total Eclipse of the Heart", hint: "Turn around bright eyes" },
        { lyrics: "Africa", answer: "Toto - Africa", hint: "Bless the rains" },
        { lyrics: "Don't stop me now", answer: "Queen - Don't Stop Me Now", hint: "Having a good time" },
        { lyrics: "Dancing queen", answer: "ABBA - Dancing Queen", hint: "Young and sweet, only 17" },
        { lyrics: "Stayin' alive", answer: "Bee Gees - Stayin' Alive", hint: "Disco walk" },
        { lyrics: "Careless whisper", answer: "George Michael - Careless Whisper", hint: "Guilty feet" },
    ]
};

// Get lyrics by category
export const getLyrics = (categoryId, language = 'en') => {
    // If request is for Kurdish but category is not Kurdish, return English but UI handles it
    // The lyrics content itself is language-agnostic mostly (names/lyrics)
    // Only the 'kurdish' category has specific Kurdish content

    const categoryData = lyricsData[categoryId];

    if (!categoryData) {
        // Return random mix
        const all = [];
        Object.keys(lyricsData).forEach(key => {
            all.push(...lyricsData[key]);
        });
        return all.sort(() => Math.random() - 0.5);
    }

    return categoryData.sort(() => Math.random() - 0.5);
};

export const getCategoryById = (id) => {
    return lyricsCategories.find(cat => cat.id === id);
};
