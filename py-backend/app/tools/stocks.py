import httpx
from typing import List, Dict, Any

async def fetch_stocks(tickers: List[str]) -> List[Dict[str, Any]]:
    if not tickers:
        return []
    symbols = ",".join(tickers)
    url = "https://query1.finance.yahoo.com/v7/finance/quote"
    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.get(url, params={"symbols": symbols})
        results = (res.json().get("quoteResponse") or {}).get("result") or []
        out: List[Dict[str, Any]] = []
        for r in results:
            out.append({
                "ticker": r.get("symbol"),
                "price": float(r.get("regularMarketPrice") or 0),
                "changePercent": float(r.get("regularMarketChangePercent") or 0),
            })
        return out
