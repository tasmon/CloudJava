/* Fast launcher: renders instantly from the browser-side library cache; the JVM only boots inside run.html */
(function () {
  'use strict';
  var KG = 'j2me.games', KP = 'j2me.prefs', ver = '2.0.1';
  var prefs = { theme: 'dark', touch: 'auto' };
  try { var p = JSON.parse(localStorage.getItem(KP) || '{}'); for (var k in p) prefs[k] = p[k]; } catch (e) {}
  var games = null;
  try { games = JSON.parse(localStorage.getItem(KG)); } catch (e) { games = []; }
  if (games === null) games = [];  /* no scan on startup: the Java engine only loads when you add or play a game */
  var $ = function (s) { return document.querySelector(s); };
  var app = $('#app'), title = $('#title'), L = $('#softkey-left'), R = $('#softkey-right');
  var view = 'home', sel = 0, rows = [], touched = false, depth = 0, pending = null;
  /* Leave this page without piling up history: unwind our own entries, then replace, so Exit/RSK on Home closes the app. */
  function nav(u) {
    if (depth > 0) { pending = u; history.go(-depth); setTimeout(function () { if (pending) location.replace(pending); }, 600); }
    else location.replace(u);
  }
  function exitApp() { try { window.close(); } catch (e) {} setTimeout(function () { if (history.length > 1) history.back(); }, 300); }
  function soundOn() { try { return localStorage.getItem('j2me.sound') === 'on'; } catch (e) { return false; } }
  function save() { try { localStorage.setItem(KP, JSON.stringify(prefs)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function theme() { document.body.setAttribute('data-theme', prefs.theme); }
  function cycle(a, v) { return a[(a.indexOf(v) + 1) % a.length]; }

  function draw(t, items, keepSel) {
    title.textContent = t; rows = items.filter(function (i) { return i.fn; });
    if (sel >= rows.length) sel = Math.max(0, rows.length - 1);
    var n = -1;
    app.innerHTML = items.map(function (i) {
      if (i.h) return '<div class="h">' + esc(i.h) + '</div>';
      if (i.t) return '<div class="txt">' + i.t + '</div>';
      n++; return '<div class="item' + (n === sel ? ' sel' : '') + '" data-i="' + n + '">' +
        (i.icon ? '<img src="' + esc(i.icon) + '" alt="">' : '') + '<div class="t">' + esc(i.l) + (i.s ? '<small>' + esc(i.s) + '</small>' : '') + '</div></div>';
    }).join('');
    var e = app.querySelector('.sel'); if (e) e.scrollIntoView({ block: 'nearest' });
  }
  function launch(g) {
    var m = prefs.touch === 'on' || (prefs.touch === 'auto' && touched);
    nav('run.html?app=' + encodeURIComponent(g.id) + (m ? '&mobile=1' : ''));
  }
  var V = {
    home: function () {
      var it = [{ h: 'Apps (' + games.length + ')' }];
      games.forEach(function (g) { it.push({ l: g.name, s: g.meta || '', icon: g.icon, fn: function () { launch(g); } }); });
      if (!games.length) { it.push({ t: 'No apps yet.' }); it.push({ l: 'Add apps', fn: function () { nav('add.html'); } }); }
      draw('CloudJava', it, true); keys('Menu', 'Exit');
    },
    menu: function () {
      draw('Menu', [
        { l: 'Add apps', fn: function () { nav('add.html'); } },
        { l: 'Manage apps', fn: function () { nav('manage.html'); } },
        { l: 'Settings', fn: function () { go('settings'); } },
        { l: 'Help', fn: function () { go('help'); } },
        { l: 'About', fn: function () { go('about'); } }]); keys('Select', 'Back');
    },
    settings: function () {
      draw('Settings', [
        { l: 'Theme', s: prefs.theme, fn: function () { prefs.theme = cycle(['dark', 'light', 'green'], prefs.theme); save(); theme(); V.settings(); } },
        { l: 'Touch keypad in apps', s: prefs.touch, fn: function () { prefs.touch = cycle(['auto', 'on', 'off'], prefs.touch); save(); V.settings(); } },
        { l: 'Sound in apps', s: soundOn() ? 'on (may stall CloudPhone)' : 'off (recommended)', fn: function () { try { localStorage.setItem('j2me.sound', soundOn() ? 'off' : 'on'); } catch (e) {} V.settings(); } },
        { l: 'Refresh library', s: 'Rescan (loads Java engine)', fn: function () { try { localStorage.removeItem(KG); sessionStorage.removeItem('j2me.sync'); } catch (e) {} nav('manage.html?sync=1'); } },
        { l: 'Test network', s: 'Check the online relay', fn: function () { go('nettest'); } },
        { l: 'Network log', s: 'Last requests from apps', fn: function () { go('netlog'); } }
      ], true); keys('Select', 'Back');
    },
    help: function () {
      draw('Help', [{ t: '<b>Add apps</b>Menu, then Add apps. Pick one or more .jar files; they stay in this device\'s browser storage.' +
        '<b>Run</b>Tap an app or press OK.' +
        '<b>Manage</b>Menu, then Manage apps. Tap an app\'s name for Settings, Delete data or Uninstall.' +
        '<b>Keys in an app</b>Arrows and OK as on the phone. 2 up, 8 down, 4 left, 6 right, 5 fire. * and # work. Left key: tap = left soft key, hold = emulator menu (settings, exit). Right key = right soft key.' +
        '<b>Touch</b>Touch devices get an on-screen keypad.' +
        '<b>Network</b>Apps can go online (web requests only) when CloudJava is hosted with its relay, for example on Vercel. Raw sockets are not supported.' +
        '<b>Install CloudJava</b>Use your browser\'s Install app option (Android, desktop) or Share, then Add to Home Screen (iPhone, iPad).' +
        '<b>Exit</b>On the home screen the right key (Exit) closes CloudJava.' +
        '<b>Sound</b>Off by default: CloudPhone cannot play it and sound made the screen hang with "video loading". Turn it on in Settings on devices that play sound.' +
        '<b>Loading</b>The first start of the Java engine needs internet and can take a minute.' +
        '<b>Scroll</b>Use Up/Down or swipe.' }]); keys('', 'Back');
    },
    nettest: function () {
      draw('Network test', [{ t: 'Testing...' }]); keys('', 'Back');
      var t0 = Date.now(), out;
      fetch('api/proxy', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ method: 'GET', url: 'https://example.com/' }) })
        .then(function (r) {
          return r.text().then(function (t) {
            var j; try { j = JSON.parse(t); } catch (e) { throw new Error('relay missing (' + r.status + '): this host has no online relay. Use the Vercel version.'); }
            if (j.error) throw new Error('relay refused: ' + j.error);
            return j;
          });
        })
        .then(function (j) { out = 'Online relay works.<br>example.com answered HTTP ' + j.status + ' in ' + (Date.now() - t0) + ' ms.'; })
        .catch(function (e) { out = 'Failed: ' + esc(e.message || e); })
        .then(function () { if (view === 'nettest') { draw('Network test', [{ t: out }]); keys('', 'Back'); } });
    },
    netlog: function () {
      var a = []; try { a = JSON.parse(localStorage.getItem('j2me.netlog') || '[]'); } catch (e) {}
      draw('Network log', [{ t: a.length ? a.slice().reverse().map(esc).join('<br><br>') : 'No requests yet. Run an app that goes online, then look here.' }]); keys('', 'Back');
    },
    about: function () { draw('About', [{ t: '<b>CloudJava</b>Version - ' + ver + '<br>Developer - Tasmon Islam<br>Contact - tasmon@outlook.com<br>Engine - freej2me-web by zb3 (GPLv3), based on FreeJ2ME<br>Java runtime - CheerpJ' }]); keys('', 'Back'); }
  };
  function keys(l, r) { L.textContent = l; R.textContent = r; }
  function go(v, replace) { sel = 0; if (v !== view && !replace) { depth++; history.pushState({ v: v, d: depth }, '', '#' + v); } view = v; V[v](); }
  window.addEventListener('popstate', function (e) {
    if (pending) { location.replace(pending); return; }
    sel = 0; depth = (e.state && e.state.d) || 0; view = (e.state && e.state.v) || 'home'; V[view]();
  });
  function pickRow() { if (rows[sel]) rows[sel].fn(); }
  function move(d) { if (!rows.length) { app.scrollTop += d * 48; return; } sel = (sel + d + rows.length) % rows.length; V[view](); }

  app.addEventListener('pointerdown', function (e) { touched = e.pointerType === 'touch'; });
  app.addEventListener('click', function (e) { var it = e.target.closest('.item'); if (it) { sel = +it.getAttribute('data-i'); pickRow(); } });
  L.addEventListener('click', function () { if (view === 'home') go('menu'); else if (view === 'menu' || view === 'settings') pickRow(); });
  R.addEventListener('click', function () { if (view === 'home') exitApp(); else history.back(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); L.click(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pickRow(); }
    else if (e.key === 'SoftRight' || e.key === 'F2' || e.key === 'Backspace') { e.preventDefault(); if (view === 'home') exitApp(); else history.back(); }
  });
  window.addEventListener('load', function () { window.focus(); });
  document.body.addEventListener('click', function () { window.focus(); });
  function fit() { document.documentElement.style.setProperty('--vh', window.innerHeight + 'px'); }
  fit(); window.addEventListener('resize', fit);
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  theme(); var h = location.hash.slice(1); if (!V[h] || h === 'menu') h = 'home';
  history.replaceState({ v: h, d: 0 }, '', h === 'home' ? location.pathname + location.search : '#' + h); go(h, true);
})();
