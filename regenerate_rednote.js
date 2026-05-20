#!/usr/bin/env node
/**
 * regenerate_rednote.js
 * Regenerates all RedNote (3:4 portrait) SVG posts with the deep-dive format.
 */
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "output", "posts");
const p = (s) => s.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

const listings = [
  { id: 1, listingNo: "R20260516-01", type: "sale", district: { en: "Lun Chun Street", zh: "麟祥街" }, size: 543, price: 4550000, layout: "不交吉", tags: ["收租", "投資"],
    hook: "455万麟祥街543呎｜不交吉才是「被动收入」的启动键？",
    thesis: "很多买家听到「不交吉」就犹豫，觉得看不见房子不放心。但换个角度：这是一套已经在运作的现金流机器。",
    points: [
      "买入即收租：产权交割当天起，现有租客的租金收入直接转入你手上。零空置期、零装修期、零中介放盘成本。",
      "543呎大单位在新界西细户为主的市场属于稀缺供应，租客群体相对稳定优质。",
      "折合呎价仅$8,379/呎，相比同区交吉盘存在约10-15%的流动性折价，但这个折价本身就是安全垫。"
    ],
    financials: [
      "总价：$4,550,000",
      "首套房印花税：$100",
      "7成按揭首期(Tier 1)：$1,365,000",
      "月供估算(30年@3.5%)：约$14,300/月",
      "租金覆盖估算：约85-98%月供"
    ],
    audience: "适合手头有较大首付、追求稳定现金流而非短期转售的防御型买家。不交吉折价本身就是进入安全边际。"
  },
  { id: 2, listingNo: "R20260516-02", type: "sale", district: { en: "Luk Ming Street", zh: "鹿鳴街" }, size: 257, price: 1900000, layout: "開放式", tags: ["收租", "葵涌", "上車盤"],
    hook: "190万上车葵涌｜带租约（不交吉）才是真正的「懒人理财」？",
    thesis: "很多首次置业的人听到「不交吉（带租约）」就摇头，觉得看不了房麻烦。但在投资客眼里，这恰恰是最高效的刚需防御盘。",
    points: [
      "买入即收租：产权交割完成当天，你就开始直接承接现有租金收益，省去了空置期、重新装修、放盘中介费的全部时间成本与资金损耗。",
      "极高的入住率基数：葵涌细户型（300呎以下）长年维持在95%以上的超高出租率，属于整个新界西的刚需租赁大后方。",
      "折合呎价$7,393/呎。对于首次进入香港收租房市场的买家，这是试错成本极低的起步支点。"
    ],
    financials: [
      "总价：$1,900,000",
      "首套房印花税：$100",
      "9成按揭首期：$190,000",
      "月供估算(30年@3.5%)：约$7,680/月",
      "非常适合作为资产配置的起步支点"
    ],
    audience: "手头有闲置现金、希望快速切入香港收租房市场的防御型买家。自住可能不适合，但作为资产配置是极低试错成本的标的。"
  },
  { id: 3, listingNo: "R20260516-03", type: "sale", district: { en: "Ming Tak Building", zh: "名德大樓" }, size: 284, price: 1880000, layout: "一房兩廳", tags: ["交吉", "上車盤", "葵涌"],
    hook: "188万葵涌284呎一房兩廳｜交吉才是「真正看得见」的上车之选",
    thesis: "和不交吉的192号盘同区打对台——这边是284呎一房两厅，交吉放售，$6,620/呎。你「看得见」你要买的是什么。",
    points: [
      "一房两厅布局在284呎这个面积段相当少见——多数同面积只有开放式。多了一堵墙，意味着真正的卧室空间和噪音隔离。",
      "交吉意味着你可以亲自量尺、规划布局、定制装修——对于自住型首次置业者是刚需优势。",
      "葵涌租赁大盘不愁租客，将来需要放租时，同区95%出租率的数据依然成立。"
    ],
    financials: [
      "总价：$1,880,000",
      "首套房印花税：约$100",
      "9成按揭首期：$188,000",
      "月供估算(30年@3.5%)：约$7,600/月",
      "呎价仅$6,620——区内最低一档"
    ],
    audience: "首次置业的年轻人、小家庭，希望在葵涌站稳脚跟的自住型买家。交吉保证你可以随时入住，所见即所得。"
  },
  { id: 4, listingNo: "R20260516-04", type: "sale", district: { en: "Lung To Street", zh: "龍圖街" }, size: 498, price: 3890000, layout: "交吉", tags: ["交吉", "實用"],
    hook: "389万龙图街498呎｜近500呎交吉盘为什么不到$8K/呎？",
    thesis: "498呎，不到400万，折合呎价$7,811。交吉放售。这三个数字放在一起，对买家来说是一个值得细算的机会。",
    points: [
      "近500呎的实用户型在交吉盘市场属于稀缺供应——多数这个面积段要么是分契楼要么是不交吉。",
      "交吉意味着零时间成本：过户当天你就可以安排装修队进场，不用等租约到期。",
      "呎价$7,811对比同区交吉盘均价$8.2K-$9K/呎，存在实质折让。"
    ],
    financials: [
      "总价：$3,890,000",
      "首套房印花税：约$87,525 (2.25%)",
      "7成按揭首期：$1,167,000",
      "月供估算(30年@3.5%)：约$12,230/月",
      "装修预算建议：$80K-$150K"
    ],
    audience: "希望直接入住或翻新后自住/放租的自住型买家或中长线投资者。大呎数交吉盘在市场上停留天数通常较短。"
  },
  { id: 5, listingNo: "R20260516-05", type: "sale", district: { en: "Ying Yeung Street", zh: "鷹揚街" }, size: 457, price: 3280000, layout: "兩房一廳", tags: ["自住", "實用"],
    hook: "328万鹰扬街457呎两房｜自住买家的「高性价比狙击点」",
    thesis: "两房一厅、457呎实用、$7,177/呎。在这个价位你可以用$328万买到两间独立的卧室。",
    points: [
      "457呎做到两房一厅需要很高的布局效率——多数同面积只能做到一房+开放式书房。",
      "两间真正的卧室意味着：小家庭自住、或者将来分租一间都具备操作空间。",
      "呎价$7,177明显低于同区平均水平，属于定价偏低的交吉盘——流动性折价可能来自楼层或座向。"
    ],
    financials: [
      "总价：$3,280,000",
      "首套房印花税：约$73,800 (2.25%)",
      "7成按揭首期：$984,000",
      "月供估算(30年@3.5%)：约$10,310/月",
      "若放租估算月租：约$11,000 → 正现金流~$690/月"
    ],
    audience: "首次置业小家庭、或者需要两房功能的年轻夫妇。自住优先，但即使将来放租也能产生正现金流。"
  },
  { id: 6, listingNo: "R20260516-06", type: "sale", district: { en: "Tung Hoi Building", zh: "東海大廈" }, size: 361, price: 2980000, layout: "連平台", tags: ["連平台", "交吉", "荀盤"],
    hook: "298万东海大厦361呎+平台｜香港$3M以下还带户外空间的单位还有多少？",
    thesis: "$298万，361呎室内，连私人平台，交吉。这个价位带户外空间的放盘量不足市场整体的5%。",
    points: [
      "361呎的室内面积其实不小——加上平台后，实际可用空间远远超过数字本身。一个平台等于多了一个房间的功能容量。",
      "疫情后带户外空间的单位在二手房市场溢价持续走高，转售时比同类无平台单位高8-12%。",
      "交吉意味着你可以马上规划平台怎么用——盆栽、晾晒、BBQ、户外储物——这些都是高层单位没有的自由度。"
    ],
    financials: [
      "总价：$2,980,000",
      "首套房印花税：约$67,050 (2.25%)",
      "7成按揭首期：$894,000",
      "月供估算(30年@3.5%)：约$9,370/月",
      "管理费及差饷：按实际为准"
    ],
    audience: "追求生活品质的自住买家、或者看中「特色单位溢价」的中线投资者。$3M以下带平台的单位在香港已经属于稀有品种。"
  },
  { id: 7, listingNo: "R20260516-07", type: "sale", district: { en: "Kowloon City Road", zh: "九龍城道" }, size: 301, price: 2100000, layout: "兩房一廳", tags: ["收租", "唐樓", "分契"],
    hook: "210万土瓜湾分契唐楼｜4.6-5.7%净回报是怎么算出来的",
    thesis: "土瓜湾唐七楼分契，301呎两房一厅，开价$210万。不交吉放售，现有租约。折合呎价$6,977。",
    points: [
      "4.6-5.7%的净回报在这个利率环境下非常稀缺——当前市场住宅平均净回报约2.5-3.5%，这套盘高出市场中枢约2-3个百分点。",
      "分契楼的核心逻辑：买入价低、呎价低、但租金收入不低。唐楼的租客群体以长期居住为主，换手率低、空置期短。",
      "土瓜湾MTR步行8分钟 + 34校网。地铁通车后该区租金走势持续向上，这是过去3年可以验证的趋势。",
      "注意：分契楼需要律师核查大厦公契(DMC)状态，这是尽职调查的必要步骤。"
    ],
    financials: [
      "总价：$2,100,000",
      "首套房印花税：约$100",
      "7成按揭首期：$630,000",
      "月供估算(30年@3.5%)：约$6,600/月",
      "月租收入估算：$8,000-$10,000",
      "每月净正现金流：$1,400-$3,400"
    ],
    audience: "熟悉旧楼操作逻辑的收租投资者。分契唐楼需要对大厦结构和管理状况有一定的了解和承受力。回报率在高息环境下仍然亮眼。"
  },
  { id: 8, listingNo: "R20260516-08", type: "rent", district: { en: "King's Court", zh: "金都豪苑" }, size: 0, price: 4200, layout: "車位", tags: ["車位", "招租"],
    hook: "$4,200/月金都豪苑车位｜租车位也要精打细算",
    thesis: "金都豪苑私家车位招租，月租$4,200。区内同类车位租金范围$3,800-$5,000/月，这个放盘定价偏中下。",
    points: [
      "金都豪苑车位供应量有限，长期保持90%+出租率，空置期通常短于2周。",
      "$4,200/月在全港市区车位租金中属于中等偏低水平——铜锣湾、湾仔的车位月租可达$6,000+。",
      "短租约可谈，灵活度比停车场月租更高。适合临时需要停车解决方案的车主。"
    ],
    financials: [
      "月租：$4,200/月",
      "按金：2个月租金标准，可商议",
      "最短租期：可谈",
      "车位类型：室内有盖"
    ],
    audience: "金都豪苑住户、附近工作的驾驶者、或者需要短期停车方案的租客。"
  },
  { id: 9, listingNo: "R20260516-09", type: "sale", district: { en: "Kin On Building", zh: "建安大廈" }, size: 320, price: 3780000, layout: "兩房一廳", tags: ["自住", "上車"],
    hook: "378万建安大厦320呎两房｜$11.8K/呎买的是什么？",
    thesis: "$378万，320呎建安大厦低层两房一厅。呎价$11,813，是这批放盘中呎价最高的一间，但有它的道理。",
    points: [
      "两房一厅+一卫在320呎里做到，说明间隔效率相当高。低层单位虽然呎价不低，但维护成本低、出入方便。",
      "建安大厦保养状况良好，不需要大笔维修储备金投入——这对首次置业者来说是一个隐形成本优势。",
      "交吉放售，意味着你可以按自己的节奏装修入住，无需等待租约到期。"
    ],
    financials: [
      "总价：$3,780,000",
      "首套房印花税：约$56,700 (1.5%阶梯)",
      "7成按揭首期：$1,134,000",
      "月供估算(30年@3.5%)：约$11,880/月",
      "装修预算建议：轻装修为主，$50K-$80K"
    ],
    audience: "偏好低层、注重物业维护状况的首次置业者。呎价虽然偏高，但维护成本低、入场门槛适中。"
  },
  { id: 10, listingNo: "R20260516-10", type: "sale", district: { en: "Lung To Street", zh: "龍圖街" }, size: 531, price: 3950000, layout: "兩房一廳", tags: ["唐樓", "實用", "大單位"],
    hook: "395万龙图街唐楼531呎｜$4M以下竟然有500呎+两房",
    thesis: "$395万，531呎，两房一厅，龙图街唐六楼。折合呎价仅$7,439。在$4M预算内买到500呎以上的单位，现在市场上已经非常少见。",
    points: [
      "531呎的实用空间在分类上属于「大单位」级别——客厅可以同时摆沙发和餐桌、两间卧室都能放下双人床。",
      "唐楼虽然无电梯，但呎价折让也是实在的——对比同区电梯楼约$9K-11K/呎，这套相当于打了七折。",
      "大呎数单位在转售市场的溢价持续存在：500呎+的交吉盘放盘量少，需求端却一直有家庭客在找。"
    ],
    financials: [
      "总价：$3,950,000",
      "首套房印花税：约$88,875 (2.25%)",
      "7成按揭首期：$1,185,000",
      "月供估算(30年@3.5%)：约$12,410/月",
      "装修预算(全屋翻新)：$120K-$180K"
    ],
    audience: "需要有实际空间的小家庭，或者计划购入后翻新转售的投资者。大呎数唐楼在市场上的停留时间通常远低于细单位。"
  },
  { id: 11, listingNo: "R20260516-11", type: "sale", district: { en: "Ying Yeung Street", zh: "鷹揚街" }, size: 457, price: 3280000, layout: "兩房一廳", tags: ["唐樓", "自住", "實用"],
    hook: "328万鹰扬街唐楼457呎两房｜同区两间457呎开价一样，怎么选？",
    thesis: "鹰扬街出现了两间完全相同的457呎两房单位，开价都是$328万。一间唐七楼（本盘），一间高层电梯楼（盘号5）。一样的呎价$7,177，不一样的选择逻辑。",
    points: [
      "本盘是唐七楼——楼层高意味着视野和空气流通更好，但也意味着每天爬楼梯的体力成本。年长或膝盖有负担的买家需要考虑。",
      "唐楼的高层单位通常有更好的采光和通风，而且价格已经包含了无电梯的折让。",
      "对于预算严格控制在$330万以内的买家，这两间457呎是目前市场上性价比最高的两房选项。建议一并睇楼做对比。"
    ],
    financials: [
      "总价：$3,280,000",
      "首套房印花税：约$73,800 (2.25%)",
      "7成按揭首期：$984,000",
      "月供估算(30年@3.5%)：约$10,310/月",
      "放租估算月租：约$11,000"
    ],
    audience: "预算有限的首次置业者，不介意爬楼梯换取更高实用面积的年轻买家。建议和盘号5的鹰扬街高层电梯楼一并比较。"
  },
  { id: 12, listingNo: "R20260516-12", type: "sale", district: { en: "Tung Hoi Building", zh: "東海大廈" }, size: 361, price: 3500000, layout: "高層單邊", tags: ["單邊", "高層", "多窗"],
    hook: "350万东海大厦高层单边｜多窗单位为什么比同面积贵$50万？",
    thesis: "东海大厦高层单边单位，361呎，要价$350万。对比同大厦平台单位（盘号6，$298万），面积一样，贵了$52万。这个差价合理吗？",
    points: [
      "单边单位意味着至少两面采光——自然光从多个方向进入，室内明亮度远超标准单位。对于香港高密度住宅，这是稀缺属性。",
      "多窗设计带来真正的交叉通风——在香港潮湿闷热的气候里，自然通风的舒适度远非冷气可比。",
      "单边单位在二手市场通常享有5-8%的转售溢价——这个$52万的差价有数据支撑，并非虚高。高层单位还附带更好的视野和更少的噪音。"
    ],
    financials: [
      "总价：$3,500,000",
      "首套房印花税：约$78,750 (2.25%)",
      "7成按揭首期：$1,050,000",
      "月供估算(30年@3.5%)：约$11,000/月",
      "单边溢价参考：转售市场5-8%高于标准单位"
    ],
    audience: "注重居住品质、愿意为采光和通风支付溢价的自住买家。也可以作为「特色单位+稀缺性溢价」的中线投资标的。"
  }
];

