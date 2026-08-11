/* ==========================================================================
   Pratik Mojumder - Universal site chrome
   Renders the same header and footer on every page, including the research
   microsites. Edit here once; all twelve pages follow.

   Usage - immediately after <body>:
     <script src="assets/js/chrome.js" data-page="research"></script>
   Research microsites (two levels deep, permanently dark):
     <script src="../../assets/js/chrome.js" data-base="../../"
             data-page="research" data-scheme="dark"></script>
   ========================================================================== */
(function () {
  'use strict';

  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';
  var page = (script && script.getAttribute('data-page')) || '';
  var scheme = (script && script.getAttribute('data-scheme')) || '';
  var isMicrosite = scheme === 'dark';

  var EMAIL = 'pratikmojumdar@gmail.com';

  var NAV = [
    { key: 'home',       label: 'Home',       href: 'index.html' },
    { key: 'research',   label: 'Research',   href: 'research.html' },
    { key: 'gallery',    label: 'Gallery',    href: 'gallery.html' },
    { key: 'cv',         label: 'CV',         href: 'cv.html' },
    { key: 'consulting', label: 'Consulting', href: 'consulting.html' },
    { key: 'resources',  label: 'Resources',  href: 'resources.html' }
  ];

  /* Academic and social presence - the canonical list for the whole site. */
  var LINKS = [
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=0yx6yC0AAAAJ&hl=en',
      path: 'M12 2L1 8l11 6 9-4.9V16h2V8L12 2zM5 13.2V17c0 2.2 3.1 4 7 4s7-1.8 7-4v-3.8l-7 3.8-7-3.8z' },
    { label: 'ORCID', href: 'https://orcid.org/0009-0006-8573-2447',
      path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zM7.4 17.7H5.9V7.6h1.5v10.1zM6.6 6.4a.95.95 0 110-1.9.95.95 0 010 1.9zm5.5 11.3H9.4V7.6h3c2.9 0 4.6 2.1 4.6 5.1 0 3.1-1.9 5-4.9 5zm-1.2-8.8v7.5h1.1c2.1 0 3.4-1.3 3.4-3.7 0-2.3-1.2-3.8-3.4-3.8h-1.1z' },
    { label: 'Scopus', href: 'https://www.scopus.com/authid/detail.uri?authorId=58758981200',
      path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm2.7 6.1c-.7-.5-1.6-.8-2.6-.8-1.6 0-2.6.8-2.6 1.9 0 1 .7 1.5 2.4 2 2.2.6 3.4 1.5 3.4 3.3 0 2-1.6 3.4-4.2 3.4-1.2 0-2.5-.4-3.2-.9l.5-1.4c.7.5 1.8.9 2.8.9 1.6 0 2.5-.8 2.5-1.9s-.6-1.6-2.2-2.1c-2.2-.7-3.5-1.6-3.5-3.3 0-1.9 1.6-3.3 4-3.3 1.2 0 2.2.3 2.9.7l-.2 1.5z' },
    { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Pratik-Mojumder',
      path: 'M19.6 0H4.4A4.4 4.4 0 000 4.4v15.2A4.4 4.4 0 004.4 24h15.2a4.4 4.4 0 004.4-4.4V4.4A4.4 4.4 0 0019.6 0zM8.2 17.3c-1.5 0-2.6-.5-3.3-1.5-.5-.8-.8-1.8-.8-3.2V9.9c0-1.5.3-2.6.9-3.4.7-.9 1.8-1.4 3.2-1.4 1.2 0 2.1.3 2.8.9.6.6 1 1.4 1.1 2.4h-1.6c-.2-1.2-.9-1.8-2.2-1.8-.9 0-1.5.3-1.9.9-.3.5-.5 1.3-.5 2.4v2.7c0 1.1.2 1.9.6 2.4.4.5 1 .8 1.9.8.8 0 1.4-.2 1.8-.6.4-.4.6-1 .6-1.8v-.9H8.3v-1.4h4v2.1c0 1.3-.4 2.3-1.1 3-.7.7-1.7 1.1-3 1.1zm10.6 1.6-2.5-4.1h-1.5v4.1h-1.6V9.1h3.4c1 0 1.8.3 2.4.8.6.5.9 1.3.9 2.2 0 1.4-.7 2.3-2 2.7l2.7 4.1h-1.8zm-1.7-8.4h-2.3v3h2.2c1.1 0 1.7-.5 1.7-1.5s-.5-1.5-1.6-1.5z' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pratikmojumder/',
      path: 'M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66V19z' },
    { label: 'GitHub', href: 'https://github.com/pratikmojumder',
      path: 'M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .5z' },
    { label: 'WhatsApp', href: 'https://wa.me/8801835477701',
      path: 'M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.3.2-.6.1a8.2 8.2 0 01-2.4-1.5 9 9 0 01-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5H7.8c-.2 0-.5.1-.8.4a3.4 3.4 0 00-1 2.5 5.9 5.9 0 001.2 3.1c.1.2 2.1 3.2 5.1 4.5a17 17 0 001.7.6 4.1 4.1 0 001.9.1 3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.1-.3-.2-.6-.4zM12 0a12 12 0 00-10.3 18L0 24l6.2-1.6A12 12 0 1012 0zm0 22a10 10 0 01-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1112 22z' },
    { label: 'Email', href: 'mailto:' + EMAIL,
      path: 'M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z' }
  ];

  function url(href) {
    /* Absolute, mail and anchor targets pass through untouched. */
    return /^(https?:|mailto:|#)/.test(href) ? href : base + href;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function navHTML() {
    return NAV.map(function (item) {
      var active = item.key === page ? ' class="is-active"' : '';
      return '<a href="' + esc(url(item.href)) + '"' + active + '>' + esc(item.label) + '</a>';
    }).join('');
  }

  function icon(path) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  /* ---------------------------------------------------------------- header */
  function headerHTML() {
    return '' +
    '<div class="pm-chrome"' + (isMicrosite ? ' data-pm-scheme="dark"' : '') + '>' +
      '<header class="pm-header" id="pmHeader">' +
        '<div class="pm-shell">' +
          '<a class="pm-brand" href="' + esc(url('index.html')) + '" aria-label="Pratik Mojumder - home">' +
            '<span class="pm-mark">PM</span>' +
            '<span class="pm-brand-text">' +
              '<span class="pm-brand-name">Pratik Mojumder</span>' +
              '<span class="pm-brand-role">Environmental Research</span>' +
            '</span>' +
          '</a>' +
          '<nav class="pm-nav" aria-label="Primary">' + navHTML() + '</nav>' +
          '<div class="pm-actions">' +
            '<button class="pm-icon-btn pm-theme" id="pmTheme" type="button" aria-label="Toggle dark mode" aria-pressed="false">' +
              '<svg class="pm-ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>' +
              '<svg class="pm-ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
            '</button>' +
            '<a class="pm-cta" href="mailto:' + EMAIL + '?subject=Let%27s%20talk" aria-label="Email Pratik Mojumder">' +
              '<svg class="pm-cta-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>' +
              '<span>Let\'s talk</span>' +
            '</a>' +
            '<button class="pm-icon-btn pm-burger" id="pmBurger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="pmDrawer">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<nav class="pm-drawer" id="pmDrawer" aria-label="Mobile">' + navHTML() + '</nav>' +
      '</header>' +
    '</div>';
  }

  /* ---------------------------------------------------------------- footer */
  function footerHTML() {
    var linkRow = LINKS.map(function (l) {
      var ext = /^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + esc(l.href) + '"' + ext + '>' + icon(l.path) + esc(l.label) + '</a>';
    }).join('');

    return '' +
    '<div class="pm-chrome"' + (isMicrosite ? ' data-pm-scheme="dark"' : '') + '>' +
      '<footer class="pm-footer">' +
        '<div class="pm-shell">' +
          '<div class="pm-footer-grid">' +
            '<div>' +
              '<div class="pm-footer-brand"><span class="pm-mark">PM</span><strong>Pratik Mojumder</strong></div>' +
              '<p class="pm-footer-blurb">Environmental scientist working across remote sensing, land-use change, and climate risk &mdash; from field sites in Bangladesh to the University of Alberta.</p>' +
              '<div class="pm-links">' + linkRow + '</div>' +
            '</div>' +
            '<div><h5>Navigate</h5><ul>' +
              '<li><a href="' + esc(url('index.html')) + '">Home</a></li>' +
              '<li><a href="' + esc(url('research.html')) + '">Research</a></li>' +
              '<li><a href="' + esc(url('gallery.html')) + '">Gallery</a></li>' +
              '<li><a href="' + esc(url('cv.html')) + '">CV &amp; publications</a></li>' +
            '</ul></div>' +
            '<div><h5>Work</h5><ul>' +
              '<li><a href="' + esc(url('consulting.html')) + '">Consulting</a></li>' +
              '<li><a href="' + esc(url('resources.html')) + '">Resource hub</a></li>' +
              '<li><a href="' + esc(url('downloads/Pratik_Mojumder_CV.pdf')) + '">Download CV (PDF)</a></li>' +
            '</ul></div>' +
            '<div><h5>Contact</h5><ul>' +
              '<li><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li>' +
              '<li><a href="https://wa.me/8801835477701" target="_blank" rel="noopener">+880 1835 477701</a></li>' +
              '<li class="pm-muted">Dhaka, Bangladesh</li>' +
              '<li class="pm-muted">Edmonton, Canada &mdash; from Sept 2026</li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="pm-footer-bottom">' +
            '<span>&copy; <span id="pmYear"></span> Pratik Mojumder. All rights reserved.</span>' +
            '<span>Built for research and open science.</span>' +
          '</div>' +
        '</div>' +
      '</footer>' +
    '</div>';
  }

  /* ------------------------------------------------------------- behaviour */
  function wireHeader() {
    var header = document.getElementById('pmHeader');
    var burger = document.getElementById('pmBurger');
    var drawer = document.getElementById('pmDrawer');
    var theme = document.getElementById('pmTheme');
    var root = document.documentElement;

    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var open = drawer.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      drawer.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          drawer.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
          drawer.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* Theme is only switchable on the main site; microsites are always dark. */
    if (theme && !isMicrosite) {
      var apply = function (t) {
        if (t === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        theme.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      };
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (e) {}
      var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      apply(saved || (systemDark ? 'dark' : 'light'));

      theme.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('theme', next); } catch (e) {}
        apply(next);
      });

      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var follow = function (e) {
          var stored = null;
          try { stored = localStorage.getItem('theme'); } catch (err) {}
          if (!stored) apply(e.matches ? 'dark' : 'light');
        };
        if (mq.addEventListener) mq.addEventListener('change', follow);
        else if (mq.addListener) mq.addListener(follow);
      }
    }
  }

  function mountFooter() {
    /* Drop any bespoke footer the page shipped with, then append the shared one. */
    Array.prototype.forEach.call(document.querySelectorAll('footer'), function (el) {
      if (!el.closest('.pm-chrome')) el.parentNode.removeChild(el);
    });
    document.body.insertAdjacentHTML('beforeend', footerHTML());
    var y = document.getElementById('pmYear');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Header goes in immediately - this script sits directly after <body>, so
     nothing has painted yet and there is no flash of unstyled chrome. */
  if (isMicrosite) document.body.classList.add('pm-host-microsite');
  document.body.insertAdjacentHTML('afterbegin', headerHTML());
  wireHeader();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
