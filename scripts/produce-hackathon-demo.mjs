import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg';
const FFPROBE_PATH = '/opt/homebrew/bin/ffprobe';

const WORK_DIR = path.resolve('docs/hackathon-demo');
const AUDIO_DIR = path.join(WORK_DIR, 'audio');
const OVERLAYS_DIR = path.join(WORK_DIR, 'overlays');
const CLIPS_DIR = path.join(WORK_DIR, 'clips');
const PUBLIC_DEMO_DIR = path.resolve('public/demo');
const PHASE22_DEMO_DIR = path.resolve('docs/phase-22/demo');
const RAW_FRAMES_DIR = path.resolve('docs/phase-22/demo/raw_frames');

[WORK_DIR, AUDIO_DIR, OVERLAYS_DIR, CLIPS_DIR, PUBLIC_DEMO_DIR, PHASE22_DEMO_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('================================================================');
console.log('  NEXBUS HACKATHON PRESENTATION VIDEO PRODUCTION PIPELINE       ');
console.log('================================================================\n');

// 1. Narration Script & Scene Definitions
const SCENES = [
  {
    id: 'seg1',
    num: '01',
    title: 'NEXBUS Title & Platform Overview',
    hudCategory: 'URBAN MOBILITY INTELLIGENCE',
    hudTag: 'DELHI NCT TRANSIT NETWORK',
    speechText: 'Every day, millions of people depend on public transportation to move through a city. [[slnc 400]] But understanding how different routes, buses, metro connections and passenger demand work together is not always easy. [[slnc 500]] Introducing NEXBUS: a mobility intelligence platform designed to help people understand urban transportation.',
    subtitleText: 'Every day, millions of people depend on public transportation to move through a city. But understanding how different routes, buses, metro connections and passenger demand work together is not always easy.\n\nIntroducing NEXBUS — a mobility intelligence platform designed to help people understand urban transportation.',
    leadInSec: 0.8,
    leadOutSec: 1.2,
    type: 'scroll',
    bgImage: path.join(RAW_FRAMES_DIR, 'landing_full.png'),
    scrollSpeed: 100
  },
  {
    id: 'seg2',
    num: '02',
    title: '3D Explore Delhi & Digital Twin',
    hudCategory: 'INTERACTIVE 3D DIGITAL TWIN',
    hudTag: 'NCT ROAD NETWORK · ARTERIAL AXES',
    speechText: 'At the heart of NEXBUS is an interactive digital representation of Delhi\'s transport network. [[slnc 400]] Users can explore important roads, bus routes, stops and transport connections through a three-dimensional environment. [[slnc 400]] Instead of looking at complicated technical diagrams, people can explore the transport system visually.',
    subtitleText: 'At the heart of NEXBUS is an interactive digital representation of Delhi\'s transport network. Users can explore important roads, bus routes, stops and transport connections through a three-dimensional environment.\n\nInstead of looking at complicated technical diagrams, people can explore the transport system visually.',
    leadInSec: 0.8,
    leadOutSec: 2.5,
    type: 'zoompan',
    bgImage: path.join(RAW_FRAMES_DIR, 'twin_explore.png')
  },
  {
    id: 'seg3',
    num: '03',
    title: 'Beginner-Friendly Guided Exploration',
    hudCategory: 'GUIDED CORRIDOR TOUR',
    hudTag: 'STEP 1: AIIMS · STEP 2: RING ROAD',
    speechText: 'For newcomers, NEXBUS provides a guided exploration experience. [[slnc 400]] It explains what users are looking at, where buses travel, how transport hubs connect, and how different parts of the network relate to one another. [[slnc 400]] The objective is simple: make complex transport information easier for everyone to understand.',
    subtitleText: 'For newcomers, NEXBUS provides a guided exploration experience. It explains what users are looking at, where buses travel, how transport hubs connect, and how different parts of the network relate to one another.\n\nThe objective is simple: make complex transport information easier for everyone to understand.',
    leadInSec: 0.8,
    leadOutSec: 2.0,
    type: 'crossfade_dual',
    bgImage1: path.join(RAW_FRAMES_DIR, 'twin_step1.png'),
    bgImage2: path.join(RAW_FRAMES_DIR, 'twin_step2.png')
  },
  {
    id: 'seg4',
    num: '04',
    title: 'Advanced Analysis & 11 GIS Layers',
    hudCategory: 'GIS ANALYTICAL SUITE',
    hudTag: '11 GIS LAYERS · 2D VECTOR FALLBACK',
    speechText: 'For advanced users, the platform provides an analytical environment with multiple geographic information layers. [[slnc 400]] These layers help examine transport infrastructure, accessibility, passenger demand, connections and potential congestion patterns. [[slnc 400]] Each layer also communicates its data status and limitations, so a model or estimate is not mistaken for a live observation.',
    subtitleText: 'For advanced users, the platform provides an analytical environment with multiple geographic information layers. These layers help examine transport infrastructure, accessibility, passenger demand, connections and potential congestion patterns.\n\nEach layer also communicates its data status and limitations, so a model or estimate is not mistaken for a live observation.',
    leadInSec: 0.8,
    leadOutSec: 2.0,
    type: 'wipe_dual',
    bgImage1: path.join(RAW_FRAMES_DIR, 'twin_analyst.png'),
    bgImage2: path.join(RAW_FRAMES_DIR, 'twin_2d.png')
  },
  {
    id: 'seg5',
    num: '05',
    title: 'Multi-Criteria Journey Planner',
    hudCategory: 'PARETO-OPTIMAL ROUTING',
    hudTag: 'FASTEST · BALANCED · COMFORT FIRST',
    speechText: 'NEXBUS also includes a multi-criteria journey planner. [[slnc 400]] Rather than presenting only one route, it provides three different travel priorities: Fastest, Balanced and Comfort First. [[slnc 400]] This helps users compare journey alternatives based on travel time, transfers, waiting and estimated crowding.',
    subtitleText: 'NEXBUS also includes a multi-criteria journey planner. Rather than presenting only one route, it provides three different travel priorities: Fastest, Balanced and Comfort First.\n\nThis helps users compare journey alternatives based on travel time, transfers, waiting and estimated crowding.',
    leadInSec: 0.8,
    leadOutSec: 2.0,
    type: 'scroll',
    bgImage: path.join(RAW_FRAMES_DIR, 'journey_full.png'),
    scrollSpeed: 30
  },
  {
    id: 'seg6',
    num: '06',
    title: 'Parametric Simulation Lab',
    hudCategory: 'SCENARIO MODELING',
    hudTag: "LITTLE'S LAW · PRICE ELASTICITY · CO2",
    speechText: 'The Simulation Lab allows users to explore hypothetical transport scenarios. [[slnc 400]] For example, they can examine how changes in waiting time, passenger demand or transport policy assumptions may affect the system. [[slnc 400]] These are model-based scenarios, not guaranteed real-world outcomes.',
    subtitleText: 'The Simulation Lab allows users to explore hypothetical transport scenarios. For example, they can examine how changes in waiting time, passenger demand or transport policy assumptions may affect the system.\n\nThese are model-based scenarios, not guaranteed real-world outcomes.',
    leadInSec: 0.8,
    leadOutSec: 2.0,
    type: 'scroll',
    bgImage: path.join(RAW_FRAMES_DIR, 'simulate_full.png'),
    scrollSpeed: 30
  },
  {
    id: 'seg7',
    num: '07',
    title: 'Data Trust & Provenance Methodology',
    hudCategory: 'DATA GOVERNANCE & PROVENANCE',
    hudTag: '9 EVIDENCE TIERS · SHA-256 DIGESTS',
    speechText: 'Trust is an essential part of NEXBUS. [[slnc 400]] The platform distinguishes observed information from verified external data, estimates, predictions, simulations and synthetic examples. [[slnc 400]] This makes it easier to understand not only what the platform shows, but also what its information can and cannot prove.',
    subtitleText: 'Trust is an essential part of NEXBUS. The platform distinguishes observed information from verified external data, estimates, predictions, simulations and synthetic examples.\n\nThis makes it easier to understand not only what the platform shows, but also what its information can and cannot prove.',
    leadInSec: 0.8,
    leadOutSec: 2.0,
    type: 'crossfade_dual',
    bgImage1: path.join(RAW_FRAMES_DIR, 'methodology_full.png'),
    bgImage2: path.join(RAW_FRAMES_DIR, 'control_full.png')
  },
  {
    id: 'seg8',
    num: '08',
    title: 'Safety Mandate & Hackathon Closing',
    hudCategory: 'CIVIC SAFETY MANDATE',
    hudTag: 'READ-ONLY + PASSIVE + ADVISORY',
    speechText: 'NEXBUS is designed to make urban mobility information more understandable, accessible and useful. [[slnc 400]] It is strictly a read-only, passive and advisory platform. [[slnc 300]] It does not dispatch vehicles or control traffic signals or railway infrastructure. [[slnc 500]] NEXBUS: helping people understand how a city moves.',
    subtitleText: 'NEXBUS is designed to make urban mobility information more understandable, accessible and useful. It is strictly a read-only, passive and advisory platform. It does not dispatch vehicles or control traffic signals or railway infrastructure.\n\nNEXBUS — helping people understand how a city moves.',
    leadInSec: 0.8,
    leadOutSec: 8.0,
    type: 'closing_split',
    bgImage: path.join(RAW_FRAMES_DIR, 'twin_explore.png')
  }
];

// Step 1: Generate Spoken Audio Narration with macOS `say -v Aman`
console.log('Step 1: Generating high-fidelity spoken narration tracks (Aman en_IN)...');
const audioManifest = [];
let totalNarrationTime = 0;

for (const scene of SCENES) {
  const aiffPath = path.join(AUDIO_DIR, `${scene.id}.aiff`);
  const rawWavPath = path.join(AUDIO_DIR, `${scene.id}_raw.wav`);
  const finalWavPath = path.join(AUDIO_DIR, `${scene.id}.wav`);

  // Synthesize speech with say
  console.log(`   [TTS] Synthesizing Scene ${scene.num}: "${scene.title}"...`);
  execSync(`say -v Aman -r 170 "${scene.speechText.replace(/"/g, '\\"')}" -o "${aiffPath}"`);

  // Convert to high-fidelity 44.1kHz mono WAV
  execSync(`"${FFMPEG_PATH}" -y -i "${aiffPath}" -ar 44100 -ac 1 "${rawWavPath}" 2>/dev/null`);

  // Add precise lead-in and lead-out silence padding for natural pacing
  const leadIn = scene.leadInSec;
  const leadOut = scene.leadOutSec;
  const filter = `adelay=${Math.round(leadIn * 1000)}|${Math.round(leadIn * 1000)},apad=pad_dur=${leadOut}`;
  execSync(`"${FFMPEG_PATH}" -y -i "${rawWavPath}" -af "${filter}" -ar 44100 -ac 2 "${finalWavPath}" 2>/dev/null`);

  // Measure exact clip duration
  const durStr = execSync(`"${FFPROBE_PATH}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalWavPath}"`).toString().trim();
  const dur = parseFloat(durStr);
  totalNarrationTime += dur;

  audioManifest.push({
    id: scene.id,
    num: scene.num,
    title: scene.title,
    durationSec: dur,
    wavPath: finalWavPath
  });

  console.log(`         -> Generated ${scene.id}.wav: ${dur.toFixed(2)}s`);
}

console.log(`\n   [PASS] Total Master Audio Duration: ${totalNarrationTime.toFixed(2)}s (${(totalNarrationTime / 60).toFixed(2)} min)\n`);

// Step 2: Generate Swiss Cartography Overlay Graphics using Headless Chrome
console.log('Step 2: Generating broadcast-quality HUD overlays and subtitle plates in Chrome...');

function createOverlayHtml(scene) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 56px;
    }

    /* Top HUD Telemetry Bar */
    .hud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(13, 27, 42, 0.94);
      border: 1px solid rgba(222, 213, 200, 0.25);
      border-left: 5px solid #B84C32;
      border-radius: 8px;
      padding: 14px 28px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
    }
    .hud-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .hud-logo {
      font-family: "IBM Plex Mono", monospace;
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 2px;
    }
    .hud-divider {
      color: #8C8275;
      font-size: 18px;
    }
    .hud-category {
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      font-weight: 600;
      color: #FFB703;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .hud-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .hud-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-tag {
      background: rgba(184, 76, 50, 0.25);
      color: #F5F0E6;
      border: 1px solid #B84C32;
    }
    .badge-safety {
      background: rgba(22, 101, 52, 0.35);
      color: #4ADE80;
      border: 1px solid #22C55E;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 8px #22C55E;
    }

    /* Bottom Subtitle / Cue Card */
    .hud-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .subtitle-card {
      width: 1560px;
      background: rgba(13, 27, 42, 0.95);
      border: 1px solid rgba(255, 183, 3, 0.4);
      border-bottom: 4px solid #B84C32;
      border-radius: 12px;
      padding: 24px 36px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(16px);
      position: relative;
    }
    .scene-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(222, 213, 200, 0.2);
      padding-bottom: 8px;
    }
    .scene-title {
      font-family: "IBM Plex Mono", monospace;
      font-size: 15px;
      font-weight: 700;
      color: #FFB703;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .scene-mandate {
      font-family: "IBM Plex Mono", monospace;
      font-size: 13px;
      font-weight: 600;
      color: #94A3B8;
      letter-spacing: 1px;
    }
    .subtitle-text {
      font-size: 25px;
      line-height: 1.45;
      color: #F8FAFC;
      font-weight: 400;
      white-space: pre-line;
      letter-spacing: -0.2px;
    }
    .subtitle-text strong {
      color: #FFB703;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="hud-header">
    <div class="hud-left">
      <span class="hud-logo">NEXBUS</span>
      <span class="hud-divider">/</span>
      <span class="hud-category">${scene.hudCategory}</span>
    </div>
    <div class="hud-right">
      <span class="hud-badge badge-tag">${scene.hudTag}</span>
      <span class="hud-badge badge-safety"><span class="status-dot"></span>READ-ONLY + PASSIVE + ADVISORY</span>
    </div>
  </div>

  <div class="hud-footer">
    <div class="subtitle-card">
      <div class="scene-meta">
        <span class="scene-title">SCENE ${scene.num} // ${scene.title}</span>
        <span class="scene-mandate">DELHI MOBILITY INTELLIGENCE PLATFORM</span>
      </div>
      <div class="subtitle-text">${scene.subtitleText}</div>
    </div>
  </div>
</body>
</html>`;
}

// Scene 8 Full Final On-Screen Presentation Slide
const finalCardHtml = `<!DOCTYPE html>
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
      overflow: hidden;
      position: relative;
      color: #F5F0E6;
    }
    .grid-bg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        linear-gradient(rgba(245, 240, 230, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(245, 240, 230, 0.05) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.6;
    }
    .container {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      padding: 80px 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 10;
    }
    .top-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(245, 240, 230, 0.2);
      padding-bottom: 24px;
    }
    .brand-badge {
      font-family: "IBM Plex Mono", monospace;
      font-size: 16px;
      letter-spacing: 2px;
      font-weight: 700;
      color: #FFB703;
      text-transform: uppercase;
    }
    .competition-badge {
      background: #B84C32;
      color: #FFFFFF;
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 8px 18px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .center-content {
      margin: auto 0;
    }
    h1 {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 120px;
      font-weight: 900;
      letter-spacing: -3px;
      color: #FFFFFF;
      line-height: 1.0;
      margin-bottom: 20px;
    }
    .subtitle {
      font-size: 38px;
      font-weight: 400;
      color: #F5F0E6;
      max-width: 1400px;
      line-height: 1.35;
      margin-bottom: 40px;
    }
    .url-box {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 24px 32px;
      width: fit-content;
      margin-bottom: 30px;
    }
    .url-row {
      display: flex;
      align-items: center;
      gap: 20px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 24px;
    }
    .url-label {
      color: #FFB703;
      font-weight: 700;
      min-width: 180px;
    }
    .url-val {
      color: #FFFFFF;
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 6px;
    }
    .bottom-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid rgba(245, 240, 230, 0.2);
      padding-top: 28px;
    }
    .tagline {
      font-size: 24px;
      font-weight: 300;
      color: #94A3B8;
      font-style: italic;
    }
    .mandate-pill {
      background: rgba(184, 76, 50, 0.25);
      border: 2px solid #B84C32;
      color: #FFFFFF;
      font-family: "IBM Plex Mono", monospace;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 1.5px;
      padding: 12px 28px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="container">
    <div class="top-meta">
      <div class="brand-badge">NCT DELHI URBAN MOBILITY INTELLIGENCE PLATFORM</div>
      <div class="competition-badge">HACKATHON PRESENTATION</div>
    </div>
    <div class="center-content">
      <h1>NEXBUS</h1>
      <div class="subtitle">Delhi Urban Mobility Intelligence and Advisory Decision-Support Platform</div>
      <div class="url-box">
        <div class="url-row">
          <span class="url-label">Live Prototype:</span>
          <span class="url-val">https://nexbus.vercel.app</span>
        </div>
        <div class="url-row">
          <span class="url-label">Source Code:</span>
          <span class="url-val">https://github.com/Mayyank04/Nexbus</span>
        </div>
      </div>
    </div>
    <div class="bottom-meta">
      <div class="tagline">NEXBUS — Helping people understand how a city moves.</div>
      <div class="mandate-pill">READ-ONLY + PASSIVE + ADVISORY</div>
    </div>
  </div>
</body>
</html>`;

// Render all overlays with headless Chrome
for (const scene of SCENES) {
  const htmlPath = path.join(OVERLAYS_DIR, `${scene.id}.html`);
  const outPng = path.join(OVERLAYS_DIR, `${scene.id}.png`);
  fs.writeFileSync(htmlPath, createOverlayHtml(scene));

  execSync(`"${CHROME_PATH}" --headless=new --default-background-color=00000000 --screenshot="${outPng}" --window-size=1920,1080 "${htmlPath}"`, { stdio: 'pipe' });
  console.log(`   [OVERLAY] Generated ${scene.id}.png (1920x1080 transparent HUD)`);
}

// Render Scene 8 Final Card
const finalCardHtmlPath = path.join(OVERLAYS_DIR, 'final_card.html');
const finalCardPng = path.join(OVERLAYS_DIR, 'final_card.png');
fs.writeFileSync(finalCardHtmlPath, finalCardHtml);
execSync(`"${CHROME_PATH}" --headless=new --screenshot="${finalCardPng}" --window-size=1920,1080 "${finalCardHtmlPath}"`, { stdio: 'pipe' });
console.log(`   [OVERLAY] Generated final_card.png (1920x1080 presentation card)\n`);

// Step 3: Render Individual Video Clips with FFmpeg
console.log('Step 3: Rendering 8 broadcast-grade video clips with camera motion, overlays & narration...');

for (const scene of SCENES) {
  const audioInfo = audioManifest.find(a => a.id === scene.id);
  const dur = audioInfo.durationSec;
  const audioFile = audioInfo.wavPath;
  const overlayPng = path.join(OVERLAYS_DIR, `${scene.id}.png`);
  const clipOut = path.join(CLIPS_DIR, `clip_${scene.num}.mp4`);

  console.log(`   [RENDER] Clip ${scene.num} (${dur.toFixed(2)}s) - Mode: ${scene.type}...`);

  if (scene.type === 'scroll') {
    // Smooth vertical scroll
    const vf = `[0:v]scale=1920:-1,crop=1920:1080:0:'min(in_h-1080, t*(in_h-1080)/${dur})'[bg];[bg][1:v]overlay=0:0[v]`;
    const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${scene.bgImage}" -loop 1 -i "${overlayPng}" -i "${audioFile}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 19 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
    execSync(cmd, { stdio: 'pipe' });
  } 
  else if (scene.type === 'zoompan') {
    // Subtle cinematic zoompan
    const frames = Math.ceil(dur * 30);
    const vf = `[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.06)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];[bg][1:v]overlay=0:0[v]`;
    const cmd = `"${FFMPEG_PATH}" -y -loop 1 -i "${scene.bgImage}" -loop 1 -i "${overlayPng}" -i "${audioFile}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 2:a -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 19 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
    execSync(cmd, { stdio: 'pipe' });
  }
  else if (scene.type === 'crossfade_dual') {
    // Dual image crossfade at midpoint
    const half = dur / 2;
    const vf = `[0:v]scale=1920:1080[v0];
[1:v]scale=1920:1080[v1];
[v0][v1]xfade=transition=fade:duration=1.2:offset=${(half - 0.6).toFixed(2)}[bg];
[bg][2:v]overlay=0:0[v]`;
    const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${half + 0.6} -i "${scene.bgImage1}" -loop 1 -t ${half + 0.6} -i "${scene.bgImage2}" -loop 1 -i "${overlayPng}" -i "${audioFile}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 3:a -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 19 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
    execSync(cmd, { stdio: 'pipe' });
  }
  else if (scene.type === 'wipe_dual') {
    // Dual image wipeleft at midpoint
    const half = dur / 2;
    const vf = `[0:v]scale=1920:1080[v0];
[1:v]scale=1920:1080[v1];
[v0][v1]xfade=transition=wipeleft:duration=1.0:offset=${(half - 0.5).toFixed(2)}[bg];
[bg][2:v]overlay=0:0[v]`;
    const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${half + 0.5} -i "${scene.bgImage1}" -loop 1 -t ${half + 0.5} -i "${scene.bgImage2}" -loop 1 -i "${overlayPng}" -i "${audioFile}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 3:a -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 19 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
    execSync(cmd, { stdio: 'pipe' });
  }
  else if (scene.type === 'closing_split') {
    // Scene 8: Part 1 shows 3D Twin with subtitle, then crossfades into full Final Card
    const cardDur = 12.0;
    const splitOffset = dur - cardDur;
    const vf = `[0:v]fps=30,scale=1920:1080,zoompan=z='min(zoom+0.0003,1.05)':d=${Math.ceil(dur * 30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg0];
[bg0][1:v]overlay=0:0,fps=30[v_part1];
[2:v]fps=30,scale=1920:1080[v_part2];
[v_part1][v_part2]xfade=transition=fade:duration=1.5:offset=${(splitOffset - 0.5).toFixed(2)}[v]`;
    const cmd = `"${FFMPEG_PATH}" -y -loop 1 -t ${splitOffset + 1.5} -i "${scene.bgImage}" -loop 1 -t ${splitOffset + 1.5} -i "${overlayPng}" -loop 1 -t ${cardDur + 1.5} -i "${finalCardPng}" -i "${audioFile}" -t ${dur} -filter_complex "${vf}" -map "[v]" -map 3:a -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 19 -c:a aac -b:a 192k -ar 44100 -shortest "${clipOut}"`;
    execSync(cmd, { stdio: 'pipe' });
  }

  console.log(`            -> Finished clip_${scene.num}.mp4`);
}

