import { useMemo, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot, ResponsiveContainer,
} from 'recharts'
import { RotateCcw, TriangleAlert, Sigma, CircleCheck, CircleX } from 'lucide-react'
import { Badge, Callout, Card, En, H3, Section, Tbl, Td, Th } from './ui.jsx'

/* -------------------------------------------------------------------------
   The calculation lives in plain functions (no React in them), so the maths can be
   read and checked on its own. The screen below only collects inputs and shows results.
   All default values are illustration assumptions from the brief, NOT Bits of Gold data.
   ------------------------------------------------------------------------- */
const YEARS = 5
const DEFAULTS = { investment: 30, holding: 15, companyValue: 300, benefit: 5, opCost: 2, rate: 12 }

const FIELDS = [
  { key: 'investment', label: 'סכום השקעה', unit: 'מיליוני ₪', min: 0, max: 200, step: 1 },
  { key: 'holding', label: 'שיעור החזקה', unit: '%', min: 0, max: 100, step: 0.5 },
  { key: 'companyValue', label: 'שווי חברה בסוף שנה חמישית', unit: 'מיליוני ₪', min: 0, max: 2000, step: 10 },
  { key: 'benefit', label: 'תועלת עסקית שנתית לבנק', unit: 'מיליוני ₪', min: 0, max: 50, step: 0.5 },
  { key: 'opCost', label: 'עלות תפעול שנתית', unit: 'מיליוני ₪', min: 0, max: 50, step: 0.5 },
  { key: 'rate', label: 'שיעור היוון', unit: '%', min: 0, max: 40, step: 0.5 },
]

function calc(v) {
  const r = v.rate / 100
  const discount = (t) => Math.pow(1 + r, -t) // value today of 1 shekel received in year t
  const netBenefit = v.benefit - v.opCost // net business benefit per year

  let pvBenefits = 0
  for (let t = 1; t <= YEARS; t++) pvBenefits += netBenefit * discount(t) // benefits arrive at the end of each year

  const futureHolding = (v.holding / 100) * v.companyValue // stake × company value in year 5
  const pvHolding = futureHolding * discount(YEARS)
  const npv = -v.investment + pvBenefits + pvHolding // investment is paid at t = 0

  // Company value (year 5) at which NPV would be exactly zero, with everything else unchanged.
  const slope = (v.holding / 100) * discount(YEARS)
  const breakEven = slope > 0 ? (v.investment - pvBenefits) / slope : null

  return { netBenefit, pvBenefits, futureHolding, pvHolding, npv, breakEven }
}

const toNum = (s) => {
  const n = parseFloat(String(s).replace(',', '.'))
  return Number.isFinite(n) ? Math.max(0, n) : 0
}
const fmt = (n, d = 1) =>
  (Math.abs(n) < 0.05 && d === 1 ? 0 : n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

const Num = ({ children }) => <bdi dir="ltr">{children}</bdi>

function Field({ f, value, onChange }) {
  const id = `sim-${f.key}`
  return (
    <div className="rounded-lg border border-line bg-card p-3">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-heading">
        {f.label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          dir="ltr"
          min={f.min}
          max={f.max}
          step={f.step}
          value={value}
          onChange={(e) => onChange(f.key, e.target.value)}
          className="w-full min-w-0 rounded-md border border-line bg-bg px-2.5 py-1.5 text-end text-base font-semibold tabular-nums text-ink"
        />
        <span className="w-[4.5rem] shrink-0 text-xs leading-4 text-muted">{f.unit}</span>
      </div>
      <input
        type="range"
        dir="ltr"
        aria-label={`${f.label} — מחוון`}
        min={f.min}
        max={f.max}
        step={f.step}
        value={Math.min(f.max, toNum(value))}
        onChange={(e) => onChange(f.key, e.target.value)}
        className="mt-2.5 w-full cursor-pointer accent-[#0D9488] print:hidden"
      />
    </div>
  )
}

function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div dir="rtl" className="rounded-lg border border-line bg-card p-2.5 text-xs shadow-md">
      <p className="mb-1 font-bold text-heading">שווי חברה בשנה 5: ₪<Num>{fmt(label, 0)}</Num> מ׳</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <Num>{fmt(p.value)}</Num>
        </p>
      ))}
    </div>
  )
}

