/* ==========================================================================
   SI TU SAVAIS… — Bootstrap applicatif
   Lenis, voile de transition, navigation, menu mobile, toast, garde-fous
   ========================================================================== */
(function () {
  'use strict';

  var STU = (window.STU = window.STU || {});
  var html = document.documentElement;
  var READY = false;

  /* ---------- Garde-fou : toute panne laisse le contenu visible ---------- */
  window.addEventListener('error', function () {
    if (!READY) { html.classList.add('no-anim'); unlock(); }
  });
  setTimeout(function () {
    if (!READY) { html.classList.add('no-anim'); unlock(); }
  }, 4000);

  function unlock() {
    html.classList.remove('is-locked');
    var intro = document.getElementById('intro');
    if (intro && !intro.dataset.busy) intro.remove();
  }

  /* ---------- Initialisation GSAP ---------- */
  STU.env.hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!STU.env.hasGSAP) {
    html.classList.add('no-anim');
  }

  var lenis = null;
  var veil = document.getElementById('veil');

  function initSmoothScroll() {
    if (!STU.env.hasGSAP || STU.env.reduced || typeof window.Lenis === 'undefined') return;
    if (!STU.env.finePointer) return; // défilement natif sur tactile
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    STU.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(hash) {
    var target = document.querySelector(hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else target.scrollIntoView({ behavior: STU.env.reduced ? 'auto' : 'smooth' });
  }

  /* ---------- Voile de transition entre pages ---------- */
  function veilIn() {
    if (!STU.env.hasGSAP || STU.env.reduced) { if (veil) veil.style.display = 'none'; return; }
    gsap.set(veil, { visibility: 'visible', scaleY: 1, transformOrigin: 'bottom' });
    gsap.to(veil, {
      scaleY: 0, duration: 0.9, ease: STU.ease.cinema, delay: 0.08,
      onComplete: function () { gsap.set(veil, { visibility: 'hidden' }); }
    });
  }

  function veilOut(url) {
    if (!STU.env.hasGSAP || STU.env.reduced) { location.href = url; return; }
    if (STU.particles) STU.particles.disperse(7);
    gsap.set(veil, { visibility: 'visible', transformOrigin: 'top', scaleY: 0 });
    gsap.to(veil, {
      scaleY: 1, duration: 0.65, ease: STU.ease.inOut,
      onComplete: function () { location.href = url; }
    });
  }

  function initLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (a.target === '_blank' || a.dataset.noTransition !== undefined) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      /* ancre interne */
      if (href.charAt(0) === '#') {
        e.preventDefault();
        scrollToTarget(href);
        return;
      }
      if (href.indexOf('mailto:') === 0 || href.indexOf('http') === 0) return;
      e.preventDefault();
      closeMenu();
      veilOut(href);
    });
  }

  /* ---------- Navigation / page courante ---------- */
  function markCurrent() {
    var page = document.body.dataset.page;
    document.querySelectorAll('.nav-link, .menu-overlay__link').forEach(function (a) {
      if (a.dataset.nav === page) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- Menu mobile ---------- */
  var menuOpen = false;
  var overlay, toggleBtn, lastFocus;

  function openMenu() {
    menuOpen = true;
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    html.classList.add('is-locked');
    if (STU.env.hasGSAP && !STU.env.reduced) {
      gsap.set(overlay, { visibility: 'visible', opacity: 1 });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(overlay.querySelectorAll('.menu-overlay__link, .menu-overlay__foot'),
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: STU.ease.cinema, delay: 0.1 });
    } else {
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
    }
    var first = overlay.querySelector('.menu-overlay__link');
    if (first) first.focus();
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    overlay.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    html.classList.remove('is-locked');
    if (STU.env.hasGSAP && !STU.env.reduced) {
      gsap.to(overlay, {
        opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: function () { gsap.set(overlay, { visibility: 'hidden' }); }
      });
    } else {
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initMenu() {
    overlay = document.querySelector('.menu-overlay');
    toggleBtn = document.querySelector('.nav-toggle');
    if (!overlay || !toggleBtn) return;
    toggleBtn.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    overlay.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });
  }

  /* ---------- Toast (confirmations, aria-live) ---------- */
  STU.toast = function (msg) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(function () {
      t.classList.add('is-visible');
      clearTimeout(t._h);
      t._h = setTimeout(function () { t.classList.remove('is-visible'); }, 3200);
    });
  };

  /* ---------- Ambient : particules + aura ---------- */
  function initAmbient() {
    var canvas = document.getElementById('particles');
    if (canvas) {
      STU.particles = new STU.Particles(canvas, {
        density: document.body.dataset.particleDensity ? +document.body.dataset.particleDensity : 26000
      });
      STU.particles.start();
    }
    var aura = document.querySelector('.aura');
    if (aura) {
      if (STU.env.hasGSAP && !STU.env.reduced) {
        gsap.to(aura, { opacity: 1, duration: 2.6, ease: 'power2.out', delay: 0.4 });
      } else aura.style.opacity = '1';
    }
  }

  /* ---------- Boot ---------- */
  function boot() {
    try {
      if (STU.env.hasGSAP) gsap.registerPlugin(ScrollTrigger);
      /* Reduced motion → expérience statique cohérente (CSS de repli) */
      if (STU.env.reduced) html.classList.add('no-anim');

      var hasIntro = !!document.getElementById('intro');

      initSmoothScroll();
      initLinks();
      markCurrent();
      initMenu();
      initAmbient();
      STU.initCursor();
      STU.initReveals();
      STU.bindButtons();

      if (!hasIntro) {
        veilIn();
        STU.pageEnter();
      } else {
        if (veil) veil.style.display = 'none';
      }

      window.addEventListener('pageshow', function (e) {
        if (e.persisted && !document.getElementById('intro')) veilIn();
      });

      READY = true;
      document.dispatchEvent(new CustomEvent('stu:ready'));
    } catch (err) {
      html.classList.add('no-anim');
      unlock();
      throw err;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
