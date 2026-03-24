const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const re1 = /<View\s+style=\{\s*(styles?\.header)\s*\}\s*>\s*(<BackButton|<TouchableOpacity[^>]*onPress=\{[^}]*goBack[^}]*\}[^>]*>)/g;
    content = content.replace(re1, (match, p1, p2) => {
        return `<View style={[${p1}, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>\n                        ${p2}`;
    });

    const re2 = /<View\s+style=\{\s*\[\s*(styles?\.header)\s*,\s*\{(.*?)\}\s*\]\s*\}\s*>\s*(<BackButton|<TouchableOpacity[^>]*onPress=\{[^}]*goBack[^}]*\}[^>]*>)/g;
    content = content.replace(re2, (match, p1, p2, p3) => {
        if (p2.includes('flexDirection')) return match;
        return `<View style={[${p1}, { ${p2}, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>\n                        ${p3}`;
    });

    if (content.includes("isRTL ? 'row-reverse'") && !content.includes('isRTL = useTheme()') && !content.includes('isRTL } = useTheme()')) {
        const themeMatch = content.match(/(const|let)\s+\{\s*(.*?)\s*\}\s*=\s*useTheme\(\)/);
        if (themeMatch) {
            content = content.replace(/(const|let)\s+\{\s*(.*?)\s*\}\s*=\s*useTheme\(\)/, `$1 { $2, isRTL } = useTheme()`);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed:", filePath);
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
