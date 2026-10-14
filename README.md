<div dir="rtl">

# rbyinvest.com — דף נתוני שוק אוטומטי

דף אינטרנט סטטי שמציג נתוני שוק (ריביות, סחורות, מט"ח, תשואות אג"ח, מדדים, יומן כלכלי) ומתעדכן אוטומטית כל שעה.

## איך זה עובד

```
GitHub Actions (כל שעה)
   └─ scripts/fetch_data.py   ← מושך נתונים מ-Yahoo Finance / ECB / FRED / בנק ישראל
         └─ public/data.json  ← קובץ נתונים אחד
                └─ commit + push
                      └─ GitHub Pages מפרסם את תיקיית public/
                            └─ rbyinvest.com  ← index.html קורא את data.json ומציג
```

הדף עצמו לא פונה לשום API — הוא רק קורא קובץ JSON מוכן. לכן הוא נטען מהר, לא תלוי במקורות חיצוניים ברגע הפתיחה, ואין מפתחות API בצד הלקוח.

## מבנה הקבצים

| קובץ | תפקיד |
|---|---|
| `public/index.html` | הדף עצמו (HTML+CSS+JS בקובץ אחד) |
| `public/data.json` | הנתונים. נכתב אוטומטית. **לא לערוך ידנית** |
| `public/CNAME` | אומר ל-GitHub Pages שהדומיין הוא rbyinvest.com |
| `scripts/fetch_data.py` | הסקריפט שאוסף נתונים |
| `config/manual.json` | ערכים ידניים לנתונים שאין להם מקור חינמי (מוצגים בנטוי) |
| `config/calendar.json` | היומן הכלכלי (ידני בשלב זה) |
| `.github/workflows/update-data.yml` | לוח הזמנים של העדכון האוטומטי |

## התקנה — פעם אחת (כ-15 דקות)

### 1. העלאת הקוד ל-GitHub

במחשב (בחשבון ה-developer), בטרמינל:

</div>

```bash
cd rbyinvest-market
git init
git add .
git commit -m "Initial market dashboard"
# צור repo חדש בשם rbyinvest-market ב-GitHub (ציבורי או פרטי, שניהם עובדים), ואז:
git remote add origin git@github.com:Rbydevelopers/rbyinvest-market.git
git branch -M main
git push -u origin main
```

<div dir="rtl">

### 2. הפעלת GitHub Pages

ב-GitHub: **Settings → Pages**
- Source: `Deploy from a branch`
- Branch: `main`, Folder: `/public`
- שמור. אחרי דקה-שתיים הדף יעלה בכתובת זמנית `https://rbydevelopers.github.io/rbyinvest-market/`

### 3. הרצה ראשונה של העדכון

**Actions → Update market data → Run workflow**. בסיום, `public/data.json` יתעדכן עם נתונים אמיתיים (הקובץ שמגיע עם הפרויקט מכיל נתוני דוגמה בלבד).

פתח את הלוג של ההרצה: כל מקור שנכשל מודפס שם (למשל `yfinance TA90.TA: ...`). זה המקום לבדוק אילו סימולים לא עובדים.

### 4. חיבור הדומיין rbyinvest.com

אצל ספק ה-DNS של rbyinvest.com, הוסף:

| סוג | שם | ערך |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `rbydevelopers.github.io` |

ואז ב-**Settings → Pages → Custom domain** הקלד `rbyinvest.com`, המתן לסימון ה-DNS הירוק, וסמן **Enforce HTTPS**.

(אלו כתובות ה-IP הרשמיות של GitHub Pages נכון לכתיבת שורות אלו; אם ה-DNS לא מאומת, בדוק את הכתובות העדכניות בתיעוד של GitHub.)

### 5. (אופציונלי, מומלץ) מפתח FRED לנתוני ארה"ב

ללא מפתח, ריבית הפד ותשואות 1Y/3Y נלקחות מהקובץ הידני. עם מפתח (חינמי) הם מתעדכנים אוטומטית:

1. הירשם ב-https://fred.stlouisfed.org/docs/api/api_key.html
2. ב-GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `FRED_API_KEY`, Value: המפתח

## תפעול שוטף

- **עדכון ערכים ידניים** (ריבית BoJ, תשואות אג"ח ישראל/גרמניה/UK/יפן): ערוך את `config/manual.json` ישירות באתר GitHub (אייקון העיפרון) ושמור. הדף יתעדכן בריצה הבאה. ערכים אלו תמיד מוצגים בנטוי.
- **יומן כלכלי**: ערוך את `config/calendar.json`. הדף מציג רק אירועים ב-30 הימים הקרובים, ממוין לפי תאריך.
- **הרצה מיידית**: Actions → Run workflow.
- **שינוי תדירות**: שורת ה-`cron` בקובץ ה-workflow (הזמן ב-UTC; ישראל = UTC+2/+3).

## סימון הנתונים בדף

| מראה | משמעות |
|---|---|
| פונט רגיל | נמשך בהצלחה ממקור חי |
| *נטוי* | ערך ידני מ-`manual.json`, או הערך האחרון שנמשך בהצלחה (המקור נכשל בריצה הזו) |
| — | אין נתון |

## מגבלות ידועות (גרסה ראשונה)

- **מדדי ת"א**: TA-35 ו-TA-125 זמינים ב-Yahoo Finance. TA-90, בנקים 5 וביטוח — הסימולים בסקריפט הם ניחוש מושכל ויש לאמת אותם בלוג של ההרצה הראשונה. אם לא עובדים, החלופה היא ה-API של הבורסה (דורש רישום).
- **תשואות אג"ח ישראל, גרמניה, UK, יפן**: אין מקור חינמי אמין — ידני בלבד.
- **ריבית BoJ**: ידני בלבד.
- **יומן כלכלי**: ידני. אוטומציה אפשרית בשלב הבא דרך API בתשלום.
- **1D/1W/1M/YTD** מחושבים מסגירות יומיות: 1D = מול הסגירה הקודמת, 1W = מול הסגירה האחרונה לפני 7 ימים, 1M = לפני 30 יום, YTD = מול סגירת 31.12 של השנה הקודמת.

</div>
