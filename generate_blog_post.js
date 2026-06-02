#!/usr/bin/env node
/* generate_blog_post.js
 * Generates a RedNote-style weekly blog post for the website.
 * Covers: property market news, new shopping mall, mainland student life,
 *         mainland expat life, how to find good food — all TKW/HH focused.
 * Called by daily_market_analysis.js on Mondays.
 */

const fs = require("fs"), path = require("path");

const D = new Date().toISOString().split("T")[0];
const DL = D.replace(/-/g, ".");
const BLOG_DIR = path.join(__dirname, "output", "blog");
const HTML = path.join(__dirname, "index.html");

if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

/* ─── Blog topic rotation ───
 * Week number (mod 5) determines topic so content stays fresh
 */
const weekNumber = Math.floor(
  (new Date() - new Date("2026-05-25")) / (7 * 86400000)
);
const topicIndex = ((weekNumber % 5) + 5) % 5; // 0-4, ensure positive

const topics = [
  {
    slug: "property-market",
    title: "土瓜灣樓市每周觀察 — 重建進度與成交動向",
    cover: "📊",
    tags: ["#土瓜灣樓市", "#市區重建", "#富榮地產"],
    content: `## 土瓜灣樓市每周觀察

### 本週重點
市建局在土瓜灣的重建項目持續推進，KC-019及KC-016項目進入關鍵收購階段。近期區內二手成交維持活躍，30日平均呎價約$11,157/呎，按月升8.23%。

### 重建紅利何時兌現？
土瓜灣是全九龍少數仍有「6字頭呎價」的區域。沙中線通車3年，樓價尚未完全反映交通紅利。參考啟德發展經驗，市區重建完成後，區域面貌及配套將全面提升。

### 投資者策略
建議關注十三街周邊物業，收購補償價往往為區域設定價格錨點。細單位租金回報穩定（4.2-4.8%），適合作為收租組合配置。`
  },
  {
    slug: "shopping-malls",
    title: "啟德新商場開幕！土瓜灣街坊又多一個好去處",
    cover: "🛍️",
    tags: ["#土瓜灣", "#啟德", "#商場", "#富榮地產"],
    content: `## 啟德新商場開幕 — 土瓜灣街坊福音

### 啟德SOGO / The Twins
啟德區大型商場即將落成，The Twins及啟德SOGO將陸續開業。從土瓜灣出發，搭屯馬線只需一站就到啟德站，或者沿海濱長廊散步15分鐘直達。

### 對土瓜灣的利好
- **商業配套升級**：以往土瓜灣街坊買餸行街要去九龍城或黃埔，未來啟德商圈將提供更多選擇
- **人流帶動租值**：商場帶動區外人流，間接推高周邊住宅及商舖需求
- **海濱長廊連通**：市建局規劃的海濱長廊將連接土瓜灣至啟德，整個九龍東海濱步行網絡成形

### 街坊私心推介
土瓜灣街市、上鄉道一帶的小店仍然是最好的日常選擇，周末想去「行街」就搭一個站去啟德。`
  },
  {
    slug: "mainland-student-life",
    title: "內地生在土瓜灣租樓攻略 — 近理工、城大的平價選擇",
    cover: "🎓",
    tags: ["#內地生租房", "#土瓜灣", "#香港留學", "#富榮地產"],
    content: `## 內地生在土瓜灣租樓全攻略

### 為什麼選土瓜灣？
理工大學及城市大学是內地生熱門選擇。土瓜灣騎車/搭小巴到紅磡只需10分鐘，租金卻比黃埔、海逸豪園便宜30-40%。

### 熱門屋苑推薦
1. **環海·東岸**：上車首選，開放式細單位為主，租金$10,000-13,000/月，會所設施齊全
2. **喜築**：鄰近土瓜灣站，交通方便，一房約$12,000-15,000/月
3. **翔龍灣**：較大單位，適合合租，兩房約$16,000-20,000/月

### 租樓貼士
- 一般需要一次過預繳一年租金（俗稱「一年票」）
- 帶齊錄取通知書、護照/通行證、存款證明
- 留意免租期：一般可議3-7天
- 水電煤上網 — 土瓜灣大部分覆蓋1000M光纖

### 區內配套
土瓜灣街市買餸平過超市，熟食中心有$40左右的茶餐廳套餐。最近還有不少內地品牌進駐，包括喜茶、瑞幸等，生活方便。`
  },
  {
    slug: "mainland-expat-life",
    title: "港漂在土瓜灣的生活指南 — 住得舒服又省錢",
    cover: "🏠",
    tags: ["#港漂", "#土瓜灣生活", "#香港租房", "#富榮地產"],
    content: `## 港漂在土瓜灣 — 你可能不知道的寶藏社區

### 住
土瓜灣位於九龍心臟地帶，往返中環、銅鑼灣、尖沙咀均在20分鐘車程內。租金相對親民——$8,000-12,000已能租到一個像樣的開放式或一房單位。

### 食
土瓜灣是真正的美食寶庫！北帝街「小泰國」集中了多間正宗泰國菜館；上鄉道有幾間老字號燒味店；海心公園一帶更多隱世小店。人均$50-80已能吃得很好。

### 行
- **海心公園**：晨運、跑步好去處，海濱長廊直達啟德
- **土瓜灣街市**：買平價蔬果海鮮
- **九龍城廣場**：戲院+餐廳+超市一站解決
- **啟德體育園**：今年開幕，各類文娛活動值得期待

### 交通
屯馬線土瓜灣站、宋皇臺站雙站覆蓋。小巴路線密集。最正的是——上班高峰過海巴士有座位唔使迫地鐵！`
  },
  {
    slug: "food-guide",
    title: "土瓜灣搵食地圖 — 地膽推介10間隱世美食",
    cover: "🍜",
    tags: ["#土瓜灣美食", "#香港好去處", "#搵食", "#富榮地產"],
    content: `## 土瓜灣搵食地圖 — 地膽推介

### 🥇 必食之選

**1. 義香荳品廠**（北帝街）
老字號豆品店，豆腐花、豆漿每日新鮮製作。$12一碗熱豆腐花加黃糖，是土瓜灣人的集體回憶。

**2. 海港燒鵝飯店**（上鄉道）
皮脆肉嫩，$60左右的燒味飯性價比超高。

**3. Thai Kitchen**（北帝街）
正宗泰國菜，冬蔭功湯粉、泰式炒金邊粉水準穩定。

**4. 海心閣茶餐廳**（海心公園旁）
街坊推介：沙爹牛肉麵、菠蘿油、奶茶。$38的常餐全天候供應。

### 🥈 隱世小店

**5. 潮興魚蛋粉** — 潮州魚蛋、墨魚丸
**6. 十三街咖啡** — 文青風格小店，精品咖啡$35起
**7. 媽咪雞蛋仔** — 外脆內軟，朱古力味是招牌
**8. 金寶泰國菜館** — 晚市小炒有水準

### 💡 貼士
- 北帝街（小泰國）一帶的泰國菜館，晚餐人均$80-120
- 上鄉道老店多數只收現金
- 周末早上海心公園旁邊的茶樓有推車點心

土瓜灣的好，住過才知。下次來睇樓，記得預留時間搵食！`
  }
];

