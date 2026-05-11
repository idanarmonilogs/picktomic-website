# PickToMic — Marketing Website

Static one-page marketing site for the PickToMic plugin. Built for GitHub Pages.

## Stack

- Vanilla `HTML` / `CSS` / `JS` — no framework, no build step
- `Web Audio API` for the before/after demo player
- `Canvas 2D` for visualizers + hero particles
- `IntersectionObserver` for scroll reveals
- `SVG` for all illustrations
- Google Fonts: `Inter` + `JetBrains Mono`

## Local dev

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

Any static server works (`live-server`, `npx serve`, etc).

## Structure

```
website/
├── index.html
├── css/
│   └── style.css            # all styling, ~1100 lines
├── js/
│   ├── main.js              # nav + sticky behavior
│   ├── animations.js        # particles + reveal + tilt
│   ├── visualizer.js        # canvas audio visualizer
│   └── audio-player.js      # demo card playback + toggle
├── assets/
│   ├── audio/               # placeholder paths — see TODO.md
│   ├── images/              # favicon + OG image
│   └── favicon.ico
├── CONTENT_FACTS.md         # source of truth for content
├── TODO.md                  # placeholders to replace before launch
├── DEPLOY.md                # GitHub Pages deploy guide
└── README.md
```

## Before you ship

1. Read `TODO.md` and replace every `#TODO_*` URL + the `$TBD` price.
2. Drop the 6 audio files into `assets/audio/` (see `TODO.md` for spec).
3. Add `favicon.ico` and `og-image.png` to `assets/images/`.
4. Follow `DEPLOY.md` to publish.

## Design system

| Token | Value |
|---|---|
| Background | `#050507` / `#0a0a0e` |
| Brand purple | `#9b72f0` |
| Brand blue | `#5b9bf8` |
| Brand gradient | 135° purple → blue |
| Text | `#f3f0ff` / `#b8b3d0` / `#7a7595` |
| Font (headings) | `Inter 700-900` |
| Font (body) | `Inter 400-500` |
| Font (mono) | `JetBrains Mono` |
| Radius | 8 / 14 / 24 / 32 |

## Accessibility

- Semantic landmarks: `<nav>`, `<header>`, `<section>`, `<footer>`
- `aria-label` on icon-only buttons, `aria-hidden` on decorative SVGs
- Keyboard-navigable controls (native `<button>` / `<details>`)
- Honors `prefers-reduced-motion`
- Contrast ratios pass WCAG AA on body text

## License

© 2026 IdAudio. All rights reserved.
