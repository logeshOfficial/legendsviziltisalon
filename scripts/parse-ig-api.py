import json
import re

api_path = r"d:\salon-demo\scripts\ig-api.json"
out_path = r"d:\salon-demo\scripts\ig-api-parsed.txt"
data = json.load(open(api_path, encoding="utf-8"))
user = data["data"]["user"]
lines = [
    f"full_name: {user.get('full_name')}",
    f"username: {user.get('username')}",
    f"biography: {user.get('biography')}",
    f"external_url: {user.get('external_url')}",
    f"profile_pic_hd: {user.get('profile_pic_url_hd')}",
]

edges = user.get("edge_owner_to_timeline_media", {}).get("edges", [])
lines.append(f"\nPOSTS: {len(edges)}")
for i, edge in enumerate(edges[:15]):
    node = edge["node"]
    url = node.get("display_url") or node.get("thumbnail_src")
    cap = ""
    if node.get("edge_media_to_caption", {}).get("edges"):
        cap = node["edge_media_to_caption"]["edges"][0]["node"]["text"][:80]
    lines.append(f"{i+1}. {url}")
    if cap:
        lines.append(f"   caption: {cap}")

open(out_path, "w", encoding="utf-8").write("\n".join(lines))
print(f"posts: {len(edges)}, wrote {out_path}")
