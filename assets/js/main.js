/* Page behaviour: gallery filter, lightbox, resource hub search, CV scroll spy,
   scroll reveal, count-up. Header, footer, nav and theme live in chrome.js. */
(function () {
  'use strict';

  /* ------------------------------------------------------- gallery filter */
  document.querySelectorAll('.gallery-toolbar').forEach(function (bar) {
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      bar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.gallery .g-item').forEach(function (item) {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ------------------------------------------------------------- lightbox */
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbVisual = lb.querySelector('.lb-visual');
    var lbTitle = lb.querySelector('.lb-title');
    var lbMeta = lb.querySelector('.lb-meta');
    var lbDesc = lb.querySelector('.lb-desc');
    var lastFocus = null;

    var close = function () {
      lb.classList.remove('open');
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('.g-item').forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      var open = function () {
        lastFocus = item;
        lbVisual.innerHTML = item.querySelector('.g-thumb').innerHTML;
        lbTitle.textContent = item.dataset.title || '';
        lbMeta.textContent = item.dataset.meta || '';
        lbDesc.textContent = item.dataset.desc || '';
        lb.classList.add('open');
        lb.querySelector('.lb-close').focus();
      };
      item.addEventListener('click', open);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
  }

  /* --------------------------------------- resource hub: search + category */
  var hub = document.querySelector('.hub-filter');
  var resourceList = document.querySelector('.resource-list');
  if (hub && resourceList) {
    var search = hub.querySelector('input[type="search"]');
    var resources = Array.prototype.slice.call(resourceList.querySelectorAll('.resource'));
    var activeCat = 'all';
    var empty = document.createElement('p');
    empty.className = 'note center mt-24';
    empty.textContent = 'No resources match that search yet. Try a broader term, or ask me directly.';
    empty.hidden = true;
    resourceList.after(empty);

    var apply = function () {
      var q = (search && search.value || '').trim().toLowerCase();
      var shown = 0;
      resources.forEach(function (item) {
        var catOk = activeCat === 'all' || item.dataset.cat === activeCat;
        var textOk = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        var visible = catOk && textOk;
        item.hidden = !visible;
        if (visible) shown++;
      });
      empty.hidden = shown !== 0;
    };

    hub.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      hub.querySelectorAll('button[data-cat]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      apply();
    });
    if (search) search.addEventListener('input', apply);
  }

  /* -------------------------------------------------------- CV scroll spy */
  var cvNav = document.querySelector('.cv-nav');
  if (cvNav && 'IntersectionObserver' in window) {
    var links = cvNav.querySelectorAll('a[href^="#"]');
    var map = new Map();
    links.forEach(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) map.set(el, a);
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var a = map.get(en.target);
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    map.forEach(function (_, el) { spy.observe(el); });
  }

  /* ---------------------------------------------------------- reveal + count */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll([
    '.tl-item', '.card', '.g-item', '.project-card', '.consult-card',
    '.resource', '.stat', '.tool-chip', '.field-item', '.pub', '.conf',
    '.cv-section', '.section-head', '.callout'
  ].join(','));

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  var animateCount = function (el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    var target = parseFloat(match[1]);
    if (isNaN(target)) return;
    var suffix = match[2] || '';
    var decimals = (match[1].split('.')[1] || '').length;
    var dur = 1100;
    var start = performance.now();
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = match[1] + suffix;
    };
    requestAnimationFrame(step);
  };

  var countTargets = document.querySelectorAll('.hero-meta strong, .stat .n');
  if (countTargets.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    countTargets.forEach(function (el) { countIO.observe(el); });
  }
})();
