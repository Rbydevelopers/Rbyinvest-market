#!/usr/bin/env python3
"""
Fetches market data and writes docs/data.json.

Design:
  * Every item is fetched independently. If one source fails, the others still update.
  * If a fetch fails, the previous value from data.json is kept and marked "stale".
  * Items that have no free API are read from config/manual.json and marked "indicative"
    (the page shows them in italic).
"""
import json
import math
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
OUT_PATH = os.path.join(ROOT, "docs", "data.json")
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
LOGS = []


def log(msg):
    print(msg, file=sys.stderr)
    LOGS.append(str(msg)[:2000])


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
        hist = yf.Ticker(symbol).history(period="14mo", interval="1d", auto_adjust=False, timeout=20)
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


def find_symbol(label):
    """Ask Yahoo's search for a Tel Aviv index matching the label; logs what it finds."""
    if yf is None or not hasattr(yf, "Search"):
        return None
    try:
        quotes = yf.Search(label.split("—")[0].strip(), max_results=10).quotes
        log(f"  search '{label}': " + ", ".join(
            f"{q.get('symbol')}[{q.get('exchange')}] {q.get('longname') or q.get('shortname')}" for q in quotes))
        for q in quotes:
            s = str(q.get("symbol", ""))
            if s.startswith("TA-") and s.endswith(".TA"):
                return s
    except Exception as e:
        log(f"  search '{label}': {e}")
    return None


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


def nyfed_target_range():
    """Fed funds target range from the New York Fed (no key). Returns (low, high) or (None, None)."""
    try:
        r = requests.get("https://markets.newyorkfed.org/api/rates/unsecured/effr/last/1.json",
                         headers={"User-Agent": "Mozilla/5.0"}, timeout=25)
        r.raise_for_status()
        x = r.json()["refRates"][0]
        return _to_float(x.get("targetRateFrom")), _to_float(x.get("targetRateTo"))
    except Exception as e:
        log(f"  NY Fed: {e}")
        return None, None


def fred_csv_latest(series_id):
    """FRED public CSV (no API key needed)."""
    try:
        r = requests.get("https://fred.stlouisfed.org/graph/fredgraph.csv", params={"id": series_id},
                         headers={"User-Agent": "Mozilla/5.0"}, timeout=25)
        r.raise_for_status()
        for line in reversed(r.text.strip().splitlines()[1:]):
            v = _to_float(line.split(",")[-1])
            if v is not None:
                return v
    except Exception as e:
        log(f"  FRED csv {series_id}: {e}")
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
# Government bond yields (official sources, no API key)
# Each function returns {"1Y": float|None, "3Y": ..., "5Y": ..., "10Y": ...}
# ----------------------------------------------------------------------------
TENORS = ["1Y", "3Y", "5Y", "10Y"]
UA = {"User-Agent": "Mozilla/5.0 (market-dashboard; personal use)"}


def _to_float(s):
    try:
        v = float(str(s).strip().strip('"').replace(",", "."))
    except (ValueError, TypeError):
        return None
    return v if math.isfinite(v) else None


def us_treasury_yields():
    """US Treasury daily par yield curve (home.treasury.gov CSV)."""
    out = dict.fromkeys(TENORS)
    year = date.today().year
    url = (f"https://home.treasury.gov/resource-center/data-chart-center/interest-rates/"
           f"daily-treasury-rates.csv/{year}/all?type=daily_treasury_yield_curve"
           f"&field_tdr_date_value={year}&page&_format=csv")
    try:
        r = requests.get(url, headers=UA, timeout=25)
        r.raise_for_status()
        lines = [l for l in r.text.splitlines() if l.strip()]
        header = [h.strip().strip('"') for h in lines[0].split(",")]
        latest = lines[1].split(",")  # newest row first
        colmap = {"1Y": "1 Yr", "3Y": "3 Yr", "5Y": "5 Yr", "10Y": "10 Yr"}
        for t, col in colmap.items():
            if col in header:
                out[t] = _to_float(latest[header.index(col)])
        log(f"  US yields ({latest[0]}): {out}")
    except Exception as e:
        log(f"  US Treasury: {e}")
    return out


