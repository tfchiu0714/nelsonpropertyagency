#!/usr/bin/env node
/**
 * generate_social_posts.js
 * Generates RedNote (3:4 portrait) and IG (1:1 square) SVG posts 
 * for all listings using the Property Listing Algorithmic Strategist approach.
 * 
 * Usage: node generate_social_posts.js
 * Output: ./output/posts/
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output', 'posts');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Load all listings from index.html JS data
const listings = [
  { id: 1, listingNo: "R20260516-01", type: "sale", district: { en: "Lun Chun Street", zh: "麟祥街" }, size: 543, price: 4550000, bedrooms: 0, bathrooms: 0, layout: "不交吉", tags: ["收租", "投資"], mtrStation: "", schoolNet: "" },
  { id: 2, listingNo: "R20260516-02", type: "sale", district: { en: "Luk Ming Street", zh: "鹿鳴街" }, size: 257, price: 1900000, bedrooms: 0, bathrooms: 0, layout: "開放式", tags: ["收租", "葵涌", "上車盤"], mtrStation: "葵涌", schoolNet: "" },
  { id: 3, listingNo: "R20260516-03", type: "sale", district: { en: "Ming Tak Building", zh: "名德大樓" }, size: 284, price: 1880000, bedrooms: 1, bathrooms: 0, layout: "一房兩廳", tags: ["交吉", "上車盤", "葵涌"], mtrStation: "葵涌", schoolNet: "" },
  { id: 4, listingNo: "R20260516-04", type: "sale", district: { en: "Lung To Street", zh: "龍圖街" }, size: 498, price: 3890000, bedrooms: 0, bathrooms: 0, layout: "交吉", tags: ["交吉", "實用"], mtrStation: "", schoolNet: "" },
  { id: 5, listingNo: "R20260516-05", type: "sale", district: { en: "Ying Yeung Street", zh: "鷹揚街" }, size: 457, price: 3280000, bedrooms: 2, bathrooms: 1, layout: "兩房一廳", tags: ["自住", "實用"], mtrStation: "", schoolNet: "" },
  { id: 6, listingNo: "R20260516-06", type: "sale", district: { en: "Tung Hoi Building", zh: "東海大廈" }, size: 361, price: 2980000, bedrooms: 0, bathrooms: 0, layout: "連平台", tags: ["連平台", "交吉", "荀盤"], mtrStation: "", schoolNet: "" },
  { id: 7, listingNo: "R20260516-07", type: "sale", district: { en: "Kowloon City Road", zh: "九龍城道" }, size: 301, price: 2100000, bedrooms: 2, bathrooms: 0, layout: "兩房一廳", tags: ["收租", "唐樓", "分契"], mtrStation: "土瓜灣", schoolNet: "34" },
  { id: 8, listingNo: "R20260516-08", type: "rent", district: { en: "King's Court", zh: "金都豪苑" }, size: 0, price: 4200, bedrooms: 0, bathrooms: 0, layout: "車位", tags: ["車位", "招租"], mtrStation: "", schoolNet: "" },
  { id: 9, listingNo: "R20260516-09", type: "sale", district: { en: "Kin On Building", zh: "建安大廈" }, size: 320, price: 3780000, bedrooms: 2, bathrooms: 1, layout: "兩房一廳", tags: ["自住", "上車"], mtrStation: "", schoolNet: "" },
  { id: 10, listingNo: "R20260516-10", type: "sale", district: { en: "Lung To Street", zh: "龍圖街" }, size: 531, price: 3950000, bedrooms: 2, bathrooms: 1, layout: "兩房一廳", tags: ["唐樓", "實用", "大單位"], mtrStation: "", schoolNet: "" },
  { id: 11, listingNo: "R20260516-11", type: "sale", district: { en: "Ying Yeung Street", zh: "鷹揚街" }, size: 457, price: 3280000, bedrooms: 2, bathrooms: 1, layout: "兩房一廳", tags: ["唐樓", "自住", "實用"], mtrStation: "", schoolNet: "" },
  { id: 12, listingNo: "R20260516-12", type: "sale", district: { en: "Tung Hoi Building", zh: "東海大廈" }, size: 361, price: 3500000, bedrooms: 0, bathrooms: 0, layout: "高層單邊", tags: ["單邊", "高層", "多窗"], mtrStation: "", schoolNet: "" }
];

function fmtPrice(d) {
  const n = d.price;
  if (d.type === 'rent') return `HK$${n.toLocaleString()}/月`;
  return `HK$${n.toLocaleString()}`;
}

function fmtPriceShort(d) {
  const n = d.price;
  if (n >= 10000000) return `$${(n/10000000).toFixed(1)}千萬`;
  if (n >= 10000) return `$${(n/10000).toFixed(0)}萬`;
  return `$${n.toLocaleString()}`;
}

function fmtPsf(d) {
  if (!d.size) return '';
  return `$${Math.round(d.price / d.size).toLocaleString()}/呎`;
}

// ─── Generate IG card (1080x1080) ───
function genIGCard(data) {
  const psf = fmtPsf(data);
  const pShort = fmtPriceShort(data);
  const pFull = fmtPrice(data);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c4a6e"/>
      <stop offset="50%" style="stop-color:#0369a1"/>
      <stop offset="100%" style="stop-color:#0ea5e9"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="12" flood-opacity="0.15"/></filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <!-- Subtle pattern -->
  <rect width="1080" height="1080" fill="rgba(255,255,255,0.03)" rx="0" ry="0"/>

  <!-- Agency Header -->
  <text x="540" y="90" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="32" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="3">富榮地產</text>
  <text x="540" y="120" font-family="'Segoe UI',sans-serif" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">Nelson Property Agency · E-137150</text>

  <!-- Type Badge -->
  <rect x="460" y="145" width="160" height="34" rx="17" fill="${data.type === 'rent' ? '#f59e0b' : '#38bdf8'}"/>
  <text x="540" y="168" font-family="'Segoe UI',sans-serif" font-size="16" font-weight="600" fill="#fff" text-anchor="middle">${data.type === 'rent' ? '🔑 招租' : '🏠 售盤'}</text>

  <!-- Main Content Card -->
  <rect x="60" y="200" width="960" height="660" rx="24" fill="#fff" filter="url(#shadow)"/>

  <!-- District Header -->
  <text x="540" y="270" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="42" font-weight="700" fill="#1e293b" text-anchor="middle">${data.district.zh} ${data.district.en}</text>
  <text x="540" y="305" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="18" fill="#64748b" text-anchor="middle">${data.layout}</text>

  <line x1="180" y1="325" x2="900" y2="325" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- Price Highlight -->
  <text x="540" y="395" font-family="'Segoe UI',sans-serif" font-size="56" font-weight="700" fill="#0284c7" text-anchor="middle">${pFull}</text>
  ${psf ? `<text x="540" y="425" font-family="'Segoe UI',sans-serif" font-size="20" fill="#64748b" text-anchor="middle">${psf}</text>` : ''}

  <!-- Specs Grid -->
  <!-- Size -->
  <rect x="120" y="460" width="160" height="80" rx="12" fill="#f0f9ff"/>
  <text x="200" y="500" font-family="'Segoe UI',sans-serif" font-size="32" font-weight="700" fill="#0369a1" text-anchor="middle">${data.size || '-'}</text>
  <text x="200" y="525" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">實用面積 sq ft</text>

  <!-- Bedrooms -->
  <rect x="380" y="460" width="160" height="80" rx="12" fill="#f0f9ff"/>
  <text x="460" y="500" font-family="'Segoe UI',sans-serif" font-size="32" font-weight="700" fill="#0369a1" text-anchor="middle">${data.bedrooms || '-'}</text>
  <text x="460" y="525" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">睡房</text>

  <!-- Layout -->
  <rect x="640" y="460" width="160" height="80" rx="12" fill="#f0f9ff"/>
  <text x="720" y="500" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="26" font-weight="700" fill="#0369a1" text-anchor="middle">${data.bathrooms || '-'}</text>
  <text x="720" y="525" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">浴室</text>

  <!-- Tags -->
  <g>
    ${data.tags.slice(0, 5).map((t, i) => {
      const total = Math.min(data.tags.length, 5);
      const startX = 540 - (total * 55) + i * 110;
      return `<rect x="${startX - 45}" y="570" width="90" height="30" rx="15" fill="#e0f2fe"/>
        <text x="${startX}" y="590" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#0369a1" text-anchor="middle">${t}</text>`;
    }).join('')}
  </g>

  <!-- MTR + School -->
  <text x="540" y="650" font-family="'Segoe UI',sans-serif" font-size="16" fill="#64748b" text-anchor="middle">
    <tspan>🚇 ${data.mtrStation || 'N/A'}</tspan>
    <tspan dx="30">🏫 校網 ${data.schoolNet || 'N/A'}</tspan>
    <tspan dx="30">📋 ${data.listingNo}</tspan>
  </text>

  <!-- Hook / Key Selling Point -->
  <rect x="120" y="685" width="840" height="60" rx="12" fill="#fef9c3"/>
  <text x="540" y="722" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">
    ${data.id === 7 ? '📊 回報可達4.6-5.7% · 土瓜灣分契樓 · 收租中' :
      data.id === 1 ? '📊 現有租約 · 即買即收租 · 回報3.2-3.7%' :
      data.id === 6 ? '🌿 361呎+私人平台 · 低於$3M · 交吉' :
      data.id === 10 ? '📐 531呎大單位 · 兩房兩廳 · 僅$3.95M' :
      '📐 ' + psf + ' · 即日可睇樓'}
  </text>

  <!-- WhatsApp CTA -->
  <rect x="290" y="770" width="500" height="56" rx="28" fill="#25D366"/>
  <text x="540" y="806" font-family="'Segoe UI',sans-serif" font-size="22" font-weight="600" fill="#fff" text-anchor="middle">📲 WhatsApp 查詢 +852 9348 6774</text>

  <!-- Footer -->
  <text x="540" y="900" font-family="'Segoe UI',sans-serif" font-size="12" fill="rgba(255,255,255,0.4)" text-anchor="middle">富榮地產 Nelson Property Agency · 牌照 E-137150 · nelsonpropertyagency.com</text>
</svg>`;
}

// ─── Generate RedNote 3:4 portrait (1080x1440) ───
function genRedNoteCard(data) {
  const psf = fmtPsf(data);
  const pShort = fmtPriceShort(data);
  const pFull = fmtPrice(data);

  // Generate different hook lines per listing
  const hook = data.id === 7 ? `${pShort} · 土瓜灣分契樓 · 回報高達5.7%` :
    data.id === 1 ? `麟祥街 · 543呎 · ${pShort} · 連租約` :
    data.id === 2 ? `葵涌入場 · 257呎 · ${pShort} · 收租精選` :
    data.id === 3 ? `葵涌284呎 · 一房兩廳 · ${pShort} · 交吉` :
    data.id === 4 ? `龍圖街498呎 · 交吉即住 · ${pShort}` :
    data.id === 5 ? `鷹揚街 · 兩房 · 457呎 · ${pShort}` :
    data.id === 6 ? `東海大廈 · 連平台 · 361呎 · ${pShort}` :
    data.id === 8 ? `車位招租 · 金都豪苑 · $4,200/月` :
    data.id === 9 ? `建安大廈 · 兩房 · 320呎 · ${pShort}` :
    data.id === 10 ? `龍圖街大單位 · 531呎兩房 · ${pShort}` :
    data.id === 11 ? `鷹揚街唐樓 · 兩房 · 457呎 · ${pShort}` :
    data.id === 12 ? `東海大廈 · 高層單邊 · 361呎 · ${pShort}` :
    `${data.district.zh} · ${data.size}呎 · ${pShort}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c4a6e"/>
      <stop offset="50%" style="stop-color:#0369a1"/>
      <stop offset="100%" style="stop-color:#0ea5e9"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="12" flood-opacity="0.15"/></filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1440" fill="url(#bg)"/>

  <!-- Agency Header -->
  <text x="540" y="80" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="30" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="3">富榮地產 Nelson Property Agency</text>

  <!-- Hook Banner -->
  <rect x="60" y="115" width="960" height="65" rx="10" fill="rgba(255,255,255,0.12)"/>
  <text x="540" y="158" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">${hook}</text>

  <!-- Main Card -->
  <rect x="60" y="205" width="960" height="700" rx="24" fill="#fff" filter="url(#shadow)"/>

  <!-- District + Type -->
  <text x="540" y="280" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="46" font-weight="700" fill="#1e293b" text-anchor="middle">${data.district.zh}</text>
  <text x="540" y="320" font-family="'Segoe UI',sans-serif" font-size="24" font-weight="400" fill="#64748b" text-anchor="middle">${data.district.en}</text>

  <!-- Type Badge -->
  <rect x="470" y="340" width="140" height="30" rx="15" fill="${data.type === 'rent' ? '#f59e0b' : '#38bdf8'}"/>
  <text x="540" y="361" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#fff" text-anchor="middle">${data.type === 'rent' ? '🔑 招租' : '🏠 售盤'} · ${data.status || 'available'}</text>

  <line x1="200" y1="390" x2="880" y2="390" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- Price (Big) -->
  <text x="540" y="460" font-family="'Segoe UI',sans-serif" font-size="58" font-weight="700" fill="#0284c7" text-anchor="middle">${pFull}</text>
  ${psf ? `<text x="540" y="495" font-family="'Segoe UI',sans-serif" font-size="20" fill="#64748b" text-anchor="middle">${psf} · 實用面積 ${data.size} sq ft</text>` : ''}

  <!-- Specs Box -->
  <rect x="100" y="520" width="880" height="90" rx="16" fill="#f0f9ff"/>
  <text x="280" y="565" font-family="'Segoe UI',sans-serif" font-size="38" font-weight="700" fill="#0369a1" text-anchor="middle">${data.size || '-'}</text>
  <text x="280" y="590" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#64748b" text-anchor="middle">面積 sq ft</text>
  <text x="540" y="565" font-family="'Segoe UI',sans-serif" font-size="38" font-weight="700" fill="#0369a1" text-anchor="middle">${data.bedrooms || '-'}房${data.bathrooms || '-'}廁</text>
  <text x="540" y="590" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#64748b" text-anchor="middle">間隔</text>
  <text x="800" y="565" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="32" font-weight="700" fill="#0369a1" text-anchor="middle">${data.layout}</text>
  <text x="800" y="590" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#64748b" text-anchor="middle">狀態</text>

  <!-- Tags -->
  <g>
    ${data.tags.slice(0, 5).map((t, i) => {
      const total = Math.min(data.tags.length, 5);
      const startX = 540 - (total * 55) + i * 110;
      return `<rect x="${startX - 45}" y="640" width="90" height="30" rx="15" fill="#e0f2fe"/>
        <text x="${startX}" y="660" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#0369a1" text-anchor="middle">${t}</text>`;
    }).join('')}
  </g>

  <!-- Location Info -->
  <text x="540" y="720" font-family="'Segoe UI',sans-serif" font-size="17" fill="#64748b" text-anchor="middle">
    🚇 ${data.mtrStation || '未有提供'} &nbsp;&nbsp; 🏫 校網 ${data.schoolNet || 'N/A'} &nbsp;&nbsp; 📋 ${data.listingNo}
  </text>

  <!-- Key Metrics Section -->
  <rect x="100" y="750" width="880" height="100" rx="12" fill="#fef9c3"/>
  
  <!-- Generate listing-specific breakdown -->
  ${data.id === 7 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">📊 投資回報分析</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">月租$8K-10K · 回報率4.6-5.7% · 現有租約</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">土瓜灣MTR步行8分鐘 · 34校網</text>` :
    data.id === 1 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">📊 收租回報分析</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">現有租約不交吉 · 回報率約3.2-3.7% · 即買即收租</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">麟祥街中層 · 543呎大單位 · $8,379/呎</text>` :
    data.id === 6 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">🌿 罕有連平台單位</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">361呎室內 + 私人平台 · 低於$3M · 交吉即住</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">平台單位供應少於5% · 戶外空間 + 儲物 + 綠化</text>` :
    data.id === 10 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">📐 大單位精選</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">531呎兩房一廳 · 僅$7,439/呎 · 低於$4M</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">同區500呎+單位 · 交吉盤稀少 · 把握機會</text>` :
    data.id === 12 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">☀️ 高層單邊多窗</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">單邊單位 · 三面採光 · 自然通風</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">高層單邊比標準單位高5-8%轉售溢價</text>` :
    data.id === 3 ? `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">🏠 葵涌上車精選</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">284呎一房兩廳 · 交吉 · 僅$6,620/呎</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">低於$190萬 · 葵涌MTR約10分鐘</text>` :
    `
    <text x="540" y="785" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#854d0e" text-anchor="middle">💡 樓盤重點</text>
    <text x="540" y="815" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#92400e" text-anchor="middle">即日可睇樓 · 業主急售 · 價格可議</text>
    <text x="540" y="840" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#a16207" text-anchor="middle">歡迎查詢 · 按揭計算 · 免費估價</text>`
  }

  <!-- WhatsApp CTA - Double size -->
  <rect x="190" y="880" width="700" height="70" rx="35" fill="#25D366"/>
  <text x="540" y="925" font-family="'Segoe UI',sans-serif" font-size="26" font-weight="600" fill="#fff" text-anchor="middle">📲 立即查詢 +852 9348 6774 (楊小姐)</text>

  <!-- Stamp Duty Reference -->
  <rect x="60" y="980" width="960" height="80" rx="12" fill="#f1f5f9"/>
  <text x="540" y="1015" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="18" font-weight="600" fill="#334155" text-anchor="middle">📜 印花稅供參考 (1st-time HK PR)</text>
  <text x="540" y="1045" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#64748b" text-anchor="middle">
    從價印花稅: ~${data.price <= 4000000 ? '$100' : data.price <= 6000000 ? `$${(Math.round(data.price * 0.0225)).toLocaleString()}` : data.price <= 9000000 ? `$${(Math.round(data.price * 0.03)).toLocaleString()}` : `$${(Math.round(data.price * 0.0375)).toLocaleString()}`}
     · 每月供款(70% LTV): ~$${Math.round(data.price * 0.7 * 0.004467 / 12 * -1 * -1).toLocaleString()}
  </text>

  <!-- Footer -->
  <text x="540" y="1120" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">每月供款僅供參考 · 實際利率因銀行及申請人而異</text>
  <text x="540" y="1155" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="16" font-weight="600" fill="rgba(255,255,255,0.6)" text-anchor="middle">💾 儲存此帖 · 隨時參考樓市數據</text>

  <!-- Agency at bottom -->
  <text x="540" y="1200" font-family="'Segoe UI',sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="middle">富榮地產 Nelson Property Agency · 牌照 E-137150 · nelsonpropertyagency.com</text>
  
  <!-- Hashtags -->
  <text x="540" y="1240" font-family="'Segoe UI',sans-serif" font-size="12" fill="rgba(255,255,255,0.25)" text-anchor="middle">
    #香港樓市 #${data.district.zh} #香港地產 #置業 #投資 #收租 #上車盤 #富榮地產
  </text>
</svg>`;
}

// ─── Generate all ───
listings.forEach(data => {
  // IG square
  fs.writeFileSync(path.join(outputDir, `IG_${data.listingNo}.svg`), genIGCard(data), 'utf-8');
  console.log(`✅ IG:  ${data.listingNo}`);
  // RedNote portrait
  fs.writeFileSync(path.join(outputDir, `RN_${data.listingNo}.svg`), genRedNoteCard(data), 'utf-8');
  console.log(`✅ RN:  ${data.listingNo}`);
});

console.log(`\n🎉 Generated ${listings.length * 2} social media images`);
console.log(`📂 Output: ${outputDir}`);
