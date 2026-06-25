import re
import json
import html as html_lib

path = r"d:\salon-demo\scripts\ig-page.html"
out = r"d:\salon-demo\scripts\ig-parsed.txt"
text = open(path, encoding="utf-8", errors="ignore").read()
lines = []

for m in re.finditer(r'<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)"', text):
    k, v = m.groups()
    if any(x in k for x in ["og:", "description", "title"]):
        lines.append(f"META {k}: {html_lib.unescape(v)[:500]}")

for m in re.finditer(r'<meta\s+content="([^"]*)"\s+(?:property|name)="([^"]+)"', text):
    v, k = m.groups()
    if any(x in k for x in ["og:", "description", "title"]):
        lines.append(f"META {k}: {html_lib.unescape(v)[:500]}")

pics = sorted(set(re.findall(r'https://[^"\s\\]+cdninstagram\.com[^"\s\\]*profile_pic[^"\s\\]*', text)))
lines.append(f"\nPROFILE_PICS ({len(pics)}):")
for p in pics[:8]:
    lines.append(p.replace("\\u0026", "&"))

displays = re.findall(r'"display_url":"(https://[^"]+)"', text)
lines.append(f"\nDISPLAY_URLS ({len(displays)}):")
for u in displays[:20]:
    lines.append(u.replace("\\u0026", "&"))

for key in ["biography", "full_name", "username", "external_url", "business_address_json", "public_email", "contact_phone_number"]:
    matches = re.findall(rf'"{key}"\s*:\s*"([^"]*)"', text)
    if matches:
        lines.append(f"\n{key}: {html_lib.unescape(matches[0])[:500]}")

# Larger profile pic from og:image - try s320x320
og = re.findall(r'property="og:image"\s+content="([^"]+)"', text)
if not og:
    og = re.findall(r'content="([^"]+)"\s+property="og:image"', text)
if og:
    lines.append(f"\nog:image: {og[0]}")
    large = re.sub(r"s\d+x\d+", "s320x320", og[0])
    lines.append(f"large_profile: {large}")

open(out, "w", encoding="utf-8").write("\n".join(lines))
print(f"Wrote {len(lines)} lines to {out}")
