#!/usr/bin/env python3
"""
Fetches market data and writes public/data.json.

Design:
  * Every item is fetched independently. If one source fails, the others still update.
  * If a fetch fails, the previous value from data.json is kept and marked "stale".
  * Items that have no free API are read from config/manual.json and marked "indicative"
    (the page shows them in italic).
"""
import json
import os
import sys
from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

import requests

try:
    import yfinance as yf
except ImportError:  # pragma: no cover
    yf = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "public", "data.json")
MANUAL_PATH = os.path.join(ROOT, "config", "manual.json")
CALENDAR_PATH = os.path.join(ROOT, "config", "calendar.json")
IL_TZ = ZoneInfo("Asia/Jerusalem")
FRED_KEY = os.environ.get("FRED_API_KEY", "").strip()

# ----------------------------------------------------------------------------
# Instrument definitions
# ----------------------------------------------------------------------------
INDICES = {
    "israel": [
        ("TA-35", "TA35.TA"),
        ("TA-90", "TA90.TA"),
        ("TA-125", "^TA125.TA"),
        ("TA Banks 5", "TA-BANKS5.TA"),
        ("TA Insurance", "TA-INSURANCE.TA"),
    ],
    "us": [
        ("S&P 500", "^GSPC"),
        ("Nasdaq Composite", "^IXIC"),
        ("Dow Jones", "^DJI"),
        ("Russell 2000", "^RUT"),
    ],
    "europe": [
        ("DAX — Germany", "^GDAXI"),
        ("CAC 40 — France", "^FCHI"),
        ("FTSE 100 — United Kingdom", "^FTSE"),
    ],
    "asia": [
        ("Nikkei 225 — Japan", "^N225"),
        ("KOSPI — South Korea", "^KS11"),
        ("Nifty 50 — India", "^NSEI"),
    ],
}

COMMODITIES = [
    ("VIX", "^VIX", 2),
    ("Brent Oil", "BZ=F", 2),
    ("Gold (USD/oz)", "GC=F", 2),
    ("Silver (USD/oz)", "SI=F", 2),
]

FX = [
    ("USD/ILS", "ILS=X", 4),
    ("EUR/ILS", "EURILS=X", 4),
]

# FRED series (only used when FRED_API_KEY is set)
FRED_US_YIELDS = {"1Y": "DGS1", "3Y": "DGS3", "5Y": "DGS5", "10Y": "DGS10"}
FRED_FED_RATE = "DFEDTARU"  # Fed funds target range, upper bound

# Yahoo fallbacks for US yields when no FRED key
YF_US_YIELDS = {"5Y": "^FVX", "10Y": "^TNX"}


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
def log(msg):
    print(msg, file=sys.stderr)


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def pct(new, old):
    if new is None or old in (None, 0):
        return None
    return (new / old - 1.0) * 100.0


def item(label, value=None, status="ok", **changes):
    """One row. status: ok | indicative | stale | missing."""
    if value is None and status == "ok":
        status = "missing"
    d = {"label": label, "value": value, "status": status}
    d.update(changes)
    return d


# ----------------------------------------------------------------------------
# Yahoo Finance
# ----------------------------------------------------------------------------
def yf_history(symbol):
    """Daily closes for the past ~14 months as a pandas Series, or None."""
    if yf is None:
        return None
    try:
        hist = yf.Ticker(symbol).history(period="14mo", interval="1d", auto_adjust=False)
        if hist is None or hist.empty:
            return None
        closes = hist["Close"].dropna()
        return closes if not closes.empty else None
    except Exception as e:
        log(f"  yfinance {symbol}: {e}")
        return None


def close_on_or_before(closes, target):
    """Last close on or before a calendar date."""
    try:
        idx = closes.index.tz_localize(None) if closes.index.tz is not None else closes.index
        sub = closes[idx.date <= target]
        return float(sub.iloc[-1]) if not sub.empty else None
    except Exception:
        return None


