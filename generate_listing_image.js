#!/usr/bin/env node
/**
 * generate_listing_image.js
 * Generates a branded property listing image (1080x1080, IG-optimized) 
 * using HTML + Puppeteer or fallback to a simple SVG.
 * 
 * Usage: node generate_listing_image.js <listing.json>
 * 
 * Output: ./output/<listingNo>.png (or .svg if puppeteer unavailable)
 */

const fs = require('fs');
const path = require('path');

const listingFile = process.argv[2];
if (!listingFile) {
  console.error('Usage: node generate_listing_image.js <listing.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(listingFile, 'utf-8'));
const listingNo = data.listingNo || `R${data.dateAdded?.replace(/-/g, '') || '000000'}-${String(data.id).padStart(2, '0')}`;
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const outputPath = path.join(outputDir, `${listingNo}.svg`);

function fmtPrice(p) {
  if (data.type === 'rent') return `HK$${(p/1).toLocaleString()}/月`;
  return `HK$${(p/1).toLocaleString()}`;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c4a6e"/>
      <stop offset="40%" style="stop-color:#0369a1"/>
      <stop offset="70%" style="stop-color:#0ea5e9"/>
      <stop offset="100%" style="stop-color:#7dd3fc"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95"/>
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1080" fill="url(#bg)"/>

  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.05)"/>
  <circle cx="980" cy="900" r="120" fill="rgba(255,255,255,0.05)"/>
  <circle cx="200" cy="950" r="40" fill="rgba(255,255,255,0.08)"/>
  <circle cx="850" cy="150" r="50" fill="rgba(255,255,255,0.06)"/>

  <!-- Agency Name Top -->
  <text x="540" y="110" font-family="'Segoe UI','Noto Sans SC',sans-serif" font-size="36" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="2">富榮地產</text>
  <text x="540" y="150" font-family="'Segoe UI',sans-serif" font-size="18" font-weight="300" fill="rgba(255,255,255,0.6)" text-anchor="middle">Nelson Property Agency</text>
  <line x1="380" y1="170" x2="700" y2="170" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>

  <!-- Main Card -->
  <rect x="90" y="220" width="900" height="640" rx="24" fill="url(#card)" filter="url(#shadow)"/>
  
  <!-- Status Badge -->
  <rect x="120" y="248" width="${data.type === 'rent' ? '80' : '70'}" height="36" rx="18" fill="${data.type === 'rent' ? '#f59e0b' : '#0284c7'}"/>
  <text x="${data.type === 'rent' ? '162' : '157'}" y="272" font-family="'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${data.type === 'rent' ? '出租' : '售盤'}</text>

  <!-- Listing Info -->
  <text x="540" y="310" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="40" font-weight="700" fill="#1e293b" text-anchor="middle">${data.district.zh}</text>
  <text x="540" y="350" font-family="'Segoe UI',sans-serif" font-size="22" font-weight="400" fill="#64748b" text-anchor="middle">${data.district.en}</text>

  <!-- Divider -->
  <line x1="200" y1="380" x2="880" y2="380" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Price -->
  <text x="540" y="450" font-family="'Segoe UI',sans-serif" font-size="52" font-weight="700" fill="#0284c7" text-anchor="middle">${fmtPrice(data.price)}</text>

  <!-- Key Specs -->
  ${data.size ? `<g>
    <text x="300" y="530" font-family="'Segoe UI',sans-serif" font-size="36" font-weight="700" fill="#1e293b" text-anchor="middle">${data.size}</text>
    <text x="300" y="558" font-family="'Segoe UI',sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">實用面積</text>
  </g>` : ''}
  ${data.bedrooms ? `<g>
    <text x="540" y="530" font-family="'Segoe UI',sans-serif" font-size="36" font-weight="700" fill="#1e293b" text-anchor="middle">${data.bedrooms}</text>
    <text x="540" y="558" font-family="'Segoe UI',sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">睡房</text>
  </g>` : ''}
  ${data.layout ? `<g>
    <text x="780" y="530" font-family="'Segoe UI',sans-serif" font-size="30" font-weight="600" fill="#1e293b" text-anchor="middle">${data.layout}</text>
    <text x="780" y="558" font-family="'Segoe UI',sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">間隔</text>
  </g>` : ''}

  <!-- Tags -->
  <g>
  ${data.tags.slice(0, 4).map((t, i) => {
    const x = 540 - (data.tags.slice(0, 4).length * 55) + i * 110;
    return `<rect x="${x - 45}" y="600" width="90" height="32" rx="16" fill="#e0f2fe"/>
      <text x="${x}" y="621" font-family="'Segoe UI',sans-serif" font-size="14" fill="#0369a1" text-anchor="middle">${t}</text>`;
  }).join('')}
  </g>

  <!-- Meta Info -->
  <text x="540" y="750" font-family="'Segoe UI',sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">
    盤號: ${listingNo} | 刊登: ${data.dateAdded || '-'}
  </text>

  <!-- CTA -->
  <rect x="340" y="790" width="400" height="56" rx="28" fill="#25D366"/>
  <text x="540" y="826" font-family="'Segoe UI',sans-serif" font-size="22" font-weight="600" fill="#fff" text-anchor="middle">📲 WhatsApp 查詢 +852 9348 6774</text>

  <!-- Footer -->
  <text x="540" y="900" font-family="'Segoe UI',sans-serif" font-size="13" fill="rgba(255,255,255,0.5)" text-anchor="middle">富榮地產 Nelson Property Agency · 牌照 E-137150</text>
  <text x="540" y="930" font-family="'Segoe UI',sans-serif" font-size="12" fill="rgba(255,255,255,0.3)" text-anchor="middle">nelsonpropertyagency.com</text>

  <!-- Watermark -->
  <text x="540" y="1040" font-family="'Segoe UI',sans-serif" font-size="11" fill="rgba(255,255,255,0.15)" text-anchor="middle">Generated by 富榮地產 · For social media posting</text>
</svg>`;

fs.writeFileSync(outputPath, svg, 'utf-8');
console.log(`✅ Image generated: ${outputPath}`);

// Also output the file path for easy reference
console.log(`\n📂 Output folder: ${outputDir}`);