export default function Simulator() {
  const [raw, setRaw] = useState(() => Object.fromEntries(Object.entries(DEFAULTS).map(([k, x]) => [k, String(x)])))
  const setField = (k, val) => setRaw((s) => ({ ...s, [k]: val }))
  const reset = () => setRaw(Object.fromEntries(Object.entries(DEFAULTS).map(([k, x]) => [k, String(x)])))

  const v = useMemo(
    () => ({
      investment: toNum(raw.investment),
      holding: Math.min(100, toNum(raw.holding)),
      companyValue: toNum(raw.companyValue),
      benefit: toNum(raw.benefit),
      opCost: toNum(raw.opCost),
      rate: Math.min(100, toNum(raw.rate)),
    }),
    [raw],
  )
  const res = useMemo(() => calc(v), [v])
  const positive = res.npv >= 0

  // Sensitivity: NPV as company value changes, for three levels of annual business benefit.
  const sens = useMemo(() => {
    const cvMax = Math.max(v.companyValue * 2, 100)
    const steps = 20
    const levels = Array.from(new Set([0.5, 1, 1.5].map((m) => Math.round(v.benefit * m * 100) / 100)))
    const data = []
    for (let i = 0; i <= steps; i++) {
      const cv = (cvMax / steps) * i
      const row = { cv: Math.round(cv * 10) / 10 }
      levels.forEach((b, j) => {
        row['s' + j] = Math.round(calc({ ...v, companyValue: cv, benefit: b }).npv * 100) / 100
      })
      data.push(row)
    }
    return { data, levels }
  }, [v])
  const palette = ['#D97706', '#0D9488', '#3B82F6']

  const cvMult = [0.5, 0.75, 1, 1.25, 1.5]
  const bMult = [0, 0.5, 1, 1.5, 2]

  const cards = [
    { t: 'שווי החזקה עתידי', val: res.futureHolding, sub: `${fmt(v.holding)}% × ₪${fmt(v.companyValue, 0)} מ׳`, tone: 'navy' },
    { t: 'ערך נוכחי של שווי ההחזקה', val: res.pvHolding, sub: `מהוון ${YEARS} שנים בשיעור ${fmt(v.rate)}%`, tone: 'navy' },
    { t: 'תועלת נטו שנתית', val: res.netBenefit, sub: `תועלת ₪${fmt(v.benefit)} פחות עלות ₪${fmt(v.opCost)}`, tone: res.netBenefit >= 0 ? 'navy' : 'red' },
    { t: `ערך נוכחי של התועלות נטו (${YEARS} שנים)`, val: res.pvBenefits, sub: 'סכום התועלות השנתיות המהוונות', tone: res.pvBenefits >= 0 ? 'navy' : 'red' },
  ]

  return (
    <Section id="sim" n={12} title="סימולטור השקעה אינטראקטיבי" subtitle="מחשבון ערך נוכחי נקי (NPV) עם גרף רגישות">
      <div className="flex flex-wrap items-center gap-2">
        <Badge type="assumption" />
        <span className="text-sm font-semibold text-heading">
          כל הערכים הם הנחות דוגמה בלבד ואינם נתונים של <En>Bits of Gold</En>.
        </span>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <H3>הנחות הסימולציה</H3>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-card px-3 text-sm font-semibold text-heading hover:bg-soft print:hidden"
          >
            <RotateCcw size={15} aria-hidden="true" /> איפוס לברירת מחדל
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((f) => (
            <Field key={f.key} f={f} value={raw[f.key]} onChange={setField} />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          אופק: {YEARS} שנים (קבוע). ההשקעה משולמת בתחילת התקופה והתועלות נצברות בסוף כל שנה.
        </p>
      </Card>

      <div aria-live="polite">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`avoid-break tone ${positive ? 'tone-green' : 'tone-red'} rounded-2xl p-5 sm:col-span-2 lg:col-span-1 lg:row-span-2`}>
            <p className="flex items-center gap-2 text-sm font-bold">
              {positive ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
              ערך נוכחי נקי (NPV)
            </p>
            <p className="mt-2 text-4xl font-extrabold leading-tight sm:text-5xl">
              <Num>{fmt(res.npv)}</Num>
              <span className="ms-2 text-base font-bold">מיליוני ₪</span>
            </p>
            <p className="mt-2 text-sm font-semibold">{positive ? 'חיובי בהנחות אלה' : 'שלילי בהנחות אלה'}</p>
            <div className="mt-3 border-t border-current/20 pt-3 text-sm">
              <p className="font-semibold">נקודת איזון</p>
              <p className="leading-7">
                {res.breakEven === null ? (
                  'לא ניתן לחשב: שיעור ההחזקה הוא אפס.'
                ) : res.breakEven < 0 ? (
                  'התועלות לבדן מכסות את ההשקעה (נקודת האיזון שלילית).'
                ) : (
                  <>
                    שווי חברה בשנה 5 של <strong>₪<Num>{fmt(res.breakEven, 0)}</Num> מ׳</strong> מביא ל־NPV אפס, כשכל שאר ההנחות ללא שינוי.
                  </>
                )}
              </p>
            </div>
          </div>

          {cards.map((c) => (
            <div key={c.t} className={`avoid-break tone tone-${c.tone} rounded-xl p-4`}>
              <p className="text-sm font-bold">{c.t}</p>
              <p className="mt-1 text-2xl font-extrabold">
                <Num>{fmt(c.val)}</Num>
                <span className="ms-1.5 text-xs font-semibold">מיליוני ₪</span>
              </p>
              <p className="mt-1 text-xs opacity-90">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="avoid-break rounded-xl border border-line bg-card p-5">
        <p className="mb-2 flex items-center gap-2 font-bold text-heading">
          <Sigma size={18} aria-hidden="true" /> נוסחאות החישוב
        </p>
        <ul className="space-y-1.5 text-sm leading-7">
          <li>שווי החזקה עתידי = שיעור החזקה × שווי החברה העתידי.</li>
          <li>תועלת נטו שנתית = תועלת עסקית שנתית − עלות תפעול שנתית.</li>
          <li>
            <strong>NPV</strong> = −השקעה ראשונית + סכום התועלות נטו המהוונות (שנים 1–{YEARS}) + שווי החזקה עתידי מהוון.
          </li>
          <li className="text-muted">
            היוון: סכום שמתקבל בשנה t מחולק ב־(1 + שיעור ההיוון)<sup>t</sup>.
          </li>
        </ul>
      </div>

      <Card>
        <H3 className="mb-1">גרף רגישות</H3>
        <p className="mb-3 text-sm text-muted">
          NPV (מיליוני ₪) כפונקציה של שווי החברה בשנה 5, בשלוש רמות של תועלת עסקית שנתית. הנקודה הכהה היא ההנחות הנוכחיות.
        </p>
        <div dir="ltr" className="chart-wrap h-80 w-full" role="img" aria-label="גרף רגישות של NPV לשווי החברה העתידי ולתועלת העסקית השנתית">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sens.data} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="cv" domain={[0, 'dataMax']} tickFormatter={(x) => fmt(x, 0)} />
              <YAxis tickFormatter={(y) => fmt(y, 0)} width={52} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ direction: 'rtl', paddingTop: 8 }} />
              <ReferenceLine y={0} />
              {sens.levels.map((b, j) => (
                <Line
                  key={j}
                  type="monotone"
                  dataKey={'s' + j}
                  name={`תועלת שנתית ₪${fmt(b)} מ׳`}
                  stroke={palette[j % palette.length]}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
              <ReferenceDot x={v.companyValue} y={res.npv} r={6} ifOverflow="extendDomain" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-muted">ציר אופקי: שווי החברה בשנה 5 (מיליוני ₪) · ציר אנכי: NPV (מיליוני ₪)</p>
      </Card>

      <div>
        <H3 className="mb-1">טבלת רגישות</H3>
        <p className="mb-3 text-sm text-muted">
          NPV (מיליוני ₪) לפי שווי החברה (שורות, באחוזים מההנחה הנוכחית) ולפי תועלת עסקית שנתית (עמודות). ירוק = חיובי, אדום = שלילי.
        </p>
        <Tbl caption="טבלת רגישות NPV" minWidth={560}>
          <thead>
            <tr>
              <Th>שווי חברה בשנה 5</Th>
              {bMult.map((m) => (
                <Th key={m} className="text-center">
                  תועלת ₪<Num>{fmt(v.benefit * m)}</Num>
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cvMult.map((cm) => (
              <tr key={cm}>
                <Td header>
                  ₪<Num>{fmt(v.companyValue * cm, 0)}</Num> מ׳ <span className="text-xs font-normal text-muted">({Math.round(cm * 100)}%)</span>
                </Td>
                {bMult.map((bm) => {
                  const n = calc({ ...v, companyValue: v.companyValue * cm, benefit: v.benefit * bm }).npv
                  const base = cm === 1 && bm === 1
                  return (
                    <Td
                      key={bm}
                      className={`tone ${n >= 0 ? 'tone-green' : 'tone-red'} text-center font-bold tabular-nums ${base ? 'ring-2 ring-heading ring-inset' : ''}`}
                    >
                      <Num>{fmt(n)}</Num>
                    </Td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Tbl>
      </div>

      <Callout tone="amber" Icon={TriangleAlert} title="מגבלות המודל">
        המודל אינו כולל מסים, דילול, השקעות המשך, הון רגולטורי וסיכוני נזילות, ואינו מהווה הערכת שווי אמיתית.
      </Callout>
    </Section>
  )
}