def yf_performance(label, symbol):
    closes = yf_history(symbol)
    if closes is None or len(closes) < 2:
        return item(label)
    last = float(closes.iloc[-1])
    prev = float(closes.iloc[-2])
    last_date = closes.index[-1].date()
    w_ago = close_on_or_before(closes, last_date - timedelta(days=7))
    m_ago = close_on_or_before(closes, last_date - timedelta(days=30))
    ytd_base = close_on_or_before(closes, date(last_date.year - 1, 12, 31))
    return item(
        label, round(last, 2), "ok",
        d1=pct(last, prev), w1=pct(last, w_ago), m1=pct(last, m_ago), ytd=pct(last, ytd_base),
    )


def yf_last_and_1d(label, symbol, decimals):
    closes = yf_history(symbol)
    if closes is None or len(closes) < 2:
        return item(label)
    last, prev = float(closes.iloc[-1]), float(closes.iloc[-2])
    return item(label, round(last, decimals), "ok", d1=pct(last, prev))


def yf_last(symbol):
    closes = yf_history(symbol)
    return float(closes.iloc[-1]) if closes is not None else None


# ----------------------------------------------------------------------------
# Official sources
# ----------------------------------------------------------------------------
def fred_latest(series_id):
    if not FRED_KEY:
        return None
    try:
        r = requests.get(
            "https://api.stlouisfed.org/fred/series/observations",
            params={"series_id": series_id, "api_key": FRED_KEY, "file_type": "json",
                    "sort_order": "desc", "limit": 5},
            timeout=20,
        )
        r.raise_for_status()
        for obs in r.json().get("observations", []):
            if obs.get("value") not in (None, ".", ""):
                return float(obs["value"])
    except Exception as e:
        log(f"  FRED {series_id}: {e}")
    return None


def ecb_deposit_rate():
    """ECB deposit facility rate from the ECB Data Portal (no key needed)."""
    try:
        r = requests.get(
            "https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV",
            params={"lastNObservations": 1, "format": "csvdata"},
            timeout=20,
        )
        r.raise_for_status()
        lines = [l for l in r.text.splitlines() if l.strip()]
        header = lines[0].split(",")
        row = lines[-1].split(",")
        return float(row[header.index("OBS_VALUE")])
    except Exception as e:
        log(f"  ECB: {e}")
        return None


def boi_interest_rate():
    """Bank of Israel policy rate via the BoI public API."""
    try:
        r = requests.get("https://www.boi.org.il/PublicApi/GetInterest", timeout=20)
        r.raise_for_status()
        data = r.json()
        # Expected shape: {"currentInterest": 4.5, ...}; be defensive about key names.
        for k in ("currentInterest", "CurrentInterest", "interestRate", "rate"):
            if k in data:
                return float(data[k])
    except Exception as e:
        log(f"  BoI: {e}")
    return None


def boe_bank_rate():
    """Bank of England Bank Rate, latest value from the IADB CSV endpoint."""
    try:
        today = date.today()
        r = requests.get(
            "https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp",
            params={
                "csv.x": "yes", "Datefrom": (today - timedelta(days=400)).strftime("%d/%b/%Y"),
                "Dateto": today.strftime("%d/%b/%Y"), "SeriesCodes": "IUMABEDR",
                "CSVF": "TN", "UsingCodes": "Y", "VPD": "Y", "VFD": "N",
            },
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=20,
        )
        r.raise_for_status()
        rows = [l.split(",") for l in r.text.splitlines() if l.strip()]
        for row in reversed(rows):
            try:
                return float(row[1])
            except (ValueError, IndexError):
                continue
    except Exception as e:
        log(f"  BoE: {e}")
    return None


# ----------------------------------------------------------------------------
# Assembly
# ----------------------------------------------------------------------------
def with_fallback(label, auto_value, manual_value, previous, decimals=2):
    """Prefer live data; else manual (italic); else previous (stale); else —."""
    if auto_value is not None:
        return item(label, round(auto_value, decimals), "ok")
    if manual_value is not None:
        return item(label, manual_value, "indicative")
    if previous and previous.get("value") is not None:
        return item(label, previous["value"], "stale")
    return item(label)


def previous_lookup(prev_data, section, key):
    try:
        return next(x for x in prev_data[section] if x.get("key") == key)
    except Exception:
        return None


