export const PYRAMID_DATA = [
    {
        id: 'category_1',
        title: { en: 'Things In A Fridge', ku: 'شتەکانی ناو سەلاجە' },
        items: [
            { en: 'Milk', ku: 'شیر' },
            { en: 'Eggs', ku: 'هێلکە' },
            { en: 'Cheese', ku: 'پەنیر' },
            { en: 'Butter', ku: 'کەرە' },
            { en: 'Juice', ku: 'شەربەت' },
            { en: 'Vegetables', ku: 'سەوزە' },
            { en: 'Leftovers', ku: 'ماوەی خواردن' }
        ]
    },
    {
        id: 'category_2',
        title: { en: 'Types of Sports', ku: 'جۆرەکانی وەرزش' },
        items: [
            { en: 'Football', ku: 'تۆپی پێ' },
            { en: 'Basketball', ku: 'تۆپی باسکە' },
            { en: 'Tennis', ku: 'تێنس' },
            { en: 'Swimming', ku: 'مەلەوان' },
            { en: 'Running', ku: 'ڕاکردن' },
            { en: 'Boxing', ku: 'بۆکسێن' },
            { en: 'Volleyball', ku: 'تۆپی بالە' }
        ]
    },
    {
        id: 'category_3',
        title: { en: 'Things That Are Hot', ku: 'ئەو شتانەی گەامن' },
        items: [
            { en: 'Sun', ku: 'خۆر' },
            { en: 'Fire', ku: 'ئاگر' },
            { en: 'Coffee', ku: 'قاوە' },
            { en: 'Oven', ku: 'فڕن' },
            { en: 'Desert', ku: 'بیابان' },
            { en: 'Lava', ku: 'لاڤا' },
            { en: 'Tea', ku: 'چای' }
        ]
    },
    {
        id: 'category_4',
        title: { en: 'In A Classroom', ku: 'لە پۆلدا' },
        items: [
            { en: 'Teacher', ku: 'مامۆستا' },
            { en: 'Desk', ku: 'مێز' },
            { en: 'Whiteboard', ku: 'تەختە سپی' },
            { en: 'Books', ku: 'کتێب' },
            { en: 'Pencils', ku: 'قەڵەم' },
            { en: 'Students', ku: 'قوتابی' },
            { en: 'Clock', ku: 'کاتژمێر' }
        ]
    },
    {
        id: 'category_5',
        title: { en: 'Animals', ku: 'ئاژەڵەکان' },
        items: [
            { en: 'Lion', ku: 'شێر' },
            { en: 'Dog', ku: 'سەگ' },
            { en: 'Cat', ku: 'پشیلە' },
            { en: 'Elephant', ku: 'فیل' },
            { en: 'Bird', ku: 'باڵندە' },
            { en: 'Fish', ku: 'ماسی' },
            { en: 'Monkey', ku: 'مەیمون' }
        ]
    },
    {
        id: 'category_6',
        title: { en: 'Colors', ku: 'ڕەنگەکان' },
        items: [
            { en: 'Red', ku: 'سور' },
            { en: 'Blue', ku: 'شین' },
            { en: 'Green', ku: 'سەوز' },
            { en: 'Yellow', ku: 'زەرد' },
            { en: 'Black', ku: 'ڕەش' },
            { en: 'White', ku: 'سپی' },
            { en: 'Purple', ku: 'مۆر' }
        ]
    },
    {
        id: 'category_7',
        title: { en: 'Camping Items', ku: 'کەلوپەلی گەشت' },
        items: [
            { en: 'Tent', ku: 'خێمە' },
            { en: 'Fire', ku: 'ئاگر' },
            { en: 'Sleeping Bag', ku: 'تورەگەی خەوتن' },
            { en: 'Flashlight', ku: 'لایت' },
            { en: 'Marshmallow', ku: 'مارشمێلۆ' },
            { en: 'Backpack', ku: 'جانتا' },
            { en: 'Map', ku: 'نەخشە' }
        ]
    },
    {
        id: 'category_8',
        title: { en: 'Things You Wear', ku: 'پۆشاک' },
        items: [
            { en: 'Shirt', ku: 'تیشێرت' },
            { en: 'Pants', ku: 'پانتۆڵ' },
            { en: 'Shoes', ku: 'پێڵاو' },
            { en: 'Hat', ku: 'کڵاو' },
            { en: 'Socks', ku: 'گۆرەوی' },
            { en: 'Jacket', ku: 'اکەت' },
            { en: 'Glasses', ku: 'عەینەک' }
        ]
    }
];

export const getRandomCategories = (count = 6) => {
    const shuffled = [...PYRAMID_DATA].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
