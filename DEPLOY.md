# PickToMic — Deployment Guide

איך לפרסם את האתר ב-GitHub Pages, ולחבר custom domain אם רוצים `picktomic.com`.

---

## אופציה A — Repo נפרד `picktomic` (מומלץ)

הכי נקי. ה-repo של האתר נפרד מ-repo של הפלאגין.

### שלב 1 — יצירת ה-repo

1. `github.com/new`
2. שם: `picktomic` (או כל שם)
3. Public
4. Initialize empty

### שלב 2 — העלאת התוכן

מתוך `/Users/idan/PickToMic/website/`:

```bash
cd /Users/idan/PickToMic/website
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin git@github.com:<USERNAME>/picktomic.git
git push -u origin main
```

### שלב 3 — הפעלת Pages

1. ב-repo בדפדפן ← **Settings** ← **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save

תוך 1-2 דקות יהיה זמין ב-`https://<USERNAME>.github.io/picktomic/`.

---

## אופציה B — Repo בשם `<USERNAME>.github.io`

האתר יעלה ל-root domain — `https://<USERNAME>.github.io/`.

זהה לאופציה A אבל ה-repo נקרא `<USERNAME>.github.io`.

---

## אופציה C — תוך ה-monorepo של הפלאגין

אם רוצים להשאיר את ה-`website/` בתוך `/Users/idan/PickToMic/`:

1. ב-repo `PickToMic` בדפדפן ← **Settings** ← **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/website` (folder)
4. Save

ה-URL יהיה: `https://<USERNAME>.github.io/PickToMic/`.

⚠️ חיסרון: אם ה-repo private, GitHub Pages free דורש public. תצטרך GitHub Pro / Team / Enterprise כדי להפעיל Pages על repo פרטי.

---

## Custom domain — `picktomic.com`

### שלב 1 — קנייה

קנה את הדומיין ב-Namecheap / Cloudflare / Google Domains / כל רושם דומיינים.

### שלב 2 — הגדרת DNS

תוסיף את ה-A records הבאים לדומיין (apex):

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

ועבור `www.picktomic.com` (CNAME):

```
CNAME    www    <USERNAME>.github.io.
```

### שלב 3 — הגדרה ב-GitHub

1. ב-repo ← **Settings** ← **Pages** ← Custom domain
2. הכנס `picktomic.com`
3. סמן **Enforce HTTPS** (יופעל אחרי שה-DNS מתאים)
4. השמירה יוצרת אוטומטית קובץ `CNAME` ב-repo עם התוכן `picktomic.com`

### שלב 4 — אימות

```bash
dig picktomic.com +noall +answer
# צריך לראות את 4 ה-A records של GitHub
```

תוך 24 שעות (לרוב הרבה פחות) — `https://picktomic.com` יעבוד עם SSL חינמי של GitHub.

---

## ⚠️ דברים שכדאי לדעת

### 1. ה-`<base>` — לא צריך

האתר משתמש ב-paths יחסיים (`css/style.css`, `js/main.js`, `assets/...`). יעבוד בכל מסלול sub-path בלי שינוי.

### 2. Cache

GitHub Pages משתמשת ב-CDN. אחרי push יקח **עד 10 דקות** עד שהשינוי גלוי. השתמש ב-hard reload (`Cmd+Shift+R`).

### 3. גודל

GitHub Pages תומך עד `1 GB` per site, ו-`10 builds/hour`. האתר הזה ⪅ 1 MB, אז זה ירוץ נכון.

### 4. HTTPS — חובה!

לא לפרסם בלי HTTPS. אחרת ה-`<audio>` שלך עם Web Audio API לא יעבוד בכל הדפדפנים (Chrome חוסם autoplay על HTTP).

GitHub Pages תומך HTTPS חינמי עבור גם `*.github.io` וגם custom domains (Let's Encrypt).

### 5. `audio` עם autoplay חסום

ה-Web Audio API דורש user gesture (קליק / מגע) לפני שמתחיל לנגן. הקוד שלך מטפל בזה — ה-context מוקם ב-`getCtx()` בפעם הראשונה שלוחצים Play, אז זה יעבוד.

### 6. Mobile testing

לפני שחרור — בדוק ב-iPhone Safari אמיתי. iOS Safari מחמיר עם Web Audio:
- אסור `audioContext.createMediaElementSource` לפני user gesture
- אסור פתיחת `<audio>` עם preload=auto + autoplay
- הקוד הקיים מטפל בשניהם.

---

## סיכום מהיר

1. `cd website && git init && git commit -am "init" && git push`
2. Settings → Pages → branch `main`
3. ✓ Up

עם custom domain: + 4 A records + 1 CNAME + Settings → Pages → custom domain.
