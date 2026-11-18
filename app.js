(function () {
  var $ = function (i) { return document.getElementById(i); };
  var R = window.RECIPES || [];

  /* ---------- header: meniu, categorii, căutare ---------- */
  var menuBtn = $('menuBtn'), nav = $('nav'), catBtn = $('catBtn'), catSub = $('catSub');
  var searchBtn = $('searchBtn'), searchRow = $('searchRow');
  function set(b, p, o) { b.setAttribute('aria-expanded', o); p.classList.toggle('open', o); }
  menuBtn.addEventListener('click', function () { set(menuBtn, nav, menuBtn.getAttribute('aria-expanded') !== 'true'); });
  catBtn.addEventListener('click', function (e) { e.stopPropagation(); set(catBtn, catSub, catBtn.getAttribute('aria-expanded') !== 'true'); });
  searchBtn.addEventListener('click', function () {
    var o = searchBtn.getAttribute('aria-expanded') !== 'true';
    set(searchBtn, searchRow, o);
    if (o) $('q').focus();
  });
  document.addEventListener('click', function (e) { if (!catSub.contains(e.target)) set(catBtn, catSub, false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { set(catBtn, catSub, false); set(searchBtn, searchRow, false); }
  });
  $('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('q').value.trim();
    if (v) location.href = '/?q=' + encodeURIComponent(v);
  });

  /* ---------- temă alb / negru ---------- */
  var root = document.documentElement, tb = $('themeBtn');
  var mq = window.matchMedia('(prefers-color-scheme: dark)'), saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  function applyTheme(d) {
    root.setAttribute('data-theme', d ? 'dark' : 'light');
    tb.setAttribute('aria-checked', d);
    tb.firstChild.textContent = d ? '\u263e' : '\u2600';
  }
  applyTheme(saved ? saved === 'dark' : mq.matches);
  tb.addEventListener('click', function () {
    var d = tb.getAttribute('aria-checked') !== 'true';
    applyTheme(d);
    try { localStorage.setItem('theme', d ? 'dark' : 'light'); } catch (e) {}
  });

  /* ---------- utilitare ---------- */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function norm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function thumb(r) { return '<span class="t"><img src="' + r.image + '" alt="" loading="lazy" onerror="this.hidden=true"></span>'; }

  /* ---------- bara laterală: rețete recente ---------- */
  var rc = $('recent');
  if (rc) {
    rc.innerHTML = R.slice(0, 5).map(function (r) {
      return '<a class="recent" href="/' + r.slug + '">' + thumb(r) + '<b>' + esc(r.title) + '</b></a>';
    }).join('');
  }

  /* ---------- homepage: carduri, căutare, paginare ---------- */
  var cards = $('cards');
  if (cards) {
    var PER = 8, page = 1, list = R;
    var q = new URLSearchParams(location.search).get('q') || '';
    var info = $('resinfo'), pager = $('pager'), hero = document.querySelector('.hero');
    if (q) {
      var nq = norm(q);
      list = R.filter(function (r) { return norm(r.title + ' ' + r.category + ' ' + r.excerpt).indexOf(nq) > -1; });
      info.hidden = false;
      info.textContent = list.length ? 'Rezultate pentru „' + q + '”: ' + list.length : 'Nu am găsit rețete pentru „' + q + '”.';
      if (hero) hero.hidden = true;
      $('q').value = q;
    }
    var card = function (r) {
      return '<a class="card" href="/' + r.slug + '"><div class="ph photo"><img src="' + r.image + '" alt="' + esc(r.alt) + '" loading="lazy" onerror="this.parentNode.hidden=true"></div>' +
        '<div class="card-body"><p class="cat">' + esc(r.category) + '</p><h2>' + esc(r.title) + '</h2><p class="ex">' + esc(r.excerpt) + '</p></div></a>';
    };
    var render = function () {
      var pages = Math.max(1, Math.ceil(list.length / PER));
      cards.innerHTML = list.slice((page - 1) * PER, page * PER).map(card).join('');
      if (pages < 2) { pager.hidden = true; return; }
      pager.hidden = false;
      var h = '<button type="button" data-p="prev"' + (page === 1 ? ' disabled' : '') + '>Înapoi</button>';
      for (var i = 1; i <= pages; i++) h += '<button type="button" data-p="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '>' + i + '</button>';
      h += '<button type="button" data-p="next"' + (page === pages ? ' disabled' : '') + '>Înainte</button>';
      pager.innerHTML = h;
    };
    pager.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var v = b.dataset.p;
      page = v === 'prev' ? page - 1 : v === 'next' ? page + 1 : +v;
      render();
      window.scrollTo(0, 0);
    });
    render();
  }

  /* ---------- pagina de rețetă: anterioara / următoarea, distribuire ---------- */
  var pn = $('pn');
  if (pn) {
    var cur = R.findIndex(function (r) { return r.slug === document.body.dataset.slug; });
    var older = R[cur + 1], newer = cur > 0 ? R[cur - 1] : null, h = '';
    if (older) h += '<a href="/' + older.slug + '">' + thumb(older) + '<span><small>Anterioară</small><b>' + esc(older.title) + '</b></span></a>';
    if (newer) h += '<a class="nx" href="/' + newer.slug + '"><span><small>Următoarea</small><b>' + esc(newer.title) + '</b></span>' + thumb(newer) + '</a>';
    if (h) { pn.innerHTML = h; pn.hidden = false; }

    var su = encodeURIComponent(location.href), st = encodeURIComponent(document.title);
    var smap = {
      fb: 'https://www.facebook.com/sharer/sharer.php?u=' + su,
      x: 'https://twitter.com/intent/tweet?url=' + su + '&text=' + st,
      pin: 'https://www.pinterest.com/pin/create/button/?url=' + su + '&description=' + st,
      wa: 'https://wa.me/?text=' + st + '%20' + su
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-s]'), function (a) { a.href = smap[a.dataset.s]; });
    var cb = $('copyBtn');
    if (cb) cb.addEventListener('click', function () {
      try { navigator.clipboard.writeText(location.href); this.textContent = 'Link copiat'; } catch (e) {}
    });
  }
})();
