#!/usr/bin/env python3
"""
auto_publish.py — Multi-platform listing content generator for Ka Fai Property.

Usage:
    python auto_publish.py listing.json
    python auto_publish.py --help
"""

import json
import sys
import os
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# from dotenv import load_dotenv   # pip install python-dotenv
# load_dotenv()
# META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")
# META_PAGE_ID = os.getenv("META_PAGE_ID")

TEMPLATE_ENV = """META_ACCESS_TOKEN=your_facebook_access_token
META_PAGE_ID=your_facebook_page_id
"""


def help_text():
    return """auto_publish.py — Generate listing content for Website, Instagram & Xiaohongshu

Usage:
  python auto_publish.py <listing.json>
  python auto_publish.py --help

Arguments:
  listing.json    Path to a JSON file containing a single listing object
                  with fields: id, district, size, price, bedrooms, bathrooms,
                  layout, descriptionEn, descriptionZh, tags, etc.

Output:
  Three clearly labeled versions printed to stdout:
    1. Website version (JavaScript array entry)
    2. Instagram version (Cantonese/English mix with emojis & hashtags)
    3. Xiaohongshu version (Simplified Chinese, lifestyle-focused)

Examples:
  python auto_publish.py ./listings/1.json

  # Create .env.example first, then edit with your tokens:
  python auto_publish.py --help
"""


def fmt_price(hkd):
    return f"HK${hkd:,.0f}"


def gen_website_version(d):
    return f"""// Website — listings.js array entry
{{
  id: {d["id"]},
  district: {{ en: "{d["district"]["en"]}", zh: "{d["district"]["zh"]}" }},
  size: {d["size"]},
  price: {d["price"]},
  bedrooms: {d["bedrooms"]},
  bathrooms: {d["bathrooms"]},
  layout: "{d["layout"]}",
  descriptionEn: "{d.get("descriptionEn", "")}",
  descriptionZh: "{d.get("descriptionZh", "")}",
  tags: {json.dumps(d.get("tags", []))},
  imageUrl: "{d.get("imageUrl", "")}",
  dateAdded: "{d.get("dateAdded", "")}",
  status: "{d.get("status", "available")}",
  mtrStation: "{d.get("mtrStation", "")}",
  schoolNet: "{d.get("schoolNet", "")}"
}}"""


def gen_instagram_version(d):
    district_zh = d["district"]["zh"]
    district_en = d["district"]["en"]
    price = fmt_price(d["price"])
    lines = [
        f"🏠 {' '.join(d.get('tags', []))}",
        "",
        f"📍 {district_zh} {district_en}",
        f"📐 {d['size']} sq ft | {d['bedrooms']}房 {d['bathrooms']}廁 | {d['layout']}",
        f"💰 {price}",
        "",
        d.get("descriptionEn", ""),
        d.get("descriptionZh", ""),
        "",
        f"🚇 鄰近 {d.get('mtrStation', 'N/A')}站",
        f"🏫 校網 {d.get('schoolNet', 'N/A')}",
        "",
        "📲 立即查詢: wa.me/852",
        "",
        "#嘉輝置業 #KaFaiProperty #香港樓盤 #置業",
        f"#{district_en.replace(' ', '')} #香港地產",
    ]
    return "\n".join(lines)


def gen_xiaohongshu_version(d):
    district_zh = d["district"]["zh"]
    tags_str = " ".join(d.get("tags", []))
    price = fmt_price(d["price"])
    lines = [
        "🏡 香港置业日记",
        "",
        f"📍 地区：{district_zh}",
        f"📐 面积：{d['size']} 平方呎 | {d['bedrooms']}房{d['bathrooms']}卫 | {d['layout']}",
        f"💰 售价：{price}",
        "",
        f"{d.get('descriptionZh', '')}",
        "",
        f"✨ {tags_str}",
        "",
        f"🚇 地铁：{d.get('mtrStation', 'N/A')}站",
        f"🏫 校网：{d.get('schoolNet', 'N/A')}",
        "",
        "💬 想了解更多的朋友欢迎私信或留言！",
        "",
        "#香港买房 #香港置业 #港楼 #上车盘 #香港生活",
    ]
    return "\n".join(lines)


def gen_image(d):
    """Generate marketing image by calling the Node.js image generator."""
    import subprocess, tempfile
    tmp = tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', suffix='.json', delete=False)
    json.dump(d, tmp, ensure_ascii=False)
    tmp.close()
    script = os.path.join(os.path.dirname(__file__), 'generate_listing_image.js')
    result = subprocess.run(['node', script, tmp.name], capture_output=True, text=True)
    os.unlink(tmp.name)
    print(result.stdout.strip())
    if result.returncode != 0:
        print(f"[WARN] Image generation: {result.stderr.strip()}", file=sys.stderr)


def main():
    if len(sys.argv) != 2:
        print(help_text())
        sys.exit(1)

    arg = sys.argv[1]
    if arg in ("--help", "-h"):
        print(help_text())
        sys.exit(0)

    if not os.path.isfile(arg):
        print(f"Error: file not found — {arg}", file=sys.stderr)
        sys.exit(1)

    with open(arg, "r", encoding="utf-8-sig") as f:
        data = json.load(f)

    sep = "=" * 60

    print(sep)
    print("  [1/3] WEBSITE VERSION  (listings.js entry)")
    print(sep)
    print(gen_website_version(data))

    print()
    print(sep)
    print("  [2/3] INSTAGRAM VERSION  (Cantonese/English + emojis + hashtags)")
    print(sep)
    print(gen_instagram_version(data))

    print()
    print(sep)
    print("  [3/3] XIAOHONGSHU VERSION  (Simplified Chinese, lifestyle)")
    print(sep)
    print(gen_xiaohongshu_version(data))


def create_env_example():
    path = ".env.example"
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(TEMPLATE_ENV)
        print(f"Created {path} (edit with your tokens)")


if __name__ == "__main__":
    create_env_example()
    main()
