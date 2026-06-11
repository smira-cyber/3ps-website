/* 3PS "Operations Report" site — shared chrome + minimal interaction layer.
   Header/footer are injected here (single source of truth for all pages).
   Interactions: scroll reveals, mobile nav, year. Restraint is the brand. */
(function () {
  'use strict';

  var MARK = '<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><rect x="1.5" y="1.5" width="37" height="37" fill="none" stroke="currentColor" stroke-width="3"/><g fill="#17613B"><rect x="9" y="21" width="5" height="10"/><rect x="17" y="16" width="5" height="15"/><rect x="25" y="10" width="5" height="21"/></g></svg>';

  var NAV = [
    ['services.html', 'Services'],
    ['3pslock.html', '3PS Lock'],
    ['how-we-work.html', 'How we work'],
    ['industries.html', 'Industries'],
    ['case-studies.html', 'Evidence'],
    ['about.html', 'About']
  ];

  function here() {
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function buildHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var links = NAV.map(function (n) {
      var cur = here() === n[0] ? ' aria-current="page" class="current"' : '';
      return '<a href="' + n[0] + '"' + cur + '>' + n[1] + '</a>';
    }).join('');
    el.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<div class="doc-bar" aria-label="Site status bar"><div class="wrap">' +
        '<span class="company">3PS, LLC — Managed IT &amp; Security</span>' +
        '<span class="right">' +
          '<a class="phone" href="tel:+18559505200">(855) 950-5200</a>' +
          '<span class="status"><span class="dot pulse" aria-hidden="true"></span> All client systems operational</span>' +
        '</span>' +
      '</div></div>' +
      '<header class="site-header"><div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="3PS home">' + MARK +
          '<span><span class="word">3PS</span><span class="ppp">People · Process · Performance</span></span>' +
        '</a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label="Toggle navigation">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
        '</button>' +
        '<nav class="nav" id="nav" aria-label="Primary">' + links +
          '<a class="btn btn-primary" href="contact.html">Start a baseline</a>' +
        '</nav>' +
      '</div></header>';
  }

  function buildFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="foot-grid">' +
          '<div class="foot-brand">' +
            '<a class="brand" href="index.html" aria-label="3PS home">' + MARK +
              '<span><span class="word">3PS</span><span class="ppp">People · Process · Performance</span></span></a>' +
            '<p>The managed IT and security partner for regulated industries and growing businesses nationwide.</p>' +
          '</div>' +
          '<div class="foot-col"><div class="h">Services</div>' +
            '<a href="services.html">All services</a>' +
            '<a href="3pslock.html">3PS Lock</a>' +
            '<a href="assessment.html">Baseline assessment</a>' +
            '<a href="breach-check.html">Breach check</a>' +
            '<a href="services.html#ransomware-recovery">Ransomware recovery</a>' +
          '</div>' +
          '<div class="foot-col"><div class="h">Company</div>' +
            '<a href="about.html">About</a>' +
            '<a href="how-we-work.html">How we work</a>' +
            '<a href="industries.html">Industries</a>' +
            '<a href="case-studies.html">Case studies</a>' +
          '</div>' +
          '<div class="foot-col"><div class="h">Contact</div>' +
            '<a href="tel:+18559505200">(855) 950-5200</a>' +
            '<a href="mailto:info@3ps.llc">info@3ps.llc</a>' +
            '<a href="contact.html">Contact form</a>' +
            '<a href="privacy-policy.html">Privacy policy</a>' +
            '<a href="terms-of-service.html">Terms of service</a>' +
          '</div>' +
        '</div>' +
        '<div class="colophon">' +
          '<span>© <span id="yr">2026</span> 3PS, LLC · People. Process. Performance.</span>' +
          '<span>DOC 3PS-WEB-01 · DESIGNED LIKE WE RUN IT — NO SURPRISES</span>' +
        '</div>' +
      '</div></footer>';
  }

  function setupNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setupReveals() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var d = parseInt(el.getAttribute('data-d') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, d * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Contact form: POSTs to FORM_ENDPOINT if set (e.g. Formspree),
     otherwise falls back to a prefilled mailto draft. */
  var FORM_ENDPOINT = '';
  function setupForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('[name="company_site"]').value) return; // honeypot
      var data = new FormData(form);
      var status = document.getElementById('form-status');
      var btn = form.querySelector('button[type="submit"]');
      function mailtoFallback() {
        var body = 'Name: ' + data.get('name') + '\nCompany: ' + data.get('company') +
          '\nEmail: ' + data.get('email') + '\nPhone: ' + (data.get('phone') || '—') +
          '\n\n' + data.get('message');
        location.href = 'mailto:info@3ps.llc?subject=' +
          encodeURIComponent('Baseline assessment request — ' + data.get('company')) +
          '&body=' + encodeURIComponent(body);
        if (status) status.textContent = 'Opening your email client — or call (855) 950-5200.';
      }
      if (!FORM_ENDPOINT) { mailtoFallback(); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          if (status) status.textContent = 'Received. We respond within one business day.';
        })
        .catch(mailtoFallback)
        .finally(function () { btn.disabled = false; btn.textContent = 'Send request'; });
    });
  }

  buildHeader();
  buildFooter();
  setupNavToggle();
  setupReveals();
  setupForm();

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
