import { ExternalLink, ClipboardCheck } from 'lucide-react'
import { Badge, Bullets, Callout, Card, En, H3, Section, Tbl, Td, Th } from './ui.jsx'

// Direct sources used for material claims. "date" is the publication date; the company website has no
// publication date, so it shows the date it was read. Wording of sources is paraphrased, never copied.
export const SOURCES = [
  {
    id: 'S1',
    title: 'הודעה לעיתונות של Galaxy Digital על שיתוף הפעולה עם בנק לאומי',
    publisher: 'Galaxy Digital (יחסי משקיעים)',
    date: '14.8.2026',
    supports: 'מועד ותוכן שיתוף הפעולה: מסחר, משמורת, מועד השקה צפוי; היעדר אזכור להשקעה הונית',
    url: 'https://galaxydigital.gcs-web.com/news-releases/news-release-details/bank-leumi-partners-galaxy-be-first-bank-israel-offer-digital',
    kind: 'official',
  },
  {
    id: 'S2',
    title: 'כתבה על אישור הרגולטור להשקת BILS',
    publisher: 'Cointelegraph',
    date: '27.4.2026',
    supports: 'אישור להשקה לאחר כשנתיים של פיילוט על Solana; רזרבות בחשבונות ייעודיים בישראל',
    url: 'https://cointelegraph.com/news/israel-shekel-pegged-stablecoin-bils',
    kind: 'press',
  },
  {
    id: 'S3',
    title: 'כתבה על אישור פיילוט BILS בסביבת ניסוי רגולטורית',
    publisher: 'Calcalist (CTech)',
    date: '13.3.2024',
    supports: 'אישור הפיילוט של BILS ב־Sandbox על Solana',
    url: 'https://www.calcalistech.com/ctechnews/article/hj9ovv06p',
    kind: 'press',
  },
  {
    id: 'S4',
    title: 'כתבה על מתן רישיון קבוע ל־Bits of Gold',
    publisher: 'Globes',
    date: '18.9.2022',
    supports: 'רישיון קבוע לנותן שירותים פיננסיים (ללא מספר רישיון בכתבה)',
    url: 'https://en.globes.co.il/en/article-regulator-awards-second-crypto-license-1001424709',
    kind: 'press',
  },
  {
    id: 'S5',
    title: 'הודעת בנק ישראל על 14 הצוותים שנבחרו לאתגר השקל הדיגיטלי',
    publisher: 'בנק ישראל',
    date: '23.7.2024',
    supports: 'Bits of Gold ברשימת 14 המשתתפים; מהות האתגר',
    url: 'https://boi.org.il/en/communication-and-publications/press-releases/fourteen-teams-have-been-chosen-to-participate-with-the-bank-of-israel-in-the-digital-shekel-challenge/',
    kind: 'official',
  },
  {
    id: 'S6',
    title: 'הודעת בנק ישראל על כנס הסיכום של אתגר השקל הדיגיטלי',
    publisher: 'בנק ישראל',
    date: '31.10.2024',
    supports: 'החברה כמשתתפת (לא כזוכה) ומקרה השימוש שלה; היעדר התחייבות להנפיק שקל דיגיטלי או לבחור ספקי תשתית',
    url: 'https://boi.org.il/en/communication-and-publications/press-releases/the-bank-of-israel-held-a-concluding-conference-for-the-digital-shekel-challenge-today-and-announced-the-winners-of-the-challenge/',
    kind: 'official',
  },
  {
    id: 'S7',
    title: 'אתר Bits of Gold',
    publisher: 'Bits of Gold (פרסום החברה)',
    date: 'נקרא ב־20.10.2026',
    supports: 'מספר רישיון 56716, “13+ שנות פעילות”, פתרון Connect API, משמורת בארנק קר',
    url: 'https://www.bitsofgold.co.il',
    kind: 'company',
  },
  {
    id: 'S8',
    title: 'כתבה על אישור BILS על ידי רשות שוק ההון',
    publisher: 'Value The Markets',
    date: '28.4.2026',
    supports: 'מציין גישה מוגבלת לגורמים מוסדיים ולמשתתפים מוכשרים (מקור יחיד); אין נתוני שימוש',
    url: 'https://www.valuethemarkets.com/cryptocurrency/news/israels-capital-market-authority-approves-shekel-backed-stablecoin-bils',
    kind: 'press',
  },
  {
    id: 'S9',
    title: 'כתבה על אישור הנפקת מטבע יציב צמוד שקל',
    publisher: 'Forklog',
    date: '28.4.2026',
    supports: 'אישור לאחר כשנתיים בסביבת ניסוי; אינו מפרט את היקף ההפצה',
    url: 'https://forklog.com/en/israel-approves-shekel-pegged-stablecoin-issuance/',
    kind: 'press',
  },
  {
    id: 'S10',
    title: 'ניתוח על השקת BILS',
    publisher: 'BlockEden (בלוג ניתוח)',
    date: '29.4.2026',
    supports: 'הסיבה לכך שלא נמצאו נתוני היקף: הכתבה אינה מדווחת על היקף עסקאות או היצע של BILS. מקור משני, לא מבוסס עליו עובדה בדוח',
    url: 'https://blockeden.xyz/blog/2026/04/29/israel-bils-shekel-stablecoin-solana-bits-of-gold/',
    kind: 'analysis',
  },
]

