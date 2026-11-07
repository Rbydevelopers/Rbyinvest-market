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
from datetime import date, datetime, timedelta, timezone

try:
    import yfinance as yf
except ImportError:
    yf = None

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


def main():
    with open(WATCH, encoding="utf-8") as f:
        symbols = [s.strip().upper() for s in json.load(f).get("tickers", []) if str(s).strip()]
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
        quotes[s] = r
        print(f"  {s}: {r.get('status')} {r.get('last')}")
    out = {"updated_iso": datetime.now(timezone.utc).isoformat(timespec="seconds"), "source": "Yahoo Finance (via yfinance)", "quotes": quotes}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
