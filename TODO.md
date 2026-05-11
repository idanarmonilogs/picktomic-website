# PickToMic Website — TODO list

רשימת כל ה-placeholders שצריך להחליף ידנית לפני go-live.

## 1. URLs

| Placeholder | מיקום | מה שמים שם |
|---|---|---|
| `#TODO_LEMONSQUEEZY_URL` | `index.html` (×4 — hero, pricing, final CTA, nav) | Lemon Squeezy checkout URL מלא |
| `#TODO_TRIAL_DOWNLOAD` | `index.html` (×4) | קישור הורדה ישיר ל-installer (zip / dmg / pkg) |
| `#TODO_SITE_URL` | meta `og:url` | `https://picktomic.com` או `https://username.github.io/picktomic` |
| `#TODO_SUPPORT_EMAIL` | footer → Contact | `mailto:support@idaudio.com` או דומה |
| `#TODO_DOCS_URL` | footer → Documentation | קישור לתיעוד |
| `#TODO_USER_MANUAL_URL` | footer → User Manual | קישור ל-PDF / HTML של המדריך |
| `#TODO_PRIVACY_URL` | footer → Privacy | URL למסמך פרטיות |
| `#TODO_TERMS_URL` | footer → Terms | URL לתנאי שימוש |
| `#TODO_REFUND_URL` | footer → Refund Policy | URL למדיניות החזר |

## 2. מחיר

המחיר מופיע כ-`$TBD` בשני מקומות:
- `index.html` בכפתור Hero `.btn-price`
- `index.html` בסקציית Pricing `.pricing-amount`

החלף ל-מחיר אמיתי (לדוגמה `$99`).

ב-`index.html` במטה structured data:
```json
"price": "TBD"
```
החלף ל-מחיר אמיתי.

## 3. קבצי אודיו (`assets/audio/`)

צריך 6 קבצים — לכל כלי `before` ו-`after`:

| כלי | קובץ before | קובץ after |
|---|---|---|
| Classical Guitar | `classical-before.mp3` | `classical-after.mp3` |
| Acoustic Guitar | `acoustic-before.mp3` | `acoustic-after.mp3` |
| Oud | `oud-before.mp3` | `oud-after.mp3` |

**מפרט מומלץ:**
- פורמט: `MP3 128-192 kbps` (תאימות רחבה) או `M4A AAC` (איכות טובה יותר באותו גודל)
- אורך: `12-25 שניות` לדגימה
- אותה התחלה ב-before/after (לסנכרון toggle)
- Normalize ל-`-14 LUFS` לעקביות בין דגימות
- Mono הוא בסדר; stereo עדיף

**טיפ**: שמור גם גרסה `.opus` עם רוחב פס נמוך — נטענת מהר יותר במובייל. ה-`<audio>` תומך ב-fallback אוטומטית עם `<source>` tags (לעדכן ב-HTML אם רוצים).

## 4. תמונות (`assets/images/`)

| קובץ | מטרה | מפרט |
|---|---|---|
| `favicon.ico` | טאב דפדפן | 32×32 / 16×16 multi-res ICO |
| `og-image.png` | Open Graph (Facebook/Twitter/iMessage preview) | 1200×630 PNG, ≤500KB |
| `plugin-screenshot.png` | (אופציונלי — אינו בשימוש כרגע ב-HTML) | UI screenshot עיקרי |
| `logo-idaudio.svg` | (אופציונלי — הלוגו inline ב-HTML) | — |

## 5. אופציונלי — הוספות מומלצות

- [ ] **Video demo** במקום או בנוסף לאודיו — קצר (15-30 שניות), MP4 + WebM
- [ ] **Customer testimonials** — קטע נפרד עם 3 ציטוטים ותמונות
- [ ] **Press / coverage** — לוגואים של MusicTech / Sound on Sound / KVR וכו'
- [ ] **Newsletter signup** — Mailchimp / ConvertKit embed
- [ ] **Analytics** — Plausible / Fathom (GDPR-friendly) או GA4
- [ ] **GitHub Discussions** או **Discord** link לקהילה
- [ ] **Loom / YouTube walkthrough** — embed iframe בסקציית Demo

## 6. SEO / Meta — לסקור אחרי הכל

- [ ] עדכן `<title>` ו-`meta description` אם הניסוח לא מדויק
- [ ] עדכן `og:image` ל-URL מלא של ה-OG image (לא relative)
- [ ] שקול להוסיף `sitemap.xml` ו-`robots.txt`
- [ ] שקול schema markup עשיר יותר (Review, AggregateRating אחרי שיהיו ביקורות)

## 7. בדיקות לפני שחרור

- [ ] בדוק ב-Chrome / Safari / Firefox / Edge
- [ ] בדוק במובייל אמיתי (iPhone Safari, Android Chrome)
- [ ] בדוק Lighthouse score (target: Performance ≥90, Accessibility ≥95)
- [ ] בדוק שכל הקישורים עובדים אחרי החלפת URLs
- [ ] בדוק שהאודיו נטען ומשמיע (לא רק "wakes up" ה-context)
- [ ] בדוק ב-DevTools "throttle to slow 3G" — האם נטען בתוך 3 שניות?
- [ ] שמור על HTML/CSS תקני (W3C validator)