def main():
    manual = load_json(MANUAL_PATH, {})
    prev = load_json(OUT_PATH, {})
    now_il = datetime.now(IL_TZ)
    out = {"updated_il": now_il.strftime("%d.%m.%Y %H:%M"), "updated_iso": now_il.isoformat()}

    # --- A. Central bank rates ---
    log("Central bank rates")
    m = manual.get("central_bank_rates", {})
    rates = [
        ("israel", "Israel — BoI", boi_interest_rate()),
        ("us", "United States — Fed", fred_latest(FRED_FED_RATE)),
        ("ecb", "Euro Area — ECB", ecb_deposit_rate()),
        ("uk", "United Kingdom — BoE", boe_bank_rate()),
        ("japan", "Japan — BoJ", None),  # no free API; manual only
    ]
    out["central_bank_rates"] = []
    for key, label, auto in rates:
        row = with_fallback(label, auto, m.get(key), previous_lookup(prev, "central_bank_rates", key))
        row["key"] = key
        out["central_bank_rates"].append(row)

    # --- B. Commodities & volatility ---
    log("Commodities")
    out["commodities"] = []
    for label, sym, dec in COMMODITIES:
        row = yf_last_and_1d(label, sym, dec)
        row["key"] = sym
        if row["status"] == "missing":
            p = previous_lookup(prev, "commodities", sym)
            if p and p.get("value") is not None:
                row = dict(p, status="stale")
        out["commodities"].append(row)

    # --- C. FX ---
    log("FX")
    out["fx"] = []
    for label, sym, dec in FX:
        row = yf_last_and_1d(label, sym, dec)
        row["key"] = sym
        if row["status"] == "missing":
            p = previous_lookup(prev, "fx", sym)
            if p and p.get("value") is not None:
                row = dict(p, status="stale")
        out["fx"].append(row)

    # --- Government bond yields ---
    log("Bond yields")
    my = manual.get("bond_yields", {})
    tenors = ["1Y", "3Y", "5Y", "10Y"]
    yields = []

    # United States: FRED if key, else Yahoo for 5Y/10Y, else manual
    us = {}
    for t in tenors:
        v = fred_latest(FRED_US_YIELDS[t])
        status = "ok"
        if v is None and t in YF_US_YIELDS:
            v = yf_last(YF_US_YIELDS[t])
        if v is None:
            v = my.get("us", {}).get(t)
            status = "indicative"
        us[t] = {"value": round(v, 2) if v is not None else None, "status": status if v is not None else "missing"}
    yields.append({"key": "us", "label": "United States", "tenors": us})

    for key, label in [("israel", "Israel"), ("germany", "Germany"), ("uk", "United Kingdom"), ("japan", "Japan")]:
        row = {}
        for t in tenors:
            v = my.get(key, {}).get(t)
            row[t] = {"value": v, "status": "indicative" if v is not None else "missing"}
        yields.append({"key": key, "label": label, "tenors": row})
    out["bond_yields"] = yields

    # --- Index performance ---
    out["indices"] = {}
    for region, lst in INDICES.items():
        log(f"Indices: {region}")
        rows = []
        for label, sym in lst:
            row = yf_performance(label, sym)
            row["key"] = sym
            if row["status"] == "missing":
                try:
                    p = next(x for x in prev["indices"][region] if x.get("key") == sym)
                    if p.get("value") is not None:
                        row = dict(p, status="stale")
                except Exception:
                    pass
            rows.append(row)
        out["indices"][region] = rows

    # --- Economic calendar (manual file; next 30 days only, sorted) ---
    cal = load_json(CALENDAR_PATH, {"events": []}).get("events", [])
    today = now_il.date()
    horizon = today + timedelta(days=30)
    events = []
    for ev in cal:
        try:
            d = datetime.strptime(ev["date"], "%Y-%m-%d").date()
        except Exception:
            continue
        if today <= d <= horizon:
            events.append(ev)
    events.sort(key=lambda e: (e["date"], e.get("time", "")))
    out["calendar"] = events

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    log(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
