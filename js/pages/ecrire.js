/* ==========================================================================
   SI TU SAVAIS… — Éditeur de messages (/ecrire)
   Aperçu vivant, révélation cinématique, copier / partager / enregistrer
   ========================================================================== */
(function () {
  'use strict';

  var STU = window.STU;
  var form = document.getElementById('editor-form');
  if (!form) return;

  var can = STU.env.hasGSAP && !STU.env.reduced;

  var elMessage = document.getElementById('f-message');
  var elTo = document.getElementById('f-to');
  var elEmotion = document.getElementById('f-emotion');
  var elSignature = document.getElementById('f-signature');
  var elCount = document.getElementById('f-count');
  var elError = document.getElementById('f-message-error');
  var previewMsg = document.getElementById('preview-msg');
  var previewSign = document.getElementById('preview-sign');
  var previewEmotion = document.getElementById('preview-emotion');

  var scene = document.getElementById('reveal-scene');
  var sceneEmotion = document.getElementById('reveal-emotion');
  var sceneMsg = document.getElementById('reveal-msg');
  var sceneMeta = document.getElementById('reveal-meta');
  var actions = document.getElementById('reveal-actions');

  var editing = null;
  var lastFocus = null;
  var current = null;

  /* ---------- Mode édition (?id=…) & présélection (?emotion=…) ---------- */
  var params = new URLSearchParams(location.search);
  var editId = params.get('id');
  if (editId) {
    editing = STU.store.get(editId);
    if (editing) {
      elEmotion.value = editing.emotion;
      elTo.value = editing.to || '';
      elMessage.value = editing.message || '';
      elSignature.value = editing.signature || '';
    } else {
      STU.toast('Ce message n\u2019existe plus dans cet espace.');
    }
  } else if (params.get('emotion') && STU.EMOTIONS[params.get('emotion')]) {
    elEmotion.value = params.get('emotion');
  }

  function label() { return STU.EMOTIONS[elEmotion.value].label; }

  /* ---------- Aperçu vivant ---------- */
  function refreshPreview() {
    document.body.dataset.emotion = elEmotion.value;
    if (previewEmotion) previewEmotion.textContent = label();
    if (previewEmotion) previewEmotion.style.color = STU.EMOTIONS[elEmotion.value].color;
    if (elMessage.value.trim()) {
      previewMsg.textContent = elMessage.value;
    } else {
      previewMsg.innerHTML = '<span class="preview__placeholder">Ton message apparaîtra ici, doucement, pendant que tu écris…</span>';
    }
    previewSign.textContent = elSignature.value.trim() ? '— ' + elSignature.value.trim() : '';
    elCount.textContent = elMessage.value.length;
  }

  ['input', 'change'].forEach(function (evt) {
    form.addEventListener(evt, function (e) {
      if (e.target === elMessage) {
        elError.textContent = '';
        elMessage.removeAttribute('aria-invalid');
      }
      refreshPreview();
    });
  });
  refreshPreview();

  /* ---------- Texte partagé / copié ---------- */
  function composeText() {
    var parts = [];
    if (current.to) parts.push('Pour ' + current.to + '.');
    parts.push(current.message);
    var tail = [];
    if (current.signature) tail.push('— ' + current.signature);
    tail.push('(SI TU SAVAIS…)');
    return parts.join('\n\n') + '\n\n' + tail.join(' ');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ---------- Scène de révélation ---------- */
  function openScene() {
    current = {
      id: editing ? editing.id : undefined,
      emotion: elEmotion.value,
      to: elTo.value.trim(),
      message: elMessage.value.trim(),
      signature: elSignature.value.trim(),
      createdAt: editing ? editing.createdAt : undefined
    };

    sceneEmotion.textContent = label();
    sceneEmotion.style.color = STU.EMOTIONS[current.emotion].color;
    sceneMsg.textContent = current.message;
    var metaBits = [];
    if (current.to) metaBits.push('Pour ' + current.to);
    if (current.signature) metaBits.push('— ' + current.signature);
    sceneMeta.textContent = metaBits.join('  ');

    lastFocus = document.activeElement;
    scene.classList.add('is-open');
    document.documentElement.classList.add('is-locked');
    if (STU.lenis) STU.lenis.stop();
    if (STU.particles) STU.particles.disperse(4);

    if (can) {
      gsap.set(scene, { visibility: 'visible', opacity: 0 });
      var lines = STU.split.lines(sceneMsg);
      gsap.set(lines, { yPercent: 115 });
      gsap.set([sceneEmotion, sceneMeta], { opacity: 0 });
      gsap.set(actions.children, { opacity: 0, y: 22 });

      var tl = gsap.timeline({ defaults: { ease: STU.ease.cinema } });
      tl.to(scene, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
        .to(sceneEmotion, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.55)
        .to(lines, { yPercent: 0, duration: 1.7, stagger: 0.32 }, 0.8)
        .to(sceneMeta, { opacity: 1, duration: 1.1, ease: 'power2.out' }, '>-0.3')
        .to(actions.children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: STU.ease.soft }, '>-0.2')
        .call(function () { actions.querySelector('button').focus(); });
    } else {
      gsapSetVisibleStatic();
    }
  }

  function gsapSetVisibleStatic() {
    scene.style.visibility = 'visible';
    scene.style.opacity = '1';
    actions.querySelector('button').focus();
  }

  function closeScene() {
    function done() {
      scene.classList.remove('is-open');
      scene.style.visibility = 'hidden';
      document.documentElement.classList.remove('is-locked');
      if (STU.lenis) STU.lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (can) {
      gsap.to(scene, { opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: done });
    } else done();
  }

  /* ---------- Soumission ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!elMessage.value.trim()) {
      elError.textContent = 'Écris au moins quelques mots — même imparfaits.';
      elMessage.setAttribute('aria-invalid', 'true');
      elMessage.focus();
      return;
    }
    openScene();
  });

  /* ---------- Actions ---------- */
  actions.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.dataset.act;

    if (act === 'copy') {
      copyToClipboard(composeText()).then(function (ok) {
        STU.toast(ok ? 'Message copié dans le presse-papiers.' : 'Impossible de copier ici — sélectionne le texte manuellement.');
      });
    }

    if (act === 'share') {
      if (navigator.share) {
        navigator.share({ title: 'SI TU SAVAIS…', text: composeText() })
          .catch(function (err) { if (err && err.name !== 'AbortError') STU.toast('Le partage a été interrompu.'); });
      } else {
        copyToClipboard(composeText()).then(function () {
          STU.toast('Le partage n\u2019est pas disponible ici — le message a été copié à la place.');
        });
      }
    }

    if (act === 'save') {
      var saved = STU.store.save(current);
      if (saved) {
        editing = saved;
        current.id = saved.id;
        STU.toast('Confié à cet espace. À retrouver dans « Mes messages ».');
      } else {
        STU.toast('L\u2019enregistrement a échoué (stockage local indisponible).');
      }
    }

    if (act === 'edit') closeScene();

    if (act === 'restart') {
      editing = null;
      form.reset();
      if (params.get('emotion') && STU.EMOTIONS[params.get('emotion')]) elEmotion.value = params.get('emotion');
      refreshPreview();
      closeScene();
      STU.toast('Page blanche.');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scene.classList.contains('is-open')) closeScene();
  });
})();
