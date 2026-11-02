/* ==========================================================================
   SI TU SAVAIS… — Stockage local des messages
   Tout reste dans le navigateur : rien n'est envoyé nulle part.
   ========================================================================== */
(function () {
  'use strict';

  var STU = (window.STU = window.STU || {});
  var KEY = 'stu.messages.v1';

  STU.EMOTIONS = {
    amour:     { index: 1, label: 'Amour',     color: '#D6A0AD', href: 'emotion-amour.html',
                 short: 'Ce que je n\u2019ai jamais osé te dire.' },
    regret:    { index: 2, label: 'Regret',    color: '#C4697E', href: 'emotion-regret.html',
                 short: 'Si seulement j\u2019avais trouvé les mots.' },
    nostalgie: { index: 3, label: 'Nostalgie', color: '#B9AECC', href: 'emotion-nostalgie.html',
                 short: 'Certaines absences ne vieillissent jamais.' },
    gratitude: { index: 4, label: 'Gratitude', color: '#E4C99B', href: 'emotion-gratitude.html',
                 short: 'Tu as changé quelque chose en moi.' },
    adieu:     { index: 5, label: 'Adieu',     color: '#A49AA5', href: 'emotion-adieu.html',
                 short: 'Tout ne peut pas rester.' }
  };
  STU.EMOTION_KEYS = Object.keys(STU.EMOTIONS);

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var val = JSON.parse(raw);
      return Array.isArray(val) ? val : [];
    } catch (e) { return []; }
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  function uid() {
    return (crypto && crypto.randomUUID) ? crypto.randomUUID()
      : 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  STU.store = {
    list: function () { return read().sort(function (a, b) { return b.createdAt - a.createdAt; }); },
    get: function (id) { return read().find(function (m) { return m.id === id; }) || null; },
    save: function (data) {
      var list = read();
      var msg = {
        id: data.id || uid(),
        emotion: data.emotion || 'amour',
        to: (data.to || '').slice(0, 80),
        message: (data.message || '').slice(0, 600),
        signature: (data.signature || '').slice(0, 80),
        createdAt: data.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      var i = list.findIndex(function (m) { return m.id === msg.id; });
      if (i >= 0) list[i] = msg; else list.unshift(msg);
      return write(list) ? msg : null;
    },
    remove: function (id) { return write(read().filter(function (m) { return m.id !== id; })); }
  };
})();
