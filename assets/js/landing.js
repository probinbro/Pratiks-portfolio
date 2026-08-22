/* ==========================================================================
   Pratik Mojumder — Landing page behaviour
   1. Hero canvas: a raster scene that classifies itself into land-cover
   2. Scroll reveals, counters, bento spotlight, scroll progress
   Everything degrades cleanly under prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====================================================== 1. HERO CANVAS */
  /* Land-cover classes, coloured the way a supervised classification would
     render them: vegetation, cropland, water, bare earth, built-up. */
  var CLASSES = [
    [74, 222, 128],   // vegetation
    [34, 160, 94],    // dense forest
    [56, 189, 248],   // water
    [216, 160, 106],  // bare earth
    [148, 163, 184],  // built-up
    [251, 191, 36]    // heat / stressed
  ];
  /* Weighted draw so the scene reads mostly green with water and urban
     accents, rather than looking like uniform confetti. */
  var WEIGHTS = [0.34, 0.22, 0.14, 0.12, 0.11, 0.07];

  function pickClass() {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < WEIGHTS.length; i++) {
      acc += WEIGHTS[i];
      if (r <= acc) return i;
    }
    return 0;
  }

  var canvas = document.getElementById('lp-canvas');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d', { alpha: true });
    var CELL = 26, GAP = 2;
    var cols = 0, rows = 0, cells = [], dpr = 1;
    var pointer = { x: -9999, y: -9999 };
    var raf = null, t0 = performance.now();

    function build() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(rect.width / CELL) + 1;
      rows = Math.ceil(rect.height / CELL) + 1;
      cells = new Array(cols * rows);

      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var cls = pickClass();
          cells[y * cols + x] = {
            x: x, y: y,
            cls: cls,
            /* Diagonal wave delay — the scene resolves like a satellite pass */
            delay: (x * 14) + (y * 26) + Math.random() * 320,
            /* Each cell re-classifies on its own slow cycle */
            next: 3200 + Math.random() * 7000,
            base: 0.16 + Math.random() * 0.5
          };
        }
      }
    }

    function draw(now) {
      var elapsed = now - t0;
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        if (elapsed < c.delay) continue;

        var age = elapsed - c.delay;
        /* Fade in over 700ms after this cell's turn arrives */
        var intro = Math.min(age / 700, 1);

        /* Periodic re-classification keeps the field alive */
        if (age > c.next) {
          c.cls = pickClass();
          c.base = 0.16 + Math.random() * 0.5;
          c.next = age + 3200 + Math.random() * 7000;
        }

        var px = c.x * CELL;
        var py = c.y * CELL;

        /* Cursor proximity lifts nearby cells, like a query cursor on a raster */
        var dx = pointer.x - (px + CELL / 2);
        var dy = pointer.y - (py + CELL / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        var near = dist < 190 ? (1 - dist / 190) : 0;

        /* Slow breathing so the grid never looks static */
        var breathe = 0.06 * Math.sin(elapsed / 1900 + c.x * 0.35 + c.y * 0.22);

        var alpha = (c.base + breathe + near * 0.75) * intro;
        if (alpha <= 0.01) continue;

        var col = CLASSES[c.cls];
        var size = CELL - GAP + near * 2;

        ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + Math.min(alpha, 0.95) + ')';
        ctx.fillRect(px - near, py - near, size, size);
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      build();
      t0 = performance.now();
      raf = requestAnimationFrame(draw);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 220);
    });

    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    });
    canvas.addEventListener('pointerleave', function () {
      pointer.x = pointer.y = -9999;
    });

    /* Pause the loop when the hero scrolls out of view or the tab is hidden */
    var hero = canvas.closest('.lp-hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(draw);
          } else if (raf) {
            cancelAnimationFrame(raf); raf = null;
          }
        });
      }, { threshold: 0.01 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && !raf) { raf = requestAnimationFrame(draw); }
    });

    start();
  }

  /* ================================================ 2. HEADLINE REVEAL */
  /* Split the headline into per-word masks so each word rises on its own.
     Walk the DOM rather than the HTML string: splitting innerHTML on spaces
     would tear inline markup like <em class="ink">from orbit</em> in half. */
  var headline = document.querySelector('[data-split]');
  if (headline) {
    var order = 0;

    var splitNode = function (node) {
      /* Copy the child list first — we mutate it as we go */
      var kids = Array.prototype.slice.call(node.childNodes);

      kids.forEach(function (child) {
        if (child.nodeType === 3) {                 // text node
          var words = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();

          words.forEach(function (chunk) {
            if (chunk === '') return;
            if (/^\s+$/.test(chunk)) {              // keep the original spacing
              frag.appendChild(document.createTextNode(chunk));
              return;
            }
            var mask = document.createElement('span');
            mask.className = 'w';
            var inner = document.createElement('span');
            inner.textContent = chunk;
            inner.style.animationDelay = (0.12 + order * 0.075).toFixed(3) + 's';
            order++;
            mask.appendChild(inner);
            frag.appendChild(mask);
          });

          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {          // element: recurse into it
          splitNode(child);
        }
      });
    };

    splitNode(headline);
  }

  /* ================================================== 3. SCROLL REVEAL */
  var risers = document.querySelectorAll('.lp-rise');
  if ('IntersectionObserver' in window && !reduce) {
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    risers.forEach(function (el) { revealIO.observe(el); });
  } else {
    risers.forEach(function (el) { el.classList.add('in'); });
  }

  /* Bento cells get an 'in' class of their own so the bar chart can grow */
  var cells2 = document.querySelectorAll('.lp-cell');
  if ('IntersectionObserver' in window) {
    var cellIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    cells2.forEach(function (el) { cellIO.observe(el); });
  } else {
    cells2.forEach(function (el) { el.classList.add('in'); });
  }

  /* =============================================== 4. COUNT-UP NUMBERS */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    if (isNaN(target)) return;
    var dur = 1400, start = performance.now();
    (function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    })(start);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = parseFloat(el.dataset.count).toFixed((el.dataset.count.split('.')[1] || '').length) + (el.dataset.suffix || '');
      });
    } else {
      var countIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIO.observe(el); });
    }
  }

  /* ============================================== 5. BENTO SPOTLIGHT */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.lp-cell').forEach(function (cell) {
      cell.addEventListener('pointermove', function (e) {
        var r = cell.getBoundingClientRect();
        cell.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        cell.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* =============================================== 6. SCROLL PROGRESS */
  var bar = document.getElementById('lp-progress');
  if (bar) {
    var ticking = false;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
