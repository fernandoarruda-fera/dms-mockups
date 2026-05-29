/* DMS Mockups — Notes Widget
 * Self-contained. Inject via <script src="notes-widget.js" defer></script>
 * Renders a floating button + side drawer for per-page annotations.
 * Storage: localStorage key `mockup-notes-{pageKey}` = JSON array of {id, text, timestamp}.
 * Hide via ?hide-notes=1 in URL, or localStorage `mockup-notes-hidden = '1'`.
 */
(function () {
  if (window.__dmsNotesWidgetLoaded) return;
  window.__dmsNotesWidgetLoaded = true;

  var PRIMARY = '#643585';
  var PRIMARY_DARK = '#4f2a6a';
  var BG = '#F8F9FA';

  function pageKey() {
    var p = (location.pathname || '').split('/').pop() || '';
    p = p.replace(/\.html?$/i, '');
    return p || 'index';
  }
  var KEY_PREFIX = 'mockup-notes-';
  var STORAGE_KEY = KEY_PREFIX + pageKey();

  function isHidden() {
    try {
      var q = (location.search || '').toLowerCase();
      if (q.indexOf('hide-notes=1') !== -1) return true;
      if (localStorage.getItem('mockup-notes-hidden') === '1') return true;
    } catch (e) {}
    return false;
  }

  function readNotes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function writeNotes(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function fmtRelative(ts) {
    var diff = Date.now() - ts;
    var s = Math.floor(diff / 1000);
    if (s < 60) return 'agora';
    var m = Math.floor(s / 60);
    if (m < 60) return 'há ' + m + 'min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'há ' + h + 'h';
    var d = Math.floor(h / 24);
    if (d < 7) return 'há ' + d + 'd';
    return new Date(ts).toLocaleDateString('pt-BR');
  }
  function fmtAbs(ts) {
    var d = new Date(ts);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function injectStyles() {
    var css = '' +
      '.dms-notes-btn{position:fixed;right:24px;bottom:24px;z-index:2147483600;display:inline-flex;align-items:center;gap:8px;background:' + PRIMARY + ';color:#fff;border:0;border-radius:999px;padding:12px 18px;font:600 14px/1 Montserrat,Verdana,sans-serif;box-shadow:0 8px 20px -4px rgba(100,53,133,.45),0 4px 8px -2px rgba(0,0,0,.1);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,background .15s ease;}' +
      '.dms-notes-btn:hover{transform:translateY(-2px);background:' + PRIMARY_DARK + ';box-shadow:0 12px 24px -4px rgba(100,53,133,.55),0 6px 12px -2px rgba(0,0,0,.12);}' +
      '.dms-notes-btn svg{width:18px;height:18px;flex-shrink:0;}' +
      '.dms-notes-badge{background:#fff;color:' + PRIMARY + ';border-radius:999px;min-width:20px;height:20px;padding:0 6px;font:700 11px/20px Montserrat,Verdana,sans-serif;text-align:center;display:inline-block;}' +
      '.dms-notes-backdrop{position:fixed;inset:0;background:rgba(15,15,25,.35);z-index:2147483640;opacity:0;transition:opacity .2s ease;pointer-events:none;}' +
      '.dms-notes-backdrop.open{opacity:1;pointer-events:auto;}' +
      '.dms-notes-drawer{position:fixed;top:0;right:0;bottom:0;width:380px;max-width:92vw;background:#fff;z-index:2147483641;box-shadow:-8px 0 32px -8px rgba(0,0,0,.18);transform:translateX(100%);transition:transform .25s ease;display:flex;flex-direction:column;font:400 14px/1.45 Montserrat,Verdana,sans-serif;color:#1A1A1A;}' +
      '.dms-notes-drawer.open{transform:translateX(0);}' +
      '.dms-notes-head{padding:18px 20px 14px;border-bottom:1px solid #E5E7EB;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}' +
      '.dms-notes-head h3{margin:0 0 4px;font:700 15px/1.3 Montserrat,Verdana,sans-serif;color:' + PRIMARY + ';}' +
      '.dms-notes-head p{margin:0;font:500 11px/1.4 JetBrains Mono,Consolas,monospace;color:#656464;word-break:break-all;}' +
      '.dms-notes-close{background:transparent;border:0;cursor:pointer;color:#656464;padding:4px;border-radius:6px;line-height:0;}' +
      '.dms-notes-close:hover{background:#F3F4F6;color:#1A1A1A;}' +
      '.dms-notes-form{padding:14px 20px;border-bottom:1px solid #E5E7EB;background:' + BG + ';}' +
      '.dms-notes-form textarea{width:100%;min-height:90px;border:1px solid #E5E7EB;border-radius:8px;background:#fff;padding:10px 12px;font:400 13px/1.5 Montserrat,Verdana,sans-serif;color:#1A1A1A;resize:vertical;box-sizing:border-box;}' +
      '.dms-notes-form textarea:focus{outline:none;border-color:' + PRIMARY + ';box-shadow:0 0 0 3px rgba(100,53,133,.18);}' +
      '.dms-notes-form-row{display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px;}' +
      '.dms-notes-hint{font:500 11px/1.3 Montserrat,Verdana,sans-serif;color:#656464;}' +
      '.dms-notes-save{background:' + PRIMARY + ';color:#fff;border:0;border-radius:8px;padding:8px 16px;font:600 13px/1 Montserrat,Verdana,sans-serif;cursor:pointer;transition:background .15s ease;}' +
      '.dms-notes-save:hover:not(:disabled){background:' + PRIMARY_DARK + ';}' +
      '.dms-notes-save:disabled{opacity:.5;cursor:not-allowed;}' +
      '.dms-notes-list{flex:1;overflow-y:auto;padding:8px 20px 24px;}' +
      '.dms-notes-empty{padding:40px 12px;text-align:center;color:#656464;font:500 13px/1.5 Montserrat,Verdana,sans-serif;}' +
      '.dms-notes-empty svg{width:36px;height:36px;margin:0 auto 12px;display:block;opacity:.4;}' +
      '.dms-notes-item{padding:12px 0;border-bottom:1px solid #F3F4F6;}' +
      '.dms-notes-item:last-child{border-bottom:0;}' +
      '.dms-notes-item-text{white-space:pre-wrap;word-wrap:break-word;font:400 13px/1.5 Montserrat,Verdana,sans-serif;color:#1A1A1A;}' +
      '.dms-notes-item-meta{margin-top:6px;display:flex;justify-content:space-between;align-items:center;gap:8px;font:500 11px/1 JetBrains Mono,Consolas,monospace;color:#656464;}' +
      '.dms-notes-del{background:transparent;border:0;color:#B91C1C;cursor:pointer;font:600 11px/1 Montserrat,Verdana,sans-serif;padding:4px 8px;border-radius:6px;}' +
      '.dms-notes-del:hover{background:#FEE2E2;}' +
      '@media (max-width:480px){.dms-notes-btn{right:16px;bottom:16px;padding:10px 14px;font-size:13px;}}';
    var s = document.createElement('style');
    s.id = 'dms-notes-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function renderList(container) {
    var notes = readNotes().sort(function (a, b) { return b.timestamp - a.timestamp; });
    if (!notes.length) {
      container.innerHTML =
        '<div class="dms-notes-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' +
        'Nenhuma anotação nesta tela ainda.<br>Use o campo acima pra registrar.' +
        '</div>';
      return;
    }
    var html = '';
    notes.forEach(function (n) {
      html +=
        '<div class="dms-notes-item" data-id="' + n.id + '">' +
        '<div class="dms-notes-item-text">' + escapeHtml(n.text) + '</div>' +
        '<div class="dms-notes-item-meta">' +
        '<span title="' + fmtAbs(n.timestamp) + '">' + fmtRelative(n.timestamp) + ' · ' + fmtAbs(n.timestamp) + '</span>' +
        '<button class="dms-notes-del" data-del="' + n.id + '">Excluir</button>' +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  function updateBadge(btn) {
    var n = readNotes().length;
    var badge = btn.querySelector('.dms-notes-badge');
    if (n > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'dms-notes-badge';
        btn.appendChild(badge);
      }
      badge.textContent = n;
    } else if (badge) {
      badge.remove();
    }
  }

  function build() {
    injectStyles();

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dms-notes-btn';
    btn.setAttribute('aria-label', 'Anotar esta tela');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' +
      '<span>Anotar</span>';
    document.body.appendChild(btn);
    updateBadge(btn);

    var backdrop = document.createElement('div');
    backdrop.className = 'dms-notes-backdrop';
    document.body.appendChild(backdrop);

    var drawer = document.createElement('aside');
    drawer.className = 'dms-notes-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Anotações desta página');
    drawer.innerHTML =
      '<div class="dms-notes-head">' +
        '<div>' +
          '<h3>Anotações desta página</h3>' +
          '<p>' + escapeHtml(pageKey()) + '</p>' +
        '</div>' +
        '<button class="dms-notes-close" aria-label="Fechar">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="dms-notes-form">' +
        '<textarea placeholder="O que você quer registrar sobre esta tela?"></textarea>' +
        '<div class="dms-notes-form-row">' +
          '<span class="dms-notes-hint">Salvo localmente · veja todas em tela76</span>' +
          '<button class="dms-notes-save" disabled>Salvar anotação</button>' +
        '</div>' +
      '</div>' +
      '<div class="dms-notes-list"></div>';
    document.body.appendChild(drawer);

    var listEl = drawer.querySelector('.dms-notes-list');
    var textarea = drawer.querySelector('textarea');
    var saveBtn = drawer.querySelector('.dms-notes-save');
    var closeBtn = drawer.querySelector('.dms-notes-close');

    function open() {
      renderList(listEl);
      drawer.classList.add('open');
      backdrop.classList.add('open');
      setTimeout(function () { textarea.focus(); }, 250);
    }
    function close() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    }

    btn.addEventListener('click', open);
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });

    textarea.addEventListener('input', function () {
      saveBtn.disabled = !textarea.value.trim();
    });
    textarea.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && textarea.value.trim()) {
        e.preventDefault();
        saveBtn.click();
      }
    });

    saveBtn.addEventListener('click', function () {
      var text = textarea.value.trim();
      if (!text) return;
      var notes = readNotes();
      notes.push({ id: Date.now(), text: text, timestamp: Date.now() });
      writeNotes(notes);
      textarea.value = '';
      saveBtn.disabled = true;
      renderList(listEl);
      updateBadge(btn);
    });

    listEl.addEventListener('click', function (e) {
      var t = e.target.closest('[data-del]');
      if (!t) return;
      var id = Number(t.getAttribute('data-del'));
      var notes = readNotes().filter(function (n) { return n.id !== id; });
      writeNotes(notes);
      renderList(listEl);
      updateBadge(btn);
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (isHidden()) return;
    build();
  });
})();
