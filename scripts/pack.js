const fs = require('fs');
const path = require('path');
const glob = require('glob');
const JSZip = require('jszip');
const { ROOT_ABS, DEST_ABS } = require('./vite.config');
const manifest = require('../public/manifest.json');

function zip() {
  const fileName = path.relative(ROOT_ABS, __filename);
  console.log(`[${fileName}]：🍵 构建zip包...`);

  const inputPattern = path.resolve(DEST_ABS, '**/*.*');
  const files = glob.sync(inputPattern) || [];
  const zipTask = JSZip();
  const zipName = `${manifest.name}-v${manifest.version}`;

  for (const file of files) {
    const content = fs.readFileSync(file);
    const relPath = path.relative(DEST_ABS, file);
    const filePath = path.join(zipName, relPath);
    zipTask.file(filePath, content);
  }

  const outPath = path.resolve(ROOT_ABS, `${zipName}.zip`);

  zipTask
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(outPath))
    .on('finish', () => {
      console.log(`[${fileName}]：🚀 zip包构建完成，路径是 ${outPath}`);
    });
}

module.exports = { zip };
