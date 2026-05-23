# ממשק ניהול תוכן — eyalmoryosef.com/admin

## כניסה

| סביבה | כתובת |
|--------|--------|
| מקומי | http://localhost:4321/admin |
| Production | https://eyalmoryosef.com/admin |

פרטי התחברות מוגדרים ב-`.env` (מקומי) וב-Vercel Environment Variables (production).

## מה אפשר לערוך

| לשונית | תוכן |
|--------|------|
| **בלוג** | יצירה, עריכה, מחיקה של פוסטים (עברית + אנגלית) |
| **פרויקטים** | יצירה, עריכה, מחיקה של פרויקטים |
| **טקסטי אתר** | Hero, תיבות תיאור, ניווט, כותרות עמודים |
| **אודות** | פסקאות דף About + תיאור SEO |
| **עכשיו** | דף Now — בונה, לומד, חושב על |

## משתני סביבה (חובה)

```bash
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...   # openssl rand -hex 32
```

## Production — שמירה ל-GitHub (חובה ב-Vercel)

ב-Vercel אין מערכת קבצים לכתיבה. בלי אלה השמירה מהאדמין **לא תעבוד** ב-production:

```bash
GITHUB_TOKEN=...           # Personal Access Token עם הרשאת repo
GITHUB_REPO=eyalmoryosef/eyalmoryosef.com
GITHUB_BRANCH=master
```

אחרי שמירה ב-production: Vercel מבצע deploy אוטומטי (אם מחובר ל-GitHub).

## מקומי

```bash
cp .env.example .env
# ערוך .env
npm install
npm run dev
```

שמירה מקומית כותבת ישירות לקבצים ב-`src/` — רואים מיד אחרי רענון.

## קבצי נתונים

| קובץ | תוכן |
|------|------|
| `src/data/site-copy.json` | טקסטי UI (Hero, ניווט וכו') |
| `src/data/about-content.json` | דף אודות |
| `src/data/now-content.json` | דף עכשיו |
| `src/content/blog/{locale}/*.md` | פוסטי בלוג |
| `src/content/projects/{locale}/*.md` | פרויקטים |
