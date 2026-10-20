import { useEffect, useMemo, useState } from 'react'
import { Banknote, Briefcase, Cpu, Gavel, Coins, Compass, RotateCcw } from 'lucide-react'
import { Badge, Callout, En, Section, Tbl, Th } from './ui.jsx'

// Due-diligence areas. Each item is one thing to check; the status of every item is chosen by the user.
const DOMAINS = [
  { id: 'fin', title: 'פיננסי', Icon: Banknote, items: ['דוחות מבוקרים', 'הכנסות', 'EBITDA', 'תזרים', 'חוב ומבנה הון'] },
  { id: 'com', title: 'מסחרי', Icon: Briefcase, items: ['לקוחות פעילים', 'היקפי מסחר', 'הכנסות B2B', 'ריכוזיות לקוחות', 'חוזים'] },
  { id: 'tech', title: 'טכנולוגי', Icon: Cpu, items: ['קניין רוחני', 'API', 'תלות בספקים', 'זמינות מערכות ו־SLA'] },
  { id: 'reg', title: 'רגולטורי', Icon: Gavel, items: ['רישיונות', 'מגבלות פעילות', 'AML/KYC', 'פרטיות', 'דרישות בנקאיות'] },
  { id: 'bils', title: 'BILS', Icon: Coins, items: ['רזרבות', 'פדיון', 'ביקורת', 'נזילות', 'מבנה משפטי'] },
  { id: 'str', title: 'אסטרטגי', Icon: Compass, items: ['יתרון תחרותי', 'תוכנית מוצרים', 'קשרים עם בנקים', 'אפשרויות יציאה'] },
]

const STATUSES = [
  { v: 'todo', label: 'לא התחיל', tone: 'slate' },
  { v: 'doing', label: 'בתהליך', tone: 'amber' },
  { v: 'done', label: 'הושלם', tone: 'green' },
]
const STORE_KEY = 'bog-dd-status'

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
    return s && typeof s === 'object' ? s : {}
  } catch (_) {
    return {}
  }
}

export default function DueDiligence() {
  // Status per item is kept in this browser only (localStorage), so a half-filled list survives a refresh.
  // Nothing is sent anywhere.
  const [status, setStatus] = useState(load)
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(status))
    } catch (_) {}
  }, [status])

  const keyOf = (d, item) => `${d.id}:${item}`
  const get = (d, item) => status[keyOf(d, item)] || 'todo'
  const set = (d, item, v) => setStatus((s) => ({ ...s, [keyOf(d, item)]: v }))

  const totals = useMemo(() => {
    const all = DOMAINS.flatMap((d) => d.items.map((i) => status[keyOf(d, i)] || 'todo'))
    return {
      total: all.length,
      done: all.filter((x) => x === 'done').length,
      doing: all.filter((x) => x === 'doing').length,
    }
  }, [status])
  const pct = Math.round((totals.done / totals.total) * 100)

  return (
    <Section id="dd" n={14} title="בדיקת נאותות" subtitle="רשימת בדיקה אינטראקטיבית: סמנו סטטוס לכל סעיף">
      <div className="avoid-break rounded-xl border border-line bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-heading">התקדמות כוללת</p>
            <p className="text-sm text-muted">
              הושלמו <En>{totals.done}</En> מתוך <En>{totals.total}</En> סעיפים · <En>{totals.doing}</En> בתהליך
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStatus({})}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-card px-3 text-sm font-semibold text-heading hover:bg-soft print:hidden"
          >
            <RotateCcw size={15} aria-hidden="true" /> איפוס הסטטוסים
          </button>
        </div>
        <div
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-soft"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="התקדמות בדיקת הנאותות"
        >
          <div className="h-full rounded-full bg-[#16A34A] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <Tbl caption="טבלת בדיקת נאותות עם סטטוס לכל סעיף" minWidth={520}>
        <thead>
          <tr>
            <Th>תחום וסעיף בדיקה</Th>
            <Th className="w-44">סטטוס</Th>
          </tr>
        </thead>
        <tbody>
          {DOMAINS.map((d) => {
            const done = d.items.filter((i) => get(d, i) === 'done').length
            const Icon = d.Icon
            return (
              <DomainRows key={d.id} d={d} Icon={Icon} done={done} get={get} set={set} />
            )
          })}
        </tbody>
      </Tbl>

      <Callout tone="slate" title="שמירת הסטטוסים">
        הסטטוסים נשמרים בדפדפן הזה בלבד ואינם נשלחים לשום מקום. בהדפסה או בשמירה כ־PDF יופיע המצב הנוכחי של הרשימה.
      </Callout>
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" /> רשימת הסעיפים היא מסגרת עבודה מוצעת, לא רשימה סגורה.
      </p>
    </Section>
  )
}

function DomainRows({ d, Icon, done, get, set }) {
  return (
    <>
      <tr>
        <th colSpan={2} scope="colgroup" className="border-t border-line bg-soft px-3 py-2.5 text-start">
          <span className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-bold text-heading">
              <Icon size={16} aria-hidden="true" />
              {d.title}
            </span>
            <span className="text-xs font-semibold text-muted">
              <En>{done}/{d.items.length}</En>
            </span>
          </span>
        </th>
      </tr>
      {d.items.map((item) => {
        const cur = get(d, item)
        const meta = STATUSES.find((s) => s.v === cur)
        return (
          <tr key={item}>
            <td className="border-t border-line px-3 py-2.5 align-middle">
              <label htmlFor={`dd-${d.id}-${item}`} className="cursor-pointer leading-7">
                {item}
              </label>
            </td>
            <td className="border-t border-line px-3 py-2 align-middle">
              <select
                id={`dd-${d.id}-${item}`}
                value={cur}
                onChange={(e) => set(d, item, e.target.value)}
                className={`tone tone-${meta.tone} w-full rounded-md px-2 py-1.5 text-sm font-semibold print:hidden`}
              >
                {STATUSES.map((s) => (
                  <option key={s.v} value={s.v} style={{ color: '#1E293B', background: '#fff' }}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className={`tone tone-${meta.tone} hidden rounded-full px-2.5 py-0.5 text-xs font-bold print:inline-block`}>
                {meta.label}
              </span>
            </td>
          </tr>
        )
      })}
    </>
  )
}