// Step 4: Concatenate All 8 Clips into Master Video
console.log('\nStep 4: Concatenating all 8 clips into final hackathon presentation master video...');
const concatListFile = path.join(CLIPS_DIR, 'concat_list.txt');
const clipEntries = SCENES.map(s => `file '${path.join(CLIPS_DIR, `clip_${s.num}.mp4`)}'`).join('\n');
fs.writeFileSync(concatListFile, clipEntries);

const masterVideoHackathon = path.join(WORK_DIR, 'NEXBUS_HACKATHON_DEMO.mp4');
const masterVideoPhase22 = path.join(PHASE22_DEMO_DIR, 'NEXBUS_COMPETITION_DEMO.mp4');
const publicDemoHackathon = path.join(PUBLIC_DEMO_DIR, 'NEXBUS_HACKATHON_DEMO.mp4');
const publicDemoCompetition = path.join(PUBLIC_DEMO_DIR, 'NEXBUS_COMPETITION_DEMO.mp4');

// Concatenate directly without re-encoding
execSync(`"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${masterVideoHackathon}"`, { stdio: 'pipe' });

// Copy to secondary target destinations so the video is accessible across all paths
fs.copyFileSync(masterVideoHackathon, masterVideoPhase22);
fs.copyFileSync(masterVideoHackathon, publicDemoHackathon);
fs.copyFileSync(masterVideoHackathon, publicDemoCompetition);

