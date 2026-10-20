import { ShieldCheck, Building2, Lightbulb, Calculator, TriangleAlert, Info } from 'lucide-react'

// ---------------------------------------------------------------------------
// Evidence types — the report's main rule: never mix facts, estimates and assumptions.
// Every statement that carries a claim is tagged with one of these five badges.
// ---------------------------------------------------------------------------
export const EVIDENCE = {
  verified: {
    label: 'עובדה מאומתת',
    tone: 'teal',
    Icon: ShieldCheck,
    desc: 'נתמכת במקור ישיר שנבדק, עם תאריך פרסום (ראו פרק 16).',
  },
  company: {
    label: 'פורסם על ידי החברה',
    tone: 'slate',
    Icon: Building2,
    desc: 'מידע מפרסומי החברה עצמה. לא נבדק עצמאית.',
  },
  analysis: {
    label: 'הערכה אנליטית',
    tone: 'navy',
    Icon: Lightbulb,
    desc: 'שיקול דעת מקצועי של מחבר הדוח. אינה עובדה ואינה נתון מדווח.',
  },
  assumption: {
    label: 'הנחת סימולציה',
    tone: 'violet',
    Icon: Calculator,
    desc: 'ערך המחשה בלבד. אינו נתון של Bits of Gold.',
  },
  verify: {
    label: 'טעון אימות',
    tone: 'amber',
    Icon: TriangleAlert,
    desc: 'לא נמצא מקור ישיר, או שהמקורות אינם עקביים. יש לאמת לפני הסתמכות.',
  },
}

export function Badge({ type, label, className = '' }) {
  const e = EVIDENCE[type]
  const Icon = e.Icon
  return (
    <span
      title={e.desc}
      className={`tone tone-${e.tone} inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 align-middle text-[11px] font-semibold leading-5 ${className}`}
    >
      <Icon size={12} aria-hidden="true" />
      {label ?? e.label}
    </span>
  )
}

// Reference to a numbered source: <Src ids={['S1','S4']} /> renders [1][4], linking to chapter 16.
export function Src({ ids }) {
  return (
    <sup className="ms-1 whitespace-nowrap text-[11px] font-semibold">
      {ids.map((id) => (
        <a
          key={id}
          href={`#src-${id}`}
          className="mx-0.5 text-brand hover:underline"
          aria-label={`מקור ${id.slice(1)}`}
        >
          [{id.slice(1)}]
        </a>
      ))}
    </sup>
  )
}

// Keeps English phrases and numbers intact inside Hebrew sentences (bidi isolation).
export const En = ({ children, className = '' }) => (
  <bdi dir="ltr" className={className}>
    {children}
  </bdi>
)

export function Card({ children, className = '', tone, as: Tag = 'div' }) {
  const accent = tone ? `tone-${tone} border-s-4` : ''
  return (
    <Tag
      className={`avoid-break rounded-xl border border-line bg-card p-5 shadow-sm ${accent} ${className}`}
      style={tone ? { borderInlineStartColor: 'var(--t-solid)', background: 'var(--c-card)', color: 'inherit' } : undefined}
    >
      {children}
    </Tag>
  )
}

export function Callout({ tone = 'navy', Icon = Info, title, children, className = '' }) {
  return (
    <div className={`avoid-break tone tone-${tone} flex gap-3 rounded-xl p-4 text-sm leading-7 ${className}`} role="note">
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-1 font-bold">{title}</p>}
        <div className="text-ink">{children}</div>
      </div>
    </div>
  )
}

export function Section({ id, n, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-32" aria-labelledby={`${id}-h`}>
      <header className="mb-5 flex items-start gap-3 border-b border-line pb-4">
        <span
          aria-hidden="true"
          className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-heading text-sm font-bold text-card"
        >
          {n}
        </span>
        <div className="min-w-0">
          <h2 id={`${id}-h`} className="text-2xl font-bold leading-snug text-heading sm:text-[1.7rem]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export const H3 = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-heading ${className}`}>{children}</h3>
)

export const P = ({ children, className = '' }) => <p className={`leading-8 text-ink ${className}`}>{children}</p>

export function Bullets({ items, className = '', marker = 'var(--c-brand)' }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 leading-7">
          <span
            aria-hidden="true"
            className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: marker }}
          />
          <span className="min-w-0 flex-1">{it}</span>
        </li>
      ))}
    </ul>
  )
}

// Responsive table: scrolls sideways on narrow screens instead of squashing the columns.
export function Tbl({ caption, minWidth = 640, children, className = '' }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-line bg-card shadow-sm ${className}`}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export const Th = ({ children, className = '', ...rest }) => (
  <th
    scope="col"
    className={`bg-soft px-3 py-2.5 text-start text-[13px] font-bold text-heading ${className}`}
    {...rest}
  >
    {children}
  </th>
)

export const Td = ({ children, className = '', header = false, ...rest }) =>
  header ? (
    <th scope="row" className={`border-t border-line bg-card px-3 py-3 text-start align-top font-semibold text-heading ${className}`} {...rest}>
      {children}
    </th>
  ) : (
    <td className={`border-t border-line px-3 py-3 align-top leading-7 ${className}`} {...rest}>
      {children}
    </td>
  )
