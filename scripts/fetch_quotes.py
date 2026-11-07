#!/usr/bin/env python3
"""
Fetches last price and day / week / month / year-to-date change for every ticker in
config/watch.json and writes docs/quotes.json (the Alerts page reads that file).

Design (same spirit as fetch_data.py):
  * Each ticker is fetched on its own. One failure never stops the others.
  * If a ticker fails, its previous values are kept and marked "stale".
  * Alert prices are NOT here. They are saved privately in your own browser.
"""
import json
import os
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from datetime import date, datetime, timedelta, timezone

try:
    import yfinance as yf
except ImportError:
    yf = None

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WATCH = os.path.join(ROOT, "config", "watch.json")
OUT = os.path.join(ROOT, "docs", "quotes.json")


def pct(new, old):
    return None if new is None or not old else (new / old - 1.0) * 100.0


def close_on_or_before(closes, target):
    idx = closes.index.tz_localize(None) if closes.index.tz is not None else closes.index
    sub = closes[idx.date <= target]
    return float(sub.iloc[-1]) if not sub.empty else None


def fetch(symbol):
    t = yf.Ticker(symbol)
    hist = t.history(period="14mo", interval="1d", auto_adjust=False, timeout=20)
    closes = hist["Close"].dropna() if hist is not None and not hist.empty else None
    if closes is None or len(closes) < 2:
        return None
    last, prev = float(closes.iloc[-1]), float(closes.iloc[-2])
    d = closes.index[-1].date()
    ccy, name = None, None
    try:
        ccy = t.fast_info.get("currency")
    except Exception:
        pass
    try:
        info = t.info or {}
        name = info.get("shortName") or info.get("longName")
    except Exception:
        pass
    return {
        "name": name, "ccy": ccy, "last": round(last, 4), "date": d.isoformat(),
        "d1": pct(last, prev),
        "w1": pct(last, close_on_or_before(closes, d - timedelta(days=7))),
        "m1": pct(last, close_on_or_before(closes, d - timedelta(days=30))),
        "ytd": pct(last, close_on_or_before(closes, date(d.year - 1, 12, 31))),
        "status": "ok",
    }


def fetch_news(query, limit=8):
    """Latest headlines from Google News RSS (headline, source, date, link only)."""
    r = requests.get(
        "https://news.google.com/rss/search",
        params={"q": query + " when:365d", "hl": "he", "gl": "IL", "ceid": "IL:he"},
        headers={"User-Agent": "Mozilla/5.0"}, timeout=20,
    )
    r.raise_for_status()
    items = []
    for it in ET.fromstring(r.content).iter("item"):
        src = it.findtext("source") or ""
        title = (it.findtext("title") or "").strip()
        if src and title.endswith(" - " + src):
            title = title[: -len(src) - 3]
        try:
            d = parsedate_to_datetime(it.findtext("pubDate")).date().isoformat()
        except Exception:
            d = None
        items.append({"title": title, "source": src, "date": d, "link": it.findtext("link")})
    items.sort(key=lambda x: x["date"] or "", reverse=True)
    return items[:limit]


def sym_of(t):
    return (t["symbol"] if isinstance(t, dict) else str(t)).strip().upper()


def main():
    with open(WATCH, encoding="utf-8") as f:
        cfg = json.load(f)
    lists = {
        "alerts": [sym_of(t) for t in cfg.get("alerts", cfg.get("tickers", [])) if sym_of(t)],
        "watchlist": [sym_of(t) for t in cfg.get("watchlist", []) if sym_of(t)],
    }
    names = {sym_of(t): t["name"] for k in ("alerts", "watchlist") for t in cfg.get(k, []) if isinstance(t, dict) and t.get("name")}
    symbols = list(dict.fromkeys(lists["alerts"] + lists["watchlist"]))
    try:
        with open(OUT, encoding="utf-8") as f:
            prev = json.load(f).get("quotes", {})
    except Exception:
        prev = {}
    quotes = {}
    for s in symbols:
        r = None
        if yf is not None:
            try:
                r = fetch(s)
            except Exception as e:
                print(f"  {s}: {e}")
        if r is None:
            old = prev.get(s)
            r = {**old, "status": "stale"} if old and old.get("last") is not None else {"last": None, "status": "missing"}
        if names.get(s):
            r["he_name"] = names[s]
        quotes[s] = r
        print(f"  {s}: {r.get('status')} {r.get('last')}")
    try:
        with open(OUT, encoding="utf-8") as f:
            prev_news = json.load(f).get("news", {})
    except Exception:
        prev_news = {}
    news = {}
    for u in cfg.get("unlisted", []):
        name, q = u.get("name"), u.get("query")
        if not name or not q:
            continue
        try:
            news[name] = {"items": fetch_news(q), "status": "ok"}
        except Exception as e:
            print(f"  news {name}: {e}")
            old = prev_news.get(name, {}).get("items", [])
            news[name] = {"items": old, "status": "stale" if old else "missing"}
        print(f"  news {name}: {news[name]['status']} {len(news[name]['items'])}")
    out = {
        "news": news,
        "updated_iso": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "Yahoo Finance (via yfinance)",
        "lists": lists,
        "unlisted": cfg.get("unlisted", []),
        "quotes": quotes,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
