/* ==========================================================================
   SI TU SAVAIS… — Introduction cinématique (5 actes)
   Acte 1 Le silence · Acte 2 La lumière · Acte 3 Le titre monumental
   Acte 4 La phrase émotionnelle · Acte 5 La transition finale
   ========================================================================== */
(function () {
  'use strict';

  var STU = window.STU;
  var intro = document.getElementById('intro');
  if (!intro) return;

  var html = document.documentElement;
  var SEEN_KEY = 'stu.intro.seen';
  var finished = false;

  /* ---------- Libération de la page ---------- */
  function finish() {
    if (finished) return;
    finished = true;
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}

    clearTimeout(guard);
    document.removeEventListener('keydown', onKey);

    intro.remove();
    html.classList.remove('is-locked');
    document.querySelectorAll('[data-suspend]').forEach(function (el) {
      el.removeAttribute('aria-hidden');
      try { el.removeAttribute('inert'); } catch (e) {}
    });
    if (STU.lenis) STU.lenis.start();
    if (STU.env.hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();

    STU.entered = true;
    document.dispatchEvent(new CustomEvent('stu:entered'));
    if (STU.env.hasGSAP) STU.pageEnter();
  }

  /* Mode dégradé : aucun blocage, accès immédiat */
  if (!STU.env.hasGSAP || STU.env.reduced) {
    finish();
    return;
  }

  /* ---------- Verrouillage de la page ---------- */
  html.classList.add('is-locked');
  ['site-header', 'menu-overlay', 'site-footer'].forEach(function (sel) {
    var el = document.querySelector('.' + sel);
    if (el) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('inert', ''); el.dataset.suspend = '1'; }
  });
  var main = document.getElementById('contenu');
  if (main) { main.setAttribute('aria-hidden', 'true'); main.setAttribute('inert', ''); main.dataset.suspend = '1'; }
  if (STU.lenis) STU.lenis.stop();
  window.scrollTo(0, 0);

  /* ---------- Références ---------- */
  var core = intro.querySelector('.intro__core');
  var phrase1Lines = intro.querySelectorAll('.intro__phrase--1 .iline > span');
  var phrase1 = intro.querySelector('.intro__phrase--1');
  var beam = intro.querySelector('.intro__beam');
  var fragsBox = intro.querySelector('.intro__fragments');
  var titleGroups = intro.querySelectorAll('.tg-in');
  var titleText = intro.querySelector('.intro-title-text');
  var glow = intro.querySelector('.intro__title .glow');
  var phrase2 = intro.querySelector('.intro__phrase2');
  var panels = intro.querySelectorAll('.intro__panel');
  var skipBtn = document.getElementById('intro-skip');
  var stage = intro.querySelector('.intro__stage');

  /* Particules propres à l'intro */
  var introCanvas = document.getElementById('intro-particles');
  var field = new STU.Particles(introCanvas, { density: 46000, max: 34, smallMax: 18, speed: [0.04, 0.14] });
  field.start();
  gsap.set(introCanvas, { opacity: 0 });

  /* Fragments typographiques : des pensées qui convergent */
  var WORDS = ['peur', 'silence', 'presque', 'hier', 'toujours', 'cœur', 'envie'];
  var frags = [];
  WORDS.forEach(function (w, i) {
    var el = document.createElement('span');
    el.className = 'intro__frag';
    el.textContent = w;
    var angle = (i / WORDS.length) * Math.PI * 2 - Math.PI / 2;
    var r = 16 + (i % 3) * 7; // vmin
    el.style.left = 'calc(50% + ' + (Math.cos(angle) * r) + 'vmin)';
    el.style.top = 'calc(50% + ' + (Math.sin(angle) * r * 0.62) + 'vmin)';
    el.style.transform = 'translate(-50%, -50%)';
    fragsBox.appendChild(el);
    frags.push({ el: el, angle: angle });
  });
  var fragEls = frags.map(function (f) { return f.el; });

  /* ---------- Timeline ---------- */
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  var breath = null;

  var seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}

  if (seen) {
    /* ------- Version courte (visites suivantes) ------- */
    tl.set(skipBtn, { opacity: 0.85 })
      .fromTo(core, { opacity: 0, scale: 0.3 }, { opacity: 0.9, scale: 1.05, duration: 0.6, ease: 'expo.out' }, 0)
      .to(introCanvas, { opacity: 1, duration: 1.0 }, 0)
      .fromTo(titleGroups, { yPercent: 118 }, { yPercent: 0, duration: 0.95, stagger: 0.1, ease: 'expo.out' }, 0.35)
      .fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.4)
      .to(titleGroups, { opacity: 0, yPercent: -30, duration: 0.7, ease: 'power2.in' }, 1.45)
      .to([glow, core], { opacity: 0, duration: 0.5 }, 1.5)
      .add(openPanels, 1.7)
      .add(finish, 2.75);
  } else {
    /* ------- Séquence complète (~9 s) ------- */
    tl
      /* ACTE 1 — LE SILENCE */
      .fromTo(core, { opacity: 0, scale: 0.25 }, { opacity: 1, scale: 1, duration: 1.35, ease: 'expo.out' }, 0.15)
      .call(function () {
        breath = gsap.to(core, { scale: 1.35, opacity: 0.8, duration: 1.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }, null, 1.4)
      .to(introCanvas, { opacity: 1, duration: 2.2, ease: 'power1.inOut' }, 0.7)
      .fromTo(phrase1Lines, { yPercent: 118 }, { yPercent: 0, duration: 1.3, stagger: 0.5, ease: 'expo.out' }, 1.05)
      .to(phrase1Lines, { yPercent: -118, duration: 0.85, stagger: 0.09, ease: 'power2.in' }, 3.35)
      .to(phrase1, { autoAlpha: 0, duration: 0.01 }, 4.15)
      .call(function () { if (breath) breath.kill(); }, null, 3.1)
      .to(core, { opacity: 0, scale: 0.55, duration: 0.9, ease: 'power2.in' }, 3.1)

      /* ACTE 2 — LA LUMIÈRE */
      .set(beam, { opacity: 1 }, 3.7)
      .fromTo(beam, { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: 'power2.inOut' }, 3.7)
      .to(beam, { opacity: 0, duration: 0.5 }, 4.75)
      .fromTo(fragEls,
        {
          opacity: 0,
          x: function (i) { return Math.cos(frags[i].angle) * (34 + (i % 4) * 12) + 'vw'; },
          y: function (i) { return Math.sin(frags[i].angle) * (20 + (i % 3) * 8) + 'vh'; }
        },
        { x: 0, y: 0, opacity: 0.6, duration: 1.5, stagger: 0.06, ease: 'expo.out' }, 3.8)
      .to(fragEls, { opacity: 0, duration: 0.45, ease: 'power1.in' }, 5.2)

      /* ACTE 3 — LE TITRE MONUMENTAL */
      .fromTo(titleGroups, { yPercent: 118 }, { yPercent: 0, duration: 1.4, stagger: 0.2, ease: 'expo.out' }, 5.3)
      .fromTo(titleText, { letterSpacing: '0.3em' }, { letterSpacing: '0.06em', duration: 2.1, ease: 'expo.out' }, 5.3)
      .fromTo(glow, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 2.0, ease: 'power2.out' }, 5.5)

      /* ACTE 4 — LA PHRASE ÉMOTIONNELLE */
      .fromTo(phrase2, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.35, ease: 'power2.out' }, 6.95)

      /* ACTE 5 — LA TRANSITION FINALE */
      .to(phrase2, { opacity: 0, y: -12, duration: 0.7, ease: 'power2.in' }, 8.55)
      .to(titleGroups, { yPercent: -14, opacity: 0.0, duration: 1.2, ease: 'power2.inOut' }, 8.7)
      .to(glow, { opacity: 0, scale: 1.15, duration: 1.0, ease: 'power2.in' }, 8.7)
      .call(function () { field.disperse(9); }, null, 8.75)
      .to(introCanvas, { opacity: 0, duration: 1.1 }, 8.8)
      .add(openPanels, 9.05)
      .add(finish, 10.1);
  }

  /* Ouverture des panneaux : on entre dans l'univers */
  function openPanels() {
    gsap.to(stage, { opacity: 0, duration: 0.4, ease: 'power1.in' });
    gsap.to(panels, {
      scaleY: 0,
      duration: 1.15,
      ease: 'expo.inOut',
      stagger: 0.07
    });
  }

  /* ---------- Contrôles ---------- */
  gsap.to(skipBtn, { opacity: 0.85, duration: 0.8, delay: 1.2, ease: 'power2.out' });
  if (skipBtn.focus) skipBtn.focus({ preventScroll: true });

  function skip() {
    if (finished) return;
    tl.kill();
    if (breath) breath.kill();
    gsap.killTweensOf(stage);
    openPanels();
    gsap.set(stage, { opacity: 0 });
    setTimeout(finish, 620);
  }

  skipBtn.addEventListener('click', skip);

  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' && document.activeElement === skipBtn) {
      if (e.key === 'Escape') { e.preventDefault(); skip(); }
    }
  }
  document.addEventListener('keydown', onKey);

  /* Garde-fou absolu : jamais bloqué au-delà de 16 s */
  var guard = setTimeout(skip, 16000);
})();
