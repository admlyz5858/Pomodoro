/**
 * Icon generator for Focus Universe.
 *
 * Usage: node scripts/generate-icons.js
 *
 * Generates PNG icons from the SVG source at public/favicon.svg
 * for PWA manifest and Android/iOS resources.
 *
 * Requires: npm install -D sharp
 * If sharp is not installed, the script will create placeholder
 * SVG-based HTML files that can be screenshotted.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicIcons = join(rootDir, 'public', 'icons');
const resources = join(rootDir, 'resources');

if (!existsSync(publicIcons)) mkdirSync(publicIcons, { recursive: true });
if (!existsSync(resources)) mkdirSync(resources, { recursive: true });

const sizes = [72, 96, 128, 144, 192, 512];

function createSvgIcon(size) {
  const pad = size * 0.15;
  const r = (size - pad * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const clockR = r * 0.7;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#0a0a12"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#8b5cf6" opacity="0.9"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.85}" fill="#0a0a12" opacity="0.3"/>
  <circle cx="${cx}" cy="${cy}" r="${clockR}" fill="none" stroke="#f1f0f5" stroke-width="${Math.max(1.5, size * 0.015)}" opacity="0.7"/>
  <line x1="${cx}" y1="${cx}" x2="${cx}" y2="${cy - clockR * 0.65}" stroke="#f1f0f5" stroke-width="${Math.max(2, size * 0.02)}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${cx + clockR * 0.45}" y2="${cy}" stroke="#f1f0f5" stroke-width="${Math.max(1.5, size * 0.015)}" stroke-linecap="round" opacity="0.8"/>
  <circle cx="${cx}" cy="${cy}" r="${Math.max(2, size * 0.025)}" fill="#f1f0f5"/>
</svg>`;
}

async function generate() {
  let useSharp = false;
  let sharp;

  try {
    sharp = (await import('sharp')).default;
    useSharp = true;
    console.log('Using sharp for PNG generation');
  } catch {
    console.log('sharp not available — generating SVG icons (install sharp for PNG)');
  }

  for (const size of sizes) {
    const svg = createSvgIcon(size);
    const svgPath = join(publicIcons, `icon-${size}.svg`);
    writeFileSync(svgPath, svg);

    if (useSharp) {
      const pngPath = join(publicIcons, `icon-${size}.png`);
      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath);
      console.log(`  ✓ ${pngPath}`);
    }
  }

  // Android adaptive icon (foreground)
  const fgSvg = createSvgIcon(432);
  writeFileSync(join(resources, 'icon-foreground.svg'), fgSvg);

  // Splash screen SVG
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2400" viewBox="0 0 1200 2400">
  <rect width="1200" height="2400" fill="#0a0a12"/>
  <circle cx="600" cy="1100" r="120" fill="#8b5cf6" opacity="0.9"/>
  <circle cx="600" cy="1100" r="100" fill="#0a0a12" opacity="0.3"/>
  <circle cx="600" cy="1100" r="80" fill="none" stroke="#f1f0f5" stroke-width="3" opacity="0.7"/>
  <line x1="600" y1="1100" x2="600" y2="1040" stroke="#f1f0f5" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="600" y1="1100" x2="640" y2="1100" stroke="#f1f0f5" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
  <circle cx="600" cy="1100" r="4" fill="#f1f0f5"/>
  <text x="600" y="1300" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="600" fill="#f1f0f5">
    <tspan fill="#8b5cf6">Focus</tspan> Universe
  </text>
</svg>`;
  writeFileSync(join(resources, 'splash.svg'), splashSvg);

  if (useSharp) {
    await sharp(Buffer.from(splashSvg)).resize(1200, 2400).png().toFile(join(resources, 'splash.png'));
    console.log('  ✓ resources/splash.png');
  }

  console.log('\nIcon generation complete!');
  if (!useSharp) {
    console.log('Note: Install sharp for PNG output: npm install -D sharp');
    console.log('SVG icons were created — browsers support SVG icons in manifests.');
  }
}

generate().catch(console.error);
