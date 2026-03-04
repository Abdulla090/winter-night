// Partners in Crime Data (Couples/Friends Quiz)
// Questions to test how well you know each other

export const partnersData = [
    {
        id: 'favorites',
        title: { en: 'Favorites', ku: 'دڵخوازەکان' },
        questions: [
            { q: { en: "What is their favorite food?", ku: "خواردنی دڵخوازی چییە؟" } },
            { q: { en: "What is their favorite movie genre?", ku: "جۆری فیلمی دڵخوازی چییە؟" } },
            { q: { en: "What is their favorite color?", ku: "ڕەنگی دڵخوازی چییە؟" } },
            { q: { en: "What is their favorite season?", ku: "وەرزی دڵخوازی چییە؟" } },
            { q: { en: "What is their favorite holiday?", ku: "پشووی دڵخوازی چییە؟" } },
        ]
    },
    {
        id: 'habits',
        title: { en: 'Habits', ku: 'وڕووژان' },
        questions: [
            { q: { en: "Are they a morning person or night owl?", ku: "بەیانیانن یان شەوان؟" } },
            { q: { en: "What is their worst habit?", ku: "خراپترین خووی چییە؟" } },
            { q: { en: "Ideally, how would they spend a Saturday night?", ku: "شەوانی شەممە حەز دەکەن چی بکەن؟" } },
            { q: { en: "How do they drink their coffee/tea?", ku: "قاوە/چای چۆن دەخۆنەوە؟" } },
            { q: { en: "What stresses them out the most?", ku: "چی زۆرترین فشاریان لێ دەکات؟" } },
        ]
    },
    {
        id: 'history',
        title: { en: 'History', ku: 'مێژوو' },
        questions: [
            { q: { en: "Where did you first meet?", ku: "یەکەمجار لە کوێ یەکتریتان بینی؟" } },
            { q: { en: "What was your first impression of them?", ku: "یەکەم سەرنجت چی بوو لەسەریان؟" } },
            { q: { en: "What is their fondest childhood memory?", ku: "خۆشترین بیرەوەری منداڵییان چییە؟" } },
            { q: { en: "Who said 'I love you' first? (If applicable)", ku: "کێ یەکەمجار وتی 'خۆشم دەوێیت'؟" } },
            { q: { en: "What is the best trip you've taken together?", ku: "خۆشترین گەشتتان پێکەوە چی بووە؟" } },
        ]
    },
    {
        id: 'random',
        title: { en: 'Random', ku: 'هەڕەمەکی' },
        questions: [
            { q: { en: "If they could have any superpower, what would it be?", ku: "ئەگەر هێزێکی سەرووسڕوشتیان هەبێت، چی دەبێت؟" } },
            { q: { en: "What would they buy first if they won the lottery?", ku: "ئەگەر یانسیبیان بردەوە، یەکەم شت چی دەکڕن؟" } },
            { q: { en: "Who is their celebrity crush?", ku: "کێیە خۆشەویستە ناودارەکەیان؟" } },
            { q: { en: "What is their biggest fear?", ku: "گەورەترین ترسیان چییە؟" } },
            { q: { en: "Which emoji do they use the most?", ku: "کام ئیمۆجی زۆرترین بەکاردەهێنن؟" } },
            { q: { en: "What would their last meal be?", ku: "دوایین خواردنیان چی دەبێت؟" } },
            { q: { en: "What is their dream car?", ku: "ئۆتۆمبێلی خەونەکانیان چییە؟" } },
            { q: { en: "What would their dream job be?", ku: "کاری خەونەکانیان چییە؟" } },
            { q: { en: "Are they a cat person or a dog person?", ku: "پشیلە حەز دەکەن یان سەگ؟" } },
            { q: { en: "What is their go-to karaoke song?", ku: "گۆرانی کاریۆکەی دڵخوازیان چییە؟" } },
        ]
    },
    {
        id: 'preferences',
        title: { en: 'Preferences', ku: 'هەڵبژاردنەکان' },
        questions: [
            { q: { en: "Do they prefer sweet or savory food?", ku: "خواردنی شیرین حەز دەکەن یان خوێ؟" } },
            { q: { en: "Beach vacation or mountain vacation?", ku: "پشوو لە دەریا یان لە شاخ؟" } },
            { q: { en: "Early bird or night owl?", ku: "بەیانیی زوو یان شەوان دوا؟" } },
            { q: { en: "Books or movies?", ku: "کتێب یان فیلم؟" } },
            { q: { en: "City life or countryside?", ku: "ژیانی شار یان لادێ؟" } },
            { q: { en: "Text or call?", ku: "نامە یان پەیوەندی؟" } },
            { q: { en: "Summer or winter?", ku: "هاوین یان زستان؟" } },
        ]
    },
    {
        id: 'deep',
        title: { en: 'Deep Questions', ku: 'پرسیارە قووڵەکان' },
        questions: [
            { q: { en: "What is their biggest dream in life?", ku: "گەورەترین خەونیان لە ژیاندا چییە؟" } },
            { q: { en: "What are they most grateful for?", ku: "بۆ چی زۆرترین سوپاسگوزارن؟" } },
            { q: { en: "What would they change about their past?", ku: "چی دەگۆڕن لە ڕابردووی خۆیاندا؟" } },
            { q: { en: "What makes them truly happy?", ku: "چی بە ڕاستی خۆشیان دەکات؟" } },
            { q: { en: "What is their biggest life lesson?", ku: "گەورەترین وانەی ژیانیان چییە؟" } },
            { q: { en: "If they could live anywhere, where would it be?", ku: "ئەگەر بتوانن لە هەر شوێنێک بژین، لە کوێ دەبوو؟" } },
        ]
    }
];

export const getPartnersQuestions = (categoryId) => {
    if (categoryId === 'mix') {
        const all = [];
        partnersData.forEach(cat => all.push(...cat.questions));
        return all.sort(() => Math.random() - 0.5).slice(0, 10);
    }
    const category = partnersData.find(c => c.id === categoryId);
    return category ? category.questions : [];
};
