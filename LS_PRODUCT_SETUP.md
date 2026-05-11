# LS Product — Paste-Ready Setup

Open: https://app.lemonsqueezy.com/products/new

## Section: Basic info

**Name**
```
PickToMic
```

**Status** = `Published`

**Description** (paste into rich-text editor — keep formatting)
```html
<h3>Turn any acoustic pickup into a studio-mic sound.</h3>

<p>PickToMic is an IR-based plugin trained on real DI ↔ mic pairs.
It captures the natural tone you'd get from a high-end microphone
on your acoustic guitar, mandolin, oud, or any pickup-equipped
instrument — without owning the microphone, room, or preamp.</p>

<h4>What's inside</h4>
<ul>
  <li><strong>4-IR engine</strong> — Punch / Body / Space / Air, individually mixable</li>
  <li><strong>Smart Capture</strong> — record your own DI↔mic pair and the plugin builds the IR for you</li>
  <li><strong>Compressor v2</strong> — feed-forward log-domain VCA with soft knee + sidechain HPF</li>
  <li><strong>Reverb v2</strong> — dual-engine (Plate + Hall) with multi-axis Amount knob and sidechain Ducking</li>
  <li><strong>Transient Designer</strong> — broad + per-band attack/sustain shaping</li>
  <li><strong>37 factory presets</strong> — instrument-by-character (Direct / Mix / Producer variants)</li>
  <li><strong>Lock IR</strong> — keep your captured tone while auditioning preset effects</li>
</ul>

<h4>Compatibility</h4>
<ul>
  <li>macOS 13+ (Apple Silicon + Intel) — AU + VST3</li>
  <li>Windows 10/11 — VST3</li>
</ul>

<p><em>14-day free trial. License delivered by email after purchase.</em></p>
```

**Thumbnail**: upload from your Mac — `/Users/idan/PickToMic/branding/idaudio_mark_1024.png`
(Or download from Drive: `https://drive.google.com/open?id=16oSSAS2O7AJW9lE6yC-d9ECBypuTdx4B`)

---

## Section: Pricing

**Pricing model** = `Single payment`

**Price** = `99` (₪99 — store currency is ILS, equates to ~$29 USD)

**Tax behaviour** = `Tax inclusive` (LS auto-applies VAT for EU/UK buyers)

---

## Section: Delivery

**Delivery method** = `Custom delivery`

**Delivery instructions** (paste — shown to buyer after payment):
```
Thanks for purchasing PickToMic!

Your license key will be emailed to you within 1 minute of payment
(check spam if you don't see it).

After receiving the key:
1. Download the plugin: https://drive.google.com/open?id=1Ja6g6z8uy_LT0M5kKqVHDdQbhBauWnrl
   (right-click the .pkg → Open if Gatekeeper warns)
2. Open your DAW and load "PickToMic Licensed"
3. Click "I have a license key", paste your key, click Activate

Need help? idanarmonilogs@gmail.com
```

**License keys** = `Disabled` (we issue our own keys via webhook)

---

## Section: Settings

**SKU** = `PTM-1`

**Display order** = `0`

---

→ Click **Save & Publish**

→ Once saved, the URL will look like:
   `https://app.lemonsqueezy.com/products/123456`
   
→ Paste that product ID (`123456`) into chat and I'll wire up:
  - Variant pricing API
  - Webhook to our Cloudflare Worker
  - Buy buttons on the website
  - Final checkout URL
