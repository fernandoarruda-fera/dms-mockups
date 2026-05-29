/* DMS Mockups — Notes Widget
 * Self-contained. Inject via <script src="notes-widget.js" defer></script>
 * Renders a floating button + side drawer for per-page annotations.
 * Storage: localStorage key `mockup-notes-{pageKey}` = JSON array of
 *   { id, text, timestamp, validationStatus, validationComment, validatedAt }.
 * Hide via ?hide-notes=1 in URL, or localStorage `mockup-notes-hidden = '1'`.
 */
(function () {
  if (window.__dmsNotesWidgetLoaded) return;
  window.__dmsNotesWidgetLoaded = true;

  var PRIMARY = '#643585';
  var PRIMARY_DARK = '#4f2a6a';
  var BG = '#F8F9FA';
  var OK_COLOR = '#16A34A';
  var OK_BG = '#DCFCE7';
  var NOK_COLOR = '#B91C1C';
  var NOK_BG = '#FEE2E2';

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

  function migrateNote(n) {
    if (!n.validationStatus) n.validationStatus = 'pending';
    if (typeof n.validationComment !== 'string') n.validationComment = '';
    if (typeof n.validatedAt === 'undefined') n.validatedAt = null;
    return n;
  }

  function readNotes() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return raw.map(migrateNote);
    }
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
      '.dms-notes-btn{position:fixed;right:24px;bottom:max(24px,env(safe-area-inset-bottom));z-index:2147483600;display:inline-flex;align-items:center;gap:8px;background:' + PRIMARY + ';color:#fff;border:0;border-radius:999px;padding:12px 18px;font:600 14px/1 Montserrat,Verdana,sans-serif;box-shadow:0 8px 20px -4px rgba(100,53,133,.45),0 4px 8px -2px rgba(0,0,0,.1);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,background .15s ease;box-sizing:border-box;}' +
      '.dms-notes-btn:hover{transform:translateY(-2px);background:' + PRIMARY_DARK + ';box-shadow:0 12px 24px -4px rgba(100,53,133,.55),0 6px 12px -2px rgba(0,0,0,.12);}' +
      '.dms-notes-btn svg{width:18px;height:18px;flex-shrink:0;}' +
      '.dms-notes-badge{background:#fff;color:' + PRIMARY + ';border-radius:999px;min-width:20px;height:20px;padding:0 6px;font:700 11px/20px Montserrat,Verdana,sans-serif;text-align:center;display:inline-block;}' +
      '.dms-notes-backdrop{position:fixed;inset:0;background:rgba(15,15,25,.35);z-index:2147483640;opacity:0;transition:opacity .2s ease;pointer-events:none;}' +
      '.dms-notes-backdrop.open{opacity:1;pointer-events:auto;}' +
      '.dms-notes-drawer{position:fixed;top:0;right:0;bottom:0;height:100vh;height:100dvh;width:380px;max-width:92vw;background:#fff;z-index:2147483641;box-shadow:-8px 0 32px -8px rgba(0,0,0,.18);transform:translateX(100%);transition:transform .25s ease;display:flex;flex-direction:column;font:400 14px/1.45 Montserrat,Verdana,sans-serif;color:#1A1A1A;box-sizing:border-box;overflow:hidden;}' +
      '.dms-notes-drawer *,.dms-notes-drawer *::before,.dms-notes-drawer *::after{box-sizing:border-box;}' +
      '.dms-notes-drawer.open{transform:translateX(0);}' +
      '.dms-notes-head{flex:0 0 auto;padding:18px 20px 14px;border-bottom:1px solid #E5E7EB;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;background:#fff;}' +
      '.dms-notes-head h3{margin:0 0 4px;font:700 15px/1.3 Montserrat,Verdana,sans-serif;color:' + PRIMARY + ';}' +
      '.dms-notes-head p{margin:0;font:500 11px/1.4 JetBrains Mono,Consolas,monospace;color:#656464;word-break:break-all;}' +
      '.dms-notes-close{background:transparent;border:0;cursor:pointer;color:#656464;padding:4px;border-radius:6px;line-height:0;flex-shrink:0;}' +
      '.dms-notes-close:hover{background:#F3F4F6;color:#1A1A1A;}' +
      '.dms-notes-body{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;display:flex;flex-direction:column;}' +
      '.dms-notes-form{padding:14px 20px;border-bottom:1px solid #E5E7EB;background:' + BG + ';flex:0 0 auto;}' +
      '.dms-notes-form textarea{width:100%;min-height:100px;max-height:200px;border:1px solid #E5E7EB;border-radius:8px;background:#fff;padding:10px 12px;font:400 13px/1.5 Montserrat,Verdana,sans-serif;color:#1A1A1A;resize:vertical;display:block;}' +
      '.dms-notes-form textarea:focus{outline:none;border-color:' + PRIMARY + ';box-shadow:0 0 0 3px rgba(100,53,133,.18);}' +
      '.dms-notes-list{padding:8px 20px 24px;flex:1 1 auto;}' +
      '.dms-notes-empty{padding:40px 12px;text-align:center;color:#656464;font:500 13px/1.5 Montserrat,Verdana,sans-serif;}' +
      '.dms-notes-empty svg{width:36px;height:36px;margin:0 auto 12px;display:block;opacity:.4;}' +
      '.dms-notes-item{padding:10px 0 12px;border-bottom:1px solid #F3F4F6;border-left:3px solid transparent;padding-left:10px;margin-left:-10px;transition:border-color .15s ease,background .15s ease;border-radius:0 6px 6px 0;}' +
      '.dms-notes-item:last-child{border-bottom:0;}' +
      '.dms-notes-item.is-ok{border-left-color:' + OK_COLOR + ';background:rgba(220,252,231,.35);}' +
      '.dms-notes-item.is-nok{border-left-color:' + NOK_COLOR + ';background:rgba(254,226,226,.35);}' +
      '.dms-notes-item-text{white-space:pre-wrap;word-wrap:break-word;font:400 13px/1.5 Montserrat,Verdana,sans-serif;color:#1A1A1A;}' +
      '.dms-notes-status-row{margin-top:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}' +
      '.dms-notes-status-label{font:600 11px/1 Montserrat,Verdana,sans-serif;padding:3px 8px;border-radius:999px;display:inline-flex;align-items:center;gap:4px;}' +
      '.dms-notes-status-label.pending{background:#F3F4F6;color:#656464;}' +
      '.dms-notes-status-label.ok{background:' + OK_BG + ';color:' + OK_COLOR + ';}' +
      '.dms-notes-status-label.nok{background:' + NOK_BG + ';color:' + NOK_COLOR + ';}' +
      '.dms-notes-validate{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}' +
      '.dms-notes-vbtn{font:600 11px/1 Montserrat,Verdana,sans-serif;padding:6px 10px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:background .12s ease,color .12s ease,border-color .12s ease;}' +
      '.dms-notes-vbtn.ok-out{background:#fff;border:1px solid ' + OK_COLOR + ';color:' + OK_COLOR + ';}' +
      '.dms-notes-vbtn.ok-out:hover{background:' + OK_BG + ';}' +
      '.dms-notes-vbtn.ok-solid{background:' + OK_COLOR + ';border:1px solid ' + OK_COLOR + ';color:#fff;}' +
      '.dms-notes-vbtn.nok-out{background:#fff;border:1px solid ' + NOK_COLOR + ';color:' + NOK_COLOR + ';}' +
      '.dms-notes-vbtn.nok-out:hover{background:' + NOK_BG + ';}' +
      '.dms-notes-vbtn.nok-solid{background:' + NOK_COLOR + ';border:1px solid ' + NOK_COLOR + ';color:#fff;}' +
      '.dms-notes-undo{background:transparent;border:0;color:#656464;cursor:pointer;font:500 11px/1 Montserrat,Verdana,sans-serif;padding:6px 8px;border-radius:6px;text-decoration:underline;}' +
      '.dms-notes-undo:hover{color:#1A1A1A;}' +
      '.dms-notes-fb{margin-top:8px;}' +
      '.dms-notes-fb textarea{width:100%;min-height:60px;max-height:140px;border:1px solid #FCA5A5;border-radius:6px;background:#fff;padding:8px 10px;font:400 12px/1.4 Montserrat,Verdana,sans-serif;color:#1A1A1A;resize:vertical;display:block;}' +
      '.dms-notes-fb textarea:focus{outline:none;border-color:' + NOK_COLOR + ';box-shadow:0 0 0 3px rgba(185,28,28,.15);}' +
      '.dms-notes-fb-save{margin-top:6px;background:' + NOK_COLOR + ';color:#fff;border:0;border-radius:6px;padding:6px 12px;font:600 11px/1 Montserrat,Verdana,sans-serif;cursor:pointer;}' +
      '.dms-notes-fb-save:hover{background:#991B1B;}' +
      '.dms-notes-item-meta{margin-top:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;font:500 11px/1 JetBrains Mono,Consolas,monospace;color:#656464;}' +
      '.dms-notes-del{background:transparent;border:0;color:#B91C1C;cursor:pointer;font:600 11px/1 Montserrat,Verdana,sans-serif;padding:4px 8px;border-radius:6px;}' +
      '.dms-notes-del:hover{background:#FEE2E2;}' +
      '.dms-notes-foot{flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 20px;padding-bottom:max(12px,env(safe-area-inset-bottom));border-top:1px solid #E5E7EB;background:#fff;}' +
      '.dms-notes-hint{font:500 11px/1.3 Montserrat,Verdana,sans-serif;color:#656464;flex:1 1 auto;min-width:0;}' +
      '.dms-notes-save{background:' + PRIMARY + ';color:#fff;border:0;border-radius:8px;padding:10px 18px;font:600 13px/1 Montserrat,Verdana,sans-serif;cursor:pointer;transition:background .15s ease;flex:0 0 auto;}' +
      '.dms-notes-save:hover:not(:disabled){background:' + PRIMARY_DARK + ';}' +
      '.dms-notes-save:disabled{opacity:.5;cursor:not-allowed;}' +
      '@media (max-width:768px){' +
        '.dms-notes-head{padding:14px 16px 12px;}' +
        '.dms-notes-form{padding:12px 16px;}' +
        '.dms-notes-list{padding:6px 16px 20px;}' +
        '.dms-notes-foot{padding-left:16px;padding-right:16px;}' +
        '.dms-notes-form textarea{resize:none;min-height:90px;}' +
      '}' +
      '@media (max-width:480px){' +
        '.dms-notes-drawer{width:100%;max-width:100vw;}' +
        '.dms-notes-btn{right:16px;padding:10px 14px;font-size:13px;}' +
      '}';
    var s = document.createElement('style');
    s.id = 'dms-notes-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function statusLabel(status) {
    if (status === 'ok') {
      return '<span class="dms-notes-status-label ok">✓ Aprovado</span>';
    }
    if (status === 'not-ok') {
      return '<span class="dms-notes-status-label nok">✗ Precisa ajustar</span>';
    }
    return '<span class="dms-notes-status-label pending">⏳ Aguardando validação</span>';
  }

  function noteItemHtml(n) {
    var cls = 'dms-notes-item';
    if (n.validationStatus === 'ok') cls += ' is-ok';
    else if (n.validationStatus === 'not-ok') cls += ' is-nok';

    var okClass = n.validationStatus === 'ok' ? 'ok-solid' : 'ok-out';
    var nokClass = n.validationStatus === 'not-ok' ? 'nok-solid' : 'nok-out';
    var showUndo = n.validationStatus === 'ok' || n.validationStatus === 'not-ok';

    var validateRow =
      '<div class="dms-notes-validate">' +
        '<button class="dms-notes-vbtn ' + okClass + '" data-validate="ok" data-id="' + n.id + '">✓ OK</button>' +
        '<button class="dms-notes-vbtn ' + nokClass + '" data-validate="not-ok" data-id="' + n.id + '">✗ Não OK</button>' +
        (showUndo ? '<button class="dms-notes-undo" data-validate="pending" data-id="' + n.id + '">desfazer</button>' : '') +
      '</div>';

    var feedback = '';
    if (n.validationStatus === 'not-ok') {
      feedback =
        '<div class="dms-notes-fb" data-fb-wrap="' + n.id + '">' +
          '<textarea data-fb-text="' + n.id + '" placeholder="Descreva o que não ficou bom...">' + escapeHtml(n.validationComment || '') + '</textarea>' +
          '<button class="dms-notes-fb-save" data-fb-save="' + n.id + '">' + (n.validationComment ? 'Atualizar feedback' : 'Salvar feedback') + '</button>' +
        '</div>';
    }

    return '<div class="' + cls + '" data-id="' + n.id + '">' +
      '<div class="dms-notes-item-text">' + escapeHtml(n.text) + '</div>' +
      '<div class="dms-notes-status-row">' + statusLabel(n.validationStatus) + '</div>' +
      validateRow +
      feedback +
      '<div class="dms-notes-item-meta">' +
        '<span title="' + fmtAbs(n.timestamp) + '">' + fmtRelative(n.timestamp) + ' · ' + fmtAbs(n.timestamp) + '</span>' +
        '<button class="dms-notes-del" data-del="' + n.id + '">Excluir</button>' +
      '</div>' +
      '</div>';
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
    container.innerHTML = notes.map(noteItemHtml).join('');
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

  function setStatus(id, newStatus) {
    var notes = readNotes();
    var changed = false;
    notes.forEach(function (n) {
      if (n.id === id) {
        n.validationStatus = newStatus;
        if (newStatus === 'pending') {
          n.validationComment = '';
          n.validatedAt = null;
        } else if (newStatus === 'ok') {
          n.validationComment = '';
          n.validatedAt = Date.now();
        } else if (newStatus === 'not-ok') {
          n.validatedAt = Date.now();
        }
        changed = true;
      }
    });
    if (changed) writeNotes(notes);
  }

  function setComment(id, comment) {
    var notes = readNotes();
    var changed = false;
    notes.forEach(function (n) {
      if (n.id === id) {
        n.validationComment = comment;
        n.validatedAt = Date.now();
        changed = true;
      }
    });
    if (changed) writeNotes(notes);
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
      '<div class="dms-notes-body">' +
        '<div class="dms-notes-form">' +
          '<textarea placeholder="O que você quer registrar sobre esta tela?"></textarea>' +
        '</div>' +
        '<div class="dms-notes-list"></div>' +
      '</div>' +
      '<div class="dms-notes-foot">' +
        '<span class="dms-notes-hint">Salvo localmente · veja todas em tela76</span>' +
        '<button class="dms-notes-save" disabled>Salvar anotação</button>' +
      '</div>';
    document.body.appendChild(drawer);

    var listEl = drawer.querySelector('.dms-notes-list');
    var textarea = drawer.querySelector('.dms-notes-form textarea');
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
      notes.push({
        id: Date.now(),
        text: text,
        timestamp: Date.now(),
        validationStatus: 'pending',
        validationComment: '',
        validatedAt: null
      });
      writeNotes(notes);
      textarea.value = '';
      saveBtn.disabled = true;
      renderList(listEl);
      updateBadge(btn);
    });

    listEl.addEventListener('click', function (e) {
      var delT = e.target.closest('[data-del]');
      if (delT) {
        var did = Number(delT.getAttribute('data-del'));
        var notes = readNotes().filter(function (n) { return n.id !== did; });
        writeNotes(notes);
        renderList(listEl);
        updateBadge(btn);
        return;
      }
      var vT = e.target.closest('[data-validate]');
      if (vT) {
        var vid = Number(vT.getAttribute('data-id'));
        var newStatus = vT.getAttribute('data-validate');
        setStatus(vid, newStatus);
        renderList(listEl);
        return;
      }
      var fbT = e.target.closest('[data-fb-save]');
      if (fbT) {
        var fbid = Number(fbT.getAttribute('data-fb-save'));
        var ta = listEl.querySelector('[data-fb-text="' + fbid + '"]');
        if (ta) {
          setComment(fbid, ta.value.trim());
          renderList(listEl);
        }
      }
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