def japan_mof_yields():
    """Japan Ministry of Finance JGB yields (current-month CSV)."""
    out = dict.fromkeys(TENORS)
    try:
        r = requests.get("https://www.mof.go.jp/english/jgbs/reference/interest_rate/jgbcme.csv",
                         headers=UA, timeout=25)
        r.raise_for_status()
        rows = [l.split(",") for l in r.content.decode("utf-8", "ignore").splitlines() if l.strip()]
        header = next(row for row in rows if row and row[0].strip() == "Date")
        data = [row for row in rows if row and row[0][:4].isdigit()]
        latest = data[-1]
        for t in TENORS:
            if t in header:
                out[t] = _to_float(latest[header.index(t)])
        log(f"  JP yields ({latest[0]}): {out}")
    except Exception as e:
        log(f"  Japan MoF: {e}")
    return out


def germany_bundesbank_yields():
    """Bundesbank daily term structure of listed Federal securities (Bunds)."""
    out = dict.fromkeys(TENORS)
    codes = {"1Y": "R01XX", "3Y": "R03XX", "5Y": "R05XX", "10Y": "R10XX"}
    for t, code in codes.items():
        key = f"D.I.ZST.ZI.EUR.S1311.B.A604.{code}.R.A.A._Z._Z.A"
        try:
            r = requests.get(
                f"https://api.statistiken.bundesbank.de/rest/data/BBSIS/{key}",
                params={"lastNObservations": 3, "format": "csv", "lang": "en"},
                headers=dict(UA, Accept="text/csv"), timeout=25,
            )
            r.raise_for_status()
            last = None
            for line in r.content.decode("utf-8", "ignore").splitlines():
                parts = [p.strip().strip('"') for p in line.replace(";", ",").split(",")]
                for i, p in enumerate(parts):
                    if len(p) == 10 and p[4] == "-" and p[7] == "-" and p[:4].isdigit():
                        nums = [_to_float(x) for x in parts[i + 1:]]
                        nums = [x for x in nums if x is not None]
                        if nums:
                            last = nums[0]
                        break
            out[t] = last
        except Exception as e:
            log(f"  Bundesbank {t}: {e}")
    log(f"  DE yields: {out}")
    return out


def boe_series(codes, days=30):
    """Latest value for each Bank of England IADB series code."""
    out = dict.fromkeys(codes)
    today = date.today()
    try:
        r = requests.get(
            "https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp",
            params={
                "csv.x": "yes", "Datefrom": (today - timedelta(days=days)).strftime("%d/%b/%Y"),
                "Dateto": today.strftime("%d/%b/%Y"), "SeriesCodes": ",".join(codes),
                "CSVF": "TN", "UsingCodes": "Y", "VPD": "Y", "VFD": "N",
            },
            headers=UA, timeout=25,
        )
        r.raise_for_status()
        rows = [[c.strip().strip('"') for c in l.split(",")] for l in r.text.splitlines() if l.strip()]
        header = rows[0]
        for code in codes:
            if code not in header:
                continue
            idx = header.index(code)
            for row in reversed(rows[1:]):
                v = _to_float(row[idx]) if idx < len(row) else None
                if v is not None:
                    out[code] = v
                    break
    except Exception as e:
        log(f"  BoE {codes}: {e}")
    return out


def uk_boe_yields():
    """UK gilt nominal par yields from the BoE (5Y and 10Y series)."""
    s = boe_series(["IUDSNPY", "IUDMNPY"])
    out = {"1Y": None, "3Y": None, "5Y": s.get("IUDSNPY"), "10Y": s.get("IUDMNPY")}
    log(f"  UK yields: {out}")
    return out


def israel_boi_yields():
    """Bank of Israel nominal zero-coupon yields (shcd08_e.xls). Layout is detected heuristically."""
    out = dict.fromkeys(TENORS)
    try:
        import pandas as pd
        r = requests.get("https://boi.org.il/boi_files/Statistics/shcd08_e.xls", headers=UA, timeout=30)
        r.raise_for_status()
        import io
        sheets = pd.read_excel(io.BytesIO(r.content), sheet_name=None, header=None)
        for name, df in sheets.items():
            log(f"  IL sheet '{name}' shape={df.shape}\n" + df.head(10).to_string(max_cols=14)[:1500]
                + "\n...\n" + df.tail(3).to_string(max_cols=14)[:800])
        for name, df in sheets.items():
            df = df.dropna(how="all")
            # find a header row whose cells contain maturities 1,3,5,10 (as numbers or text)
            for hi in range(min(len(df), 40)):
                row = [str(x).strip().lower().replace(".0", "") for x in df.iloc[hi].tolist()]
                def col_for(n):
                    for ci, c in enumerate(row):
                        if c in (str(n), f"{n}y", f"{n} year", f"{n} years", f"{n}-year"):
                            return ci
                    return None
                cols = {t: col_for(int(t[:-1])) for t in TENORS}
                if cols["10Y"] is not None and cols["1Y"] is not None:
                    body = df.iloc[hi + 1:]
                    for _, brow in body[::-1].iterrows():
                        vals = {t: _to_float(brow.iloc[c]) if c is not None else None for t, c in cols.items()}
                        if all(v is not None and -5 < v < 30 for v in vals.values()):
                            out = vals
                            log(f"  IL yields (sheet {name}, row {brow.iloc[0]}): {out}")
                            return out
        # Could not detect layout: print the top of the first sheet so it can be fixed.
        first = next(iter(sheets.values()))
        log("  IL yields: layout not recognised. Top of sheet:\n" + first.head(15).to_string())
    except Exception as e:
        log(f"  BoI yields: {e}")
    return out


