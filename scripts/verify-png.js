const sharp = require('sharp');
const path = require('path');

const files = ['zarumar.png','sheshbesh.png','twotruths.png'];
const dir = path.join(__dirname, '..', 'assets', 'games');

Promise.all(files.map(f =>
  sharp(path.join(dir, f)).metadata().then(m =>
    console.log(f, '-> format:', m.format, '| depth:', m.depth, '| space:', m.space, '| icc:', !!m.icc)
  )
));
