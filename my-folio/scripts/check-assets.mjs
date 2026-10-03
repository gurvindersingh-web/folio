import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DIRS_TO_CHECK = ['public', 'src/assets'];
const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB
const MAX_VIDEO_SIZE = 1 * 1024 * 1024; // 1 MB

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const videoExts = new Set(['.mp4', '.webm', '.ogg', '.mov']);

// Legacy exceptions to prevent breaking the build for pre-existing large assets
const EXCEPTIONS = [
  'Pasted image (2).png',
  'Pasted image (3).png',
  'Pasted image.png',
  'screenshot-2026-09-12_17-57-32.png',
  'ink_lv2_slow.webp',
  'omarchy.png',
  'ppf_1080p_fixed-Picsart-AiImageEnhancer.webp',
  'omarchy.mp4',
  'omarchy.webm',
  'screenrecording-2026-09-04_22-01-08.mp4',
  'screenrecording-2026-09-04_22-01-08.webm',
  'screenrecording-2026-09-11_21-59-54.mp4',
  'screenrecording-2026-09-11_21-59-54.webm'
];

let hasError = false;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      if (EXCEPTIONS.includes(file)) continue;

      const ext = path.extname(file).toLowerCase();
      
      if (imageExts.has(ext)) {
        if (stat.size > MAX_IMAGE_SIZE) {
          console.error(`ERROR: Image ${fullPath} is ${(stat.size / 1024).toFixed(2)} KB (limit: 200 KB)`);
          hasError = true;
        }
      } else if (videoExts.has(ext)) {
        if (stat.size > MAX_VIDEO_SIZE) {
          console.error(`ERROR: Video ${fullPath} is ${(stat.size / 1024 / 1024).toFixed(2)} MB (limit: 1 MB)`);
          hasError = true;
        }
      }
    }
  }
}

DIRS_TO_CHECK.forEach(dir => scanDir(path.join(projectRoot, dir)));

if (hasError) {
  process.exit(1);
} else {
  console.log('Asset size check passed.');
}
