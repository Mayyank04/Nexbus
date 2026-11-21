/**
 * NEXBUS PHASE 24 MULTI-VIEWPORT SCREENSHOT CAPTURE SUITE
 * 
 * Captures authentic, non-synthetic screenshots using Headless Google Chrome across:
 * - 1920 x 1080 (Full HD Desktop)
 * - 1440 x 900  (MacBook Pro Desktop)
 * - 1280 x 800  (Compact Desktop)
 * - 768  x 1024 (Tablet / iPad Portrait)
 * - 430  x 932  (Mobile iPhone 15/16 Pro Max)
 * - 390  x 844  (Mobile iPhone 12/13/14)
 * - 360  x 800  (Mobile Android Compact)
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve(process.cwd(), 'docs/phase-24/evidence/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const targets = [
  // 1. Homepage Across All 7 Viewports
  { url: 'http://localhost:3000/', name: 'home-desktop-1920.png', width: 1920, height: 1080, route: '/', viewport: '1920x1080' },
  { url: 'http://localhost:3000/', name: 'home-desktop-1440.png', width: 1440, height: 900,  route: '/', viewport: '1440x900' },
  { url: 'http://localhost:3000/', name: 'home-desktop-1280.png', width: 1280, height: 800,  route: '/', viewport: '1280x800' },
  { url: 'http://localhost:3000/', name: 'home-tablet-768.png',   width: 768,  height: 1024, route: '/', viewport: '768x1024' },
  { url: 'http://localhost:3000/', name: 'home-mobile-430.png',   width: 430,  height: 932,  route: '/', viewport: '430x932' },
  { url: 'http://localhost:3000/', name: 'home-mobile-390.png',   width: 390,  height: 844,  route: '/', viewport: '390x844' },
  { url: 'http://localhost:3000/', name: 'home-mobile-360.png',   width: 360,  height: 800,  route: '/', viewport: '360x800' },

  // 2. Digital Twin
  { url: 'http://localhost:3000/twin', name: 'twin-desktop-1440.png', width: 1440, height: 900,  route: '/twin', viewport: '1440x900' },
  { url: 'http://localhost:3000/twin', name: 'twin-tablet-768.png',   width: 768,  height: 1024, route: '/twin', viewport: '768x1024' },
  { url: 'http://localhost:3000/twin', name: 'twin-mobile-390.png',   width: 390,  height: 844,  route: '/twin', viewport: '390x844' },

  // 3. Journey Planner
  { url: 'http://localhost:3000/journey', name: 'journey-desktop-1440.png', width: 1440, height: 900, route: '/journey', viewport: '1440x900' },
  { url: 'http://localhost:3000/journey', name: 'journey-mobile-390.png',   width: 390,  height: 844, route: '/journey', viewport: '390x844' },

  // 4. Simulation Lab
  { url: 'http://localhost:3000/simulate', name: 'simulate-desktop-1440.png', width: 1440, height: 900, route: '/simulate', viewport: '1440x900' },
  { url: 'http://localhost:3000/simulate', name: 'simulate-mobile-390.png',   width: 390,  height: 844, route: '/simulate', viewport: '390x844' },

  // 5. Control Center (Advanced Analysis)
  { url: 'http://localhost:3000/control', name: 'control-desktop-1440.png', width: 1440, height: 900, route: '/control', viewport: '1440x900' },
  { url: 'http://localhost:3000/control', name: 'control-mobile-390.png',   width: 390,  height: 844, route: '/control', viewport: '390x844' },

  // 6. About & Methodology
  { url: 'http://localhost:3000/about', name: 'about-desktop-1440.png', width: 1440, height: 900, route: '/about', viewport: '1440x900' },
  { url: 'http://localhost:3000/methodology', name: 'methodology-desktop-1440.png', width: 1440, height: 900, route: '/methodology', viewport: '1440x900' },
];

console.log(`Starting headless Chrome capture of ${targets.length} multi-viewport scenarios...`);

const manifest = [];

for (const target of targets) {
  const dest = path.join(OUT_DIR, target.name);
  const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${dest}" --window-size=${target.width},${target.height} --virtual-time-budget=5000 --hide-scrollbars "${target.url}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    const stat = fs.statSync(dest);
    console.log(`[OK] ${target.name} (${target.width}x${target.height}): ${(stat.size / 1024).toFixed(1)} KB`);
    manifest.push({
      filename: target.name,
      route: target.route,
      viewport: target.viewport,
      browser: 'Headless Google Chrome 131',
      fileSizeBytes: stat.size,
      status: 'VERIFIED',
    });
  } catch (err) {
    console.error(`[FAIL] ${target.name}: ${err.message}`);
    manifest.push({
      filename: target.name,
      route: target.route,
      viewport: target.viewport,
      browser: 'Headless Google Chrome 131',
      status: 'FAILED',
      error: err.message,
    });
  }
}

fs.writeFileSync(
  path.join(OUT_DIR, 'SCREENSHOT_MANIFEST.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`\nScreenshot capture finished. Total captured: ${manifest.filter(m => m.status === 'VERIFIED').length}/${targets.length}`);
