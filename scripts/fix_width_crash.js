const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/screens');

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace standard Dimension width/height usage at module scope
            // E.g., const { width } = Dimensions.get('window');
            const dimensionRegex = /const\s+\{\s*width\s*(?:,\s*height)?\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/g;
            if (dimensionRegex.test(content)) {
                content = content.replace(dimensionRegex, (match) => {
                    const hasHeight = match.includes('height');
                    if (hasHeight) {
                        return `const _dims = Dimensions.get('window');\nconst width = Math.max(_dims.width, 300);\nconst height = Math.max(_dims.height, 200);`;
                    } else {
                        return `const _w = Dimensions.get('window').width;\nconst width = Math.max(_w, 300);`;
                    }
                });
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated width crash bounds in: ${fullPath}`);
            }
        }
    });
}

processDirectory(srcDir);
console.log('Done standardizing screen dimensions!');