# ----------------------------------------------------------------------------
# Economic calendar: ForexFactory weekly feed (automatic) + config/calendar.json
# ----------------------------------------------------------------------------
FF_COUNTRY = {"USD": "US", "EUR": "EU", "GBP": "UK", "JPY": "JP"}


def ff_calendar():
    """This week's high-impact events from the ForexFactory JSON feed."""
    try:
        r = requests.get("https://nfs.faireconomy.media/ff_calendar_thisweek.json", headers=UA, timeout=25)
        r.raise_for_status()
        events = []
        for e in r.json():
            if e.get("impact") != "High" or e.get("country") not in FF_COUNTRY:
                continue
            dt = datetime.fromisoformat(e["date"]).astimezone(IL_TZ)
            events.append({
                "date": dt.strftime("%Y-%m-%d"), "time": dt.strftime("%H:%M"),
                "country": FF_COUNTRY[e["country"]], "event": e.get("title", ""),
                "previous": e.get("previous") or "—", "forecast": e.get("forecast") or "—",
            })
        log(f"  ForexFactory: {len(events)} high-impact events")
        return events
    except Exception as e:
        log(f"  ForexFactory: {e}")
        return None


def manual_calendar():
    """Events from config/calendar.json; times converted from their source time zone to Israel."""
    events = []
    for ev in load_json(CALENDAR_PATH, {"events": []}).get("events", []):
        try:
            t = ev.get("time") or ""
            if t and t != "—":
                src = ZoneInfo(ev.get("tz", "Asia/Jerusalem"))
                dt = datetime.strptime(f'{ev["date"]} {t}', "%Y-%m-%d %H:%M").replace(tzinfo=src).astimezone(IL_TZ)
                d, t = dt.strftime("%Y-%m-%d"), dt.strftime("%H:%M")
            else:
                d, t = ev["date"], "—"
            events.append({
                "date": d, "time": t, "country": ev.get("country", "—"), "event": ev.get("event", ""),
                "previous": ev.get("previous") or "—", "forecast": ev.get("forecast") or "—",
                "indicative": bool(ev.get("indicative")),
            })
        except Exception as e:
            log(f"  calendar.json row skipped ({ev}): {e}")
    return events


def build_calendar(today):
    horizon = today + timedelta(days=30)
    manual = manual_calendar()
    ff = ff_calendar()
    if ff:
        # Inside the feed's week the feed wins (it has forecasts); keep manual rows for
        # other weeks and for countries the feed doesn't cover (e.g. Israel).
        ff_dates = sorted(e["date"] for e in ff)
        lo, hi = ff_dates[0], ff_dates[-1]
        covered = set(FF_COUNTRY.values())
        manual = [e for e in manual if not (e["country"] in covered and lo <= e["date"] <= hi)]
        events = ff + manual
    else:
        events = manual
    events = [e for e in events if today.isoformat() <= e["date"] <= horizon.isoformat()]
    events.sort(key=lambda e: (e["date"], e["time"] if e["time"] != "—" else "99"))
    return events


# ----------------------------------------------------------------------------
# Assembly
# ----------------------------------------------------------------------------
def with_fallback(label, auto_value, manual_value, previous, decimals=2):
    """Prefer live data; else manual (italic); else previous (stale); else —."""
    if auto_value is not None:
        return item(label, round(auto_value, decimals), "ok")
    if manual_value is not None:
        return item(label, manual_value, "indicative")
    if ok_prev(previous):
        return item(label, previous["value"], "stale", as_of=previous["as_of"])
    return item(label)


TODAY = date.today()


def ok_prev(p):
    """A previous value may be shown (in italic) only if it was fetched for real within 7 days."""
    try:
        return (p and p.get("value") is not None and p.get("as_of") and not p.get("src")
                and (TODAY - date.fromisoformat(p["as_of"])).days <= 7)
    except Exception:
        return False


