#!/usr/bin/env node
/* daily_market_analysis.js v2
 * Generates: RedNote post (SC) + charts + website update (TC) + pushes to GitHub
 * Bar charts: price index, volume, TKW comparison, rental yield
 * Pie chart: transaction type breakdown
 */

const fs=require("fs"),path=require("path"),cp=require("child_process");
const D=(new Date).toISOString().split("T")[0],DL=(new Date).toISOString().slice(0,10).replace(/-/g,".");
const OUT=path.join(__dirname,"output","daily"),HTML=path.join(__dirname,"index.html");
if(!fs.existsSync(OUT))fs.mkdirSync(OUT,{recursive:true});

const d={
  idx:[156.14,0.36,"5-8%",6669,"+40.7%",88000],
  im:["9/25","10/25","11/25","12/25","1/26","2/26","3/26","4/26","5/26"],
  iv:[145.2,147.8,149.1,151,152.4,154,155.2,155.8,156.1],
  vm:["9/25","10/25","11/25","12/25","1/26","2/26","3/26","4/26","5/26"],
  vv:[4100,3800,4900,5200,5800,6669,6100,6800,7200],
  tx:[{l:"住宅(私樓)",v:68},{l:"住宅(公居屋)",v:15},{l:"工商舖",v:10},{l:"車位",v:7}],
  ri:116.75,ry:8.94,rf:"3-5%",
  tkwP:11157,tkwM:8.23,tkwL:6844,tkwH:26035,
  dn:["土瓜灣\nTKW","紅磡\nHH","黃埔\nWha","啟德\nKT","九龍城\nKC"],
  dp:[11157,12436,15800,19500,16800],
  uc:[{l:"環海·東岸",v:4.2},{l:"黃埔花園",v:3.8},{l:"海逸豪園",v:3.5},{l:"啟德1號",v:3.2},{l:"喜築",v:4.0}],
  ueP:17500,ueM:10.8,ueD:"2026-05-11",ueS:18246,ueZ:285
};

function bar(months,vals,mx,title,cl,cls,unit,src){
  const bw=70,g=20,cw=months.length*(bw+g)+80,ch=330,by=280;let b="",l="",v="";
  months.forEach((m,i)=>{
    const x=50+i*(bw+g),y=by-(vals[i]/mx)*240,c=i===months.length-1?cl:cls;
    b+=`<rect x="${x}" y="${y}" width="${bw}" height="${(vals[i]/mx)*240}" rx="4" fill="${c}" opacity=".9"/>\n    `;
    l+=`<text x="${x+bw/2}" y="${by+18}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="11" fill="#64748b" text-anchor="middle">${m}</text>\n    `;
    v+=`<text x="${x+bw/2}" y="${y-8}" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#1e293b" text-anchor="middle">${vals[i]}${unit||""}</text>\n    `;
  });
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" width="${cw}" height="${ch}">\n<rect width="${cw}" height="${ch}" fill="#f8fafc" rx="8"/><text x="${cw/2}" y="25" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">${title}</text><line x1="40" y1="${by}" x2="${cw-20}" y2="${by}" stroke="#cbd5e1" stroke-width="1"/>\n${b}${l}${v}<text x="${cw-20}" y="${by+50}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">僅供參考</text>\n</svg>`;
}

function cmp(){
  const mv=22000,bw=100,g=24,cw=d.dn.length*(bw+g)+80,ch=330,by=280;let b="",l="",v="",gr="";
  d.dn.forEach((n,i)=>{
    const x=50+i*(bw+g),y=by-(d.dp[i]/mv)*240,c=i===0?"#0284c7":"#94a3b8";
    b+=`<rect x="${x}" y="${y}" width="${bw}" height="${(d.dp[i]/mv)*240}" rx="4" fill="${c}" opacity="${i===0?1:.7}"/>\n    `;
    l+=`<text x="${x+bw/2}" y="${by+18}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="11" fill="#64748b" text-anchor="middle">${n}</text>\n    `;
    v+=`<text x="${x+bw/2}" y="${y-8}" font-family="'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="${i===0?"#0284c7":"#64748b"}" text-anchor="middle">$${d.dp[i].toLocaleString()}</text>\n    `;
  });
  [0,5,10,15,20].forEach(k=>{const y=by-(k*1000/mv)*240;gr+=`<line x1="30" y1="${y}" x2="38" y2="${y}" stroke="#cbd5e1" stroke-width="1"/><text x="28" y="${y+4}" font-family="'Segoe UI',sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">$${k}K</text>\n    `;});
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" width="${cw}" height="${ch}">\n<rect width="${cw}" height="${ch}" fill="#f8fafc" rx="8"/><text x="${cw/2}" y="25" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">九龍中各區成交呎價對比</text>\n${gr}${b}${l}${v}<text x="${cw-20}" y="${by+50}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">僅供參考</text>\n</svg>`;
}

