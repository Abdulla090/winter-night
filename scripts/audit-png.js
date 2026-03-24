/**
 * Scan ALL PNG files in assets/ for AAPT2 compatibility issues.
 * Detects: wrong format, 16-bit depth, ICC profiles, CMYK color space.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

function getAllPngs(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllPngs(fullPath, results);
    } else if (entry.name.toLowerCase().endsWith('.png')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const files = getAllPngs(ASSETS_DIR);
  console.log(`Found ${files.length} PNG files. Scanning...\n`);

  const problems = [];

  for (const f of files) {
    try {
      const meta = await sharp(f).metadata();
      const issues = [];
      if (meta.format !== 'png') issues.push(`wrong_format:${meta.format}`);
      if (meta.depth !== 'uchar') issues.push(`depth:${meta.depth}`);
      if (meta.icc) issues.push('has_icc_profile');
      if (meta.space === 'cmyk') issues.push('cmyk_colorspace');

      if (issues.length > 0) {
        const rel = path.relative(ASSETS_DIR, f);
        console.log(`❌ ${rel}: ${issues.join(', ')}`);
        problems.push({ file: f, issues });
      }
    } catch (e) {
      console.log(`⚠️  Cannot read: ${path.relative(ASSETS_DIR, f)} — ${e.message}`);
    }
  }

  if (problems.length === 0) {
    console.log('✅ All PNG files are AAPT2-compatible!');
  } else {
    console.log(`\n⚠️  Found ${problems.length} problematic file(s). Run fix-png-aapt2.js on them.`);
  }
}

main();
