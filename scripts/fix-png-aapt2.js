/**
 * Fix PNG files that fail AAPT2 compilation.
 * Re-encodes them as standard 8-bit sRGB PNG without ICC profiles,
 * without interlacing, and without 16-bit channels.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const GAMES_DIR = path.join(__dirname, '..', 'assets', 'games');

// Files that failed AAPT2 compilation (or would fail)
const PROBLEM_FILES = [
  'zarumar.png',
  'sheshbesh.png',
  'twotruths.png',
  'dama.png',
  'seberd.png',
];

async function fixPng(filename) {
  const filepath = path.join(GAMES_DIR, filename);
  const backupPath = filepath + '.bak';

  console.log(`\n🔍 Processing: ${filename}`);

  // Get metadata first
  const meta = await sharp(filepath).metadata();
  console.log(`   Format: ${meta.format}, Depth: ${meta.depth}, Channels: ${meta.channels}, Space: ${meta.space}, ICC: ${meta.icc ? 'YES' : 'no'}, Interlaced: ${meta.isProgressive}`);

  // Create a backup
  fs.copyFileSync(filepath, backupPath);
  console.log(`   Backup saved: ${filename}.bak`);

  // Re-encode via raw pixels — guaranteed to strip ALL ICC/EXIF/metadata
  const { data, info } = await sharp(filepath)
    .removeAlpha()         // Flatten alpha channel
    .toColorspace('srgb')  // Force standard sRGB
    .raw()
    .toBuffer({ resolveWithObject: true });

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    }
  })
    .png({
      compressionLevel: 6,
      force: true,
    })
    .toFile(filepath + '.tmp');

  // Verify the output
  const newMeta = await sharp(filepath + '.tmp').metadata();
  console.log(`   NEW → Format: ${newMeta.format}, Depth: ${newMeta.depth}, Channels: ${newMeta.channels}, Space: ${newMeta.space}, ICC: ${newMeta.icc ? 'YES' : 'no'}`);

  // Replace original
  fs.renameSync(filepath + '.tmp', filepath);
  console.log(`   ✅ ${filename} fixed successfully!`);
}

async function main() {
  console.log('🔧 AAPT2 PNG Fix Script');
  console.log('========================');

  for (const file of PROBLEM_FILES) {
    try {
      await fixPng(file);
    } catch (err) {
      console.error(`   ❌ Error processing ${file}:`, err.message);
    }
  }

  console.log('\n✅ All done! Now rebuild your APK.');
}

main();
