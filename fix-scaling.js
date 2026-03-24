const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/kurdishFont\s*:\s*\{[^}]*\}/g, "kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] }");
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changed++;
  }
});
console.log('Modified ' + changed + ' files inside src.');
