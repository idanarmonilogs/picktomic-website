/* visualizer.js — canvas visualizer for the audio demo cards
   Exposes window.PTMViz with .attach(card, audioEl) / .start() / .stop() */
(function () {
  'use strict';

  // Polyfill audio context
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) {
    window.PTMViz = { attach: () => ({ start: () => {}, stop: () => {}, idle: () => {} }) };
    return;
  }

  // One shared audio context for the whole page (browser limit on contexts).
  let sharedCtx = null;
  function getCtx() {
    if (!sharedCtx) sharedCtx = new AC();
    return sharedCtx;
  }

  /**
   * Create a visualizer bound to a demo card.
   * Returns: { attachAudio(audioEl), start(), stop(), idle() }
   */
  function attach(card) {
    const canvas = card.querySelector('.demo-canvas');
    if (!canvas) return { attachAudio: () => {}, start: () => {}, stop: () => {}, idle: () => {} };

    const ctx2d = canvas.getContext('2d');
    let raf = 0;
    let analysers = new Map(); // audioEl -> { analyser, dataArr, source }
    let currentAudio = null;
    let isPlaying = false;
    let idleT = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function ensureAnalyser(audioEl) {
      if (analysers.has(audioEl)) return analysers.get(audioEl);
      const audioCtx = getCtx();
      try {
        const source = audioCtx.createMediaElementSource(audioEl);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        const obj = { analyser, dataArr, source };
        analysers.set(audioEl, obj);
        return obj;
      } catch (err) {
        // CORS or already-connected — return null and we'll fall back to idle viz
        return null;
      }
    }

    /* Idle viz — gentle floating wave so the card never looks dead */
    function drawIdle(t) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx2d.clearRect(0, 0, w, h);

      const grad = ctx2d.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(155,114,240,.0)');
      grad.addColorStop(0.5, 'rgba(155,114,240,.65)');
      grad.addColorStop(1, 'rgba(91,155,248,.0)');

      ctx2d.lineWidth = 1.8;
      ctx2d.strokeStyle = grad;
      ctx2d.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const phase = t / 900;
        const y =
          h / 2 +
          Math.sin(x / 40 + phase) * 6 +
          Math.sin(x / 18 - phase * 1.3) * 3;
        if (x === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();
    }

    /* Active viz — spectrum bars from analyser */
    function drawActive() {
      if (!currentAudio) return;
      const a = analysers.get(currentAudio);
      if (!a) {
        drawIdle(performance.now());
        return;
      }
      a.analyser.getByteFrequencyData(a.dataArr);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx2d.clearRect(0, 0, w, h);

      const bins = a.dataArr.length;
      const bars = Math.min(64, bins);
      const step = Math.floor(bins / bars);
      const barW = w / bars;

      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += a.dataArr[i * step + j];
        const v = (sum / step) / 255;
        const bh = Math.max(2, v * (h - 8));
        const x = i * barW;
        const y = h - bh;

        const g = ctx2d.createLinearGradient(0, y, 0, h);
        g.addColorStop(0, 'rgba(155,114,240,1)');
        g.addColorStop(1, 'rgba(91,155,248,.4)');
        ctx2d.fillStyle = g;
        ctx2d.fillRect(x + 1, y, Math.max(1, barW - 2), bh);
      }

      // Center line glow
      ctx2d.strokeStyle = 'rgba(255,255,255,.05)';
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h - 1);
      ctx2d.lineTo(w, h - 1);
      ctx2d.stroke();
    }

    function loop(t) {
      if (isPlaying) drawActive();
      else drawIdle(t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return {
      attachAudio(audioEl) {
        ensureAnalyser(audioEl);
      },
      start(audioEl) {
        currentAudio = audioEl;
        isPlaying = true;
        // Resume context if suspended (autoplay policy)
        try { getCtx().resume(); } catch (e) {}
      },
      stop() {
        isPlaying = false;
      },
      setCurrent(audioEl) {
        currentAudio = audioEl;
      },
    };
  }

  window.PTMViz = { attach };
})();
