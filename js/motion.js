/* ==========================================================================
   SI TU SAVAIS… — Moteur de motion design
   Splits typographiques, révélations masquées, easings, helpers ScrollTrigger
   ========================================================================== */
(function () {
  'use strict';

  var STU = (window.STU = window.STU || {});

  /* ---------- Environnement ---------- */
  var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  STU.env = {
    hasGSAP: typeof window.gsap !== 'undefined',
    hasST: STU.env && STU.env.hasST,
    reduced: mqReduced.matches,
    finePointer: window.matchMedia('(pointer: fine)').matches,
    isSmall: window.matchMedia('(max-width: 720px)').matches
  };
  mqReduced.addEventListener && mqReduced.addEventListener('change', function (e) {
    STU.env.reduced = e.matches;
  });

  /* ---------- Identité motion : Premium / cinématique ----------
     Signature : expo.out (décélération longue)
     Durées : quick 0.5 / standard 1.05 / slow 1.6                          */
  STU.ease = { cinema: 'expo.out', soft: 'power3.out', inOut: 'power3.inOut', none: 'none' };
  STU.dur = { quick: 0.5, std: 1.05, slow: 1.6 };

  /* ---------- Découpage typographique ---------- */
  var _orig = new WeakMap();

  function eachTextNode(root, fn) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(fn);
  }

  function wrapWords(root) {
    eachTextNode(root, function (tn) {
      var frag = document.createDocumentFragment();
      tn.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          var s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  function wrapChars(root) {
    eachTextNode(root, function (tn) {
      var frag = document.createDocumentFragment();
      Array.from(tn.textContent).forEach(function (chr) {
        if (/\s/.test(chr)) { frag.appendChild(document.createTextNode(chr)); return; }
        var s = document.createElement('span');
        s.className = 'ch';
        s.textContent = chr;
        frag.appendChild(s);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  function restoreEl(el) {
    if (_orig.has(el)) {
      el.innerHTML = _orig.get(el);
      _orig.delete(el);
    }
    delete el.dataset.split;
  }

  /* Découpe en lignes masquées : .l > .l-in */
  function splitLinesEl(el) {
    if (el.dataset.split === 'lines') {
      return Array.prototype.slice.call(el.querySelectorAll(':scope > .l > .l-in'));
    }
    _orig.set(el, el.innerHTML);
    wrapWords(el);

    var elRect = el.getBoundingClientRect();
    var groups = [], lastKey = null, g = null;
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) {
          /* espace entre mots : conservé en fin de groupe (sinon les mots se collent) */
          if (g) g.nodes.push(node);
          return;
        }
        if (g) g.nodes.push(node);
        return;
      }
      var r = node.getBoundingClientRect();
      var key = Math.round((r.top - elRect.top) / 6);
      if (!g || key !== lastKey) {
        g = { nodes: [node] };
        groups.push(g);
        lastKey = key;
      } else {
        g.nodes.push(node);
      }
    });

    el.textContent = '';
    groups.forEach(function (gg) {
      var l = document.createElement('span'); l.className = 'l';
      var lin = document.createElement('span'); lin.className = 'l-in';
      gg.nodes.forEach(function (n) { lin.appendChild(n); });
      l.appendChild(lin);
      el.appendChild(l);
    });
    el.dataset.split = 'lines';
    return Array.prototype.slice.call(el.querySelectorAll(':scope > .l > .l-in'));
  }

  STU.split = {
    lines: splitLinesEl,
    words: function (el) {
      if (el.dataset.split !== 'words') { _orig.set(el, el.innerHTML); wrapWords(el); el.dataset.split = 'words'; }
      return Array.prototype.slice.call(el.querySelectorAll('.w'));
    },
    chars: function (el) {
      if (el.dataset.split !== 'chars') { _orig.set(el, el.innerHTML); wrapChars(el); el.dataset.split = 'chars'; }
      return Array.prototype.slice.call(el.querySelectorAll('.ch'));
    },
    restore: restoreEl
  };

  /* ---------- Révélations déclaratives [data-reveal] ---------- */
  var DEFAULTS = {
    lines:  { yPercent: 115, duration: 1.25, stagger: 0.12, ease: STU.ease.cinema },
    words:  { y: 26, opacity: 0, duration: 0.9, stagger: 0.055, ease: STU.ease.soft },
    chars:  { yPercent: 110, opacity: 0, duration: 1.0, stagger: 0.035, ease: STU.ease.cinema },
    fade:   { y: 34, opacity: 0, duration: 1.1, ease: STU.ease.cinema },
    up:     { y: 70, opacity: 0, duration: 1.35, ease: STU.ease.cinema },
    scale:  { scale: 0.96, opacity: 0, duration: 1.4, ease: STU.ease.cinema },
    blur:   { opacity: 0, filter: 'blur(10px)', y: 18, duration: 1.5, ease: STU.ease.soft }
  };

  function makeReveal(el) {
    var kind = el.dataset.reveal || 'fade';
    var conf = DEFAULTS[kind] || DEFAULTS.fade;
    var delay = parseFloat(el.dataset.revealDelay || 0);
    var targets, from;

    if (kind === 'lines') {
      targets = splitLinesEl(el);
      from = { yPercent: conf.yPercent };
    } else if (kind === 'words') {
      targets = STU.split.words(el);
      from = { y: conf.y, opacity: 0 };
    } else if (kind === 'chars') {
      targets = STU.split.chars(el);
      from = { yPercent: conf.yPercent, opacity: 0 };
    } else {
      targets = el;
      from = {};
      Object.keys(conf).forEach(function (k) {
        if (k !== 'duration' && k !== 'stagger' && k !== 'ease') from[k] = conf[k];
      });
    }

    var to = { duration: conf.duration, stagger: conf.stagger || 0, ease: conf.ease, delay: delay };
    Object.keys(from).forEach(function (k) {
      if (k === 'yPercent') to.yPercent = 0;
      else if (k === 'y') to.y = 0;
      else if (k === 'scale') to.scale = 1;
      else if (k === 'filter') to.filter = 'blur(0px)';
      else if (k === 'opacity') to.opacity = 1;
    });

    gsap.set(targets, from);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(targets, to);
        if (kind === 'lines' || kind === 'words' || kind === 'chars') {
          setTimeout(function () { restoreEl(el); }, (conf.duration + delay + (conf.stagger || 0) * (targets.length - 1)) * 1000 + 250);
        }
      }
    });
  }

  STU.initReveals = function (scope) {
    if (!STU.env.hasGSAP || !window.ScrollTrigger || STU.env.reduced) return;
    var els = (scope || document).querySelectorAll('[data-reveal]:not([data-reveal-done])');
    els.forEach(function (el) {
      el.dataset.revealDone = '1';
      try { makeReveal(el); } catch (e) { restoreEl(el); }
    });
  };

  /* Ré-revaluation après resize pour les splits non révélés */
  var rT;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (!window.ScrollTrigger) return;
      ScrollTrigger.refresh();
    }, 220);
  });

  /* ---------- Parallaxe légère ---------- */
  STU.parallax = function (el, amount) {
    if (!STU.env.hasGSAP || !window.ScrollTrigger || STU.env.reduced) return;
    gsap.fromTo(el,
      { y: amount },
      { y: -amount, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 1.1 } }
    );
  };

  /* ---------- Entrée de page standard (pages internes) ---------- */
  STU.pageEnter = function () {
    if (!STU.env.hasGSAP) return;
    var header = document.querySelector('.site-header');
    if (header) {
      if (STU.env.reduced) { gsap.set(header, { opacity: 1 }); return; }
      gsap.fromTo(header, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 1.1, ease: STU.ease.soft, delay: 0.35 });
    }
  };

  /* ---------- Bouton : micro-interaction ---------- */
  STU.bindButtons = function (scope) {
    if (!STU.env.hasGSAP || STU.env.reduced) return;
    (scope || document).querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointerenter', function () {
        gsap.fromTo(btn, { scale: 1 }, { scale: 1.015, duration: 0.45, ease: STU.ease.soft });
      });
      btn.addEventListener('pointerleave', function () {
        gsap.to(btn, { scale: 1, duration: 0.6, ease: STU.ease.cinema });
      });
    });
  };
})();
