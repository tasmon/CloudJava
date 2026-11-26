/* Fast launcher: renders instantly from the browser-side library cache; the JVM only boots inside run.html */
(function () {
  'use strict';
  var KG = 'j2me.games', KP = 'j2me.prefs', ver = '2.0.0';
  var prefs = { theme: 'dark', touch: 'auto' };
  try { var p = JSON.parse(localStorage.getItem(KP) || '{}'); for (var k in p) prefs[k] = p[k]; } catch (e) {}
  var games = null;
  try { games = JSON.parse(localStorage.getItem(KG)); } catch (e) { games = []; }
  if (games === null) games = [];  /* no scan on startup: the Java engine only loads when you add or play a game */
  var $ = function (s) { return document.querySelector(s); };
  var app = $('#app'), title = $('#title'), L = $('#softkey-left'), R = $('#softkey-right');
  var view = 'home', sel = 0, rows = [], touched = false;
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
    location.href = 'run.html?app=' + encodeURIComponent(g.id) + (m ? '&mobile=1' : '');
  }
  var V = {
    home: function () {
      var it = [{ h: 'Apps (' + games.length + ')' }];
      games.forEach(function (g) { it.push({ l: g.name, s: g.meta || '', icon: g.icon, fn: function () { launch(g); } }); });
      if (!games.length) { it.push({ t: 'No apps yet.' }); it.push({ l: 'Add apps', fn: function () { location.href = 'add.html'; } }); }
      draw('CloudJava', it, true); keys('Menu', '');
    },
    menu: function () {
      draw('Menu', [
        { l: 'Add apps', fn: function () { location.href = 'add.html'; } },
        { l: 'Manage apps', fn: function () { location.href = 'manage.html'; } },
        { l: 'Settings', fn: function () { go('settings'); } },
        deferred ? { l: 'Install CloudJava', fn: function () { deferred.prompt(); deferred = null; V.menu(); } } : null,
        { l: 'Help', fn: function () { go('help'); } },
        { l: 'About', fn: function () { go('about'); } }].filter(Boolean)); keys('Select', 'Back');
    },
    settings: function () {
      draw('Settings', [
        { l: 'Theme', s: prefs.theme, fn: function () { prefs.theme = cycle(['dark', 'light', 'green'], prefs.theme); save(); theme(); V.settings(); } },
        { l: 'Touch keypad in apps', s: prefs.touch, fn: function () { prefs.touch = cycle(['auto', 'on', 'off'], prefs.touch); save(); V.settings(); } },
        { l: 'Sound in apps', s: soundOn() ? 'on (may stall CloudPhone)' : 'off (recommended)', fn: function () { try { localStorage.setItem('j2me.sound', soundOn() ? 'off' : 'on'); } catch (e) {} V.settings(); } },
        { l: 'Refresh library', s: 'Rescan (loads Java engine)', fn: function () { try { localStorage.removeItem(KG); sessionStorage.removeItem('j2me.sync'); } catch (e) {} location.replace('manage.html?sync=1'); } }
      ], true); keys('Select', 'Back');
    },
    help: function () {
      draw('Help', [{ t: '<b>Add apps</b>Menu, then Add apps. Pick one or more .jar files; they stay in this device\'s browser storage.' +
        '<b>Run</b>Tap an app or press OK.' +
        '<b>Manage</b>Menu, then Manage apps. Tap an app\'s name for Settings, Delete data or Uninstall.' +
        '<b>Keys in an app</b>Arrows and OK as on the phone. 2 up, 8 down, 4 left, 6 right, 5 fire. * and # work. Left key: tap = left soft key, hold = emulator menu (settings, exit). Right key = right soft key.' +
        '<b>Touch</b>Touch devices get an on-screen keypad.' +
        '<b>Network</b>Apps can go online (web requests only) when CloudJava is hosted with its relay, for example on Vercel. Raw sockets are not supported.' +
        '<b>Install CloudJava</b>Android or desktop: Menu, then Install CloudJava. iPhone or iPad: Share, then Add to Home Screen.' +
        '<b>Sound</b>Off by default: CloudPhone cannot play it and sound made the screen hang with "video loading". Turn it on in Settings on devices that play sound.' +
        '<b>Loading</b>The first start of the Java engine needs internet and can take a minute.' +
        '<b>Scroll</b>Use Up/Down or swipe.' }]); keys('', 'Back');
    },
    about: function () { draw('About', [{ t: '<b>CloudJava</b>Version - ' + ver + '<br>Developer - Tasmon Islam<br>Contact - tasmon@outlook.com<br>Engine - freej2me-web by zb3 (GPLv3), based on FreeJ2ME<br>Java runtime - CheerpJ' }]); keys('', 'Back'); }
  };
  function keys(l, r) { L.textContent = l; R.textContent = r; }
  function go(v, replace) { sel = 0; if (v !== view && !replace) history.pushState({ v: v }, '', '#' + v); view = v; V[v](); }
  window.addEventListener('popstate', function (e) { sel = 0; view = (e.state && e.state.v) || 'home'; V[view](); });
  function pickRow() { if (rows[sel]) rows[sel].fn(); }
  function move(d) { if (!rows.length) { app.scrollTop += d * 48; return; } sel = (sel + d + rows.length) % rows.length; V[view](); }

  app.addEventListener('pointerdown', function (e) { touched = e.pointerType === 'touch'; });
  app.addEventListener('click', function (e) { var it = e.target.closest('.item'); if (it) { sel = +it.getAttribute('data-i'); pickRow(); } });
  L.addEventListener('click', function () { if (view === 'home') go('menu'); else if (view === 'menu' || view === 'settings') pickRow(); });
  R.addEventListener('click', function () { if (view !== 'home') history.back(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); L.click(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pickRow(); }
    else if (view !== 'home' && (e.key === 'SoftRight' || e.key === 'F2' || e.key === 'Backspace')) { e.preventDefault(); history.back(); }  /* RSK untouched on home */
  });
  window.addEventListener('load', function () { window.focus(); });
  document.body.addEventListener('click', function () { window.focus(); });
  function fit() { document.documentElement.style.setProperty('--vh', window.innerHeight + 'px'); }
  fit(); window.addEventListener('resize', fit);
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (view === 'menu') V.menu(); });
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  theme(); var h = location.hash.slice(1); if (!V[h] || h === 'menu') h = 'home';
  history.replaceState({ v: h }, '', h === 'home' ? location.pathname + location.search : '#' + h); go(h, true);
})();
