import { useLanguage } from '../context/LanguageContext';
import { t as translate } from '../localization/translations';

// Custom hook for easy translations
export function useTranslation() {
    const { language, isKurdish, isRTL } = useLanguage();

    // Translation function
    const t = (key) => {
        return translate(key, language);
    };

    // Get text alignment based on language direction
    const textAlign = isRTL ? 'right' : 'left';

    // Get flex direction for RTL support
    const flexDirection = isRTL ? 'row-reverse' : 'row';

    // Writing direction
    const writingDirection = isRTL ? 'rtl' : 'ltr';

    // Font family based on language
    const fontFamily = isKurdish ? 'Rabar' : undefined;

    return {
        t,
        language,
        isKurdish,
        isRTL,
        textAlign,
        flexDirection,
        writingDirection,
        fontFamily,
    };
}

export default useTranslation;