const post = topics[topicIndex];
const postDate = `第${weekNumber + 1}期 · ${DL}`;

/* ─── Build full blog post HTML ─── */
function blogPostHTML() {
  return `
  <article class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div class="p-6 lg:p-8">
      <div class="text-sm text-gray-400 mb-2">${postDate}</div>
      <h3 class="text-2xl font-bold text-gray-800 mb-4">${post.cover} ${post.title}</h3>
      <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm">
${post.content}
      </div>
      <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        ${post.tags.map(t => `<span class="bg-cyan-50 text-cyan-700 text-xs px-3 py-1 rounded-full">${t}</span>`).join("")}
      </div>
    </div>
  </article>`;
}

/* ─── Blog archive listing card ─── */
/* ─── Archive article full HTML (hidden section for toggle) ─── */
function blogArticleHTML(slug, title, cover, tags, content, dateLabel) {
  return `
  <div id="blog-${slug}" class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8 hidden">
    <div class="p-6 lg:p-8">
      <div class="text-sm text-gray-400 mb-2">${dateLabel}</div>
      <h3 class="text-2xl font-bold text-gray-800 mb-4">${cover} ${title}</h3>
      <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm">
${content}
      </div>
      <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        ${tags.map(t => `<span class="bg-cyan-50 text-cyan-700 text-xs px-3 py-1 rounded-full">${t}</span>`).join("")}
      </div>
    </div>
  </div>`;
}

