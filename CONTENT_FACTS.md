# PickToMic — Content Facts (Website)

עובדות שחולצו מהקוד. כל מה שייכנס לאתר חייב להיות מבוסס על זה. אם משהו לא ברשימה — לא כותבים עליו.

---

## 1. זהות מותג
- שם המוצר = `PickToMic` (AU + VST3 build: `PickToMic AI`)
- מפתח = `Idan Armoni`
- חברה = `IdAudio`
- זכויות = `© 2026 IdAudio`
- גרסה (CMake) = `1.0.0`
- צבעי מותג = סגול `#9b72f0` → כחול `#5b9bf8` (gradient)
- לוגו = 5 פסי גל אודיו (SVG, ראה `IdAudioBrand.h`)
- Wordmark = `Id` לבן + `Audio` סגול

## 2. תיאור רשמי
- Short = `Pickup to Mic — IR-based tone capture`
- **הערה (2026-05-11)**: למרות ש-CMakeLists עדיין מציין "AI / TCN-Lite neural" — **בפועל הפלאגין שמשתחרר IR-only**. אסור להזכיר TCN / Neural / 107K / 11ms באתר.

## 3. ארכיטקטורת DSP — מה שבאמת רץ
- **IR Convolution** = שני faders עצמאיים: `Primary` (Tone) + `Body`
- **לא ניורל** = הסר הכל. הפלאגין הסופי IR-only.
- מקור IRs = פייפליין שאומן על `data/master/pairs.csv` (847 זוגות DI↔MIC eligible), אך התוצאה האריזה = IR קלאסי

## 4. מודולי DSP (ידיות אמיתיות ב-UI)
מהקובץ `PluginEditor.cpp` + `componentID`:

| ID | תפקיד | קובץ DSP |
|---|---|---|
| `IN` | Input Gain | — |
| `OT` | Output Gain | — |
| `MX` | Dry/Wet (Pickup / Mic) | `PlayChain` |
| `PN` | Punch | `TransientShaper` |
| `RV` | DePickup (חיתוך פיקאפ) | `SpectralEnvelope` |
| `EQ` | EQ Master | `ParametricEQ` |
| `CP` | Compressor (v2 — log-domain VCA, soft knee, 5ms RMS, 80Hz HPF) | `CompressorModule` |
| `ST` | Saturation (channel-strip + spectrum DRY/WET + harmonics) | `SaturationModule` |
| `WD` | Stereo Width | `StereoWidth` |
| `SE` | Spectral Envelope | `SpectralEnvelope` |
| `DQ` | Transient Shaper (broad + Attack/Sustain bands) | `TransientShaper` |
| `Reverb` | Hall/Plate, decay עד 10s/6s, sidechain ducking | `ReverbEngine` |

## 5. כלים נתמכים (factory presets, 47 קבצים)
מ-`~/Library/PickToMic/Presets`:

1. Acoustic Guitar (10 פריסטים)
2. Bouzouki (6)
3. Cello (2)
4. Classical Guitar (7)
5. Double Bass (2)
6. Oud (2)
7. Qanun (2)
8. Saz (6)
9. Ukulele (2)
10. Violin (Aurora + נוספים)

**הערה**: רק כלים אקוסטיים עם פיקאפ. לא חשמלי, לא ויולה.

## 6. פיצ'רים אמיתיים (UI tabs)
מהקוד: `const char* tabNames[] = { "CAPTURE", "TONE", "STUDIO", "PRESETS", "SETTINGS" };`

1. **CAPTURE** — הקלטת DI+Mic זוג → חילוץ IR אישי משלך
2. **TONE** — שליטת ידיות פשוטה (3 ידיות + Bypass + AutoGain)
3. **STUDIO** — מצב advanced (כל המודולים, Compressor/Sat/Reverb/EQ/Width/Transient)
4. **PRESETS** — 47 פריסטים פקטוריים
5. **SETTINGS** — Theme, Tooltips, Oversampling, Auto Gain

## 7. ערכות נושא (Themes) פעילות
- `Dark Neon` (default)
- `Obsidian`
- `Monolith`

(נסתרות בקוד: Woodify / Simple Black / Simple Wood / Futuristic)

## 8. Oversampling
- Online: x1 / x2 / x4 / x8
- Offline: x1 / x2 / x4

## 9. דרישות מערכת
- **macOS**: 13.0+ (Universal Binary — `arm64` + `x86_64`, Apple Silicon + Intel)
- **Windows**: build מ-MSVC קיים בקוד (לא מאומת על גרסה ספציפית — לרשום `Windows 10/11` בזהירות)
- **CPU**: כל מעבד מודרני, ARM/x86 שניהם
- **RAM**: לא הוגדר בקוד — `512 MB+` סביר

## 10. פורמטים נתמכים
- `AU` (macOS)
- `VST3` (macOS + Windows)
- **לא נתמך**: `AAX` (אין ב-CMakeLists)

## 11. רישוי + Trial
- `TrialManager` ב-`Utility/TrialManager.h` — תקופת ניסיון `14 ימים`
- `LicenseManager` מבוסס `juce_cryptography` — מפתח מקומי ב-`~/Library/PickToMic/.license`
- Trial expiry overlay על ה-UI כשפג

## 12. Tail Length
- `getTailLengthSeconds() = 15.0` — DAW משאיר את הפלאגין פועל 15 שניות אחרי עצירה (להמשך זנב Reverb)

## 13. מה לא קיים — אל תכתוב!
- ❌ AAX support
- ❌ Linux build
- ❌ Standalone app
- ❌ MIDI control
- ❌ Sidechain input חיצוני (ה-ducking פנימי)
- ❌ Cloud presets / community sharing
- ❌ AI / Neural / TCN — הפלאגין IR-only סופי
- ❌ Multi-out
- ❌ ויולה / כלים חשמליים / סינתים

---

## הצעות לאתר (Approval required)

### Hero tagline (3 הצעות)
1. `One plugin for every acoustic instrument with a pickup`
2. `Pickup recordings, mic-quality tone`
3. `Capture the mic in the pickup`

### מחיר placeholder
`$99` חד-פעמי, רישיון תמידי (לאישור)

### כפתורים
- Primary: `Buy Now — $99` → Lemon Squeezy placeholder
- Secondary: `Free 14-Day Trial` → download placeholder

### DAW logos להציג
`Logic Pro` / `Ableton Live` / `Pro Tools` / `Reaper` / `FL Studio` / `Cubase` / `Studio One`
(כל מי שתומך AU או VST3 — כלומר כולם)

### Audio demo כלים מומלצים
2-4 דוגמאות בלבד — אחרת כבד מדי. הצעה:
1. Classical Guitar (הכלי המאומת ביותר)
2. Acoustic Guitar
3. Oud (לעבודה אורגנית/מזרח-תיכונית)
4. Cello (מיתרי קשת)

---

**אישור?** אחרי שתאשר, אני ממשיך לשלב 2-7.
