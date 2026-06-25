import json
import os
import urllib.request

API = r"d:\salon-demo\scripts\ig-api.json"
PUBLIC = r"d:\salon-demo\public"
GALLERY = os.path.join(PUBLIC, "gallery")

os.makedirs(GALLERY, exist_ok=True)

data = json.load(open(API, encoding="utf-8"))
user = data["data"]["user"]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def download(url: str, dest: str) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
        with open(dest, "wb") as f:
            f.write(content)
        print(f"OK {dest} ({len(content)} bytes)")
        return True
    except Exception as e:
        print(f"FAIL {dest}: {e}")
        return False


# Profile pic -> logo.jpg
profile_url = user.get("profile_pic_url_hd") or user.get("profile_pic_url")
download(profile_url, os.path.join(PUBLIC, "logo.jpg"))

# Posts -> gallery
edges = user.get("edge_owner_to_timeline_media", {}).get("edges", [])
for i, edge in enumerate(edges[:12], start=1):
    node = edge["node"]
    url = node.get("display_url") or node.get("thumbnail_src")
    dest = os.path.join(GALLERY, f"post-{i:02d}.jpg")
    download(url, dest)

print("Done.")