def stamp(obj):
    """Add as_of=today to every freshly fetched ('ok') value."""
    if isinstance(obj, dict):
        if obj.get("status") == "ok" and "value" in obj:
            obj["as_of"] = TODAY.isoformat()
        for v in obj.values():
            stamp(v)
    elif isinstance(obj, list):
        for v in obj:
            stamp(v)


def clean(obj):
    """Replace NaN/inf with None so the file is always valid JSON for browsers."""
    if isinstance(obj, float) and not math.isfinite(obj):
        return None
    if isinstance(obj, dict):
        return {k: clean(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [clean(v) for v in obj]
    return obj


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
    fed_lo, fed_hi = nyfed_target_range()
    if fed_hi is None:
        fed_hi = fred_latest(FRED_FED_RATE) or fred_csv_latest(FRED_FED_RATE)
    rates = [
        ("israel", "Israel — BoI", boi_interest_rate()),
        ("us", "United States — Fed", fed_hi),
        ("ecb", "Euro Area — ECB", ecb_deposit_rate()),
        ("uk", "United Kingdom — BoE", boe_bank_rate()),
        ("japan", "Japan — BoJ", None),  # no free API; manual only
    ]
    out["central_bank_rates"] = []
    for key, label, auto in rates:
        row = with_fallback(label, auto, m.get(key), previous_lookup(prev, "central_bank_rates", key))
        row["key"] = key
        if key == "us" and row["status"] == "ok" and fed_lo is not None:
            row["display"] = f"{fed_lo:.2f}–{fed_hi:.2f}%"
        out["central_bank_rates"].append(row)

    # --- B. Commodities & volatility ---
    log("Commodities")
    out["commodities"] = []
    for label, sym, dec in COMMODITIES:
        row = yf_last_and_1d(label, sym, dec)
        row["key"] = sym
        if row["status"] == "missing":
            p = previous_lookup(prev, "commodities", sym)
            if ok_prev(p):
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
            if ok_prev(p):
                row = dict(p, status="stale")
        out["fx"].append(row)

    # --- Government bond yields ---
    log("Bond yields")
    my = manual.get("bond_yields", {})
    sources = [
        ("us", "United States", us_treasury_yields),
        ("israel", "Israel", israel_boi_yields),
        ("germany", "Germany", germany_bundesbank_yields),
        ("uk", "United Kingdom", uk_boe_yields),
        ("japan", "Japan", japan_mof_yields),
    ]
    prev_yields = {r.get("key"): r for r in prev.get("bond_yields", [])}
    yields = []
    for key, label, fn in sources:
        live = fn()
        row = {}
        for t in TENORS:
            v = live.get(t)
            if v is None and key == "us":
                v = fred_latest(FRED_US_YIELDS[t])
            if v is not None and -5 < v < 30:
                row[t] = {"value": round(v, 2), "status": "ok"}
                continue
            m = my.get(key, {}).get(t)
            p = prev_yields.get(key, {}).get("tenors", {}).get(t, {})
            if m is not None:
                row[t] = {"value": m, "status": "indicative"}
            elif ok_prev(p):
                row[t] = {"value": p["value"], "status": "stale", "as_of": p["as_of"]}
            else:
                row[t] = {"value": None, "status": "missing"}
        yields.append({"key": key, "label": label, "tenors": row})
    out["bond_yields"] = yields

    # --- Index performance ---
    out["indices"] = {}
    for region, lst in INDICES.items():
        log(f"Indices: {region}")
        rows = []
        for label, sym in lst:
            row = yf_performance(label, sym)
            if row["status"] == "missing":
                alt = find_symbol(label)
                if alt and alt != sym:
                    row = yf_performance(label, alt)
                    row["src"] = alt
                    if row["status"] == "ok":
                        row["status"] = "indicative"   # symbol found by search, not yet verified
            row["key"] = sym
            if row["status"] == "missing":
                try:
                    p = next(x for x in prev["indices"][region] if x.get("key") == sym)
                    if ok_prev(p):
                        row = dict(p, status="stale")
                except Exception:
                    pass
            rows.append(row)
        out["indices"][region] = rows

    # --- Economic calendar (feed + manual file; next 30 days only, sorted) ---
    log("Calendar")
    out["calendar"] = build_calendar(now_il.date())

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        stamp(out)
        out["_log"] = LOGS[-300:]
        json.dump(clean(out), f, ensure_ascii=False, indent=1, allow_nan=False)
    log(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
