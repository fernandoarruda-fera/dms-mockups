/* DMS Mockups — List Customizer (B11 - Personalização por perfil)
 * Self-contained. Inject via <script src="list-customizer.js" defer></script>
 * Adds a "⚙️ Personalizar" button near customizable lists, opens a side drawer
 * with tabs: Colunas / Ordem / Badges. Saves preferences per profile in localStorage.
 * Storage key: `dms-prefs-{userId}-{pageKey}` (userId default = 'default-user').
 *
 * Detection: element with attribute `data-customizable="true"`.
 * Conceptual mockup — UI feedback works; actual column/order/badge changes are not applied to the live table.
 */
(function () {
  if (window.__dmsListCustomizerLoaded) return;
  window.__dmsListCustomizerLoaded = true;

  var PRIMARY = '#643585';
  var PRIMARY_DARK = '#4f2a6a';
  var BORDER = '#E5E7EB';
  var TEXT = '#1A1A1A';
  var MUTED = '#656464';
  var BG = '#F8F9FA';

  var USER_ID = 'default-user';

  function pageKey() {
    var p = (location.pathname || '').split('/').pop() || '';
    p = p.replace(/\.html?$/i, '');
    return p || 'index';
  }
  var STORAGE_KEY = 'dms-prefs-' + USER_ID + '-' + pageKey();

  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultPrefs(); }
    catch (e) { return defaultPrefs(); }
  }
  function writePrefs(prefs) {
    try {
      prefs._savedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }
  function defaultPrefs() {
    return {
      columns: [
        { id: 'col1', label: 'Coluna 1', visible: true },
        { id: 'col2', label: 'Coluna 2', visible: true },
        { id: 'col3', label: 'Coluna 3', visible: true },
        { id: 'col4', label: 'Coluna 4', visible: true },
        { id: 'col5', label: 'Coluna 5', visible: true },
      ],
      badges: { kpis: true, counters: true, slaBars: true },
      _savedAt: null,
    };
  }

  function detectColumns(table) {
    if (!table) return null;
    var ths = table.querySelectorAll('thead th');
    if (!ths.length) return null;
    var cols = [];
    for (var i = 0; i < ths.length; i++) {
      var label = (ths[i].textContent || '').trim() || ('Coluna ' + (i + 1));
      cols.push({ id: 'col_' + i, label: label, visible: true });
    }
    return cols;
  }

  function fmtRelative(ts) {
    if (!ts) return '';
    var diff = Date.now() - ts;
    var s = Math.floor(diff / 1000);
    if (s < 60) return 'agora';
    var m = Math.floor(s / 60);
    if (m < 60) return 'há ' + m + 'min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'há ' + h + 'h';
    var d = Math.floor(h / 24);
    return 'há ' + d + 'd';
  }

  function injectStyle() {
    if (document.getElementById('dms-lc-style')) return;
    var st = document.createElement('style');
    st.id = 'dms-lc-style';
    st.textContent = '' +
      '.dms-lc-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: ' + PRIMARY + '; background: white; border: 1px solid ' + PRIMARY + '; border-radius: 6px; padding: 6px 10px; cursor: pointer; transition: background 150ms; line-height: 1; position: relative; }' +
      '.dms-lc-btn:hover { background: rgba(100,53,133,0.06); }' +
      '.dms-lc-btn.dms-lc-pulse { animation: dmsLcPulse 1.2s ease-out 1; box-shadow: 0 0 0 0 rgba(100,53,133,0.5); }' +
      '@keyframes dmsLcPulse { 0% { box-shadow: 0 0 0 0 rgba(100,53,133,0.55); } 70% { box-shadow: 0 0 0 12px rgba(100,53,133,0); } 100% { box-shadow: 0 0 0 0 rgba(100,53,133,0); } }' +
      '.dms-lc-hint { position: absolute; top: -38px; left: 50%; transform: translateX(-50%); background: #1A1A1A; color: white; font-size: 11px; padding: 6px 10px; border-radius: 6px; white-space: nowrap; z-index: 90; opacity: 0; transition: opacity 200ms; pointer-events: none; }' +
      '.dms-lc-hint::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #1A1A1A; }' +
      '.dms-lc-hint.show { opacity: 1; }' +
      '.dms-lc-btn-wrap { display: inline-flex; align-items: center; gap: 8px; }' +
      '.dms-lc-saved { font-size: 11px; color: ' + MUTED + '; }' +
      '.dms-lc-overlay { position: fixed; inset: 0; background: rgba(0,56,108,0.45); backdrop-filter: blur(2px); z-index: 70; }' +
      '.dms-lc-drawer { position: fixed; right: 0; top: 0; height: 100vh; width: 320px; max-width: 92vw; background: white; box-shadow: -8px 0 24px rgba(0,0,0,0.12); z-index: 71; display: flex; flex-direction: column; animation: dmsLcSlide 200ms ease-out; }' +
      '@keyframes dmsLcSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }' +
      '.dms-lc-head { padding: 16px 18px; border-bottom: 1px solid ' + BORDER + '; display: flex; align-items: center; justify-content: space-between; }' +
      '.dms-lc-title { font-weight: 700; font-size: 14px; color: #00386C; }' +
      '.dms-lc-close { background: none; border: 0; cursor: pointer; color: ' + MUTED + '; font-size: 18px; padding: 4px; }' +
      '.dms-lc-tabs { display: flex; border-bottom: 1px solid ' + BORDER + '; }' +
      '.dms-lc-tab { flex: 1; padding: 10px 8px; background: none; border: 0; border-bottom: 2px solid transparent; font-size: 12px; font-weight: 600; color: ' + MUTED + '; cursor: pointer; }' +
      '.dms-lc-tab.active { color: ' + PRIMARY + '; border-bottom-color: ' + PRIMARY + '; }' +
      '.dms-lc-body { flex: 1; overflow-y: auto; padding: 14px 18px; }' +
      '.dms-lc-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid ' + BORDER + '; border-radius: 6px; margin-bottom: 6px; background: white; }' +
      '.dms-lc-item input[type=checkbox] { accent-color: ' + PRIMARY + '; width: 14px; height: 14px; }' +
      '.dms-lc-item .lbl { font-size: 13px; color: ' + TEXT + '; flex: 1; }' +
      '.dms-lc-drag { color: #C0C0C0; cursor: grab; font-size: 14px; user-select: none; }' +
      '.dms-lc-foot { padding: 12px 18px; border-top: 1px solid ' + BORDER + '; display: flex; gap: 8px; align-items: center; }' +
      '.dms-lc-save { flex: 1; background: ' + PRIMARY + '; color: white; border: 0; border-radius: 6px; padding: 9px 12px; font-size: 13px; font-weight: 700; cursor: pointer; }' +
      '.dms-lc-save:hover { background: ' + PRIMARY_DARK + '; }' +
      '.dms-lc-reset { background: white; color: ' + PRIMARY + '; border: 1px solid ' + PRIMARY + '; border-radius: 6px; padding: 9px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }' +
      '.dms-lc-toast { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); background: #1A1A1A; color: white; font-size: 12px; padding: 10px 14px; border-radius: 6px; z-index: 80; opacity: 0; transition: opacity 200ms; pointer-events: none; }' +
      '.dms-lc-toast.show { opacity: 1; }';
    document.head.appendChild(st);
  }

  function showToast(msg) {
    var t = document.getElementById('dms-lc-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'dms-lc-toast';
      t.className = 'dms-lc-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t.__hideT);
    t.__hideT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  var currentTab = 'colunas';
  var workingPrefs = null;

  function renderTabBody() {
    var body = document.getElementById('dms-lc-body');
    if (!body) return;
    var html = '';
    if (currentTab === 'colunas') {
      html += '<div style="font-size:11px; color:' + MUTED + '; margin-bottom:10px;">Ative ou desative colunas da lista.</div>';
      workingPrefs.columns.forEach(function (c, idx) {
        html += '<label class="dms-lc-item" data-idx="' + idx + '">' +
          '<input type="checkbox" data-action="col-toggle" data-idx="' + idx + '"' + (c.visible ? ' checked' : '') + '>' +
          '<span class="lbl">' + escapeHtml(c.label) + '</span>' +
          '</label>';
      });
    } else if (currentTab === 'ordem') {
      html += '<div style="font-size:11px; color:' + MUTED + '; margin-bottom:10px;">Arraste pra reordenar (visual — mockup conceitual).</div>';
      workingPrefs.columns.forEach(function (c, idx) {
        html += '<div class="dms-lc-item" data-idx="' + idx + '">' +
          '<span class="dms-lc-drag">⋮⋮</span>' +
          '<span class="lbl">' + escapeHtml(c.label) + '</span>' +
          '<span style="font-size:11px; color:' + MUTED + ';">#' + (idx + 1) + '</span>' +
          '</div>';
      });
    } else if (currentTab === 'badges') {
      html += '<div style="font-size:11px; color:' + MUTED + '; margin-bottom:10px;">Mostrar/esconder KPI tiles e contadores do topo.</div>';
      var items = [
        { id: 'kpis', label: 'KPI tiles do topo' },
        { id: 'counters', label: 'Contadores em abas' },
        { id: 'slaBars', label: 'Barras de SLA' },
      ];
      items.forEach(function (it) {
        html += '<label class="dms-lc-item">' +
          '<input type="checkbox" data-action="badge-toggle" data-id="' + it.id + '"' + (workingPrefs.badges[it.id] ? ' checked' : '') + '>' +
          '<span class="lbl">' + it.label + '</span>' +
          '</label>';
      });
    }
    body.innerHTML = html;

    body.querySelectorAll('[data-action=col-toggle]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var idx = +cb.getAttribute('data-idx');
        workingPrefs.columns[idx].visible = cb.checked;
      });
    });
    body.querySelectorAll('[data-action=badge-toggle]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = cb.getAttribute('data-id');
        workingPrefs.badges[id] = cb.checked;
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function openDrawer() {
    injectStyle();
    workingPrefs = readPrefs();
    currentTab = 'colunas';

    var ov = document.createElement('div');
    ov.className = 'dms-lc-overlay';
    ov.id = 'dms-lc-overlay';
    ov.addEventListener('click', closeDrawer);
    document.body.appendChild(ov);

    var dr = document.createElement('div');
    dr.className = 'dms-lc-drawer';
    dr.id = 'dms-lc-drawer';
    dr.innerHTML =
      '<div class="dms-lc-head">' +
        '<div class="dms-lc-title">⚙️ Personalizar lista</div>' +
        '<button class="dms-lc-close" id="dms-lc-close" aria-label="Fechar">✕</button>' +
      '</div>' +
      '<div class="dms-lc-tabs">' +
        '<button class="dms-lc-tab active" data-tab="colunas">Colunas</button>' +
        '<button class="dms-lc-tab" data-tab="ordem">Ordem</button>' +
        '<button class="dms-lc-tab" data-tab="badges">Badges</button>' +
      '</div>' +
      '<div class="dms-lc-body" id="dms-lc-body"></div>' +
      '<div class="dms-lc-foot">' +
        '<button class="dms-lc-reset" id="dms-lc-reset">Restaurar padrão</button>' +
        '<button class="dms-lc-save" id="dms-lc-save">Salvar preferências</button>' +
      '</div>';
    document.body.appendChild(dr);

    document.getElementById('dms-lc-close').addEventListener('click', closeDrawer);
    dr.querySelectorAll('.dms-lc-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        dr.querySelectorAll('.dms-lc-tab').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        currentTab = t.getAttribute('data-tab');
        renderTabBody();
      });
    });
    document.getElementById('dms-lc-save').addEventListener('click', function () {
      writePrefs(workingPrefs);
      updateSavedIndicator();
      showToast('✓ Preferências atualizadas');
      closeDrawer();
    });
    document.getElementById('dms-lc-reset').addEventListener('click', function () {
      workingPrefs = defaultPrefs();
      renderTabBody();
      showToast('Padrão restaurado (não salvo)');
    });

    renderTabBody();
  }

  function closeDrawer() {
    var ov = document.getElementById('dms-lc-overlay');
    var dr = document.getElementById('dms-lc-drawer');
    if (ov) ov.remove();
    if (dr) dr.remove();
  }

  function updateSavedIndicator() {
    var prefs = readPrefs();
    document.querySelectorAll('.dms-lc-saved').forEach(function (el) {
      if (prefs._savedAt) el.textContent = '✓ Preferências salvas ' + fmtRelative(prefs._savedAt);
      else el.textContent = '';
    });
  }

  function injectButtons() {
    var targets = document.querySelectorAll('[data-customizable="true"]');
    if (!targets.length) return;

    targets.forEach(function (target) {
      if (target.__dmsLcInjected) return;
      target.__dmsLcInjected = true;

      var table = target.matches('table') ? target : target.querySelector('table');
      var detected = detectColumns(table);
      if (detected && detected.length) {
        var saved = readPrefs();
        if (!saved._fromTable) {
          saved.columns = detected;
          saved._fromTable = true;
          // do not auto-persist; keep default in memory until user saves
        }
      }

      var btnWrap = document.createElement('div');
      btnWrap.className = 'dms-lc-btn-wrap';
      btnWrap.style.cssText = 'position:relative; display:inline-flex; align-items:center; gap:8px;';
      btnWrap.innerHTML =
        '<button type="button" class="dms-lc-btn" data-action="open-lc" title="Escolha quais colunas, badges e métricas aparecem na sua visão">' +
          '<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' +
          'Personalizar' +
          '<span class="dms-lc-hint">Experimente! ✨</span>' +
        '</button>' +
        '<span class="dms-lc-saved"></span>';
      // pulse + flutuante hint on first load
      var btnEl = btnWrap.querySelector('.dms-lc-btn');
      var hintEl = btnWrap.querySelector('.dms-lc-hint');
      setTimeout(function(){
        if(btnEl){ btnEl.classList.add('dms-lc-pulse'); }
        if(hintEl){ hintEl.classList.add('show'); }
        setTimeout(function(){
          if(hintEl){ hintEl.classList.remove('show'); }
          if(btnEl){ btnEl.classList.remove('dms-lc-pulse'); }
        }, 3000);
      }, 800);

      btnWrap.querySelector('[data-action=open-lc]').addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDrawer();
      });

      // Insertion strategy: prefer dropping above the customizable container, aligned to the right.
      var anchor = target.previousElementSibling;
      var inserted = false;
      // Try to find a toolbar/header sibling and append the button to it for less layout disruption.
      var prev = target.parentElement;
      if (prev) {
        var toolbar = prev.querySelector('.flex.items-center.justify-between');
        if (toolbar && toolbar !== target && !toolbar.__dmsLcHosted) {
          toolbar.__dmsLcHosted = true;
          var rightSide = toolbar.children[toolbar.children.length - 1];
          if (rightSide && rightSide !== toolbar.firstElementChild) {
            rightSide.style.display = 'flex';
            rightSide.style.alignItems = 'center';
            rightSide.style.gap = rightSide.style.gap || '12px';
            rightSide.appendChild(btnWrap);
            inserted = true;
          } else {
            toolbar.appendChild(btnWrap);
            inserted = true;
          }
        }
      }
      if (!inserted) {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex; justify-content:flex-end; align-items:center; gap:8px; margin: 0 0 8px;';
        wrap.appendChild(btnWrap);
        target.parentNode.insertBefore(wrap, target);
      }
    });

    updateSavedIndicator();
  }

  function boot() {
    injectStyle();
    injectButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
