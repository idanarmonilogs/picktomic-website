/* audio-player.js — controls each demo card */
(function () {
  'use strict';

  if (!window.PTMViz) return;

  const cards = document.querySelectorAll('.demo-card');
  const allCards = []; // for cross-card pause

  function fmtTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  cards.forEach((card) => {
    const playBtn = card.querySelector('.demo-play');
    const toggle = card.querySelector('.demo-toggle');
    const toggleBtns = card.querySelectorAll('.demo-toggle-btn');
    const audios = card.querySelectorAll('.demo-audio');
    const curEl = card.querySelector('.demo-time-cur');
    const durEl = card.querySelector('.demo-time-dur');

    if (!playBtn || !audios.length) return;

    const viz = window.PTMViz.attach(card);
    audios.forEach((a) => viz.attachAudio(a));

    // 'before' = pickup, 'after' = PickToMic. Default to before.
    let activeRole = 'before';
    if (toggle) toggle.setAttribute('data-active', activeRole);

    function getActiveAudio() {
      return card.querySelector(`.demo-audio[data-role="${activeRole}"]`);
    }

    function pauseAllOtherCards() {
      allCards.forEach((c) => {
        if (c.card === card) return;
        c.pause();
      });
    }

    function play() {
      const a = getActiveAudio();
      if (!a) return;
      pauseAllOtherCards();
      a.play().then(() => {
        card.classList.add('is-playing');
        viz.start(a);
      }).catch((err) => {
        // Likely missing file or autoplay block — show subtle state.
        console.warn('Demo audio could not play:', err && err.message);
        card.classList.add('is-playing'); // still flip UI for placeholder
        viz.start(a);
      });
    }

    function pause() {
      audios.forEach((a) => { try { a.pause(); } catch (e) {} });
      card.classList.remove('is-playing');
      viz.stop();
    }

    playBtn.addEventListener('click', () => {
      const a = getActiveAudio();
      if (!a) return;
      if (a.paused) play();
      else pause();
    });

    toggleBtns.forEach((b) => {
      b.addEventListener('click', () => {
        const role = b.dataset.src;
        if (role === activeRole) return;

        const wasPlaying = !getActiveAudio().paused;
        const t = getActiveAudio().currentTime;

        toggleBtns.forEach((x) => {
          x.classList.toggle('is-active', x === b);
          x.setAttribute('aria-selected', x === b ? 'true' : 'false');
        });

        // Pause current
        getActiveAudio().pause();

        // Switch
        activeRole = role;
        if (toggle) toggle.setAttribute('data-active', role);
        const newA = getActiveAudio();

        // Sync playhead so the toggle feels instant + same-position
        try { newA.currentTime = t; } catch (e) {}
        viz.setCurrent(newA);

        if (wasPlaying) {
          newA.play().then(() => viz.start(newA)).catch(() => viz.start(newA));
        }
      });
    });

    audios.forEach((a) => {
      a.addEventListener('loadedmetadata', () => {
        if (durEl) durEl.textContent = fmtTime(a.duration);
      });
      a.addEventListener('timeupdate', () => {
        if (a !== getActiveAudio()) return;
        if (curEl) curEl.textContent = fmtTime(a.currentTime);
      });
      a.addEventListener('ended', () => {
        pause();
        if (curEl) curEl.textContent = '0:00';
      });
    });

    allCards.push({ card, pause });
  });
})();