const KIND = { official: 'הודעה רשמית', press: 'עיתונות', company: 'פרסום החברה', analysis: 'ניתוח / מקור משני' }

// Verification matrix: every material claim in the brief, with what the check found.
const CLAIMS = [
  { c: 'שיתוף פעולה מסחרי וטכנולוגי בין בנק לאומי ל־Galaxy הוכרז באוגוסט 2026 (מסחר ב־BTC, ETH ו־SOL; הסכם משמורת; השקה צפויה בתחילת 2027)', s: 'verified', src: ['S1'], note: 'הודעה מיום 14.8.2026' },
  { c: 'לא דווחה השקעה הונית של לאומי ב־Galaxy', s: 'verified', src: ['S1'], note: 'אין אזכור בהודעה זו. לא נסרקו כל ההודעות הפומביות האחרות' },
  { c: 'פלטפורמת Galaxy Custody (לשעבר GK8) משמשת את הבנק לתשתית', s: 'verified', src: ['S1'], note: 'הסכם נחתם לפי ההודעה' },
  { c: 'פיילוט BILS אושר בסביבת ניסוי רגולטורית', s: 'verified', src: ['S3'], note: 'דווח ב־13.3.2024' },
  { c: 'באפריל 2026 אושרה השקת BILS לאחר כשנתיים של פיילוט', s: 'verified', src: ['S2', 'S9', 'S8'], note: 'דיווחי עיתונות. ההודעה המקורית של הרגולטור או של החברה לא נבדקה ישירות' },
  { c: 'רשות שוק ההון אישרה “מעבר מפיילוט להפצה רחבה” של BILS', s: 'verify', src: ['S2', 'S9', 'S8'], note: 'הניסוח לא אומת. מקור אחד מציין גישה מוגבלת לגורמים מוסדיים; האחרים אינם מפרטים' },
  { c: 'היקפי שימוש, רזרבות מבוקרות, נזילות והכנסות מ־BILS', s: 'verify', src: ['S2', 'S8', 'S10'], note: 'לא נמצאו נתוני היקף או הכנסות במקורות שנבדקו' },
  { c: 'Bits of Gold פועלת ברישיון קבוע של נותן שירותים פיננסיים', s: 'verified', src: ['S4'], note: 'גלובס, 18.9.2022' },
  { c: 'מספר הרישיון הוא 56716', s: 'company', src: ['S7'], note: 'מופיע באתר החברה. לא נבדק במרשם רשמי' },
  { c: 'פעילות בתחום הנכסים הדיגיטליים משנת 2013', s: 'company', src: ['S7'], note: 'האתר מציין “13+ שנות פעילות”. שנת ההקמה המדויקת לא אומתה' },
  { c: 'Bits of Gold Connect — פתרון API לגופים פיננסיים', s: 'company', src: ['S7'], note: 'האתר מתאר פתרון API מודולרי לעסקים. התאמה לגופים פיננסיים לא נבדקה' },
  { c: 'פתרונות משמורת המשלבים ספקי תשתית חיצוניים', s: 'verify', src: ['S7'], note: 'האתר מתאר משמורת בארנק קר מנוהל. לא אומת אילו רכיבים חיצוניים' },
  { c: 'השתתפות באתגר השקל הדיגיטלי של בנק ישראל', s: 'verified', src: ['S5', 'S6'], note: 'ברשימת 14 המשתתפים (23.7.2024). בכנס הסיכום (31.10.2024) מופיעה כמשתתפת, לא כזוכה' },
  { c: 'בנק ישראל לא התחייב להנפיק שקל דיגיטלי או לבחור ספקי תשתית', s: 'verified', src: ['S6'], note: 'לפי הודעת הסיכום' },
  { c: 'ל־Galaxy אין פעילות מקבילה במטבע יציב שקלי או בשקל הדיגיטלי', s: 'verify', src: [], note: 'לא נבדק. היעדר ראיה אינו הוכחה להיעדר פעילות' },
  { c: 'נתונים פיננסיים של Bits of Gold: הכנסות, EBITDA, שווי', s: 'verify', src: [], note: 'לא אותרו נתונים פומביים מאומתים. הדוח אינו מציג כאלה' },
]

