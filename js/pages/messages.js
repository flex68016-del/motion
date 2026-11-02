/* ==========================================================================
   SI TU SAVAIS… — Mes messages (/mes-messages)
   Liste locale, filtres par émotion, lecture, modification, suppression
   ========================================================================== */
(function () {
  'use strict';

  var STU = window.STU;
  var container = document.getElementById('messages-list');
  if (!container) return;

  var can = STU.env.hasGSAP && !STU.env.reduced;
  var emptyState = document.getElementById('empty-state');
  var filter = 'all';

  var reader = document.getElementById('reader');
  var readerEmotion = document.getElementById('reader-emotion');
  var readerMsg = document.getElementById('reader-msg');
  var readerMeta = document.getElementById('reader-meta');
  var readerEdit = document.getElementById('reader-edit');
  var readerDelete = document.getElementById('reader-delete');
  var readerClose = document.getElementById('reader-close');
  var readerConfirm = document.getElementById('reader-confirm');
  var readerActions = document.getElementById('reader-actions');

  var currentMsg = null;
  var confirmArmed = false;
  var confirmTimer = null;
  var lastFocus = null;

  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return ''; }
  }

  /* ---------- Rendu de la liste ---------- */
  function render(animate) {
    var all = STU.store.list();
    var rows = all.filter(function (m) { return filter === 'all' || m.emotion === filter; });

    container.textContent = '';
    emptyState.hidden = all.length > 0;

    if (all.length && !rows.length) {
      var note = document.createElement('p');
      note.className = 'meta';
      note.style.padding = '3rem 0';
      note.textContent = 'Rien de confié sous cette émotion — pour l\u2019instant.';
      container.appendChild(note);
    }

    rows.forEach(function (m, i) {
      var meta = STU.EMOTIONS[m.emotion] || STU.EMOTIONS.amour;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msg-row';
      btn.style.setProperty('--msg-accent', meta.color);
      btn.setAttribute('aria-label', 'Lire le message ' + meta.label + ' du ' + fmtDate(m.createdAt));

      var emo = document.createElement('span');
      emo.className = 'small-caps msg-row__emotion';
      emo.textContent = meta.label;

      var ex = document.createElement('p');
      ex.className = 'msg-row__excerpt';
      var text = m.message.replace(/\s+/g, ' ').trim();
      ex.textContent = '« ' + (text.length > 72 ? text.slice(0, 72) + '…' : text) + ' »';

      var mt = document.createElement('span');
      mt.className = 'msg-row__meta';
      mt.textContent = fmtDate(m.createdAt) + (m.signature ? ' · ' + m.signature : '');

      btn.appendChild(emo);
      btn.appendChild(ex);
      btn.appendChild(mt);
      btn.addEventListener('click', function () { openReader(m); });
      container.appendChild(btn);
    });

    if (can && animate && rows.length) {
      gsap.fromTo(container.querySelectorAll('.msg-row'),
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: STU.ease.cinema, clearProps: 'all' });
    }
  }

  /* ---------- Filtres ---------- */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render(true);
    });
  });

  /* ---------- Lecture plein écran ---------- */
  function openReader(m) {
    currentMsg = m;
    disarmConfirm();
    var meta = STU.EMOTIONS[m.emotion] || STU.EMOTIONS.amour;
    readerEmotion.textContent = meta.label;
    readerEmotion.style.color = meta.color;
    readerMsg.textContent = m.message;
    readerMeta.textContent = [m.to ? 'Pour ' + m.to : '', fmtDate(m.createdAt), m.signature ? '— ' + m.signature : '']
      .filter(Boolean).join('  ');
    readerEdit.href = 'ecrire.html?id=' + encodeURIComponent(m.id);

    lastFocus = document.activeElement;
    reader.classList.add('is-open');
    document.documentElement.classList.add('is-locked');
    if (STU.lenis) STU.lenis.stop();

    if (can) {
      gsap.set(reader, { visibility: 'visible', opacity: 0 });
      var lines = STU.split.lines(readerMsg);
      gsap.set(lines, { yPercent: 115 });
      gsap.set([readerEmotion, readerMeta], { opacity: 0 });
      gsap.set(readerActions.children, { opacity: 0, y: 22 });
      gsap.timeline({ defaults: { ease: STU.ease.cinema } })
        .to(reader, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0)
        .to(readerEmotion, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.35)
        .to(lines, { yPercent: 0, duration: 1.5, stagger: 0.3 }, 0.5)
        .to(readerMeta, { opacity: 1, duration: 1.0, ease: 'power2.out' }, '>-0.25')
        .to(readerActions.children, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: STU.ease.soft }, '>-0.2')
        .call(function () { readerClose.focus(); });
    } else {
      reader.style.visibility = 'visible';
      reader.style.opacity = '1';
      readerClose.focus();
    }
  }

  function closeReader() {
    function done() {
      reader.classList.remove('is-open');
      reader.style.visibility = 'hidden';
      document.documentElement.classList.remove('is-locked');
      if (STU.lenis) STU.lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    disarmConfirm();
    if (can) {
      gsap.to(reader, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: done });
    } else done();
  }

  function disarmConfirm() {
    confirmArmed = false;
    clearTimeout(confirmTimer);
    readerConfirm.textContent = '';
    readerDelete.querySelector('.btn-line').textContent = 'Supprimer';
  }

  readerClose.addEventListener('click', closeReader);

  readerDelete.addEventListener('click', function () {
    if (!confirmArmed) {
      confirmArmed = true;
      readerConfirm.textContent = 'Supprimer définitivement ce message ?';
      readerDelete.querySelector('.btn-line').textContent = 'Oui, supprimer';
      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(disarmConfirm, 5000);
      return;
    }
    var gone = currentMsg;
    STU.store.remove(gone.id);
    function after() {
      closeReader();
      render(true);
      STU.toast('Message supprimé de cet espace.');
    }
    if (can) {
      gsap.to(reader.querySelectorAll('.reveal-scene__body'), {
        opacity: 0, y: -18, duration: 0.5, ease: 'power2.in', onComplete: function () {
          gsap.set(reader.querySelectorAll('.reveal-scene__body'), { clearProps: 'all' });
          after();
        }
      });
    } else after();
  });

  document.addEventListener('keydown', function (e) {
    if (!reader.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeReader(); return; }
    /* focus piégé dans le dialogue */
    if (e.key === 'Tab') {
      var focusables = reader.querySelectorAll('button, a[href]');
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  render(false);
})();
