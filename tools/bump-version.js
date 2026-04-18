// Usage: node tools/bump-version.js <version>
// Example: node tools/bump-version.js 1.0.1
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node tools/bump-version.js <version>');
  process.exit(1);
}

const pkgPath = path.join(__dirname, '../package.json');
const chromeManifestPath = path.join(__dirname, '../src/assets/manifest-chrome.json');
const firefoxManifestPath = path.join(__dirname, '../src/assets/manifest-firefox.json');

function updateJson(file, updater) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

updateJson(pkgPath, data => { data.version = version; });
updateJson(chromeManifestPath, data => { data.version = version; });
updateJson(firefoxManifestPath, data => { data.version = version; });

console.log('Updated version to', version);
