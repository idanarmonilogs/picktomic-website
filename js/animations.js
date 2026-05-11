/* animations.js — particles, reveal-on-scroll, tilt-on-hover */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     Reveal on scroll — IntersectionObserver
     ───────────────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('in'));
    }
  }

  /* ─────────────────────────────────────────────────────────────
     Tilt on hover — pointer parallax
     ───────────────────────────────────────────────────────────── */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach((el) => {
      let rect = null;
      const MAX = 6; // degrees

      function onMove(e) {
        if (!rect) rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rx = -dy * MAX;
        const ry = dx * MAX;
        el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
      function onEnter() {
        rect = el.getBoundingClientRect();
      }
      function onLeave() {
        rect = null;
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      }

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Hero particle field — lightweight, no deps
     Each particle = a glowing dot drifting upward.
     ───────────────────────────────────────────────────────────── */
  (function particles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = 1, parts = [];
    let raf = 0, last = 0;
    const COUNT = 60;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.15 + Math.random() * 0.5),
        r: 0.6 + Math.random() * 1.8,
        a: 0.15 + Math.random() * 0.55,
        hue: Math.random() < 0.5 ? 262 : 215, // purple or blue
        life: 0,
        maxLife: 4000 + Math.random() * 6000,
      };
    }

    function init() {
      parts = [];
      for (let i = 0; i < COUNT; i++) parts.push(spawn(true));
    }

    function frame(t) {
      const dt = last ? t - last : 16;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life += dt;
        if (p.y < -20 || p.life > p.maxLife) {
          parts[i] = spawn(false);
          continue;
        }
        const a = p.a * Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${a * 0.15})`;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => {
      resize();
      init();
    });
    resize();
    init();
    raf = requestAnimationFrame(frame);

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
  })();
})();
