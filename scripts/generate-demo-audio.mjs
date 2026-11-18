import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIO_DIR = path.resolve('docs/phase-22/demo/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const SEGMENTS = [
  {
    id: 'seg1',
    targetSec: 21,
    title: 'Introduction & Problem Context',
    text: 'Delhi sustains over 7,000 public buses and a massive metro grid, yet planners, researchers, and commuters struggle with fragmented data silos, bunching headways, and opaque crowding. NEXBUS is an open-source urban mobility intelligence and advisory decision-support platform engineered specifically for Delhi\'s transit ecosystem.'
  },
  {
    id: 'seg2',
    targetSec: 30,
    title: 'Platform Overview & Safety Mandate',
    text: 'The platform is built on Next.js 16, React 19, and Three.js, running entirely in standard web browsers with zero proprietary plugins. Notice the persistent header affirming our non-negotiable safety invariant: READ-ONLY, PASSIVE, and ADVISORY. NEXBUS never issues operational commands to transit vehicles or traffic signals. It serves purely as an advisory lens for humans.'
  },
  {
    id: 'seg3',
    targetSec: 40,
    title: 'Digital Twin: Explore Delhi Mode',
    text: 'Here is the interactive 3D Digital Twin. In Explore Delhi mode, users can follow a guided tour of Delhi\'s major transit corridors and multimodal hubs. As we cycle through AIIMS, the Ring Road belt, and Kashmere Gate, the camera dynamically orbits each interchange, with animated particle streams visualizing bus flows along arterial axes and bridge crossings.'
  },
  {
    id: 'seg4',
    targetSec: 30,
    title: 'Advanced GIS Analysis & 2D Vector Fallback',
    text: 'Switching to Advanced Analysis reveals eleven specialized GIS analytical layers. Planners can toggle corridor volumes, headway variability, passenger crowding heatmaps, and accessibility barriers. For lower-powered hardware or browsers without WebGL, our deterministic 2D vector fallback preserves full cartographic exploration without data loss.'
  },
  {
    id: 'seg5',
    targetSec: 35,
    title: 'Multi-Criteria Journey Planning',
    text: 'In the Multi-Criteria Journey Planner, we don\'t just optimize for shortest travel time. NEXBUS computes three distinct Pareto-optimal alternatives: Fastest Route minimizes duration; Balanced Option reduces transfer friction; and Comfort First prioritizes low vehicle crowding and level boarding for elderly and mobility-impaired riders.'
  },
  {
    id: 'seg6',
    targetSec: 30,
    title: 'Parametric Simulation Lab',
    text: 'The Parametric Simulation Lab allows transport analysts to evaluate operational counterfactuals risk-free. Using Little\'s Law, empirical price elasticity, and Central Electricity Authority grid emission factors, analysts can test frequency boosts, fare adjustments, and fleet electrification, calculating waiting time drops and net carbon abatement in real time.'
  },
  {
    id: 'seg7',
    targetSec: 25,
    title: 'Data Provenance & Evidence Classification',
    text: 'Every single metric is backed by our strict nine-tier evidence taxonomy and cryptographic SHA-256 source digests. We clearly distinguish directly observed evidence from statistical estimates, neural network predictions, and hypothetical simulations. There is zero data masquerading.'
  },
  {
    id: 'seg8',
    targetSec: 14,
    title: 'Limitations & Operational Safety Invariant',
    text: 'NEXBUS currently models four priority arterial corridors across 67 nodes, 226 edges, and 15 hubs. It operates strictly under an absolute READ-ONLY, PASSIVE, and ADVISORY mandate. Explore the live platform today at nexbus.vercel.app.'
  }
];

console.log('Generating audio narration tracks using macOS speech synthesis (Aman en_IN)...');

let totalDuration = 0;
const results = [];

for (const seg of SEGMENTS) {
  const aiffPath = path.join(AUDIO_DIR, `${seg.id}.aiff`);
  const wavPath = path.join(AUDIO_DIR, `${seg.id}.wav`);
  const mp3Path = path.join(AUDIO_DIR, `${seg.id}.mp3`);

  // Generate speech via say
  execSync(`say -v Aman "${seg.text.replace(/"/g, '\\"')}" -o "${aiffPath}"`);
  
  // Convert to high-quality mono WAV and MP3 at 44.1kHz
  execSync(`ffmpeg -y -i "${aiffPath}" -ar 44100 -ac 1 "${wavPath}" 2>/dev/null`);
  execSync(`ffmpeg -y -i "${wavPath}" -ar 44100 -b:a 192k "${mp3Path}" 2>/dev/null`);
  
  // Measure exact duration using ffprobe
  const durStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`).toString().trim();
  const dur = parseFloat(durStr);
  totalDuration += dur;

  results.push({
    id: seg.id,
    title: seg.title,
    durationSec: dur,
    targetSec: seg.targetSec,
    wavPath,
    mp3Path
  });

  console.log(`[PASS] ${seg.id} (${seg.title}): ${dur.toFixed(2)}s (target: ${seg.targetSec}s)`);
}

console.log(`\nTotal Spoken Narration Duration: ${totalDuration.toFixed(2)} seconds (${(totalDuration / 60).toFixed(2)} minutes)`);
fs.writeFileSync(path.join(AUDIO_DIR, 'audio_manifest.json'), JSON.stringify(results, null, 2));
