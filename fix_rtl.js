const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const touchableRegex = /<TouchableOpacity[^>]*onPress=\{\s*\(\)\s*=>\s*navigation\.goBack\(\)\s*\}[^>]*>[\s\S]*?(?:<ArrowLeft|<ChevronLeft)[\s\S]*?<\/TouchableOpacity>/g;
    
    if (touchableRegex.test(content)) {
        content = content.replace(touchableRegex, '<BackButton onPress={() => navigation.goBack()} />');
    }

    if (content.includes('<BackButton')) {
        if (!content.match(/import.*BackButton/)) {
            // Add import to top if missing
            const importLine = "import { BackButton } from '../../components/BackButton';\n";
            content = content.replace(/import React/, importLine + "import React");
        }
        
        // ensure header is dynamically RTL-aware
        // matches `<View style={styles.header}>` or `<View style={st.header}>`
        const singleStyleHeader = /<View\s+style=\{\s*(styles?\.header)\s*\}>([\s\S]*?<BackButton)/g;
        content = content.replace(singleStyleHeader, "<View style={[$1, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>$2");
        
        // matches `<View style={[styles.header, { backgroundColor: ... }]}>`
        // We will just do a generic replace: if it has `<BackButton`, we force the surrounding styles.header to include `flexDirection: isRTL ? 'row-reverse' : 'row'` if it doesn't have it.
        const arrayStyleHeader = /<View\s+style=\{\[\s*(styles?\.header)\s*,\s*\{(.*?)\}\s*\]\}>([\s\S]*?<BackButton)/g;
        content = content.replace(arrayStyleHeader, (match, p1, p2, p3) => {
            if (p2.includes('flexDirection')) return match;
            return `<View style={[${p1}, {${p2}, flexDirection: isRTL ? 'row-reverse' : 'row'}]}>${p3}`;
        });

        // Ensure `isRTL` is defined from useTheme
        if (content.includes("isRTL ? 'row-reverse' : 'row'")) {
            const themeExtract = /(const|let)\s+\{\s*(.*?)\s*\}\s*=\s*useTheme\(\)/;
            const match = content.match(themeExtract);
            if (match && !match[2].includes('isRTL')) {
                content = content.replace(themeExtract, `$1 { $2, isRTL } = useTheme()`);
            } else if (!match && content.includes('function ')) {
                // If there's no useTheme() at all, add it inside the function component.
                // It's safer to just let the user fix files with no useTheme, but most have it.
            }
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed RTL back button in:", filePath);
    }
}

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            fixFile(fullPath);
        }
    });
}

processDir('src/screens');