const GENERAL = [
  { n: 'בנק ישראל', u: 'https://www.boi.org.il' },
  { n: 'Bits of Gold', u: 'https://www.bitsofgold.co.il' },
  { n: 'Galaxy Digital', u: 'https://www.galaxy.com' },
  { n: 'בנק לאומי', u: 'https://www.leumi.co.il' },
  { n: 'רשות שוק ההון (gov.il)', u: 'https://www.gov.il' },
]

const ext = { target: '_blank', rel: 'noopener noreferrer' }

export default function SourcesChapter() {
  return (
    <Section id="sources" n={16} title="מקורות ובקרת איכות" subtitle="מקורות ישירים, תאריכי פרסום, ומה לא הצלחנו לאמת">
      <Callout tone="teal" Icon={ClipboardCheck} title="איך נבדק הדוח">
        <Bullets
          className="text-sm"
          items={[
            'הבדיקה בוצעה ב־20 באוקטובר 2026 מול הודעות רשמיות (בנק ישראל, Galaxy), אתר החברה ופרסומי עיתונות.',
            'המקורות מנוסחים מחדש ולא מצוטטים. לכל טענה מהותית שאומתה מצוינים מקור ותאריך פרסום.',
            'לא נבדקו: מרשם רשמי של נותני שירותים פיננסיים, דוחות כספיים של החברה, והודעת Bits of Gold המקורית על BILS.',
            'טענה שלא נמצא לה מקור ישיר או שהמקורות אינם עקביים לגביה סומנה “טעון אימות”.',
          ]}
        />
      </Callout>

      <div>
        <H3 className="mb-3">מטריצת אימות טענות</H3>
        <Tbl caption="מטריצת אימות הטענות המהותיות בדוח" minWidth={760}>
          <thead>
            <tr>
              <Th>טענה</Th>
              <Th className="w-44">סטטוס</Th>
              <Th>מקורות</Th>
              <Th>הערה</Th>
            </tr>
          </thead>
          <tbody>
            {CLAIMS.map((r) => (
              <tr key={r.c}>
                <Td className="font-medium">{r.c}</Td>
                <Td><Badge type={r.s} /></Td>
                <Td>
                  {r.src.length ? (
                    r.src.map((id) => (
                      <a key={id} href={`#src-${id}`} className="me-1.5 font-semibold text-brand hover:underline">
                        [{id.slice(1)}]
                      </a>
                    ))
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Td>
                <Td className="text-muted">{r.note}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </div>

      <div>
        <H3 className="mb-3">מקורות ישירים</H3>
        <Tbl caption="מקורות ישירים עם תאריכי פרסום" minWidth={820}>
          <thead>
            <tr>
              <Th className="w-12">#</Th>
              <Th>מקור</Th>
              <Th>סוג</Th>
              <Th>תאריך</Th>
              <Th>נתמך בו</Th>
              <Th className="w-24">קישור</Th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s) => (
              <tr key={s.id} id={`src-${s.id}`} className="scroll-mt-36">
                <Td header>{s.id.slice(1)}</Td>
                <Td>
                  <span className="font-semibold text-heading">{s.title}</span>
                  <span className="block text-xs text-muted">{s.publisher}</span>
                </Td>
                <Td className="text-xs">{KIND[s.kind]}</Td>
                <Td className="whitespace-nowrap text-xs"><En>{s.date}</En></Td>
                <Td className="text-xs text-muted">{s.supports}</Td>
                <Td>
                  <a href={s.url} {...ext} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                    פתיחה <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </div>

      <Card>
        <H3 className="mb-1">אתרים רשמיים (קישורים כלליים)</H3>
        <p className="mb-3 text-sm text-muted">
          קישורים כלליים לאתרי הבית בלבד. הם אינם אסמכתאות ישירות לטענה כלשהי בדוח. האסמכתאות הישירות מופיעות בטבלה שלמעלה.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GENERAL.map((g) => (
            <li key={g.u}>
              <a
                href={g.u}
                {...ext}
                className="flex items-center justify-between gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-sm font-semibold text-heading hover:bg-soft"
              >
                <span>{g.n}</span>
                <span className="flex items-center gap-1 text-xs font-normal text-muted">
                  <En>{g.u.replace('https://www.', '')}</En>
                  <ExternalLink size={12} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  )
}