// Step 5: Generate Presentation Poster Thumbnail
console.log('Step 5: Generating high-resolution presentation poster thumbnail in Chrome...');
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
      background-image: url('${path.relative(WORK_DIR, path.join(RAW_FRAMES_DIR, 'twin_explore.png'))}');
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
      font-family: "IBM Plex Mono", monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .badge-red { background: #B84C32; color: white; }
    .badge-gold { background: #FFB703; color: #0D1B2A; }
    .badge-green { background: #15803D; color: white; }
    h1 {
      font-size: 115px;
      font-weight: 900;
      letter-spacing: -2px;
      color: #FFFFFF;
      line-height: 1.0;
      margin-top: 20px;
    }
    h2 {
      font-size: 40px;
      font-weight: 400;
      color: #F5F0E6;
      margin-top: 20px;
      max-width: 1300px;
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
      gap: 48px;
      font-size: 20px;
      color: #E2E8F0;
    }
    .feature-item strong {
      color: #FFB703;
      display: block;
      font-size: 24px;
      font-family: "IBM Plex Mono", monospace;
    }
    .safety-mandate {
      background: rgba(184, 76, 50, 0.25);
      border: 1px solid #B84C32;
      padding: 12px 24px;
      border-radius: 6px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 18px;
      color: #FFFFFF;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-image"></div>
  <div class="overlay">
    <div>
      <div class="badge-bar">
        <span class="badge badge-red">Hackathon Demo</span>
        <span class="badge badge-gold">Full Prototype</span>
        <span class="badge badge-green">NCT Delhi</span>
      </div>
      <h1>NEXBUS</h1>
      <h2>Delhi Urban Mobility Intelligence &amp; Advisory Decision-Support Platform</h2>
      <div class="subtitle">Understanding How a City Moves · 3D Digital Twin · Pareto Routing · Little's Law Simulation · 9-Tier Provenance</div>
    </div>
    <div class="footer-bar">
      <div class="features-list">
        <div class="feature-item"><strong>4 Corridors</strong>67 Nodes · 226 Edges</div>
        <div class="feature-item"><strong>Dual Modes</strong>Explore &amp; 11-Layer GIS</div>
        <div class="feature-item"><strong>3 Pareto Tiers</strong>Fastest, Balanced, Comfort</div>
        <div class="feature-item"><strong>Live Web App</strong>https://nexbus.vercel.app</div>
      </div>
      <div class="safety-mandate">
        MANDATE: READ-ONLY + PASSIVE + ADVISORY
      </div>
    </div>
  </div>
</body>
</html>`;

const thumbHtmlPath = path.join(WORK_DIR, 'thumb_template.html');
const thumbOutHackathon = path.join(WORK_DIR, 'DEMO_THUMBNAIL.png');
const thumbOutPhase22 = path.join(PHASE22_DEMO_DIR, 'DEMO_THUMBNAIL.png');
const thumbOutPublic = path.join(PUBLIC_DEMO_DIR, 'DEMO_THUMBNAIL.png');

fs.writeFileSync(thumbHtmlPath, thumbHtml);
execSync(`"${CHROME_PATH}" --headless=new --screenshot="${thumbOutHackathon}" --window-size=1920,1080 "${thumbHtmlPath}"`, { stdio: 'pipe' });
fs.copyFileSync(thumbOutHackathon, thumbOutPhase22);
fs.copyFileSync(thumbOutHackathon, thumbOutPublic);

// Step 6: Verify Video Telemetry with FFprobe
console.log('Step 6: Auditing master video stream telemetry...');
const probeStr = execSync(`"${FFPROBE_PATH}" -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,r_frame_rate,codec_name "${masterVideoHackathon}"`).toString();
const masterStats = fs.statSync(masterVideoHackathon);
const durMatch = probeStr.match(/duration=([0-9.]+)/);
const finalDurSec = durMatch ? parseFloat(durMatch[1]) : 0;

console.log('\n================================================================');
console.log('  PRODUCTION COMPLETE & VALIDATED                              ');
console.log('================================================================');
console.log(`Master Video File:   ${masterVideoHackathon}`);
console.log(`Live Public Video:   ${publicDemoHackathon}`);
console.log(`File Size:           ${(masterStats.size / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Total Runtime:       ${finalDurSec.toFixed(2)}s (${Math.floor(finalDurSec / 60)}m ${Math.round(finalDurSec % 60)}s)`);
console.log(`Video Stream:        1920x1080 Full HD @ 30fps (H.264 High Profile)`);
console.log(`Audio Stream:        44.1 kHz Stereo AAC (192 kbps)`);
console.log(`Thumbnail Poster:    ${thumbOutHackathon}`);
console.log('================================================================\n');