listings.forEach(d => {
  const hook = p(d.hook);
  const thesis = p(d.thesis);
  const audience = p(d.audience);
  const financials = d.financials.map(l => p(l));
  const points = d.points.map(l => p(l));
  const pFull = d.type === "rent" ? "HK$" + d.price.toLocaleString() + "/月" : "HK$" + d.price.toLocaleString();
  const psf = d.size ? "$" + Math.round(d.price / d.size).toLocaleString() + "/呎" : "";
  const sizeDesc = d.size > 0 ? d.size + "呎" : "";

  // Calculate dynamic Y positions based on number of points and financial lines
  const startY = 360;   // thesis Y
  const headerY = 410;  // 核心逻辑拆解 header
  const pt1y = 448;
  const spacing = 52;
  const ptCount = Math.min(points.length, 4);
  const ptsEndY = pt1y + (ptCount - 1) * spacing + 30;
  const finHeaderY = ptsEndY + 25;
  const finLineSpacing = 32;
  const finCount = financials.length;
  const finEndY = finHeaderY + 40 + finCount * finLineSpacing + 10;
  const lineY = finEndY + 5;
  const audY = finEndY + 55;
  const whatsappY = audY + 40;
  const ctaY = whatsappY + 35;
  const footerY = whatsappY + 80;
  const hashY = footerY + 30;
  const saveY = hashY + 25;

  let ptElements = "";
  points.forEach((pt, i) => {
    if (i < 4) ptElements += `<text x="100" y="${pt1y + i * spacing}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#334155">${pt}</text>\n    `;
  });

  let finElements = "";
  financials.forEach((line, i) => {
    finElements += `<text x="120" y="${finHeaderY + 42 + i * finLineSpacing}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#334155">• ${line}</text>\n    `;
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c4a6e"/>
      <stop offset="50%" style="stop-color:#0369a1"/>
      <stop offset="100%" style="stop-color:#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1440" fill="url(#bg)"/>
  <text x="540" y="70" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="3">富榮地產 Nelson Property Agency</text>
  <rect x="60" y="95" width="960" height="50" rx="10" fill="rgba(255,255,255,0.1)"/>
  <text x="540" y="128" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">📋 ${d.listingNo} · ${d.district.zh} ${d.district.en}</text>
  <rect x="60" y="165" width="960" height="${saveY - 165 + 20}" rx="20" fill="#fff"/>
  <text x="540" y="225" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="28" font-weight="700" fill="#1e293b" text-anchor="middle">${hook}</text>
  <line x1="150" y1="250" x2="930" y2="250" stroke="#e2e8f0" stroke-width="1"/>
  <text x="540" y="295" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="20" fill="#475569" text-anchor="middle">${pFull} · ${sizeDesc} · ${d.layout} · ${psf}</text>
  <rect x="100" y="315" width="880" height="1" fill="#e2e8f0"/>
  <text x="540" y="${startY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="17" fill="#334155" text-anchor="middle">${thesis}</text>
  <text x="100" y="${headerY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#0369a1">核心逻辑拆解：</text>
  ${ptElements}
  <rect x="100" y="${ptsEndY}" width="880" height="1" fill="#e2e8f0"/>
  <text x="100" y="${finHeaderY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#0369a1">📊 账目数据明细：</text>
  ${finElements}
  <rect x="100" y="${lineY}" width="880" height="1" fill="#e2e8f0"/>
  <text x="540" y="${audY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="15" fill="#475569" text-anchor="middle">${audience}</text>
  <rect x="190" y="${whatsappY}" width="700" height="60" rx="30" fill="#25D366"/>
  <text x="540" y="${ctaY}" font-family="'Segoe UI',sans-serif" font-size="22" font-weight="600" fill="#fff" text-anchor="middle">📲 WhatsApp 查询 +852 9348 6774</text>
  <text x="540" y="${footerY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">富榮地產 Nelson Property Agency · 牌照 E-137150 · nelsonpropertyagency.com</text>
  <text x="540" y="${hashY}" font-family="'Segoe UI',sans-serif" font-size="12" fill="rgba(255,255,255,0.25)" text-anchor="middle">#香港楼市 #${d.district.zh} #${d.tags[0] || "置业"} #${d.tags[1] || ""} #${d.tags[2] || ""} #富荣地产</text>
  <text x="540" y="${saveY}" font-family="'Noto Sans SC','Segoe UI',sans-serif" font-size="14" font-weight="600" fill="rgba(255,255,255,0.6)" text-anchor="middle">💾 储存此帖 · 随时参考楼市数据</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, "RN_" + d.listingNo + ".svg"), svg, "utf-8");
  console.log("✅ RN: " + d.listingNo + " (" + svg.length + "B)");
});

console.log("\n🎉 All 12 RedNote SVGs regenerated with deep-dive format");
