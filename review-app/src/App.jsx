import { SideNav, TopBar, useActiveChapter } from './nav.jsx'
import { Hero, Intro, Executive, Profile, Layers, Compare3, Galaxy } from './chapters-a.jsx'
import { Alternatives, ValueEngines, Scenarios, Risks, Valuation, Deal, Decision } from './chapters-b.jsx'
import Simulator from './Simulator.jsx'
import DueDiligence from './DueDiligence.jsx'
import Sources from './Sources.jsx'

export default function App() {
  const active = useActiveChapter()
  return (
    <div className="min-h-screen bg-bg text-ink">
      <TopBar active={active} />
      <div className="mx-auto flex max-w-[1400px]">
        <SideNav active={active} />
        <main className="min-w-0 flex-1 space-y-14 px-4 py-6 sm:px-8 lg:py-10">
          <Hero />
          <Intro />
          <Executive />
          <Profile />
          <Layers />
          <Compare3 />
          <Galaxy />
          <Alternatives />
          <ValueEngines />
          <Scenarios />
          <Risks />
          <Valuation />
          <Simulator />
          <Deal />
          <DueDiligence />
          <Decision />
          <Sources />
          <footer className="border-t border-line pt-6 text-sm leading-7 text-muted">
            <p className="font-semibold text-heading">הבהרה</p>
            <p>
              מסמך זה הוא חומר עזר לדיון פנימי ואינו ייעוץ השקעות, שיווק השקעות או המלצה לבצע פעולה כלשהי. הנתונים שלא אומתו מסומנים “טעון אימות”, וההנחות בסימולטור הן הנחות עבודה בלבד.
            </p>
            <p className="mt-2">RBY Invest · 20 באוקטובר 2026</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
