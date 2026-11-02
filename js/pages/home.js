/* ==========================================================================
   SI TU SAVAIS… — Page d'accueil
   Entrée du héros, Silence épinglé, mots jamais envoyés, parallaxe
   ========================================================================== */
(function () {
  'use strict';

  var STU = window.STU;
  var canAnimate = STU.env.hasGSAP && !STU.env.reduced;

  /* ===================== HERO ===================== */
  function heroIn() {
    if (!canAnimate) return;
    var rows = document.querySelectorAll('.hero__title .hrow-in');
    var lines = document.querySelectorAll('[data-hero-line]');
    var cta = document.querySelector('[data-hero-cta]');
    var meta = document.querySelectorAll('.hero__index, .hero__meta, .hero__scroll');

    var tl = gsap.timeline({ defaults: { ease: STU.ease.cinema } });
    tl.fromTo(rows, { yPercent: 118 }, { yPercent: 0, duration: 1.55, stagger: 0.17 }, 0.1)
      .fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.12, ease: 'power2.out' }, 0.5)
      .fromTo(lines, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.25, stagger: 0.3, ease: STU.ease.soft }, 0.65)
      .fromTo(cta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, ease: STU.ease.soft }, 1.25);
  }

  if (STU.entered) heroIn();
  else document.addEventListener('stu:entered', heroIn, { once: true });

  /* Parallaxe du héros au défilement */
  if (canAnimate && window.ScrollTrigger) {
    gsap.to('.hero__title', {
      yPercent: -9, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero__sub', {
      yPercent: 22, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }

  /* Influence discrète du curseur sur la composition (desktop) */
  if (canAnimate && STU.env.finePointer) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var qx = gsap.quickTo('.hero__title', 'x', { duration: 1.1, ease: 'power3.out' });
      var qy = gsap.quickTo('.hero__title', 'y', { duration: 1.1, ease: 'power3.out' });
      var qix = gsap.quickTo('.hero__index', 'x', { duration: 1.4, ease: 'power3.out' });
      hero.addEventListener('pointermove', function (e) {
        var nx = e.clientX / window.innerWidth - 0.5;
        var ny = e.clientY / window.innerHeight - 0.5;
        qx(nx * 16); qy(ny * 10); qix(nx * -10);
      }, { passive: true });
    }
  }

  /* ===================== LE SILENCE — séquence épinglée ===================== */
  (function silence() {
    var sec = document.querySelector('.silence');
    if (!sec || !canAnimate || !window.ScrollTrigger) return;

    var aLines = STU.split.lines(sec.querySelector('[data-silence-a] .verse'));
    var bLines = STU.split.lines(sec.querySelector('[data-silence-b] .verse'));
    var aNum = sec.querySelector('[data-silence-a] .num');
    var bNum = sec.querySelector('[data-silence-b] .num');
    var rule = sec.querySelector('.silence__rule');

    gsap.set(aLines, { yPercent: 115 });
    gsap.set(bLines, { yPercent: 115 });
    gsap.set([aNum, bNum], { opacity: 0 });
    gsap.set(rule, { scaleY: 0 });

    var tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7 }
    });

    tl.to(aNum, { opacity: 0.7, duration: 0.06, ease: 'none' }, 0.02)
      .to(aLines, { yPercent: 0, duration: 0.13, stagger: 0.02, ease: 'none' }, 0.04)
      .to(rule, { scaleY: 1, duration: 0.1, ease: 'none' }, 0.14)
      .to(aLines, { yPercent: -115, duration: 0.1, stagger: 0.015, ease: 'none' }, 0.36)
      .to(aNum, { opacity: 0, duration: 0.06, ease: 'none' }, 0.36)
      .to(rule, { scaleY: 0, transformOrigin: 'bottom', duration: 0.08, ease: 'none' }, 0.37)
      .to(bNum, { opacity: 0.7, duration: 0.06, ease: 'none' }, 0.5)
      .to(bLines, { yPercent: 0, duration: 0.13, stagger: 0.02, ease: 'none' }, 0.52)
      .to(bLines, { opacity: 0.3, duration: 0.12, ease: 'none' }, 0.86);
  })();

  /* ===================== LES MOTS JAMAIS ENVOYÉS ===================== */
  (function unsent() {
    var stage = document.querySelector('[data-unsent-stage]');
    var next = document.querySelector('[data-unsent-next]');
    var count = document.querySelector('[data-unsent-count]');
    if (!stage || !next) return;

    var items = Array.prototype.slice.call(stage.querySelectorAll('.unsent__item'));
    var current = 0;
    var busy = false;

    /* Trois familles d'animation, cohérentes mais distinctes */
    var patterns = [
      { out: { y: -44, opacity: 0 }, in: { y: 44 } },
      { out: { opacity: 0, scale: 0.94 }, in: { scale: 1.06, y: 0 } },
      { out: { x: -52, opacity: 0 }, in: { x: 52, y: 0 } }
    ];

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    next.addEventListener('click', function () {
      if (busy || items.length < 2) return;
      var from = items[current];
      current = (current + 1) % items.length;
      var to = items[current];
      var p = patterns[current % patterns.length];

      if (count) count.textContent = pad(current + 1);

      if (!canAnimate) {
        from.classList.remove('is-active');
        to.classList.add('is-active');
        return;
      }

      busy = true;
      from.classList.add('is-active'); /* assure visibilité pendant la sortie */
      gsap.to(from, Object.assign({ duration: 0.8, ease: 'power2.in' }, p.out, {
        onComplete: function () {
          from.classList.remove('is-active');
          gsap.set(from, { clearProps: 'all' });
        }
      }));
      to.classList.add('is-active');
      var inVars = Object.assign({ opacity: 0 }, p.in);
      gsap.fromTo(to, inVars, {
        x: 0, y: 0, scale: 1, opacity: 1,
        duration: 1.05, ease: STU.ease.cinema, delay: 0.55,
        onComplete: function () { gsap.set(to, { clearProps: 'all' }); }
      });
      setTimeout(function () { busy = false; }, 900);
    });
  })();
})();
