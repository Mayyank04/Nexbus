import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg';
const FFPROBE_PATH = '/opt/homebrew/bin/ffprobe';
const BASE_URL = 'http://localhost:3000';

const DEMO_DIR = path.resolve('docs/phase-22/demo');
const FRAMES_DIR = path.join(DEMO_DIR, 'raw_frames');
const CLIPS_DIR = path.join(DEMO_DIR, 'clips');
const AUDIO_DIR = path.join(DEMO_DIR, 'audio');

[DEMO_DIR, FRAMES_DIR, CLIPS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('=== NEXBUS PHASE 22: COMPETITION DEMONSTRATION VIDEO PRODUCTION ===\n');

// 1. Capture High-Resolution Real Application Surfaces
const CAPTURES = [
  { id: 'landing_full', url: `${BASE_URL}/`, width: 1920, height: 3200, delay: 2000 },
  { id: 'twin_explore', url: `${BASE_URL}/twin?mode=explore`, width: 1920, height: 1080, delay: 3500 },
  { id: 'twin_step1', url: `${BASE_URL}/twin?mode=explore&step=1`, width: 1920, height: 1080, delay: 3500 },
  { id: 'twin_step2', url: `${BASE_URL}/twin?mode=explore&step=2`, width: 1920, height: 1080, delay: 3500 },
  { id: 'twin_analyst', url: `${BASE_URL}/twin?mode=analyst`, width: 1920, height: 1080, delay: 3500 },
  { id: 'twin_2d', url: `${BASE_URL}/twin?view=2d`, width: 1920, height: 1080, delay: 2000 },
  { id: 'journey_full', url: `${BASE_URL}/journey`, width: 1920, height: 1600, delay: 2000 },
  { id: 'simulate_full', url: `${BASE_URL}/simulate`, width: 1920, height: 1600, delay: 2000 },
  { id: 'methodology_full', url: `${BASE_URL}/methodology`, width: 1920, height: 1800, delay: 2000 },
  { id: 'control_full', url: `${BASE_URL}/control`, width: 1920, height: 1400, delay: 2000 },
  { id: 'terms_full', url: `${BASE_URL}/terms`, width: 1920, height: 1400, delay: 2000 },
  { id: 'privacy_full', url: `${BASE_URL}/privacy`, width: 1920, height: 1400, delay: 2000 }
];

console.log('1. Verifying or capturing authentic 1080p rendered surfaces...');
for (const cap of CAPTURES) {
  const outPath = path.join(FRAMES_DIR, `${cap.id}.png`);
  if (!fs.existsSync(outPath) || fs.statSync(outPath).size === 0) {
    console.log(`   Capturing ${cap.id} (${cap.width}x${cap.height})...`);
    const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${cap.width},${cap.height} --hide-scrollbars --virtual-time-budget=${cap.delay} "${cap.url}"`;
    execSync(cmd, { stdio: 'pipe' });
  } else {
    console.log(`   Using existing ${cap.id}.png (${fs.statSync(outPath).size} bytes)`);
  }
}
console.log('   [PASS] All 12 high-resolution raw application surfaces ready.\n');

// 2. Read Audio Durations
const audioManifest = JSON.parse(fs.readFileSync(path.join(AUDIO_DIR, 'audio_manifest.json'), 'utf8'));

function getDuration(segId) {
  const item = audioManifest.find(a => a.id === segId);
  return item ? item.durationSec : 20;
}

// 3. Render 8 Professional Video Clips with Audio Muxing
console.log('2. Rendering video clips with camera motion, scroll dynamics, and spoken narration...');

// Clip 1: Landing Page Smooth Scroll
{
  const dur = getDuration('seg1');
  const img = path.join(FRAMES_DIR, 'landing_full.png');
  const audio = path.join(AUDIO_DIR, 'seg1.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip1.mp4');
  console.log(`   Rendering Clip 1: Landing Page Overview (${dur.toFixed(2)}s)...`);
  
  const vf = `scale=1920:-1,crop=1920:1080:0:'min(in_h-1080, t*(in_h-1080)/${dur})'`;
  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${img}" -i "${audio}" -t ${dur} -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 2: Digital Twin Overview & Safety Header
{
  const dur = getDuration('seg2');
  const img = path.join(FRAMES_DIR, 'twin_explore.png');
  const audio = path.join(AUDIO_DIR, 'seg2.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip2.mp4');
  console.log(`   Rendering Clip 2: Digital Twin & Safety Mandate (${dur.toFixed(2)}s)...`);

  const vf = `scale=1920:1080,zoompan=z='min(zoom+0.0003,1.06)':d=${Math.ceil(dur * 30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${img}" -i "${audio}" -t ${dur} -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 3: Explore Delhi Guided Tour Steps (AIIMS -> Ring Road)
{
  const dur = getDuration('seg3');
  const img1 = path.join(FRAMES_DIR, 'twin_step1.png');
  const img2 = path.join(FRAMES_DIR, 'twin_step2.png');
  const audio = path.join(AUDIO_DIR, 'seg3.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip3.mp4');
  console.log(`   Rendering Clip 3: Explore Delhi Guided Tour (${dur.toFixed(2)}s)...`);

  const half = dur / 2;
  const vf = `[0:v]scale=1920:1080[v0];
[1:v]scale=1920:1080[v1];
[v0][v1]xfade=transition=fade:duration=1.2:offset=${(half - 0.6).toFixed(2)}[v]`;

  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${half + 0.6} -i "${img1}" -loop 1 -t ${half + 0.6} -i "${img2}" -i "${audio}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 4: Advanced Analysis (11 GIS Layers) & 2D Vector Fallback
{
  const dur = getDuration('seg4');
  const img1 = path.join(FRAMES_DIR, 'twin_analyst.png');
  const img2 = path.join(FRAMES_DIR, 'twin_2d.png');
  const audio = path.join(AUDIO_DIR, 'seg4.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip4.mp4');
  console.log(`   Rendering Clip 4: Advanced Analysis & 2D Vector Fallback (${dur.toFixed(2)}s)...`);

  const half = dur / 2;
  const vf = `[0:v]scale=1920:1080[v0];
[1:v]scale=1920:1080[v1];
[v0][v1]xfade=transition=wipeleft:duration=1.0:offset=${(half - 0.5).toFixed(2)}[v]`;

  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${half + 0.5} -i "${img1}" -loop 1 -t ${half + 0.5} -i "${img2}" -i "${audio}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 5: Multi-Criteria Journey Planning (Fastest, Balanced, Comfort First)
{
  const dur = getDuration('seg5');
  const img = path.join(FRAMES_DIR, 'journey_full.png');
  const audio = path.join(AUDIO_DIR, 'seg5.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip5.mp4');
  console.log(`   Rendering Clip 5: Multi-Criteria Journey Planner (${dur.toFixed(2)}s)...`);

  const vf = `scale=1920:-1,crop=1920:1080:0:'min(in_h-1080, t*(in_h-1080)/${dur})'`;
  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${img}" -i "${audio}" -t ${dur} -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 6: Parametric Simulation Lab
{
  const dur = getDuration('seg6');
  const img = path.join(FRAMES_DIR, 'simulate_full.png');
  const audio = path.join(AUDIO_DIR, 'seg6.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip6.mp4');
  console.log(`   Rendering Clip 6: Parametric Simulation Lab (${dur.toFixed(2)}s)...`);

  const vf = `scale=1920:-1,crop=1920:1080:0:'min(in_h-1080, t*(in_h-1080)/${dur})'`;
  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${img}" -i "${audio}" -t ${dur} -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 7: Methodology, 9-Tier Taxonomy & Control Observatory
{
  const dur = getDuration('seg7');
  const img1 = path.join(FRAMES_DIR, 'methodology_full.png');
  const img2 = path.join(FRAMES_DIR, 'control_full.png');
  const audio = path.join(AUDIO_DIR, 'seg7.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip7.mp4');
  console.log(`   Rendering Clip 7: Data Provenance & Control Observatory (${dur.toFixed(2)}s)...`);

  const half = dur / 2;
  const vf = `[0:v]scale=1920:-1,crop=1920:1080:0:'min(in_h-1080, t*120)'[v0];
[1:v]scale=1920:1080[v1];
[v0][v1]xfade=transition=fade:duration=1.0:offset=${(half - 0.5).toFixed(2)}[v]`;

  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${half + 0.5} -i "${img1}" -loop 1 -t ${half + 0.5} -i "${img2}" -i "${audio}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// Clip 8: Terms, Civic Privacy & Closing Safety Mandate
{
  const dur = getDuration('seg8');
  const img = path.join(FRAMES_DIR, 'terms_full.png');
  const audio = path.join(AUDIO_DIR, 'seg8.wav');
  const clipOut = path.join(CLIPS_DIR, 'clip8.mp4');
  console.log(`   Rendering Clip 8: Operational Safety Mandate & Conclusion (${dur.toFixed(2)}s)...`);

  const vf = `scale=1920:1080`;
  const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${img}" -i "${audio}" -t ${dur} -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
  execSync(cmd, { stdio: 'pipe' });
}

// 4. Concatenate into Master Video
console.log('\n3. Concatenating all 8 clips into master competition demo video...');
const concatListPath = path.join(CLIPS_DIR, 'concat_list.txt');
const clipFiles = [
  'clip1.mp4',
  'clip2.mp4',
  'clip3.mp4',
  'clip4.mp4',
  'clip5.mp4',
  'clip6.mp4',
  'clip7.mp4',
  'clip8.mp4'
];

const listContent = clipFiles.map(f => `file '${path.join(CLIPS_DIR, f)}'`).join('\n');
fs.writeFileSync(concatListPath, listContent);

const masterOut = path.join(DEMO_DIR, 'NEXBUS_COMPETITION_DEMO.mp4');
const concatCmd = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterOut}"`;
execSync(concatCmd, { stdio: 'pipe' });

// 5. Generate Professional Thumbnail using HTML/CSS rendered in Chrome
console.log('4. Generating high-resolution video thumbnail in Chrome...');
const thumbHtmlPath = path.join(DEMO_DIR, 'thumb_template.html');
const thumbOut = path.join(DEMO_DIR, 'DEMO_THUMBNAIL.png');

const thumbHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #0D1B2A;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: relative;
      overflow: hidden;
      color: #F5F0E6;
    }
    .bg-image {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: url('raw_frames/twin_explore.png');
      background-size: cover;
      background-position: center;
      opacity: 0.35;
      filter: blur(2px);
    }
    .overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 30% 40%, rgba(13,27,42,0.4) 0%, rgba(13,27,42,0.92) 80%);
      padding: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .badge-bar {
      display: flex;
      gap: 16px;
    }
    .badge {
      display: inline-block;
      padding: 8px 18px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .badge-red { background: #E63946; color: white; }
    .badge-gold { background: #FFB703; color: #0D1B2A; }
    .badge-green { background: #2A9D8F; color: white; }
    h1 {
      font-size: 110px;
      font-weight: 900;
      letter-spacing: -2px;
      color: #FFFFFF;
      line-height: 1.0;
      margin-top: 20px;
    }
    h2 {
      font-size: 42px;
      font-weight: 400;
      color: #F5F0E6;
      margin-top: 20px;
      max-width: 1200px;
      line-height: 1.3;
    }
    .subtitle {
      font-size: 26px;
      color: #94A3B8;
      margin-top: 15px;
      font-weight: 300;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 2px solid rgba(245,240,230,0.2);
      padding-top: 30px;
    }
    .features-list {
      display: flex;
      gap: 40px;
      font-size: 20px;
      color: #E2E8F0;
    }
    .feature-item strong {
      color: #FFB703;
      display: block;
      font-size: 24px;
    }
    .safety-mandate {
      background: rgba(230,57,70,0.2);
      border: 1px solid #E63946;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 18px;
      color: #FFFFFF;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-image"></div>
  <div class="overlay">
    <div>
      <div class="badge-bar">
        <span class="badge badge-red">Competition Demo</span>
        <span class="badge badge-gold">Full Prototype</span>
        <span class="badge badge-green">NCT Delhi</span>
      </div>
      <h1>NEXBUS</h1>
      <h2>Delhi Urban Mobility Intelligence &amp; Advisory Decision-Support Platform</h2>
      <div class="subtitle">Interactive 3D Digital Twin · Multi-Criteria Journey Planning · Parametric Simulation · 9-Tier Evidence Governance</div>
    </div>
    <div class="footer-bar">
      <div class="features-list">
        <div class="feature-item"><strong>4 Corridors</strong>67 Nodes · 226 Edges</div>
        <div class="feature-item"><strong>Dual Modes</strong>Explore &amp; 11-Layer GIS</div>
        <div class="feature-item"><strong>3 Pareto Tiers</strong>Fastest, Balanced, Comfort</div>
        <div class="feature-item"><strong>Open Source</strong>MIT License · Next.js 16</div>
      </div>
      <div class="safety-mandate">
        MANDATE: READ-ONLY + PASSIVE + ADVISORY
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(thumbHtmlPath, thumbHtml);

// Render thumbnail with Chrome
execSync(`"${CHROME_PATH}" --headless=new --screenshot="${thumbOut}" --window-size=1920,1080 "${thumbHtmlPath}"`, { stdio: 'pipe' });

// 6. Inspect Master Video Metrics via FFprobe
console.log('\n5. Inspecting final master video metrics...');
const probeStr = execSync(`"${FFPROBE_PATH}" -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,r_frame_rate,codec_name "${masterOut}"`).toString();
console.log(probeStr);

const masterStats = fs.statSync(masterOut);
const durMatch = probeStr.match(/duration=([0-9.]+)/);
const finalDurSec = durMatch ? parseFloat(durMatch[1]) : 0;

console.log(`=======================================================`);
console.log(`MASTER DEMO GENERATED: ${masterOut}`);
console.log(`File Size: ${(masterStats.size / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Duration: ${finalDurSec.toFixed(2)} seconds (${(finalDurSec / 60).toFixed(2)} minutes)`);
console.log(`Resolution: 1920x1080 at 30 fps (H.264 / AAC)`);
console.log(`Thumbnail: ${thumbOut}`);
console.log(`=======================================================\n`);
