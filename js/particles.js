/* ==========================================================================
   SI TU SAVAIS… — Particules émotionnelles (Canvas)
   Fragments de souvenirs : flottement lent, opacité vivante, répulsion douce
   ========================================================================== */
(function () {
  'use strict';

  var STU = (window.STU = window.STU || {});

  function makeSprite(color) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, color);
    g.addColorStop(0.35, color.replace(/[\d.]+\)$/, '0.35)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return c;
  }

  function ParticleField(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = Object.assign({
      density: 26000,     // px² par particule
      max: 80, min: 14,
      smallMax: 32,       // plafond mobile
      pinkRatio: 0.18,
      size: [4, 14],      // taille sprite px (rendu doux)
      speed: [0.06, 0.22],
      repel: 110
    }, opts || {});

    this.sprites = {
      white: makeSprite('rgba(245,240,233,1)'),
      pink: makeSprite('rgba(214,160,173,1)')
    };
    this.mouse = { x: -9999, y: -9999 };
    this.parts = [];
    this.raf = null;
    this.running = false;

    this._resize = this._resize.bind(this);
    this._frame = this._frame.bind(this);
    this._onMove = this._onMove.bind(this);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(this._resize, 180);
    }.bind(this));
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) this.pause(); else this.resume();
    }.bind(this));
    if (STU.env.finePointer) {
      window.addEventListener('pointermove', this._onMove, { passive: true });
    }

    this._resize();
  }

  ParticleField.prototype._resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var cap = this.opts.max;
    if (this.w < 720) cap = Math.min(cap, this.opts.smallMax);
    var target = Math.max(this.opts.min, Math.min(cap, Math.round((this.w * this.h) / this.opts.density)));
    while (this.parts.length < target) this.parts.push(this._spawn());
    this.parts.length = target;
  };

  ParticleField.prototype._spawn = function () {
    var o = this.opts;
    var s = o.size[0] + Math.random() * (o.size[1] - o.size[0]);
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(o.speed[0] + Math.random() * (o.speed[1] - o.speed[0])),
      s: s,
      base: 0.08 + Math.random() * 0.3,
      alpha: 0,
      phase: Math.random() * Math.PI * 2,
      freq: 0.3 + Math.random() * 0.7,
      pink: Math.random() < o.pinkRatio,
      rx: 0, ry: 0 // répulsion transitoire
    };
  };

  ParticleField.prototype._onMove = function (e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  };

  ParticleField.prototype._frame = function () {
    if (!this.running) return;
    var ctx = this.ctx, o = this.opts, m = this.mouse, t = performance.now() / 1000;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < this.parts.length; i++) {
      var p = this.parts[i];
      p.phase += p.freq * 0.016;
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.y += p.vy;

      /* répulsion douce autour du curseur */
      var dx = p.x - m.x, dy = p.y - m.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < o.repel * o.repel && d2 > 1) {
        var d = Math.sqrt(d2);
        var f = (1 - d / o.repel) * 1.4;
        p.rx += (dx / d) * f;
        p.ry += (dy / d) * f;
      }
      p.rx *= 0.92; p.ry *= 0.92;
      var px = p.x + p.rx, py = p.y + p.ry;

      if (py < -30) { p.y = this.h + 20; p.x = Math.random() * this.w; }
      if (px < -30) p.x = this.w + 20;
      if (px > this.w + 30) p.x = -20;

      p.alpha = p.base * (0.55 + 0.45 * Math.sin(p.phase * 1.7 + i));
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      var sz = p.s;
      ctx.drawImage(p.pink ? this.sprites.pink : this.sprites.white, px - sz / 2, py - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    this.raf = requestAnimationFrame(this._frame);
  };

  ParticleField.prototype.start = function () {
    if (this.running || STU.env.reduced) return;
    this.running = true;
    this.raf = requestAnimationFrame(this._frame);
  };

  ParticleField.prototype.pause = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  };

  ParticleField.prototype.resume = function () {
    if (!this.running && !document.hidden) this.start();
  };

  /* Dispersion cinématique lors des transitions */
  ParticleField.prototype.disperse = function (strength) {
    if (STU.env.reduced) return;
    var k = strength || 6;
    var cx = this.w / 2, cy = this.h / 2;
    this.parts.forEach(function (p) {
      var dx = p.x - cx, dy = p.y - cy;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      p.rx += (dx / d) * k * (0.5 + Math.random());
      p.ry += (dy / d) * k * (0.5 + Math.random());
    });
  };

  STU.Particles = ParticleField;
})();