function rent(){
  const mv=5.5,bw=100,g=24,cw=d.uc.length*(bw+g)+80,ch=330,by=280;let b="",l="",v="",gr="";
  d.uc.forEach((x,i)=>{
    const y=by-(x.v/mv)*240,x0=50+i*(bw+g),c=i===0?"#0284c7":"#f59e0b";
    b+=`<rect x="${x0}" y="${y}" width="${bw}" height="${(x.v/mv)*240}" rx="4" fill="${c}" opacity="${i===0?1:.7}"/>\n    `;
    l+=`<text x="${x0+bw/2}" y="${by+18}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="11" fill="#64748b" text-anchor="middle">${x.l}</text>\n    `;
    v+=`<text x="${x0+bw/2}" y="${y-8}" font-family="'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="${i===0?"#0284c7":"#64748b"}" text-anchor="middle">${x.v}%</text>\n    `;
  });
  [0,1,2,3,4,5].forEach(k=>{const y=by-(k/mv)*240;gr+=`<line x1="30" y1="${y}" x2="38" y2="${y}" stroke="#cbd5e1" stroke-width="1"/><text x="28" y="${y+4}" font-family="'Segoe UI',sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">${k}%</text>\n    `;});
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" width="${cw}" height="${ch}">\n<rect width="${cw}" height="${ch}" fill="#f8fafc" rx="8"/><text x="${cw/2}" y="25" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">區內屋苑租金回報率對比</text>\n${gr}${b}${l}${v}<text x="${cw-20}" y="${by+50}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">僅供參考</text>\n</svg>`;
}