function blogCardHTML(slug, title, cover, date) {
  return `
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer" onclick="toggleBlog('blog-${slug}')">
    <div class="text-3xl mb-2">${cover}</div>
    <h4 class="font-bold text-gray-800 text-sm mb-1">${title}</h4>
    <p class="text-xs text-gray-400">${date}</p>
  </div>`;
}

/* ─── Main ─── */
function main() {
  // 1. Save blog post JSON for archive
  const jsonPath = path.join(BLOG_DIR, `${post.slug}_${D}.json`);
  const archiveEntry = {
    slug: post.slug,
    title: post.title,
    cover: post.cover,
    tags: post.tags,
    content: post.content,
    date: D,
    dateLabel: postDate
  };
  fs.writeFileSync(jsonPath, JSON.stringify(archiveEntry, null, 2), "utf-8");
  console.log(`✅ Blog post saved: ${jsonPath}`);

  // 2. Read existing archive
  const existingFiles = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith(".json"))
    .sort()
    .reverse();
  
  // 3. Inject blog section into HTML
  if (fs.existsSync(HTML)) {
    let html = fs.readFileSync(HTML, { encoding: "utf8" });
    const blogTag = "<!-- BLOG_SEC -->";
    const blogEnd = "<!-- END_BLOG -->";

    // Build latest post section
    const blogSection = `
${blogTag}
  <section id="blog" class="max-w-6xl mx-auto px-4 py-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-800">📝 街坊Blog</h2>
      <p class="text-gray-500 mt-2">土瓜灣·紅磡生活誌</p>
    </div>

    <!-- Latest Post -->
    ${blogPostHTML()}

    <!-- Archive -->
    <div class="max-w-3xl mx-auto">
      <h4 class="text-lg font-bold text-gray-700 mb-4">過往文章 Archive</h4>
      <p class="text-sm text-gray-400 mb-4">點擊 Archive 卡片展開閱讀舊文章</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${existingFiles.slice(0, 9).map(f => {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
            return blogCardHTML(data.slug, data.title, data.cover, data.dateLabel);
          } catch(e) { return ""; }
        }).join("\n        ")}
      </div>
    </div>

    <!-- Archive full articles (hidden, toggle-able) -->
    ${existingFiles.slice(1).map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
        return blogArticleHTML(data.slug, data.title, data.cover, data.tags, data.content, data.dateLabel);
      } catch(e) { return ""; }
    }).join("\n    ")}
  </section>
${blogEnd}`;

    if (html.includes(blogTag)) {
      const a = html.indexOf(blogTag);
      const b = html.indexOf(blogEnd) + blogEnd.length;
      html = html.slice(0, a) + blogSection + html.slice(b);
    } else {
      // Insert before contact section
      html = html.replace('<section id="calculators"', blogSection + '\n\n<section id="calculators"');
    }

    fs.writeFileSync(HTML, html, "utf-8");
    console.log("✅ Blog section injected into HTML");
  }

  console.log("\n🎉 Blog post generated!");
}

main();
