import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'cypress';
const { DEST_ABS } = require('./scripts/config');

function modifyManifest() {
  const mfPath = path.resolve(DEST_ABS, 'manifest.json');
  const utf8 = 'utf8';

  const content = fs.readFileSync(mfPath, utf8);
  const json = JSON.parse(content);
  const contentScripts = json.content_scripts;
  for (const s of contentScripts) {
    s.all_frames = true;
    if (!s.exclude_matches?.length) s.exclude_matches = [];
    const ex = '*://*/__/*';
    if (!s.exclude_matches.includes(ex)) s.exclude_matches.push(ex);
  }
  fs.writeFileSync(mfPath, JSON.stringify(json, null, 4), utf8);
}

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.extensions.push(DEST_ABS);
        modifyManifest();
        return launchOptions;
      });
    },
  },
});
