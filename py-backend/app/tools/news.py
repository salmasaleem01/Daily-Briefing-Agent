import httpx
from typing import List, Dict, Any

async def fetch_top_news() -> List[Dict[str, Any]]:
    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.get("https://hn.algolia.com/api/v1/search", params={"tags": "front_page"})
        hits = res.json().get("hits") or []
        out: List[Dict[str, Any]] = []
        for h in hits[:10]:
            title = h.get("title") or h.get("story_title") or "Untitled"
            url = h.get("url") or h.get("story_url") or "#"
            out.append({"title": title, "url": url, "source": "HackerNews"})
        return out
