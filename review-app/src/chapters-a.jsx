import {
  FileText, Network, Landmark, Coins, Vault, Repeat, TrendingUp, ShieldCheck, Link as LinkIcon,
  CircleCheck, TriangleAlert, ThumbsUp, ThumbsDown, Info, Database,
} from 'lucide-react'
import { Badge, Bullets, Callout, Card, En, EVIDENCE, H3, P, Section, Src, Tbl, Td, Th } from './ui.jsx'

// One statement + its evidence badges + source references.
export function Fact({ children, badges = [], src }) {
  return (
    <li className="avoid-break flex flex-col gap-2 rounded-lg border border-line bg-card p-3.5 sm:flex-row sm:items-start sm:gap-3">
      <div className="min-w-0 flex-1 leading-7">{children}</div>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:max-w-[16rem] sm:justify-end">
        {badges.map((b) => (
          <Badge key={b} type={b} />
        ))}
        {src && <Src ids={src} />}
      </div>
    </li>
  )
}

/* =========================================================================
   כותרת ראשית
   ========================================================================= */
export function Hero() {
  return (
    <header
      className="hero relative overflow-hidden rounded-2xl p-6 text-white sm:p-10"
      style={{ background: 'linear-gradient(135deg,#142B49 0%,#0F3B5C 58%,#0D6B66 125%)' }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide" style={{ color: '#99F6E4' }}>
        <FileText size={14} aria-hidden="true" />
        דוח השקעה אסטרטגי · מסמך לדיון
      </div>
      <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
        השקעה אסטרטגית ב־<En>Bits of Gold</En>
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 sm:text-lg" style={{ color: '#E2E8F0' }}>
        ניתוח השקעה בתשתיות נכסים דיגיטליים, קריפטו, מטבעות יציבים והשקל הדיגיטלי — והשוואה למודל שיתוף הפעולה של בנק
        לאומי עם <En>Galaxy Digital</En>.
      </p>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-white/10 px-4 py-3">
          <dt className="text-xs font-semibold" style={{ color: '#99F6E4' }}>תאריך הדוח</dt>
          <dd className="font-bold">20 באוקטובר 2026</dd>
        </div>
        <div className="rounded-lg bg-white/10 px-4 py-3">
          <dt className="text-xs font-semibold" style={{ color: '#99F6E4' }}>קהל יעד</dt>
          <dd className="font-bold">הנהלת בנק ישראלי, ועדת השקעות, דירקטוריון והנהלה אסטרטגית</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold" style={{ background: '#0D9488' }}>
          <CircleCheck size={15} aria-hidden="true" />
          המלצה: <En>Proceed to Strategic Due Diligence</En>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
          <TriangleAlert size={15} aria-hidden="true" />
          אין נתונים פיננסיים מאומתים של החברה
        </span>
      </div>
    </header>
  )
}

/* =========================================================================
   1. מבוא, מקרא ומבנה הדוח
   ========================================================================= */
export function Intro() {
  return (
    <Section
      id="intro"
      n={1}
      title="מבוא, מקרא ומבנה הדוח"
      subtitle="איך לקרוא את הדוח, ומה ההבדל בין עובדה, הערכה והנחה"
    >
      <P>
        הדוח בוחן האם, ובאילו תנאים, כדאי לבנק ישראלי לבחון השקעה אסטרטגית ב־<En>Bits of Gold</En>. הוא בנוי מ־16 פרקים:
        מהתזה ופרופיל החברה, דרך השוואה למודל של בנק לאומי ו־<En>Galaxy Digital</En>, תרחישים וסיכונים, ועד סימולטור
        השקעה, בדיקת נאותות והצעת החלטה. הדוח אינו קובע שווי לחברה ואינו מאשר עסקה.
      </P>

      <div>
        <H3 className="mb-3">מקרא: חמישה סוגי טענות</H3>
        <p className="mb-3 text-sm text-muted">
          כל טענה בדוח מסומנת באחד מהסימונים הבאים, כדי שלא יתערבבו עובדות, הערכות והנחות.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(EVIDENCE).map(([key, e]) => (
            <div key={key} className="avoid-break flex flex-col items-start gap-2 rounded-xl border border-line bg-card p-4">
              <Badge type={key} />
              <p className="text-sm leading-7 text-ink">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <H3 className="mb-3">כללי עבודה של הדוח</H3>
        <Bullets
          items={[
            'לא הומצאו נתונים פיננסיים, תוצאות עסקיות, שיעורי צמיחה או מקורות.',
            'כל מספר בסימולטור (פרק 12) הוא הנחת המחשה, ואינו נתון של Bits of Gold.',
            'טענה שלא נמצא לה מקור ישיר סומנה במפורש “טעון אימות”.',
            'מקורות הדוח נבדקו ב־20 באוקטובר 2026. לכל טענה מהותית שאומתה מצוינים מקור ותאריך פרסום (פרק 16).',
          ]}
        />
      </Card>

      <Callout tone="teal" Icon={ShieldCheck} title="תמצית בדיקת המקורות">
        <ul className="space-y-1.5">
          <li className="flex gap-2"><CircleCheck size={16} className="mt-1.5 shrink-0" aria-hidden="true" />שיתוף הפעולה בין לאומי ל־Galaxy (14.8.2026) ואתגר השקל הדיגיטלי של בנק ישראל אומתו מול הודעות רשמיות.</li>
          <li className="flex gap-2"><CircleCheck size={16} className="mt-1.5 shrink-0" aria-hidden="true" />אישור פיילוט BILS (מרץ 2024) ואישור ההשקה (אפריל 2026) אומתו בדיווחי עיתונות.</li>
          <li className="flex gap-2"><TriangleAlert size={16} className="mt-1.5 shrink-0" aria-hidden="true" /><span>הניסוח “מעבר מפיילוט להפצה רחבה” של BILS <strong>לא אומת</strong> במקורות שנבדקו (פרק 4).</span></li>
          <li className="flex gap-2"><TriangleAlert size={16} className="mt-1.5 shrink-0" aria-hidden="true" />מספר הרישיון 56716 מופיע באתר החברה בלבד, ולא נבדק במרשם רשמי.</li>
        </ul>
        <p className="mt-2">
          <a className="font-semibold text-brand hover:underline" href="#sources">לפירוט המלא — פרק 16</a>
        </p>
      </Callout>

      <Callout tone="slate" Icon={Info} title="הבהרה">
        מסמך זה הוא ניתוח לצורך דיון פנימי. הוא אינו ייעוץ השקעות, משפטי או רגולטורי, ואינו מבוסס על נתונים פיננסיים של
        החברה או על בדיקת נאותות. ההמלצות והתרחישים בו הם הערכות אנליטיות.
      </Callout>
    </Section>
  )
}

/* =========================================================================
   2. תקציר מנהלים
   ========================================================================= */
export function Executive() {
  const engines = [
    {
      Icon: Network,
      title: 'תשתית נכסים דיגיטליים',
      text: 'שירותי מסחר, המרה, אינטגרציה, משמורת ותפעול נכסים דיגיטליים.',
    },
    {
      Icon: Landmark,
      title: 'תשתית בנקאית',
      text: 'שילוב שירותי נכסים דיגיטליים באפליקציות ובמערכות הבנק, באמצעות API ושיתופי פעולה מסחריים.',
    },
    {
      Icon: Coins,
      title: 'תשתית עתידית לתשלומים דיגיטליים',
      text: 'בחינת שימושים במטבע יציב שקלי, טוקניזציה ושקל דיגיטלי עתידי.',
    },
  ]
  return (
    <Section id="exec" n={2} title="תקציר מנהלים" subtitle="תזת ההשקעה, שלושת מנועי הערך והמלצה ראשונית">
      <Card tone="teal">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <H3>תזת ההשקעה</H3>
          <Badge type="analysis" />
        </div>
        <P>
          השקעה ב־<En>Bits of Gold</En> עשויה להוות הזדמנות אסטרטגית לבנק ישראלי המעוניין לפתח תשתית לשירותים פיננסיים
          מבוססי נכסים דיגיטליים.
        </P>
        <P className="mt-3">
          ההשקעה אינה צריכה להיבחן כהשקעה רגילה בחברת מסחר בקריפטו, אלא כהשקעה אפשרית בתשתית פיננסית המאפשרת לבנק לפתח
          שירותים חדשים.
        </P>
      </Card>

      <div>
        <H3 className="mb-3">שלושת מנועי הערך</H3>
        <div className="grid gap-4 md:grid-cols-3">
          {engines.map(({ Icon, title, text }, i) => (
            <Card key={title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <span className="tone tone-teal grid h-10 w-10 place-items-center rounded-lg">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-muted">מנוע {i + 1}</span>
              </div>
              <h4 className="text-base font-bold text-heading">{title}</h4>
              <p className="text-sm leading-7">{text}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <H3>המלצה ראשונית</H3>
          <Badge type="analysis" />
        </div>
        <P>לבחון השקעת מיעוט אסטרטגית המשולבת בהסכם מסחרי רב־שנתי, זכויות ממשל תאגידי ומנגנוני הגנה תפעוליים.</P>
      </div>

      <div className="avoid-break tone tone-teal rounded-2xl p-6">
        <p className="text-sm font-bold">כרטיס מסכם</p>
        <p className="mt-1 text-2xl font-extrabold leading-snug sm:text-3xl">
          המלצה: <En>Proceed to Strategic Due Diligence</En>
        </p>
        <p className="mt-3 leading-8 text-ink">
          <strong>רמת ביטחון:</strong> בינונית בהיגיון האסטרטגי, נמוכה בכדאיות ההשקעה הפיננסית בהיעדר נתוני חברה ועסקה.
        </p>
      </div>

      <Callout tone="amber" Icon={TriangleAlert} title="תנאי מקדים">
        אין לאשר השקעה לפני קבלת נתונים פיננסיים, הערכת שווי, בדיקת נאותות ואישור המסגרת הרגולטורית.
      </Callout>
    </Section>
  )
}

/* =========================================================================
   3. פרופיל Bits of Gold
   ========================================================================= */
export function Profile() {
  return (
    <Section id="profile" n={3} title={<>פרופיל <En>Bits of Gold</En></>} subtitle="מה פורסם על ידי החברה, ומה אומת מול מקורות חיצוניים">
      <ul className="space-y-3">
        <Fact badges={['company']} src={['S7']}>
          <strong><En>Bits of Gold</En></strong> היא חברה ישראלית הפעילה בתחום הנכסים הדיגיטליים משנת 2013. באתר החברה מצוין
          “13+ שנות פעילות”.
        </Fact>
        <Fact badges={['company', 'verify']} src={['S7']}>
          לפי פרסומי החברה, היא פועלת ברישיון נותן שירותים פיננסיים של רשות שוק ההון, מספר 56716.
          <p className="mt-2 text-sm text-muted">
            גלובס דיווח ב־18.9.2022 על מתן רישיון קבוע לנותן שירותים פיננסיים ל־Bits of Gold
            <Src ids={['S4']} />. מספר הרישיון עצמו מופיע באתר החברה בלבד, ולא אותר מקור עצמאי או מרשם רשמי שמאשר אותו.
          </p>
        </Fact>
      </ul>

      <div>
        <H3 className="mb-1">פעילויות שדווחו בפרסומי החברה</H3>
        <p className="mb-3 text-sm text-muted">
          יש להציג את הנתונים כמידע שפורסם על ידי החברה, ולא כקביעה שכל היכולות עברו בדיקת נאותות עצמאית.
        </p>
        <ul className="space-y-3">
          <Fact badges={['company']} src={['S7']}>שירותי מסחר והמרת נכסים דיגיטליים.</Fact>
          <Fact badges={['company', 'verify']} src={['S7']}>
            <strong><En>Bits of Gold Connect</En></strong> — פתרון <En>API</En> לגופים פיננסיים.
            <p className="mt-1 text-sm text-muted">
              באתר החברה הוא מתואר כפתרון API מודולרי לעסקים העובדים עם קריפטו. התאמתו לגופים פיננסיים מפוקחים טעונה בדיקה.
            </p>
          </Fact>
          <Fact badges={['company', 'verify']} src={['S7']}>
            פתרונות משמורת המשלבים ספקי תשתית חיצוניים.
            <p className="mt-1 text-sm text-muted">
              באתר החברה מתוארת משמורת בארנק קר מנוהל (לא מקוון, ומבוטח לפי החברה). לא אומת אילו רכיבים בבעלות החברה ואילו
              מסופקים על ידי ספקים חיצוניים.
            </p>
          </Fact>
          <Fact badges={['verified']} src={['S3', 'S2']}>
            <strong>BILS</strong> — מטבע יציב הצמוד לשקל.
            <p className="mt-1 text-sm text-muted">
              ב־13.3.2024 דווח על אישור פיילוט בסביבת ניסוי רגולטורית (Sandbox), וב־27–28.4.2026 דווח על אישור להשקה. ראו
              פרק 4 לגבי היקף ההפצה.
            </p>
          </Fact>
          <Fact badges={['verified']} src={['S5', 'S6']}>
            השתתפות באתגר השקל הדיגיטלי של בנק ישראל.
            <p className="mt-1 text-sm text-muted">
              החברה נמנתה על 14 הצוותים שנבחרו (23.7.2024). בכנס הסיכום (31.10.2024) היא מופיעה כמשתתפת, לא כזוכה.
            </p>
          </Fact>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card tone="green">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ThumbsUp size={18} className="text-[var(--t-solid)]" aria-hidden="true" />
            <H3>יתרונות אסטרטגיים פוטנציאליים</H3>
            <Badge type="analysis" />
          </div>
          <Bullets
            marker="#16A34A"
            items={['התאמה לשוק הישראלי.', 'ניסיון בעבודה בסביבה פיננסית מפוקחת.', 'יכולות אינטגרציה.', 'פעילות קיימת בנכסים דיגיטליים.']}
          />
        </Card>
        <Card tone="red">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ThumbsDown size={18} className="text-[var(--t-solid)]" aria-hidden="true" />
            <H3>חולשות וסיכונים</H3>
            <Badge type="analysis" />
          </div>
          <Bullets
            marker="#DC2626"
            items={[
              'תלות אפשרית בספקי טכנולוגיה חיצוניים.',
              'שוק מקומי מוגבל.',
              'חשיפה לתנודתיות בהיקפי מסחר.',
              'תחרות מצד ספקים גלובליים.',
              'היעדר נתונים פיננסיים פומביים מספקים להערכת שווי.',
            ]}
          />
        </Card>
      </div>
    </Section>
  )
}

/* =========================================================================
   4. ארבע שכבות התשתית האסטרטגית
   ========================================================================= */
function LayerStack() {
  const rows = [
    { w: '100%', tone: 'teal', n: 'שכבה 1', title: 'מסחר והמרה', tag: 'פעילות קיימת — לפי החברה', Icon: Repeat },
    { w: '92%', tone: 'navy', n: 'שכבה 2', title: 'משמורת ותפעול', tag: 'פעילות קיימת — רכיבים טעונים אימות', Icon: Vault },
    { w: '84%', tone: 'sky', n: 'שכבה 3', title: 'BILS וטוקניזציה', tag: 'אושר להשקה — היקף ההפצה טעון אימות', Icon: Coins },
    { w: '76%', tone: 'amber', n: 'שכבה 4', title: 'שקל דיגיטלי', tag: 'אופציה עתידית — ניסוי ללא התחייבות', Icon: Landmark },
  ]
  return (
    <figure className="avoid-break rounded-xl border border-line bg-card p-4 sm:p-6" aria-label="תרשים ארבע שכבות התשתית">
      <div className="mx-auto w-full max-w-2xl space-y-2">
        <div className="tone tone-slate flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-sm font-bold">
          <LinkIcon size={15} aria-hidden="true" />
          ערוצי הבנק: אפליקציה, מערכות ו־API
        </div>
        <div className="text-center text-xs text-muted" aria-hidden="true">▲ שירותים מוצעים ללקוחות הבנק ▲</div>
        {[...rows].reverse().map(({ w, tone, n, title, tag, Icon }) => (
          <div key={n} className="mx-auto" style={{ width: w }}>
            <div className={`tone tone-${tone} flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg px-3 py-2.5`}>
              <span className="flex items-center gap-2 font-bold">
                <Icon size={16} aria-hidden="true" />
                <span className="text-xs opacity-80">{n}</span>
                <span>{title}</span>
              </span>
              <span className="text-xs font-medium">{tag}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1 text-[11px] text-muted" aria-hidden="true">
          <span>▲ ספקולטיבי יותר</span>
          <span>מבוסס יותר ▼</span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">
        איור מושגי. הסדר משקף את מידת הוודאות שבפרסומים, ולא גודל כלכלי. <Badge type="analysis" className="ms-1" />
      </figcaption>
    </figure>
  )
}

export function Layers() {
  return (
    <Section id="layers" n={4} title="ארבע שכבות התשתית האסטרטגית" subtitle="מה כל שכבה נותנת לבנק, ומה עדיין לא ידוע">
      <LayerStack />

      <div className="grid gap-4 md:grid-cols-2">
        <Card tone="teal" className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="tone tone-teal grid h-10 w-10 place-items-center rounded-lg"><Repeat size={20} aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold text-muted">שכבה ראשונה</p><H3>מסחר והמרה</H3></div>
          </div>
          <p className="leading-7">מתן אפשרות ללקוחות הבנק לרכוש, למכור ולהמיר נכסים דיגיטליים באמצעות ערוץ בנקאי.</p>
          <p className="tone tone-teal rounded-lg px-3 py-2 text-sm"><strong>ערך אפשרי:</strong> עמלות, שימור לקוחות, הרחבת הצעת הערך.</p>
        </Card>

        <Card tone="navy" className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="tone tone-navy grid h-10 w-10 place-items-center rounded-lg"><Vault size={20} aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold text-muted">שכבה שנייה</p><H3>משמורת ותפעול</H3></div>
          </div>
          <p className="leading-7">שירותי אבטחה, שמירה ותפעול של נכסים דיגיטליים.</p>
          <p className="tone tone-navy rounded-lg px-3 py-2 text-sm"><strong>ערך אפשרי:</strong> הרחבת שירותי הבנק, הפחתת הצורך בהקמת מערכות עצמאיות.</p>
          <p className="flex flex-wrap items-start gap-2 text-sm">
            <Badge type="verify" />
            <span>יש לבדוק אילו רכיבים נמצאים בבעלות <En>Bits of Gold</En> ואילו מסופקים על ידי חברות חיצוניות.</span>
          </p>
        </Card>

        <Card tone="sky" className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="tone tone-sky grid h-10 w-10 place-items-center rounded-lg"><Coins size={20} aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold text-muted">שכבה שלישית</p><H3>BILS וטוקניזציה</H3></div>
          </div>
          <p className="leading-7">בחינת שימושים במטבע יציב שקלי, סליקה, העברות נכסים ותשלומים על בלוקצ׳יין.</p>
          <div className="space-y-2 text-sm">
            <p className="flex flex-wrap items-start gap-2">
              <Badge type="verified" />
              <span>
                ב־27–28 באפריל 2026 דווח בעיתונות על אישור רשות שוק ההון להשקת BILS, לאחר כשנתיים בסביבת ניסוי רגולטורית
                <Src ids={['S2', 'S9', 'S8']} />.
              </span>
            </p>
            <p className="flex flex-wrap items-start gap-2">
              <Badge type="verify" />
              <span>
                <strong>הבהרה לגבי ניסוח ההנחיות:</strong> בהנחיות לדוח נאמר שהרשות אישרה “מעבר מפיילוט להפצה רחבה”. הניסוח הזה
                לא מופיע במקורות שנבדקו. אחד המקורות מציין שהגישה מוגבלת כרגע לגורמים מוסדיים ולמשתתפים מוכשרים, ושניים
                אחרים אינם מפרטים את היקף ההפצה. הודעת Bits of Gold המקורית לא אותרה. יש לאמת מול ההודעה המקורית.
              </span>
            </p>
            <p className="flex flex-wrap items-start gap-2">
              <Badge type="analysis" />
              <span>
                אין להסיק מהאישור שאומתו היקפי השימוש, הרזרבות, הנזילות או הכנסות הפעילות. במקורות שנבדקו לא נמצאו נתוני
                היקף על BILS.
              </span>
            </p>
          </div>
        </Card>

        <Card tone="amber" className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="tone tone-amber grid h-10 w-10 place-items-center rounded-lg"><Landmark size={20} aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold text-muted">שכבה רביעית</p><H3>שקל דיגיטלי</H3></div>
          </div>
          <p className="leading-7">
            השתתפות החברה באתגר השקל הדיגיטלי של בנק ישראל עשויה לסייע בפיתוח יכולות ומקרי שימוש.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex flex-wrap items-start gap-2">
              <Badge type="verified" />
              <span>
                החברה השתתפה באתגר. בהודעת הסיכום של בנק ישראל (31.10.2024) היא מופיעה כמשתתפת, עם מקרה שימוש של המרת קריפטו
                למזומן באמצעות השקל הדיגיטלי. ההודעה אינה מתחייבת להנפיק שקל דיגיטלי או לבחור ספקי תשתית
                <Src ids={['S5', 'S6']} />.
              </span>
            </p>
            <p className="font-semibold">
              עם זאת, השתתפות באתגר אינה מהווה אישור לשמש כספק תשתית של השקל הדיגיטלי.
            </p>
          </div>
          <p className="tone tone-amber rounded-lg px-3 py-2 text-sm font-semibold">
            אין לכלול הכנסות עתידיות מהשקל הדיגיטלי בתרחיש הבסיס ללא חוזים והתקדמות רגולטורית מוכחת.
          </p>
        </Card>
      </div>
    </Section>
  )
}

/* =========================================================================
   5. ההבחנה בין קריפטו, BILS ושקל דיגיטלי
   ========================================================================= */
export function Compare3() {
  const head = [
    { t: 'קריפטו', c: '#D97706' },
    { t: 'BILS', c: '#0284C7' },
    { t: 'שקל דיגיטלי', c: '#7C3AED' },
  ]
  const rows = [
    ['סוג נכס', 'נכס דיגיטלי', 'מטבע יציב פרטי', 'כסף בנק מרכזי, אם יונפק'],
    ['מנפיק', 'תלוי בנכס', 'מנפיק פרטי', 'בנק ישראל'],
    ['סיכון מרכזי', 'תנודתיות שוק', 'מנפיק, רזרבות ופדיון', 'תכנון ותפעול המערכת'],
    ['משמעות לבנק', 'מוצר השקעה ושירות', 'תשלומים וסליקה אפשריים', 'תשתית תשלומים עתידית'],
  ]
  return (
    <Section id="compare3" n={5} title="ההבחנה בין קריפטו, BILS ושקל דיגיטלי" subtitle="שלושה נכסים שונים בסיכון, במבנה משפטי ובמעמד">
      <Tbl caption="השוואה בין קריפטו, BILS ושקל דיגיטלי" minWidth={680}>
        <thead>
          <tr>
            <Th>מאפיין</Th>
            {head.map((h) => (
              <Th key={h.t} style={{ boxShadow: `inset 0 3px 0 ${h.c}` }}>
                {h.t}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, a, b, c]) => (
            <tr key={k}>
              <Td header>{k}</Td>
              <Td>{a}</Td>
              <Td>{b}</Td>
              <Td>{c}</Td>
            </tr>
          ))}
          <tr>
            <Td header>מצב בישראל</Td>
            <Td>
              <span>פעילות קיימת</span> <Badge type="verified" /> <Src ids={['S4']} />
            </Td>
            <Td>
              <span>פעילות מדווחת</span> <Badge type="verified" /> <Src ids={['S3', 'S2']} />
            </Td>
            <Td>
              <span>פרויקט בבחינה</span> <Badge type="verified" /> <Src ids={['S6']} />
            </Td>
          </tr>
        </tbody>
      </Tbl>
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge type="analysis" />
        השורות “סוג נכס”, “מנפיק”, “סיכון מרכזי” ו“משמעות לבנק” הן הערכה אנליטית. שורת “מצב בישראל” נבדקה מול מקורות.
      </p>

      <Callout tone="amber" Icon={TriangleAlert}>
        <strong>
          BILS אינו שקל דיגיטלי של בנק ישראל, ואין להתייחס אליהם כנכסים שקולים מבחינת סיכון אשראי, מבנה משפטי או מעמד
          מוניטרי.
        </strong>
      </Callout>
    </Section>
  )
}

/* =========================================================================
   6. השוואה אסטרטגית — Bits of Gold מול Galaxy Digital
   ========================================================================= */
export function Galaxy() {
  return (
    <Section id="galaxy" n={6} title={<>השוואה אסטרטגית — <En>Bits of Gold</En> מול <En>Galaxy Digital</En></>} subtitle="מודל השקעה לעומת הסכם שירותים מסחרי">
      <Card>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge type="verified" />
          <Src ids={['S1']} />
        </div>
        <P>
          באוגוסט 2026 (הודעה מיום 14.8.2026) הודיעו בנק לאומי ו־<En>Galaxy Digital</En> על שיתוף פעולה מסחרי וטכנולוגי
          בתחום הנכסים הדיגיטליים.
        </P>
        <Bullets
          className="mt-3 text-sm"
          items={[
            <>לקוחות לאומי ו־<En>PEPPER</En> יוכלו לרכוש, להחזיק ולמכור <En>Bitcoin</En>, <En>Ether</En> ו־<En>Solana</En> בחלק מאובטח באפליקציית <En>Leumi Trade</En>.</>,
            <>הבנק ישתמש בפלטפורמת <En>GalaxyOne Institutional</En> למסחר ולשירותים נלווים.</>,
            <>נחתם הסכם לפלטפורמת <En>Custody Infrastructure</En> של Galaxy (לשעבר <En>GK8</En>) לתשתית הנכסים הדיגיטליים של הבנק.</>,
            'השירות צפוי להיות זמין ללקוחות בתחילת 2027.',
          ]}
        />
      </Card>

      <Callout tone="navy" Icon={Database}>
        <p>
          בהודעה לעיתונות של Galaxy מ־14.8.2026 לא מוזכרת השקעה הונית של לאומי ב־Galaxy <Src ids={['S1']} />. לכן יש להבחין בין
          הסכם שירותים מסחרי לבין השקעה במניות ספק התשתית.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <Badge type="verify" />
          לא נסרקו כל ההודעות הפומביות האחרות בנושא. הקביעה שלא דווחה השקעה הונית נבדקה מול הודעה זו בלבד.
        </p>
      </Callout>

      <Tbl caption="השוואה בין Bits of Gold ל-Galaxy Digital" minWidth={720}>
        <thead>
          <tr>
            <Th>פרמטר</Th>
            <Th><En>Bits of Gold</En></Th>
            <Th><En>Galaxy Digital</En></Th>
          </tr>
        </thead>
        <tbody>
          <tr><Td header>פעילות גאוגרפית</Td><Td>ישראל</Td><Td>בינלאומית</Td></tr>
          <tr><Td header>יתרון מרכזי</Td><Td>התאמה מקומית</Td><Td>תשתית מוסדית גלובלית</Td></tr>
          <tr>
            <Td header>שירותי מסחר</Td>
            <Td>קיימים <Src ids={['S7']} /></Td>
            <Td>קיימים <Src ids={['S1']} /></Td>
          </tr>
          <tr>
            <Td header>פתרונות משמורת</Td>
            <Td>שילוב פתרונות וספקים <Badge type="verify" /></Td>
            <Td><En>Galaxy Custody</En> <Src ids={['S1']} /></Td>
          </tr>
          <tr>
            <Td header>מטבע יציב שקלי</Td>
            <Td><En>BILS</En> <Src ids={['S2']} /></Td>
            <Td>לא אומתה פעילות מקבילה <Badge type="verify" /></Td>
          </tr>
          <tr>
            <Td header>שקל דיגיטלי</Td>
            <Td>השתתפות באתגר בנק ישראל <Src ids={['S5', 'S6']} /></Td>
            <Td>לא אומתה מעורבות מקבילה <Badge type="verify" /></Td>
          </tr>
          <tr>
            <Td header>מודל התקשרות לבנק</Td>
            <Td>הסכם מסחרי ו/או השקעה <Badge type="analysis" /></Td>
            <Td>הסכם מסחרי שפורסם <Src ids={['S1']} /></Td>
          </tr>
          <tr>
            <Td header>סיכון השקעה הונית</Td>
            <Td>קיים אם נרכשות מניות <Badge type="analysis" /></Td>
            <Td>לא נובע מההסכם שפורסם <Src ids={['S1']} /></Td>
          </tr>
        </tbody>
      </Tbl>

      <Card tone="teal">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <H3>מסקנה מההשוואה</H3>
          <Badge type="analysis" />
        </div>
        <P>מודל Galaxy מאפשר לבנק לרכוש יכולות טכנולוגיות ללא השקעה הונית בספק.</P>
        <P className="mt-3">
          השקעה ב־<En>Bits of Gold</En> תוצדק אם תעניק לבנק ערך נוסף באמצעות זכויות אסטרטגיות, השתתפות בעליית שווי החברה או
          יתרונות שאינם ניתנים להשגה בהסכם שירותים רגיל.
        </P>
      </Card>
    </Section>
  )
}
