/* ==========================================================================
   SI TU SAVAIS… — Curseur personnalisé
   Point instantané + cercle à inertie ; états hover / texte / hors-champ
   Desktop uniquement (pointeur fin), désactivé si reduced motion
   ========================================================================== */
(function () {
  'use strict';

  var STU = (window.STU = window.STU || {});

  STU.initCursor = function () {
    if (!STU.env.finePointer || STU.env.reduced) return;
    if (typeof window.gsap === 'undefined') return;

    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-cursor');

    var x = -100, y = -100, rx = -100, ry = -100, seen = false;
    var HOVER = 'a, button, [role="button"], .filter-btn, input, select, textarea, label, summary';
    var TEXT = 'input[type="text"], input[type="email"], textarea';

    document.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!seen) {
        seen = true;
        rx = x; ry = y;
        gsap.to([dot, ring], { opacity: 1, duration: 0.5, ease: 'power2.out' });
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      document.documentElement.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', function () {
      if (seen) document.documentElement.classList.remove('cursor-hidden');
    });

    document.addEventListener('mouseover', function (e) {
      var root = document.documentElement;
      var t = e.target.closest ? e.target.closest(HOVER) : null;
      root.classList.toggle('cursor-hover', !!t);
      var isText = !!(e.target.closest && e.target.closest(TEXT));
      root.classList.toggle('cursor-text', isText);
    });

    (function loop() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  };
})();
