import { useEffect, useState } from 'react'
import {
  BookOpen, Target, Building2, Layers, Coins, Scale, GitBranch, Network, TrendingUp,
  ShieldAlert, Gauge, Calculator, Handshake, ListChecks, Gavel, FileSearch,
  Menu, X, Sun, Moon, Printer, ArrowRight,
} from 'lucide-react'
import { useTheme } from './theme.jsx'

// The 16 chapters of the report. The order here is the order of the navigation.
export const CHAPTERS = [
  { id: 'intro', n: 1, title: 'מבוא, מקרא ומבנה הדוח', Icon: BookOpen },
  { id: 'exec', n: 2, title: 'תקציר מנהלים', Icon: Target },
  { id: 'profile', n: 3, title: 'פרופיל Bits of Gold', Icon: Building2 },
  { id: 'layers', n: 4, title: 'ארבע שכבות התשתית', Icon: Layers },
  { id: 'compare3', n: 5, title: 'קריפטו, BILS ושקל דיגיטלי', Icon: Coins },
  { id: 'galaxy', n: 6, title: 'השוואה ל־Galaxy Digital', Icon: Scale },
  { id: 'alts', n: 7, title: 'חלופות אסטרטגיות לבנק', Icon: GitBranch },
  { id: 'value', n: 8, title: 'מנועי יצירת ערך', Icon: Network },
  { id: 'scenarios', n: 9, title: 'תרחישי השקעה', Icon: TrendingUp },
  { id: 'risks', n: 10, title: 'סיכונים מרכזיים', Icon: ShieldAlert },
  { id: 'valuation', n: 11, title: 'הערכת שווי', Icon: Gauge },
  { id: 'sim', n: 12, title: 'סימולטור השקעה', Icon: Calculator },
  { id: 'deal', n: 13, title: 'מבנה העסקה המומלץ', Icon: Handshake },
  { id: 'dd', n: 14, title: 'בדיקת נאותות', Icon: ListChecks },
  { id: 'decision', n: 15, title: 'החלטת ועדת השקעות', Icon: Gavel },
  { id: 'sources', n: 16, title: 'מקורות ובקרת איכות', Icon: FileSearch },
]

// Scroll-spy: which chapter is on screen right now (to highlight it in the menu).
export function useActiveChapter() {
  const [active, setActive] = useState(CHAPTERS[0].id)
  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return active
}

function NavList({ active, onPick }) {
  return (
    <nav aria-label="פרקי הדוח">
      <ol className="space-y-0.5">
        {CHAPTERS.map(({ id, n, title, Icon }) => {
          const on = active === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={onPick}
                aria-current={on ? 'true' : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                  on ? 'bg-heading font-bold text-card' : 'text-ink hover:bg-soft'
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-bold ${
                    on ? 'bg-card/20 text-card' : 'bg-soft text-muted'
                  }`}
                >
                  {n}
                </span>
                <Icon size={15} className="shrink-0 opacity-80" aria-hidden="true" />
                <span className="min-w-0 truncate">{title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function SideNav({ active }) {
  return (
    <aside className="sticky top-[114px] hidden h-[calc(100vh-114px)] w-72 shrink-0 overflow-y-auto border-e border-line p-4 lg:block print:hidden">
      <p className="mb-3 px-2.5 text-xs font-bold tracking-wide text-muted">תוכן העניינים</p>
      <NavList active={active} />
    </aside>
  )
}

export function TopBar({ active }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const btn =
    'inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-sm font-medium text-heading hover:bg-soft'

  return (
    <>
      <header className="sticky top-[58px] z-40 h-14 border-b border-line bg-bg/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-full max-w-[88rem] items-center gap-2 px-3 sm:px-5">
          <button
            type="button"
            className={`${btn} lg:hidden`}
            onClick={() => setOpen(true)}
            aria-label="פתיחת תפריט הפרקים"
            aria-expanded={open}
          >
            <Menu size={18} aria-hidden="true" />
            <span className="hidden sm:inline">פרקים</span>
          </button>

          <a href="#intro" className="flex min-w-0 items-center gap-2 font-bold text-heading">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-heading text-xs text-card" aria-hidden="true">
              BoG
            </span>
            <span className="truncate text-sm sm:text-base">דוח השקעה · <bdi dir="ltr">Bits of Gold</bdi></span>
          </a>

          <div className="ms-auto flex items-center gap-1.5">
            <button type="button" className={btn} onClick={() => window.print()} title="הדפסה או שמירה כ־PDF">
              <Printer size={16} aria-hidden="true" />
              <span className="hidden md:inline">הדפסה / PDF</span>
            </button>
            <button
              type="button"
              className={btn}
              onClick={toggle}
              aria-label={theme === 'dark' ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
              title={theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
            >
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden" role="dialog" aria-modal="true" aria-label="תפריט הפרקים">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="סגירת התפריט"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-[min(20rem,88vw)] flex-col bg-bg shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="font-bold text-heading">תוכן העניינים</span>
              <button type="button" className={btn} onClick={() => setOpen(false)} aria-label="סגירה">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavList active={active} onPick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
