/* ==========================================================================
   SI TU SAVAIS… — Pages émotion (univers distincts)
   Comportements spécifiques : amour (dérive organique), regret (lettres
   interrompues), nostalgie (profondeur/brume), gratitude (lumière qui
   s'ouvre), adieu (dispersion lente)
   ========================================================================== */
(function () {
  'use strict';

  var STU = window.STU;
  var can = STU.env.hasGSAP && !STU.env.reduced;
  var emotion = document.body.dataset.emotion || '';
  var hero = document.querySelector('.emotion-hero');
  if (!hero) return;

  /* ===================== Entrée générique ===================== */
  function enter() {
    if (!can) return;
    var name = hero.querySelector('.emotion-hero__name');
    var label = hero.querySelector('.emotion-hero__center > .small-caps');
    var phrase = hero.querySelector('.emotion-hero__phrase');
    var num = hero.querySelector('.emotion-hero__num');
    var hint = hero.querySelector('.emotion-hero__hint');

    var tl = gsap.timeline({ defaults: { ease: STU.ease.cinema } });

    /* REGRET — lettres éparpillées qui se rassemblent, mouvement interrompu */
    if (emotion === 'regret' && name) {
      var chars = STU.split.chars(name);
      gsap.set(chars, {
        x: function (i) { return Math.sin(i * 2.7) * 90; },
        y: function (i) { return Math.cos(i * 1.9) * 55; },
        rotation: function (i) { return Math.sin(i) * 8; },
        opacity: 0
      });
      tl.to(chars, {
        x: 0, y: 0, rotation: 0, opacity: 1,
        duration: 1.7, stagger: { each: 0.055, from: 'center' }, ease: 'expo.inOut'
      }, 0.35);
    } else if (name) {
      var rows = name.querySelectorAll('.hrow-in');
      if (rows.length) {
        tl.fromTo(rows, { yPercent: 118 }, { yPercent: 0, duration: 1.5, stagger: 0.16 }, 0.3);
      } else {
        tl.fromTo(name, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.5 }, 0.3);
      }
    }

    if (num) tl.fromTo(num, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.15);
    if (label) tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.6);
    if (phrase) {
      var lines = STU.split.lines(phrase);
      gsap.set(lines, { yPercent: 115 });
      tl.to(lines, { yPercent: 0, duration: 1.3, stagger: 0.14, ease: STU.ease.cinema }, 0.95);
    }
    if (hint) tl.fromTo(hint, { opacity: 0 }, { opacity: 0.8, duration: 1.4, ease: 'power2.out' }, 1.6);
  }

  if (STU.entered) enter();
  else document.addEventListener('stu:entered', enter, { once: true });
  if (!document.getElementById('intro') && !STU.entered) {
    /* pages internes : entrée après le voile */
    setTimeout(function () { if (!STU.entered) { STU.entered = true; enter(); } }, 300);
  }

  /* ===================== Ambiances propres ===================== */
  if (can && window.ScrollTrigger) {

    /* AMOUR — mots flottants, dérive organique */
    if (emotion === 'amour') {
      hero.querySelectorAll('.float-word').forEach(function (w, i) {
        gsap.to(w, {
          opacity: 0.5, duration: 2.4, ease: 'power2.out', delay: 1.4 + i * 0.3
        });
        gsap.to(w, {
          y: '+=' + (18 + (i % 3) * 10),
          x: '+=' + (10 - (i % 2) * 20),
          duration: 7 + i * 1.3,
          yoyo: true, repeat: -1, ease: 'sine.inOut'
        });
      });
    }

    /* NOSTALGIE — profondeur : couches à vitesses différentes */
    if (emotion === 'nostalgie') {
      document.querySelectorAll('[data-depth]').forEach(function (layer) {
        var amount = 60 + parseFloat(layer.dataset.depth || 1) * 70;
        gsap.fromTo(layer,
          { y: amount, opacity: 0.25 },
          { y: -amount, opacity: 0.6, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.4 } });
      });
    }

    /* GRATITUDE — la lumière s'ouvre avec le défilement */
    if (emotion === 'gratitude') {
      var light = hero.querySelector('.gratitude-light');
      if (light) {
        gsap.fromTo(light,
          { scale: 0.45, opacity: 0.15 },
          { scale: 1, opacity: 0.75, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
      }
    }

    /* REGRET — une ligne interrompt la page au défilement */
    if (emotion === 'regret') {
      document.querySelectorAll('.regret-cut').forEach(function (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
        ScrollTrigger.create({
          trigger: line, start: 'top 78%', once: true,
          onEnter: function () {
            gsap.to(line, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' });
          }
        });
      });
    }

    /* ADIEU — les lettres s'écartent lentement, tout s'efface */
    if (emotion === 'adieu') {
      var farewell = document.querySelector('.adieu-disperse');
      if (farewell) {
        gsap.fromTo(farewell,
          { letterSpacing: '0.02em', opacity: 0.9 },
          { letterSpacing: '0.42em', opacity: 0.12, ease: 'none',
            scrollTrigger: { trigger: farewell, start: 'top 75%', end: 'bottom 35%', scrub: 1 } });
      }
    }

    /* Parallaxe douce du nom monumental (toutes les pages) */
    var nameEl = hero.querySelector('.emotion-hero__name');
    if (nameEl) {
      gsap.to(nameEl, {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }
  }
})();
