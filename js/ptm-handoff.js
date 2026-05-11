/* PickToMic handoff components — A/B audio cards + procedural FFT curves
   Uses real <audio> elements (data-src-pickup / data-src-picktomic) for playback.
   Curves are stylised — animated procedurally; not tied to real spectrum. */
(() => {
  const PICKUP = "#f08a5d";
  const PTM    = "#9b72f0";
  const PTM_2  = "#5b9bf8";

  document.querySelectorAll('.ptm-demo .demo-card').forEach((card, cardIdx) => {
    const cvs    = card.querySelector('.demo-analyzer canvas');
    const ctx    = cvs.getContext('2d');
    const lblL   = card.querySelector('.lbl.l');
    const lblR   = card.querySelector('.lbl.r');
    const playBtn = card.querySelector('.demo-play');
    const scrub  = card.querySelector('.demo-scrub');
    const cur    = card.querySelector('.cur');
    const durEl  = card.querySelector('.dur');
    const mlabel = card.querySelector('.mlabel');
    const toggle = card.querySelector('.demo-toggle');

    // real audio elements (two per card, one per source)
    const audPickup = card.querySelector('audio[data-role="pickup"]');
    const audPtm    = card.querySelector('audio[data-role="picktomic"]');
    [audPickup, audPtm].forEach(a => { if (a) { a.preload = 'metadata'; a.volume = 1.0; } });

    let active = 'picktomic';
    let playing = false;
    let t = 0, lastNow = performance.now();
    let DURATION = 15; // fallback until metadata loads

    function currentAudio() { return active === 'pickup' ? audPickup : audPtm; }
    function otherAudio()   { return active === 'pickup' ? audPtm    : audPickup; }

    function setIcon(isPlaying) {
      playBtn.innerHTML = isPlaying
        ? '<svg width="10" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        : '<svg width="11" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
    }
    setIcon(false);

    function fmt(s) {
      if (!isFinite(s)) s = 0;
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60);
      return m + ':' + String(ss).padStart(2, '0');
    }

    function refreshDuration() {
      const a = currentAudio();
      if (a && isFinite(a.duration) && a.duration > 0) {
        DURATION = a.duration;
        if (durEl) durEl.textContent = fmt(a.duration);
      }
    }
    [audPickup, audPtm].forEach(a => {
      if (!a) return;
      a.addEventListener('loadedmetadata', refreshDuration);
      a.addEventListener('ended', () => {
        playing = false;
        setIcon(false);
        t = 0;
      });
    });

    function setActive(k) {
      const wasPlaying = playing;
      const prev = currentAudio();
      active = k;
      toggle.querySelectorAll('button').forEach(b => b.classList.toggle('sel', b.dataset.k === k));
      if (mlabel) mlabel.textContent = k === 'pickup' ? 'Pickup' : 'PickToMic';
      lblL.classList.toggle('dim', k !== 'pickup');
      lblR.classList.toggle('dim', k !== 'picktomic');

      // swap audio: keep position, mirror playing state
      const nextA = currentAudio();
      if (prev && nextA && prev !== nextA) {
        const pos = prev.currentTime;
        try { prev.pause(); } catch (e) {}
        try { nextA.currentTime = pos; } catch (e) {}
        if (wasPlaying) { nextA.play().catch(() => {}); }
      }
      refreshDuration();
    }
    setActive('picktomic');

    toggle.addEventListener('click', e => {
      const b = e.target.closest('button[data-k]');
      if (b) setActive(b.dataset.k);
    });

    playBtn.addEventListener('click', async () => {
      const a = currentAudio();
      if (!a) return;
      if (a.paused) {
        // pause the other one if it was playing
        const o = otherAudio();
        if (o && !o.paused) { try { o.pause(); } catch (e) {} }
        try { await a.play(); playing = true; setIcon(true); }
        catch (e) { playing = false; setIcon(false); }
      } else {
        try { a.pause(); } catch (e) {}
        playing = false;
        setIcon(false);
      }
    });

    // click-to-seek on scrub bar
    scrub.addEventListener('click', (e) => {
      const r = scrub.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const a = currentAudio();
      if (a && isFinite(a.duration)) {
        try { a.currentTime = pct * a.duration; } catch (err) {}
      }
    });

    function resize() {
      const r = cvs.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cvs.width = r.width * dpr; cvs.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    new ResizeObserver(resize).observe(cvs);

    // distinct bump fingerprints per card index (Classical / Acoustic / Oud)
    const FINGERPRINTS = [
      { // 0 — Classical Guitar
        pickup: [
          { x: .42, w: .10, a: .95, bs: 1.4, bp: 0,  bw: .005, am: .04 },
          { x: .56, w: .06, a: .55, bs: 2.2, bp: .8, bw: .006, am: .06 },
          { x: .18, w: .16, a: .18 },
          { x: .85, w: .08, a: .10 },
        ],
        ptm: [
          { x: .18, w: .18, a: .78, bs: 1.0, bp: 1.5, bw: .004, am: .03 },
          { x: .45, w: .18, a: .62, bs: .9,  bp: .2,  bw: .005, am: .03 },
          { x: .72, w: .14, a: .70, bs: 1.3, bp: 2.4, bw: .005, am: .04 },
          { x: .90, w: .08, a: .46, bs: 1.8, bp: 3.0, bw: .004, am: .05 },
        ],
      },
      { // 1 — Acoustic Guitar (brighter, more upper-mids)
        pickup: [
          { x: .38, w: .08, a: .85, bs: 1.6, bp: .3, bw: .005, am: .05 },
          { x: .62, w: .07, a: .68, bs: 2.0, bp: 1.2, bw: .006, am: .05 },
          { x: .20, w: .14, a: .20 },
          { x: .82, w: .10, a: .14 },
        ],
        ptm: [
          { x: .12, w: .16, a: .72, bs: .9,  bp: 1.0, bw: .004, am: .03 },
          { x: .40, w: .16, a: .65, bs: 1.0, bp: .5,  bw: .005, am: .04 },
          { x: .68, w: .14, a: .78, bs: 1.2, bp: 2.0, bw: .005, am: .04 },
          { x: .88, w: .10, a: .58, bs: 1.6, bp: 2.8, bw: .004, am: .05 },
        ],
      },
      { // 2 — Oud (deep body, mid-focused)
        pickup: [
          { x: .30, w: .08, a: .92, bs: 1.5, bp: 0,  bw: .005, am: .05 },
          { x: .48, w: .06, a: .60, bs: 2.4, bp: .6, bw: .006, am: .06 },
          { x: .15, w: .12, a: .22 },
          { x: .80, w: .10, a: .08 },
        ],
        ptm: [
          { x: .10, w: .14, a: .82, bs: .8,  bp: 1.2, bw: .004, am: .03 },
          { x: .32, w: .18, a: .76, bs: 1.0, bp: .4,  bw: .005, am: .03 },
          { x: .58, w: .16, a: .60, bs: 1.2, bp: 2.0, bw: .005, am: .04 },
          { x: .82, w: .12, a: .48, bs: 1.6, bp: 2.8, bw: .004, am: .05 },
        ],
      },
    ];
    const fp = FINGERPRINTS[cardIdx % FINGERPRINTS.length];

    function curve(W, H, bumps, tm) {
      const ys = new Array(W).fill(0);
      for (let x = 0; x < W; x++) {
        const u = x / (W - 1);
        let g = 0;
        for (const b of bumps) {
          const breathe = b.bs ? Math.sin(tm * b.bs + (b.bp || 0)) * (b.bw || 0) : 0;
          const amp = b.a + (b.am ? Math.sin(tm * b.bs + (b.bp || 0)) * b.am : 0);
          g += amp * Math.exp(-Math.pow((u - (b.x + breathe)), 2) / (2 * b.w * b.w));
        }
        const grain = (Math.sin((x + tm * 60) * .7) * .5 + Math.sin((x + tm * 40) * 1.3) * .5) * .012;
        ys[x] = H - Math.min(1, Math.max(0, g + grain)) * H * .85 - H * .07;
      }
      return ys;
    }
    function strokeCurve(ys, kind, w, alpha, glow) {
      const W = cvs.clientWidth;
      let stroke;
      if (kind === 'ptm') {
        const g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, PTM); g.addColorStop(1, PTM_2);
        stroke = g;
      } else {
        stroke = PICKUP;
      }
      ctx.save(); ctx.lineWidth = w; ctx.strokeStyle = stroke; ctx.globalAlpha = alpha;
      if (glow) { ctx.shadowColor = kind === 'ptm' ? PTM : PICKUP; ctx.shadowBlur = 14; }
      ctx.beginPath();
      for (let x = 0; x < ys.length; x++) { if (x === 0) ctx.moveTo(x, ys[x]); else ctx.lineTo(x, ys[x]); }
      ctx.stroke(); ctx.restore();
    }
    function fillUnder(ys, kind) {
      const W = cvs.clientWidth, H = cvs.clientHeight;
      let fill;
      if (kind === 'ptm') {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        // top: blend of purple+blue at alpha .22 → bottom transparent
        g.addColorStop(0, 'rgba(155,114,240,.22)');
        g.addColorStop(.5, 'rgba(123,135,244,.14)');
        g.addColorStop(1, 'rgba(91,155,248,0)');
        fill = g;
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgba(240,138,93,.22)');
        g.addColorStop(1, 'rgba(240,138,93,0)');
        fill = g;
      }
      ctx.save(); ctx.fillStyle = fill; ctx.beginPath();
      ctx.moveTo(0, ys[0]);
      for (let x = 1; x < ys.length; x++) ctx.lineTo(x, ys[x]);
      ctx.lineTo(ys.length - 1, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function frame(now) {
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;

      // sync t to audio if playing, else continue procedural drift
      const a = currentAudio();
      if (a && !a.paused) {
        t = a.currentTime;
        if (isFinite(a.duration) && a.duration > 0) DURATION = a.duration;
      } else if (playing) {
        t = (t + dt) % DURATION;
      }

      const W = cvs.clientWidth, H = cvs.clientHeight;
      ctx.clearRect(0, 0, W, H);

      // grid
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(0, (H / 4) * i); ctx.lineTo(W, (H / 4) * i); ctx.stroke();
      }
      [.06, .26, .5, .74, .93].forEach(u => {
        ctx.beginPath(); ctx.moveTo(u * W, 0); ctx.lineTo(u * W, H);
        ctx.strokeStyle = "rgba(255,255,255,.04)"; ctx.stroke();
      });
      ctx.restore();

      const py = curve(W, H, fp.pickup, t);
      const my = curve(W, H, fp.ptm, t);

      if (active === 'pickup') { fillUnder(py, PICKUP); }
      strokeCurve(py, PICKUP, active === 'pickup' ? 2.2 : 1.3, active === 'pickup' ? 1 : .25, active === 'pickup');
      if (active === 'picktomic') { fillUnder(my, PTM); }
      strokeCurve(my, PTM, active === 'picktomic' ? 2.4 : 1.3, active === 'picktomic' ? 1 : .25, active === 'picktomic');

      // sweep line + dot
      const sweepPos = (a && isFinite(a.duration) && a.duration > 0)
        ? (a.currentTime / a.duration)
        : ((Math.sin(t * .45) * .5 + .5));
      const sx = sweepPos * W;
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke(); ctx.restore();
      const sxi = Math.min(W - 1, Math.max(0, Math.floor(sx)));
      const dotY = active === 'pickup' ? py[sxi] : my[sxi];
      const dotC = active === 'pickup' ? PICKUP : PTM;
      ctx.fillStyle = dotC; ctx.shadowColor = dotC; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(sx, dotY, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

      // transport readout
      const audDur = (a && isFinite(a.duration) && a.duration > 0) ? a.duration : DURATION;
      const p = (t / audDur) * 100;
      scrub.style.setProperty('--p', p + '%');
      if (cur) cur.textContent = fmt(t);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
