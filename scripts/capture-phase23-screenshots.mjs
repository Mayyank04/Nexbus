import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve(process.cwd(), 'docs/phase-23/evidence/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const targets = [
  { url: 'http://localhost:3000/', name: 'home-desktop.png', width: 1440, height: 900 },
  { url: 'http://localhost:3000/', name: 'home-tablet.png', width: 768, height: 1024 },
  { url: 'http://localhost:3000/', name: 'home-mobile.png', width: 390, height: 844 },
  { url: 'http://localhost:3000/twin', name: 'twin-desktop.png', width: 1440, height: 900 },
  { url: 'http://localhost:3000/twin', name: 'twin-mobile.png', width: 390, height: 844 },
  { url: 'http://localhost:3000/journey', name: 'journey-desktop.png', width: 1440, height: 900 },
  { url: 'http://localhost:3000/journey', name: 'journey-mobile.png', width: 390, height: 844 },
  { url: 'http://localhost:3000/simulate', name: 'simulate-desktop.png', width: 1440, height: 900 },
  { url: 'http://localhost:3000/simulate', name: 'simulate-mobile.png', width: 390, height: 844 },
  { url: 'http://localhost:3000/about', name: 'about-desktop.png', width: 1440, height: 900 },
];

console.log(`Starting headless Chrome capture of ${targets.length} viewports...`);

for (const target of targets) {
  const dest = path.join(OUT_DIR, target.name);
  const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${dest}" --window-size=${target.width},${target.height} --virtual-time-budget=4000 --hide-scrollbars "${target.url}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    const stat = fs.statSync(dest);
    console.log(`[OK] ${target.name} (${target.width}x${target.height}): ${stat.size} bytes`);
  } catch (err) {
    console.error(`[FAIL] ${target.name}: ${err.message}`);
  }
}

console.log('Finished capturing all multi-viewport screenshots.');