function pie(){
  const t=d.tx.reduce((s,x)=>s+x.v,0),cx=200,cy=200,r=160,cs=["#0284c7","#f59e0b","#16a34a","#94a3b8"];
  let c=0,sl="",lg="";
  d.tx.forEach((x,i)=>{
    const p=x.v/t,a1=c*360,a2=(c+p)*360,md=(a1+a2)/2,la=p>.5?1:0;
    const x1=cx+r*Math.sin(a1*Math.PI/180),y1=cy-r*Math.cos(a1*Math.PI/180);
    const x2=cx+r*Math.sin(a2*Math.PI/180),y2=cy-r*Math.cos(a2*Math.PI/180);
    sl+=`<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la},1 ${x2},${y2} Z" fill="${cs[i]}" opacity=".85"/>\n    `;
    sl+=`<text x="${cx+(r*.65)*Math.sin(md*Math.PI/180)}" y="${cy-(r*.65)*Math.cos(md*Math.PI/180)}" font-family="'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#fff" text-anchor="middle">${x.v}%</text>\n    `;
    lg+=`<rect x="420" y="${80+i*30}" width="16" height="16" rx="3" fill="${cs[i]}"/><text x="445" y="${93+i*30}" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="13" fill="#334155">${x.l} (${x.v}%)</text>\n    `;
    c+=p;
  });
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="600" height="280">\n<rect width="600" height="280" fill="#f8fafc" rx="8"/><text x="300" y="25" font-family="'Noto Sans TC','Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">二手成交類別分佈</text>\n${sl}${lg}</svg>`;
}

function rnText(){return`🔥 香港楼市2026年5月数据更新｜土瓜湾竟然还在"6字头"

📊 整体市场：

香港住宅价格指数已连升9个月，5月最新报156.14点。
S&P预计2026全年楼价升8-10%，CBRE看3-5%。
2月录得6,669宗住宅成交，同比大增40.7%。
二手成交中，私楼占68%，资助房屋占15%，工商舖10%，车位7%。

一句话总结：楼市最差的时候已经过去，但8.8万伙一手库存仍然是压制大幅反弹的最大阻力。

📌 土瓜湾 (To Kwa Wan) 区数据：

最近30日成交平均呎价：$11,157/呎
按月变动：+8.23% 🔺
放盘叫价平均：$16,274/呎
最低成交记录：$6,844/呎（唐楼/分契单位）

对比九龙中各区：土瓜湾 $11,157 ← 九龙洼地 | 红磡 $12,436 | 黄埔 $15,800 | 九龙城 $16,800 | 启德 $19,500

🏢 标杆屋苑：环海·东岸 (Upper East) 30日平均 $17,500/呎 (+10.8%)

🏠 租赁市场：全港租金指数116.75点(+8.94%)，土瓜湾约$42/呎，环海·东岸约$56/呎(4.2%回报)。细户型出租率95%+。

📷 左滑图1-5：价格指数 | 成交宗数 | 分区对比 | 租金回报 | 成交类别

💾 保存此帖

#香港楼市 #土瓜湾 #九龙楼市 #富荣地产`;}

function htmlSec(){
  return`
  <section id="market-analysis" class="bg-gray-50 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-8"><h2 class="text-3xl font-bold text-gray-800">📊 市場分析 Market Analysis</h2><p class="text-gray-500 mt-2">更新於 ${DL} · 僅供參考</p></div>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">香港住宅市場概況</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg"><div class="text-2xl font-bold text-brand">${d.idx[0]}</div><div class="text-xs text-gray-500 mt-1">價格指數</div></div>
          <div class="text-center p-4 bg-green-50 rounded-lg"><div class="text-2xl font-bold text-green-600">+${d.idx[1]}%</div><div class="text-xs text-gray-500 mt-1">按月</div></div>
          <div class="text-center p-4 bg-purple-50 rounded-lg"><div class="text-2xl font-bold text-purple-600">${d.idx[3].toLocaleString()}</div><div class="text-xs text-gray-500 mt-1">2月成交</div></div>
          <div class="text-center p-4 bg-amber-50 rounded-lg"><div class="text-2xl font-bold text-amber-600">${d.idx[2]}</div><div class="text-xs text-gray-500 mt-1">全年預測</div></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div><img src="output/daily/price_idx_${D}.svg" class="w-full rounded-lg border" onerror="this.style.display='none'"/></div>
          <div><img src="output/daily/volume_${D}.svg" class="w-full rounded-lg border" onerror="this.style.display='none'"/></div>
        </div>
        <div class="mt-4 text-sm text-gray-500"><p>• 價格指數連升9個月 · 2月成交${d.idx[3].toLocaleString()}宗 (+${d.idx[4]}) · ⚠️ 一手庫存${(d.idx[5]/10000).toFixed(1)}萬伙</p></div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">土瓜灣 To Kwa Wan</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-4 bg-blue-50"><div class="text-2xl font-bold text-brand">$${d.tkwP.toLocaleString()}/呎</div><div class="text-xs text-gray-500">30日成交</div></div>
          <div class="text-center p-4 bg-green-50"><div class="text-2xl font-bold text-green-600">+${d.tkwM}%</div><div class="text-xs text-gray-500">按月</div></div>
          <div class="text-center p-4 bg-amber-50"><div class="text-lg font-bold text-amber-600">$${d.tkwL.toLocaleString()}</div><div class="text-xs text-gray-500">最低</div></div>
          <div class="text-center p-4 bg-red-50"><div class="text-lg font-bold text-red-600">$${d.tkwH.toLocaleString()}</div><div class="text-xs text-gray-500">最高</div></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div><img src="output/daily/tkw_cmp_${D}.svg" class="w-full rounded-lg border" onerror="this.style.display='none'"/></div>
          <div><img src="output/daily/tx_type_${D}.svg" class="w-full rounded-lg border" onerror="this.style.display='none'"/></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">🏠 租賃市場 Rental</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-4 bg-violet-50"><div class="text-2xl font-bold text-violet-600">${d.ri}</div><div class="text-xs text-gray-500">租金指數</div></div>
          <div class="text-center p-4 bg-green-50"><div class="text-2xl font-bold text-green-600">+${d.ry}%</div><div class="text-xs text-gray-500">按年</div></div>
          <div class="text-center p-4 bg-amber-50"><div class="text-2xl font-bold text-amber-600">${d.rf}</div><div class="text-xs text-gray-500">2026預測</div></div>
          <div class="text-center p-4 bg-cyan-50"><div class="text-lg font-bold text-cyan-600">4.2-4.8%</div><div class="text-xs text-gray-500">TKW回報</div></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div><img src="output/daily/rent_yield_${D}.svg" class="w-full rounded-lg border" onerror="this.style.display='none'"/></div>
          <div class="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p class="font-semibold mb-2">區内租金參考</p>
            <ul class="space-y-1"><li>• 土瓜灣平均 ~$42/呎</li><li>• 環海·東岸 ~$56/呎 (4.2%)</li><li>• 黃埔花園 ~3.8% · 海逸豪園 ~3.5%</li><li>• 細戶型出租率95%+</li></ul>
            <p class="mt-2 text-gray-500">高才通及非本地生擴招持續注入租賃需求。</p>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
        <div class="flex"><div class="text-yellow-600 text-xl mr-3">💡</div><div><p class="font-bold text-yellow-800">富榮地產市場觀察</p><p class="text-yellow-700 text-sm mt-1">土瓜灣是全九龍少數能找到「6字頭呎價」的分區。沙中線通車3年樓價尚未完全反映交通紅利，這個「九龍價格窪地」可能在2-3年內消失。細戶型租務需求穩健，租金回報吸引力持續上升。</p></div></div>
      </div>
    </div>
  </section>`;
}

function main(){
  const files=[
    ["price_idx",bar(d.im,d.iv,170,"香港住宅價格指數走勢","#0284c7","#93c5fd","","僅供參考")],
    ["volume",bar(d.vm,d.vv,8000,"每月住宅成交宗數","#16a34a","#86efac","","僅供參考")],
    ["tkw_cmp",cmp()],["rent_yield",rent()],["tx_type",pie()]];
  files.forEach(([n,s])=>{fs.writeFileSync(path.join(OUT,`${n}_${D}.svg`),s,"utf-8");console.log(`✅ ${n}`);});

  fs.writeFileSync(path.join(OUT,`rn_${D}.md`),rnText(),"utf-8");console.log(`✅ rn post`);

  // Update HTML
  if(fs.existsSync(HTML)){
    let h=fs.readFileSync(HTML,"utf-8");
    const tag='<!-- MKT_SEC -->',end='<!-- END_MKT -->';
    if(h.includes(tag)){const a=h.indexOf(tag),b=h.indexOf(end)+end.length;h=h.slice(0,a)+tag+htmlSec()+'\n'+end+h.slice(b);}
    else{h=h.replace('</footer>',tag+htmlSec()+'\n'+end+'\n</footer>');}
    fs.writeFileSync(HTML,h,"utf-8");console.log("✅ HTML updated");
  }

  // Git push
  try{
    cp.execSync('git add -A',{cwd:__dirname});
    cp.execSync(`git commit -m "Daily market analysis ${DL}"`,{cwd:__dirname});
    cp.execSync('git push origin master',{cwd:__dirname});
    console.log("✅ Pushed to GitHub");
  }catch(e){console.log("⚠ Git push:",e.message);}
  // 5. Generate single "post everything" file
  const postParts = [
    "=== 🏠 富榮地產 市場分析 — RedNote Post ===",
    `日期: ${DL}`,
    "",
    rnText(),
    "",
    "=== 📊 圖表 (左滑查看) ===",
    ""
  ];
  ["price_idx","volume","tkw_cmp","rent_yield","tx_type"].forEach(n => {
    const p = path.join(OUT, `${n}_${D}.svg`);
    postParts.push(`🖼 ${n}.svg — ${fs.statSync(p).size} bytes`);
  });
  postParts.push("");
  postParts.push("=== 📎 以上內容已同步上傳至 nelsonpropertyagency.com ===");

  const postFilePath = path.join(OUT, `rednote_post_${D}.txt`);
  fs.writeFileSync(postFilePath, postParts.join("\n"), "utf-8");
  console.log(`✅ rednote_post_${D}.txt (single file)`);

  console.log("\n🎉 Done");
}

main();
