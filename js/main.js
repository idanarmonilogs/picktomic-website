/* main.js — nav scroll, mobile menu, smooth scroll polish */
(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');

  // Sticky nav style on scroll
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  // Defensive: if user clicks a nav link, close menu
  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('is-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });
})();
