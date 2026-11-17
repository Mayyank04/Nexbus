import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('docs/phase-19/evidence/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const TARGETS = [
  // 1. Home
  { name: 'home_1440x900.png', path: '/', width: 1440, height: 900 },
  { name: 'home_390x844.png', path: '/', width: 390, height: 844 },

  // 2. Twin Explore Mode (Tutorial & Newcomer view)
  { name: 'twin_explore_1440x900.png', path: '/twin?mode=explore', width: 1440, height: 900, delay: 2500 },
  { name: 'twin_explore_step1_1440x900.png', path: '/twin?mode=explore&step=1', width: 1440, height: 900, delay: 2500 },
  { name: 'twin_explore_390x844.png', path: '/twin?mode=explore', width: 390, height: 844, delay: 2500 },
  { name: 'twin_explore_768x1024.png', path: '/twin?mode=explore', width: 768, height: 1024, delay: 2500 },
  { name: 'twin_explore_360x800.png', path: '/twin?mode=explore', width: 360, height: 800, delay: 2500 },

  // 3. Twin Advanced Analysis Mode (11 GIS layers)
  { name: 'twin_analyst_1440x900.png', path: '/twin?mode=analyst', width: 1440, height: 900, delay: 2500 },
  { name: 'twin_analyst_390x844.png', path: '/twin?mode=analyst', width: 390, height: 844, delay: 2500 },

  // 4. Twin 2D Precision Vector Fallback
  { name: 'twin_2d_fallback_1440x900.png', path: '/twin?view=2d', width: 1440, height: 900, delay: 2000 },

  // 5. Journey Planner
  { name: 'journey_1440x900.png', path: '/journey', width: 1440, height: 900 },
  { name: 'journey_390x844.png', path: '/journey', width: 390, height: 844 },

  // 6. Simulate Lab
  { name: 'simulate_1440x900.png', path: '/simulate', width: 1440, height: 900 },
  { name: 'simulate_390x844.png', path: '/simulate', width: 390, height: 844 },

  // 7. Control Observatory
  { name: 'control_1440x900.png', path: '/control', width: 1440, height: 900 },
  { name: 'control_390x844.png', path: '/control', width: 390, height: 844 },

  // 8. Methodology
  { name: 'methodology_1440x900.png', path: '/methodology', width: 1440, height: 900 },
  { name: 'methodology_390x844.png', path: '/methodology', width: 390, height: 844 },

  // 9. About
  { name: 'about_1440x900.png', path: '/about', width: 1440, height: 900 },
  { name: 'about_390x844.png', path: '/about', width: 390, height: 844 },

  // 10. Terms
  { name: 'terms_1440x900.png', path: '/terms', width: 1440, height: 900 },
  { name: 'terms_390x844.png', path: '/terms', width: 390, height: 844 },

  // 11. Privacy
  { name: 'privacy_1440x900.png', path: '/privacy', width: 1440, height: 900 },
  { name: 'privacy_390x844.png', path: '/privacy', width: 390, height: 844 },

  // 12. 404
  { name: 'not_found_1440x900.png', path: '/not-found-verification-route', width: 1440, height: 900 },
  { name: 'not_found_390x844.png', path: '/not-found-verification-route', width: 390, height: 844 },
];

console.log(`Starting Phase 19 Visual Screenshot Capture across ${TARGETS.length} targets...`);

for (const t of TARGETS) {
  const targetUrl = `${BASE_URL}${t.path}`;
  const outPath = path.join(OUT_DIR, t.name);
  const virtualTime = t.delay || 1500;
  const cmd = `"${CHROME_BIN}" --headless=new --window-size=${t.width},${t.height} --virtual-time-budget=${virtualTime} --screenshot="${outPath}" "${targetUrl}"`;

  try {
    process.stdout.write(`Capturing [${t.width}x${t.height}] ${t.path} -> ${t.name}... `);
    execSync(cmd, { stdio: 'pipe' });
    const stat = fs.statSync(outPath);
    console.log(`OK (${(stat.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
  }
}

console.log('\nPhase 19 Visual Screenshot Capture complete.');
