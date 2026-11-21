import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve('docs/phase-25/evidence/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 800 },
];

const PAGES = [
  { path: '/', slug: 'homepage' },
  { path: '/twin', slug: 'twin' },
  { path: '/journey', slug: 'journey' },
  { path: '/simulate', slug: 'simulate' },
  { path: '/control', slug: 'control' },
];

async function main() {
  console.log('=== STARTING NEXT.JS FOR SCREENSHOT CAPTURE ===');
  const server = spawn('npm', ['start'], {
    env: { ...process.env, PORT: '3000' },
    stdio: 'ignore',
  });

  // Wait for server to boot
  let ready = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3000/api/health');
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!ready) {
    console.error('Next.js server failed to start within timeout');
    server.kill();
    process.exit(1);
  }

  console.log('Server is ready. Capturing screenshots...');

  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      const outPath = path.join(OUT_DIR, `${page.slug}-${vp.name}.png`);
      const url = `http://localhost:3000${page.path}`;
      const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${vp.width},${vp.height} --screenshot="${outPath}" "${url}"`;
      try {
        execSync(cmd, { stdio: 'ignore' });
        console.log(`[SAVED] ${page.slug}-${vp.name}.png`);
      } catch (err) {
        console.error(`[ERROR] Failed to capture ${page.slug} at ${vp.name}:`, err.message);
      }
    }
  }

  server.kill();
  console.log('=== SCREENSHOT CAPTURE COMPLETE ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
