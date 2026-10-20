import {
  Banknote, Users, PiggyBank, Rocket, Landmark, Gauge, Cpu, Network, Link as LinkIcon, Coins,
  TriangleAlert, CircleCheck, CircleX, Clock, FileSearch, Handshake, Eye, UserCheck, ShieldCheck,
  Lock, RefreshCcw, Scale, FlaskConical, Layers as LayersIcon, TrendingUp, TrendingDown, Minus,
} from 'lucide-react'
import { Badge, Bullets, Callout, Card, En, H3, P, Section, Src, Tbl, Td, Th } from './ui.jsx'

/* =========================================================================
   7. חלופות אסטרטגיות
   ========================================================================= */
export function Alternatives() {
  const alts = [
    {
      k: 'A',
      tone: 'teal',
      title: 'השקעה הונית אסטרטגית',
      sub: <>השקעת מיעוט ב־<En>Bits of Gold</En> לצד הסכם מסחרי.</>,
      pros: ['השתתפות בעליית ערך.', 'השפעה מסוימת על התפתחות החברה.', 'אפשרות לזכויות מיוחדות.'],
      cons: ['סיכון הוני.', 'נזילות מוגבלת.', 'סיכון רגולטורי ותלות עסקית.'],
      note: 'החלופה הנבחנת בדוח זה',
    },
    {
      k: 'B',
      tone: 'navy',
      title: 'שיתוף פעולה מסחרי בלבד',
      sub: <>רכישת שירותי <En>Bits of Gold</En> ללא רכישת מניות.</>,
      pros: ['גמישות.', 'הימנעות מחשיפה הונית.', 'אפשרות להחלפת ספק.'],
      cons: ['פחות השפעה על החברה.', 'היעדר השתתפות בעליית ערכה.'],
    },
    {
      k: 'C',
      tone: 'sky',
      title: 'ספק תשתית גלובלי',
      sub: 'התקשרות עם ספק בינלאומי במודל דומה לזה שפרסם בנק לאומי.',
      pros: ['יכולות מוסדיות.', 'קנה מידה בינלאומי.'],
      cons: ['מורכבות אינטגרציה.', 'תלות בספק חיצוני.', 'התאמה מקומית.'],
    },
  ]
  return (
    <Section id="alts" n={7} title="חלופות אסטרטגיות לבנק" subtitle="שלוש דרכים להיכנס לתחום, ומה מחיר כל אחת">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" />
        יתרונות וחסרונות הם הערכה אנליטית. לא הוקצו להם דירוגים מספריים.
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {alts.map((a) => (
          <Card key={a.k} tone={a.tone} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className={`tone tone-${a.tone} grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg font-extrabold`}>
                {a.k}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted">חלופה {a.k}</p>
                <H3>{a.title}</H3>
              </div>
            </div>
            <p className="text-sm leading-7">{a.sub}</p>
            {a.note && <p className={`tone tone-${a.tone} w-fit rounded-full px-2.5 py-0.5 text-xs font-bold`}>{a.note}</p>}
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-heading">
                <CircleCheck size={15} className="text-[#16A34A]" aria-hidden="true" /> יתרונות
              </p>
              <Bullets marker="#16A34A" className="text-sm" items={a.pros} />
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-heading">
                <CircleX size={15} className="text-[#DC2626]" aria-hidden="true" /> חסרונות
              </p>
              <Bullets marker="#DC2626" className="text-sm" items={a.cons} />
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* =========================================================================
   8. מנועי יצירת ערך לבנק
   ========================================================================= */
export function ValueEngines() {
  const engines = [
    { Icon: Banknote, t: 'הכנסות מעמלות', s: 'מסחר ושירות' },
    { Icon: Users, t: 'שימור לקוחות', s: 'והרחבת השירותים' },
    { Icon: PiggyBank, t: 'חיסכון בעלויות', s: 'פיתוח עצמי' },
    { Icon: Rocket, t: 'מוצרים עתידיים', s: 'תשלומים ונכסים דיגיטליים' },
  ]
  return (
    <Section id="value" n={8} title="מנועי יצירת ערך לבנק" subtitle="ארבעה מקורות אפשריים לערך, וכללי זהירות בכימות">
      <figure className="avoid-break rounded-xl border border-line bg-card p-4 sm:p-6" aria-label="תרשים מנועי הערך">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {engines.map(({ Icon, t, s }, i) => (
            <div key={t} className="tone tone-teal flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 text-center">
              <span className="text-xs font-bold opacity-80">{i + 1}</span>
              <Icon size={24} aria-hidden="true" />
              <p className="font-bold">{t}</p>
              <p className="text-xs opacity-90">{s}</p>
            </div>
          ))}
        </div>
        <div className="my-2 text-center text-lg text-muted" aria-hidden="true">▼</div>
        <div className="tone tone-navy rounded-xl px-4 py-3 text-center font-bold">
          ערך לבנק
          <span className="mt-0.5 block text-xs font-medium opacity-90">לא מכומת — עד לקבלת נתוני פעילות מוכחים</span>
        </div>
        <figcaption className="mt-3 text-center text-xs text-muted">
          איור מושגי. <Badge type="analysis" className="ms-1" />
        </figcaption>
      </figure>

      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="amber" Icon={TriangleAlert} title="אין לכמת ללא נתונים">
          אין לייחס הכנסות או חיסכון כספי ללא נתוני פעילות מוכחים.
        </Callout>
        <Callout tone="amber" Icon={TriangleAlert} title="הימנעות מספירה כפולה">
          יש להימנע מספירה כפולה של ערך שנכלל גם בשווי ההחזקה וגם בתועלות העסקיות לבנק.
        </Callout>
      </div>

      <figure className="avoid-break rounded-xl border border-line bg-card p-4 sm:p-6" aria-label="איור: ספירה כפולה">
        <div className="mx-auto flex max-w-xl items-center justify-center">
          <div className="tone tone-teal z-10 rounded-s-full px-6 py-6 text-center text-sm font-bold sm:px-10">
            שווי ההחזקה
            <span className="block text-xs font-medium opacity-90">בעלות על מניות</span>
          </div>
          <div className="tone tone-amber -mx-4 z-20 rounded-full px-3 py-3 text-center text-xs font-bold sm:-mx-6 sm:px-5">
            ערך חופף
            <span className="block font-medium">נספר פעם אחת</span>
          </div>
          <div className="tone tone-navy z-10 rounded-e-full px-6 py-6 text-center text-sm font-bold sm:px-10">
            תועלות עסקיות
            <span className="block text-xs font-medium opacity-90">לבנק כלקוח ושותף</span>
          </div>
        </div>
        <figcaption className="mt-3 text-center text-xs text-muted">
          ערך שנכלל בשני הצדדים יוצג בצד אחד בלבד, כדי שלא יתנפח הערך הכולל.
        </figcaption>
      </figure>
    </Section>
  )
}

/* =========================================================================
   9. תרחישי השקעה
   ========================================================================= */
function ScenarioFan() {
  const muted = { fill: 'var(--c-muted)', fontFamily: 'inherit', fontSize: 13 }
  return (
    <figure className="avoid-break rounded-xl border border-line bg-card p-4 sm:p-6" aria-label="תרשים תרחישי Bull, Base ו-Bear">
      <div dir="ltr">
        <svg viewBox="0 0 640 230" className="mx-auto w-full max-w-2xl" role="img" aria-label="שלושה תרחישים מתפצלים מנקודת המוצא">
          <defs>
            <marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#16A34A" />
            </marker>
            <marker id="arrS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#64748B" />
            </marker>
            <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#DC2626" />
            </marker>
          </defs>
          <circle cx="70" cy="115" r="9" fill="#142B49" stroke="var(--c-card)" strokeWidth="2" />
          <text x="70" y="146" textAnchor="middle" style={muted}>היום</text>
          <line x1="80" y1="111" x2="480" y2="38" stroke="#16A34A" strokeWidth="3.5" markerEnd="url(#arrG)" />
          <line x1="80" y1="115" x2="480" y2="115" stroke="#64748B" strokeWidth="3.5" markerEnd="url(#arrS)" />
          <line x1="80" y1="119" x2="480" y2="192" stroke="#DC2626" strokeWidth="3.5" markerEnd="url(#arrR)" />
          <text x="492" y="34" style={{ ...muted, fill: '#16A34A', fontWeight: 700 }}>Bull Case</text>
          <text x="492" y="119" style={{ ...muted, fill: '#64748B', fontWeight: 700 }}>Base Case</text>
          <text x="492" y="196" style={{ ...muted, fill: '#DC2626', fontWeight: 700 }}>Bear Case</text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted">
        איור מושגי בלבד: אינו מבוסס על נתונים, ואינו מכמת תוצאות או הסתברויות. <Badge type="analysis" className="ms-1" />
      </figcaption>
    </figure>
  )
}

export function Scenarios() {
  const sc = [
    {
      tone: 'green', Icon: TrendingUp, en: 'Bull Case', he: 'תרחיש חיובי',
      lead: <>‏<En>Bits of Gold</En> מתפתחת לספק תשתית משמעותי לגופים פיננסיים בישראל.</>,
      items: ['פעילות API גדלה.', 'נוצרים חוזים חוזרים עם גופים פיננסיים.', 'שירותי BILS מתרחבים.', 'נוצרים מקרי שימוש חדשים בטוקניזציה ובתשלומים.'],
    },
    {
      tone: 'navy', Icon: Minus, en: 'Base Case', he: 'תרחיש בסיס',
      lead: 'החברה ממשיכה בפעילות הקריפטו הקיימת ומרחיבה בהדרגה שיתופי פעולה מוסדיים.',
      items: ['מרבית הערך נובע מפעילות קיימת ומהתרחבות מסחרית מדודה.', 'השקל הדיגיטלי אינו מייצר הכנסות מהותיות.'],
    },
    {
      tone: 'red', Icon: TrendingDown, en: 'Bear Case', he: 'תרחיש שלילי',
      lead: 'תחרות מצד בנקים וספקים גלובליים שוחקת את המרווחים.',
      items: ['הוצאות ציות ואבטחה גדלות.', 'היקפי מסחר יורדים.', 'פעילות BILS אינה מגיעה להיקף מסחרי משמעותי.', 'החברה אינה מצליחה לייצר יתרון תחרותי בר־קיימא.'],
    },
  ]
  return (
    <Section id="scenarios" n={9} title="תרחישי השקעה" subtitle="שלושה תרחישים איכותיים, ללא הסתברויות">
      <ScenarioFan />
      <div className="grid gap-4 lg:grid-cols-3">
        {sc.map(({ tone, Icon, en, he, lead, items }) => (
          <Card key={en} tone={tone} className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`tone tone-${tone} grid h-10 w-10 place-items-center rounded-lg`}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-extrabold leading-tight text-heading"><En>{en}</En></p>
                <p className="text-sm text-muted">{he}</p>
              </div>
            </div>
            <p className="font-semibold leading-7">{lead}</p>
            <Bullets className="text-sm" marker="var(--t-solid)" items={items} />
            <div className="mt-auto"><Badge type="analysis" /></div>
          </Card>
        ))}
      </div>
      <Callout tone="amber" Icon={TriangleAlert}>
        אין להציג הסתברויות מספריות לתרחישים ללא בסיס נתונים. לכן לא צוינו כאן אחוזים, טווחי שווי או תוצאות כספיות.
      </Callout>
    </Section>
  )
}

/* =========================================================================
   10. סיכונים מרכזיים
   ========================================================================= */
const RISKS = [
  { name: 'רגולציה בנקאית', lvl: 3, mit: 'בדיקות משפטיות ואישור מודל פעילות' },
  { name: 'סייבר ומשמורת', lvl: 3, mit: 'ביקורת אבטחה, בדיקות חדירה והתאוששות' },
  { name: 'תלות בספק', lvl: 3, mit: 'תוכנית יציאה וארכיטקטורה פתוחה' },
  { name: 'BILS', lvl: 3, mit: 'בדיקת רזרבות, פדיון ונזילות' },
  { name: 'מוניטין', lvl: 3, mit: 'בקרות צרכניות וממשל מוצרים' },
  { name: 'תחרות', lvl: 2, mit: 'השוואת יכולות ותמחור' },
  { name: 'אי־הנפקת שקל דיגיטלי', lvl: 1, mit: 'אי־הכללתו בשווי הבסיס' },
  { name: 'הערכת שווי', lvl: 3, mit: 'השקעה מדורגת ותמחור מותנה ביצועים' },
]
const LEVEL = { 3: 'גבוהה', 2: 'בינונית–גבוהה', 1: 'בינונית' }

export function Risks() {
  const bank = [
    { Icon: Landmark, t: 'פיקדוני הבנק', x: 'העברת יתרות מלקוחות הבנק לנכסים דיגיטליים או למטבעות יציבים עלולה להקטין פיקדונות. מנגד, מתן השירות בערוץ הבנקאי עשוי לשמר חלק מהקשר ומהיתרות. נדרש מעקב אחר תנועות כספים בין חשבונות הלקוחות לנכסים דיגיטליים.' },
    { Icon: Banknote, t: 'עלות המקורות', x: 'ירידה בפיקדונות עלולה להיות מוחלפת במקורות יקרים יותר. ההשפעה תלויה בהיקף ההעברות ובתמהיל הלקוחות, ולא ניתן לכמת אותה ללא נתוני הבנק.' },
    { Icon: Gauge, t: <>יחס כיסוי הנזילות (<En>LCR</En>)</>, x: 'יש לבחון כיצד יסווגו יתרות לקוחות ופעילויות הקשורות לנכסים דיגיטליים לצורך דרישות הנזילות. אין להניח שחשיפה לנכסים דיגיטליים או למטבעות יציבים תיחשב נכס נזיל באיכות גבוהה. הטיפול הרגולטורי טעון בירור מול הפיקוח על הבנקים.' },
    { Icon: Cpu, t: 'סיכון תפעולי', x: 'ניהול מפתחות, זמינות מערכות, הונאות ותקלות אינטגרציה. נדרשים בקרות, תרחישי כשל ותוכנית המשכיות עסקית.' },
    { Icon: Network, t: 'סיכוני צד שלישי', x: 'תלות בספקי משמורת ותשתית, ריכוזיות, איכות הביקורת וניהול מיקור חוץ. נדרשים זכויות ביקורת, הסכמי רמת שירות (SLA) ותוכנית יציאה.' },
  ]
  return (
    <Section id="risks" n={10} title="סיכונים מרכזיים" subtitle="מפת סיכונים איכותית והשפעה אפשרית על הבנק">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" />
        הדירוגים הם הערכות אנליטיות איכותיות, לא מדידה סטטיסטית ולא נתוני חברה.
      </div>

      <figure className="avoid-break space-y-2 rounded-xl border border-line bg-card p-4 sm:p-5" aria-label="מפת סיכונים">
        {[3, 2, 1].map((lvl) => (
          <div key={lvl} className="grid items-stretch gap-2 sm:grid-cols-[8.5rem_1fr]">
            <div className={`heat-${lvl} flex items-center justify-center rounded-lg px-2 py-2 text-center text-sm font-extrabold`}>
              סיכון {LEVEL[lvl]}
            </div>
            <div className="flex flex-wrap gap-2">
              {RISKS.filter((r) => r.lvl === lvl).map((r) => (
                <div key={r.name} className={`heat-${lvl} rounded-lg px-3 py-2 text-sm font-semibold`}>
                  {r.name}
                </div>
              ))}
            </div>
          </div>
        ))}
        <figcaption className="pt-1 text-xs text-muted">
          הצבע והתווית מציינים את רמת הסיכון האיכותית. תוכנית המיתון לכל סיכון מופיעה בטבלה.
        </figcaption>
      </figure>

      <Tbl caption="סיכונים מרכזיים, רמת סיכון איכותית ומיתון" minWidth={620}>
        <thead>
          <tr>
            <Th>סיכון</Th>
            <Th>רמת סיכון איכותית</Th>
            <Th>מיתון</Th>
          </tr>
        </thead>
        <tbody>
          {RISKS.map((r) => (
            <tr key={r.name}>
              <Td header>{r.name}</Td>
              <Td>
                <span className={`heat-${r.lvl} inline-block rounded-full px-2.5 py-0.5 text-xs font-bold`}>{LEVEL[r.lvl]}</span>
              </Td>
              <Td>{r.mit}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <H3>השפעה אפשרית על הבנק</H3>
          <Badge type="analysis" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {bank.map(({ Icon, t, x }) => (
            <Card key={x.slice(0, 12)} className="flex gap-3">
              <span className="tone tone-navy grid h-10 w-10 shrink-0 place-items-center rounded-lg">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-heading">{t}</h4>
                <p className="mt-1 text-sm leading-7">{x}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* =========================================================================
   11. הערכת שווי
   ========================================================================= */
export function Valuation() {
  const layers = [
    ['מסחר והמרות', 'EBITDA מנורמל לאורך מחזור', 'teal'],
    ['API ותשתית', 'הכנסות חוזרות, רווחיות ושימור לקוחות', 'navy'],
    ['BILS', 'תזרים נטו מוכח והתחייבויות', 'sky'],
    ['שקל דיגיטלי', 'אופציה אסטרטגית, ללא שווי בסיס לא מבוסס', 'amber'],
  ]
  return (
    <Section id="valuation" n={11} title="הערכת שווי" subtitle="ארבע שכבות, ארבע שיטות, ואין עדיין נתונים לקבוע שווי">
      <Callout tone="amber" Icon={TriangleAlert} title="אין שווי בדוח זה">
        אין נתונים פיננסיים מאומתים מספיקים כדי לקבוע שווי לחברה. לכן הדוח אינו מציג שווי, טווח שווי או מכפילים.
        <p className="mt-2 flex flex-wrap items-start gap-2">
          <Badge type="verify" />
          <span>במקורות שנבדקו לא אותרו דוחות כספיים מבוקרים או נתוני הכנסות ורווחיות פומביים של Bits of Gold.</span>
        </p>
      </Callout>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {layers.map(([a, b, tone], i) => (
          <Card key={a} tone={tone} className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-muted">שכבת הערכה {i + 1}</p>
            <h4 className="font-bold text-heading">{a}</h4>
            <p className="text-sm leading-7">{b}</p>
          </Card>
        ))}
      </div>

      <Tbl caption="שיטת הערכת שווי לפי פעילות" minWidth={560}>
        <thead>
          <tr>
            <Th>פעילות</Th>
            <Th>שיטת הערכת שווי</Th>
          </tr>
        </thead>
        <tbody>
          {layers.map(([a, b]) => (
            <tr key={a}>
              <Td header>{a}</Td>
              <Td>{b}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" /> השיטות המוצעות הן הערכה אנליטית לגבי מסגרת העבודה, לא תוצאה.
      </p>
    </Section>
  )
}

/* =========================================================================
   13. מבנה העסקה המומלץ
   ========================================================================= */
export function Deal() {
  const stages = [
    {
      n: 1, tone: 'teal', Icon: FlaskConical, t: 'שלב ראשון — פיילוט',
      lines: ['בדיקות טכנולוגיות, רגולטוריות ומסחריות.', 'בדיקת API, אבטחת מידע, משמורת, ציות, עלויות ושירות לקוחות.'],
    },
    {
      n: 2, tone: 'navy', Icon: Handshake, t: 'שלב שני — השקעת מיעוט',
      lines: ['השקעה בכפוף להערכת שווי, בדיקת נאותות, הסכם בעלי מניות והסכם מסחרי.'],
    },
    {
      n: 3, tone: 'sky', Icon: TrendingUp, t: 'שלב שלישי — הרחבה',
      lines: ['השקעות נוספות רק לאחר עמידה באבני דרך מסחריות וטכנולוגיות.'],
    },
  ]
  const rights = [
    { Icon: Eye, t: 'זכויות מידע פיננסי ותפעולי' },
    { Icon: Coins, t: 'זכויות השתתפות בגיוסים' },
    { Icon: UserCheck, t: 'נציגות בדירקטוריון או משקיף, ככל שמתאים' },
    { Icon: ShieldCheck, t: 'מנגנוני הגנה מפני דילול' },
    { Icon: Handshake, t: 'זכויות מסחריות מוגדרות' },
    { Icon: RefreshCcw, t: 'מנגנוני המשכיות עסקית ויציאה מספק' },
    { Icon: Lock, t: 'הגנות מידע וסייבר' },
  ]
  return (
    <Section id="deal" n={13} title="מבנה העסקה המומלץ" subtitle="שלושה שלבים והזכויות הנדרשות בכל אחד">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" /> מבנה מוצע לדיון, ללא תנאים כספיים.
      </div>

      <ol className="ms-3 border-s-2 border-line" aria-label="ציר זמן העסקה">
        {stages.map(({ n, tone, Icon, t, lines }) => (
          <li key={n} className="relative pb-6 ps-8 last:pb-0">
            <span
              className={`tone tone-${tone} absolute -start-[1.05rem] top-0 grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold`}
              style={{ background: 'var(--c-card)', borderColor: 'var(--t-solid)', borderWidth: 2 }}
              aria-hidden="true"
            >
              {n}
            </span>
            <Card tone={tone}>
              <div className="mb-2 flex items-center gap-2">
                <Icon size={18} className="text-[var(--t-solid)]" aria-hidden="true" />
                <H3>{t}</H3>
              </div>
              <div className="space-y-1.5 text-sm leading-7">
                {lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div>
        <H3 className="mb-3">זכויות נדרשות</H3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {rights.map(({ Icon, t }) => (
            <li key={t} className="avoid-break flex items-center gap-3 rounded-lg border border-line bg-card p-3.5">
              <span className="tone tone-teal grid h-9 w-9 shrink-0 place-items-center rounded-lg">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium leading-6">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <Callout tone="amber" Icon={TriangleAlert}>
        אין להמליץ על בלעדיות גורפת ללא ניתוח השפעתה על צמיחת החברה.
      </Callout>
    </Section>
  )
}

/* =========================================================================
   15. החלטת ועדת השקעות
   ========================================================================= */
export function Decision() {
  const cards = [
    { tone: 'green', Icon: CircleCheck, t: 'מאושר לבחינה', x: 'קידום בדיקת נאותות ופיילוט מוגבל.' },
    { tone: 'amber', Icon: Clock, t: 'מותנה', x: 'השקעה הונית לאחר קבלת נתונים פיננסיים, הערכת שווי ואישור רגולטורי מתאים.' },
    { tone: 'red', Icon: CircleX, t: 'לא מאושר בשלב זה', x: 'תמחור החברה על בסיס הכנסות עתידיות לא מוכחות מהשקל הדיגיטלי.' },
  ]
  return (
    <Section id="decision" n={15} title="החלטת ועדת השקעות" subtitle="נוסח החלטה מוצע לאישור הוועדה">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ tone, Icon, t, x }) => (
          <Card key={t} tone={tone} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`tone tone-${tone} grid h-10 w-10 place-items-center rounded-lg`}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <H3>{t}</H3>
            </div>
            <p className="leading-7">{x}</p>
          </Card>
        ))}
      </div>

      <div className="avoid-break rounded-2xl border border-line bg-card p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <H3>מסקנה סופית</H3>
          <Badge type="analysis" />
        </div>
        <div className="space-y-3">
          <P>
            <En>Bits of Gold</En> עשויה להוות שותף אסטרטגי מעניין לבנק ישראלי המבקש להיכנס לתחום הנכסים הדיגיטליים.
          </P>
          <P>
            היתרון האפשרי שלה הוא שילוב של ניסיון מקומי, פעילות מסחר קיימת, פתרונות <En>API</En> ופעילות בתחום המטבעות היציבים.
          </P>
          <P>עם זאת, השקעה הונית מוצדקת רק אם היא מייצרת ערך נוסף על פני התקשרות מסחרית רגילה.</P>
          <P className="font-semibold">
            ההחלטה צריכה להתבסס על איכות הטכנולוגיה, יתרון תחרותי מוכח, יכולת יצירת תזרים, התאמה רגולטורית ומחיר ההשקעה.
          </P>
        </div>
      </div>
    </Section>
  )
}
