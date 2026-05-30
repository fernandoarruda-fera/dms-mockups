/* DMS Mockups — TAG Filter + Filtros Salvos (global)
 * Self-contained. Inject via <script src="tag-filter.js" defer></script>
 * Adiciona em listagens:
 *  - Botão flutuante 🏷️ "Filtro TAG" (canto inferior direito)
 *  - Botão 📑 "Filtros salvos" no mesmo cluster
 *  - Modal de criação de filtro TAG (TAG → campo → operador → valor)
 *  - Chips removíveis ancorados no topo do <main>
 *  - Modal "Salvar este filtro" com escopo Privado/Equipe/Global
 *  - Drawer "Filtros salvos" com 3 abas (Meus/Equipe/Globais)
 * Persistência: localStorage `dms-saved-filters` + `dms-active-tag-filters`
 * Mockup conceitual — não realiza filtragem real (apenas demonstra UX).
 */
(function () {
  if (window.__dmsTagFilterLoaded) return;
  window.__dmsTagFilterLoaded = true;

  var PRIMARY = '#643585';
  var MAR = '#00386C';
  var CEU = '#00AEEE';
  var BG = '#F8F9FA';
  var BORDER = '#E5E7EB';
  var ACCENT = '#B0C934';

  var STORAGE_SAVED = 'dms-saved-filters';
  var STORAGE_ACTIVE = 'dms-active-tag-filters';
  var STORAGE_USER = 'dms-current-user';

  // ---------- TAG catalog (mockado) ----------
  var TAGS = [
    { name: 'Categoria',        fields: ['raiz', 'subcategoria', 'classe'] },
    { name: 'Centro de Custo',  fields: ['codigo', 'nome', 'gestor'] },
    { name: 'Fornecedor',       fields: ['razao_social', 'cnpj', 'tier', 'pais'] },
    { name: 'Departamento',     fields: ['sigla', 'nome', 'diretor'] },
    { name: 'Status Fiscal',    fields: ['codigo', 'descricao'] },
    { name: 'Filial',           fields: ['codigo', 'cidade', 'uf'] },
    { name: 'Workflow',         fields: ['nome', 'versao', 'tipo'] },
    { name: 'Projeto',          fields: ['nome', 'cliente', 'prazo'] },
    { name: 'Linha de Negócio', fields: ['nome', 'segmento'] },
    { name: 'Tipo de Documento', fields: ['codigo', 'descricao'] },
  ];

  var OPERATORS = [
    { code: '=',       label: '=' },
    { code: 'contains', label: 'contém' },
    { code: 'regex',   label: 'regex' },
    { code: '>',       label: '>' },
    { code: '<',       label: '<' },
    { code: 'between', label: 'entre' },
  ];

  var SCOPES = [
    { code: 'private', label: 'Privado', icon: '🔒', desc: 'só eu' },
    { code: 'team',    label: 'Equipe',  icon: '👥', desc: 'compartilha com pessoas do meu time' },
    { code: 'global',  label: 'Global',  icon: '🌐', desc: 'todo mundo' },
  ];

  // ---------- helpers ----------
  function currentUser() {
    try {
      var u = localStorage.getItem(STORAGE_USER);
      return u || 'fernando.arruda';
    } catch (e) { return 'fernando.arruda'; }
  }

  function pageKey() {
    var p = (location.pathname || '').split('/').pop().replace('.html', '');
    return p || 'index';
  }

  function loadSavedFilters() {
    try {
      var raw = localStorage.getItem(STORAGE_SAVED);
      if (!raw) {
        seedDefaults();
        raw = localStorage.getItem(STORAGE_SAVED);
      }
      return JSON.parse(raw || '[]');
    } catch (e) { return []; }
  }

  function persistSavedFilters(list) {
    try { localStorage.setItem(STORAGE_SAVED, JSON.stringify(list)); } catch (e) {}
  }

  function loadActiveChips() {
    try {
      var raw = sessionStorage.getItem(STORAGE_ACTIVE + ':' + pageKey());
      return JSON.parse(raw || '[]');
    } catch (e) { return []; }
  }

  function persistActiveChips(list) {
    try { sessionStorage.setItem(STORAGE_ACTIVE + ':' + pageKey(), JSON.stringify(list)); } catch (e) {}
  }

  function seedDefaults() {
    var now = Date.now();
    var defaults = [
      { id: now-700000, name: 'NFs Transportadora 2026', scope: 'private', owner: currentUser(), pageKey: 'tela38-notas-fiscais-list',
        filters: [{ tag: 'Categoria', field: 'subcategoria', op: '=', value: 'Transporte' }], createdAt: now-700000, lastUsed: now-200000 },
      { id: now-650000, name: 'Pedidos críticos SLA', scope: 'team', owner: 'maria.lima', pageKey: 'tela27-pedidos-list',
        filters: [{ tag: 'Workflow', field: 'tipo', op: '=', value: 'Aprovação Diretoria' }], createdAt: now-650000, lastUsed: now-100000 },
      { id: now-600000, name: 'Cotações > 50k', scope: 'global', owner: 'roberto.santos', pageKey: 'tela24-cotacoes-list',
        filters: [{ tag: 'Centro de Custo', field: 'codigo', op: 'contains', value: 'CC-' }], createdAt: now-600000, lastUsed: now-80000 },
      { id: now-550000, name: 'Material limpeza filial SP', scope: 'private', owner: currentUser(), pageKey: 'tela21-requisicoes-list',
        filters: [
          { tag: 'Categoria', field: 'subcategoria', op: '=', value: 'Material limpeza' },
          { tag: 'Filial', field: 'uf', op: '=', value: 'SP' }
        ], createdAt: now-550000, lastUsed: now-40000 },
      { id: now-500000, name: 'Aprovações pendentes diretoria', scope: 'team', owner: 'rh.team', pageKey: 'tela40-aprovacoes-list',
        filters: [{ tag: 'Departamento', field: 'diretor', op: 'contains', value: 'CEO' }], createdAt: now-500000, lastUsed: now-60000 },
      { id: now-450000, name: 'Contratos vencendo 30d', scope: 'global', owner: 'juridico.team', pageKey: 'tela44-contratos-list',
        filters: [{ tag: 'Tipo de Documento', field: 'codigo', op: '=', value: 'CTR' }], createdAt: now-450000, lastUsed: now-30000 },
      { id: now-400000, name: 'Audit trail último mês', scope: 'private', owner: currentUser(), pageKey: 'tela13-audit-trail',
        filters: [{ tag: 'Workflow', field: 'versao', op: '>', value: '3.0' }], createdAt: now-400000, lastUsed: now-20000 },
      { id: now-350000, name: 'Fornecedores tier A APAC', scope: 'global', owner: 'sourcing.team', pageKey: 'tela30-empresas-list',
        filters: [
          { tag: 'Fornecedor', field: 'tier', op: '=', value: 'A' },
          { tag: 'Fornecedor', field: 'pais', op: 'regex', value: '^(JP|KR|CN)$' }
        ], createdAt: now-350000, lastUsed: now-10000 },
    ];
    try { localStorage.setItem(STORAGE_SAVED, JSON.stringify(defaults)); } catch (e) {}
  }

  function fmtFilter(f) {
    return 'TAG ' + f.tag + ' · ' + f.field + ' · ' + f.op + ' "' + f.value + '"';
  }

  function uid() { return Date.now() + Math.floor(Math.random()*1000); }

  // ---------- styles (injected once) ----------
  function injectStyles() {
    if (document.getElementById('dms-tag-filter-css')) return;
    var s = document.createElement('style');
    s.id = 'dms-tag-filter-css';
    s.textContent = [
      '.dms-tf-fab { position:fixed; right:16px; bottom:84px; z-index:9998; display:flex; flex-direction:column; gap:8px; align-items:flex-end; font-family:Inter,system-ui,sans-serif; }',
      '.dms-tf-fab button { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid '+BORDER+'; padding:8px 12px; border-radius:10px; font-size:12px; font-weight:700; color:'+MAR+'; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.08); transition:transform .12s ease, box-shadow .12s ease; }',
      '.dms-tf-fab button:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(0,0,0,0.12); }',
      '.dms-tf-fab button .dms-tf-badge { background:'+PRIMARY+'; color:#fff; border-radius:10px; padding:2px 7px; font-size:10px; font-weight:800; }',
      '#dms-tf-chips-bar { display:flex; flex-wrap:wrap; gap:6px; padding:10px 16px; background:#FFF8E1; border-bottom:1px solid #F5E0A5; font-family:Inter,system-ui,sans-serif; font-size:12px; align-items:center; }',
      '#dms-tf-chips-bar.empty { display:none; }',
      '.dms-tf-chip { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid '+BORDER+'; border-radius:14px; padding:4px 10px; font-size:11px; font-weight:600; color:'+MAR+'; }',
      '.dms-tf-chip button { background:transparent; border:0; color:#9CA3AF; cursor:pointer; font-size:14px; line-height:1; padding:0 2px; }',
      '.dms-tf-chip button:hover { color:#DC2626; }',
      '.dms-tf-chips-actions { margin-left:auto; display:flex; gap:6px; }',
      '.dms-tf-chips-actions button { background:'+PRIMARY+'; color:#fff; border:0; border-radius:8px; padding:6px 12px; font-size:11px; font-weight:700; cursor:pointer; }',
      '.dms-tf-chips-actions .secondary { background:#fff; color:'+MAR+'; border:1px solid '+BORDER+'; }',
      '.dms-tf-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:10000; display:flex; align-items:center; justify-content:center; font-family:Inter,system-ui,sans-serif; }',
      '.dms-tf-modal { background:#fff; border-radius:12px; width:min(560px, 92vw); max-height:88vh; overflow:auto; box-shadow:0 24px 60px rgba(0,0,0,0.25); }',
      '.dms-tf-modal header { padding:14px 18px; border-bottom:1px solid '+BORDER+'; display:flex; align-items:center; justify-content:space-between; }',
      '.dms-tf-modal header h3 { margin:0; font-size:15px; font-weight:700; color:'+MAR+'; }',
      '.dms-tf-modal header button { background:transparent; border:0; color:#9CA3AF; font-size:22px; cursor:pointer; line-height:1; }',
      '.dms-tf-modal .body { padding:16px 18px; }',
      '.dms-tf-modal .footer { padding:12px 18px; border-top:1px solid '+BORDER+'; display:flex; gap:8px; justify-content:flex-end; background:'+BG+'; }',
      '.dms-tf-modal .footer button { padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid '+BORDER+'; background:#fff; color:'+MAR+'; }',
      '.dms-tf-modal .footer button.primary { background:'+PRIMARY+'; color:#fff; border-color:'+PRIMARY+'; }',
      '.dms-tf-field { margin-bottom:12px; }',
      '.dms-tf-field label { display:block; font-size:11px; font-weight:700; color:#6B7280; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.04em; }',
      '.dms-tf-field select, .dms-tf-field input { width:100%; padding:8px 10px; border:1px solid '+BORDER+'; border-radius:8px; font-size:13px; color:'+MAR+'; background:#fff; box-sizing:border-box; }',
      '.dms-tf-field select:focus, .dms-tf-field input:focus { outline:none; border-color:'+CEU+'; box-shadow:0 0 0 3px rgba(0,174,238,0.18); }',
      '.dms-tf-row { display:flex; gap:8px; }',
      '.dms-tf-row .dms-tf-field { flex:1; }',
      '.dms-tf-scope-list { display:flex; flex-direction:column; gap:8px; }',
      '.dms-tf-scope-item { display:flex; align-items:flex-start; gap:10px; padding:10px; border:1px solid '+BORDER+'; border-radius:8px; cursor:pointer; background:#fff; }',
      '.dms-tf-scope-item:hover { background:'+BG+'; }',
      '.dms-tf-scope-item.selected { border-color:'+PRIMARY+'; background:#F5EBF8; }',
      '.dms-tf-scope-item input { margin-top:3px; }',
      '.dms-tf-scope-item .icon { font-size:18px; }',
      '.dms-tf-scope-item .name { font-weight:700; font-size:13px; color:'+MAR+'; }',
      '.dms-tf-scope-item .desc { font-size:11px; color:#6B7280; margin-top:2px; }',
      '.dms-tf-preview { margin-top:6px; padding:10px; background:'+BG+'; border:1px dashed '+BORDER+'; border-radius:8px; font-size:11px; color:'+MAR+'; }',
      '.dms-tf-preview .item { padding:3px 0; font-family:JetBrains Mono, Consolas, monospace; }',
      '.dms-tf-tabs { display:flex; gap:0; border-bottom:1px solid '+BORDER+'; margin-bottom:12px; }',
      '.dms-tf-tabs button { padding:10px 14px; background:transparent; border:0; border-bottom:2px solid transparent; font-size:12px; font-weight:700; color:#6B7280; cursor:pointer; }',
      '.dms-tf-tabs button.active { color:'+PRIMARY+'; border-bottom-color:'+PRIMARY+'; }',
      '.dms-tf-saved-list { display:flex; flex-direction:column; gap:8px; }',
      '.dms-tf-saved-item { padding:10px 12px; border:1px solid '+BORDER+'; border-radius:8px; display:flex; align-items:center; gap:10px; background:#fff; }',
      '.dms-tf-saved-item .info { flex:1; min-width:0; }',
      '.dms-tf-saved-item .name { font-weight:700; font-size:13px; color:'+MAR+'; }',
      '.dms-tf-saved-item .meta { font-size:11px; color:#6B7280; margin-top:2px; }',
      '.dms-tf-saved-item .badge { display:inline-block; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:700; margin-right:4px; }',
      '.dms-tf-saved-item .badge.private { background:#E5E7EB; color:#374151; }',
      '.dms-tf-saved-item .badge.team    { background:#DBEAFE; color:#1E40AF; }',
      '.dms-tf-saved-item .badge.global  { background:#DCFCE7; color:#166534; }',
      '.dms-tf-saved-item .actions { display:flex; gap:4px; }',
      '.dms-tf-saved-item .actions button { padding:5px 10px; border:1px solid '+BORDER+'; background:#fff; color:'+MAR+'; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; }',
      '.dms-tf-saved-item .actions button.primary { background:'+PRIMARY+'; color:#fff; border-color:'+PRIMARY+'; }',
      '.dms-tf-saved-item .actions button.danger { color:#DC2626; }',
      '.dms-tf-empty { text-align:center; padding:24px 12px; color:#9CA3AF; font-size:12px; }',
      '.dms-tf-mockup-note { margin-top:10px; padding:8px 10px; background:#FFF8E1; border:1px solid #F5E0A5; border-radius:6px; font-size:11px; color:#78651A; text-align:center; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ---------- chips bar ----------
  function ensureChipsBar() {
    if (document.getElementById('dms-tf-chips-bar')) return document.getElementById('dms-tf-chips-bar');
    var main = document.querySelector('main') || document.body.firstElementChild;
    var bar = document.createElement('div');
    bar.id = 'dms-tf-chips-bar';
    bar.className = 'empty';
    if (main && main.parentNode) {
      main.parentNode.insertBefore(bar, main);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
    return bar;
  }

  function renderChips() {
    var bar = ensureChipsBar();
    var chips = loadActiveChips();
    bar.innerHTML = '';
    if (!chips.length) {
      bar.className = 'empty';
      return;
    }
    bar.className = '';
    var lbl = document.createElement('span');
    lbl.style.cssText = 'font-weight:700;color:#78651A;margin-right:4px;';
    lbl.textContent = '🏷️ Filtros TAG aplicados:';
    bar.appendChild(lbl);

    chips.forEach(function (c, i) {
      var chip = document.createElement('span');
      chip.className = 'dms-tf-chip';
      chip.innerHTML = fmtFilter(c);
      var x = document.createElement('button');
      x.textContent = '✕';
      x.title = 'Remover filtro';
      x.onclick = function () {
        var list = loadActiveChips();
        list.splice(i, 1);
        persistActiveChips(list);
        renderChips();
        updateFabBadge();
      };
      chip.appendChild(x);
      bar.appendChild(chip);
    });

    var actions = document.createElement('div');
    actions.className = 'dms-tf-chips-actions';

    var saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Salvar este filtro';
    saveBtn.onclick = openSaveModal;
    actions.appendChild(saveBtn);

    var clearBtn = document.createElement('button');
    clearBtn.className = 'secondary';
    clearBtn.textContent = 'Limpar tudo';
    clearBtn.onclick = function () {
      persistActiveChips([]);
      renderChips();
      updateFabBadge();
    };
    actions.appendChild(clearBtn);

    bar.appendChild(actions);
  }

  // ---------- modal: criar filtro TAG ----------
  function openTagFilterModal() {
    var overlay = makeOverlay();
    var modal = makeModalShell('🏷️ Adicionar filtro por TAG');
    overlay.appendChild(modal.root);

    var body = modal.body;

    // Linha 1: TAG
    var f1 = field('TAG', selectEl(['— Selecione —'].concat(TAGS.map(function (t) { return t.name; })), function (v) {
      var t = TAGS.filter(function (x) { return x.name === v; })[0];
      f2Sel.innerHTML = '';
      ['— Selecione —'].concat(t ? t.fields : []).forEach(function (op) {
        var o = document.createElement('option'); o.value = op === '— Selecione —' ? '' : op; o.textContent = op; f2Sel.appendChild(o);
      });
      f2Wrap.style.display = t ? '' : 'none';
      f3Wrap.style.display = 'none';
    }));
    body.appendChild(f1.wrap);

    // Linha 2: campo
    var f2Sel = document.createElement('select');
    f2Sel.className = '';
    var f2 = field('Campo da TAG', f2Sel);
    f2Sel.onchange = function () {
      f3Wrap.style.display = f2Sel.value ? '' : 'none';
    };
    body.appendChild(f2.wrap);
    var f2Wrap = f2.wrap; f2Wrap.style.display = 'none';

    // Linha 3: operador + valor
    var row = document.createElement('div'); row.className = 'dms-tf-row';
    var opSel = selectEl(OPERATORS.map(function (o) { return o.label; }), function () {});
    var valInput = document.createElement('input'); valInput.type = 'text'; valInput.placeholder = 'Valor';
    var f3a = field('Operador', opSel);
    var f3b = field('Valor', valInput);
    row.appendChild(f3a.wrap);
    row.appendChild(f3b.wrap);
    body.appendChild(row);
    var f3Wrap = row; f3Wrap.style.display = 'none';

    var note = document.createElement('div');
    note.className = 'dms-tf-mockup-note';
    note.innerHTML = '⚠️ Mockup conceitual — filtro é adicionado como chip mas não filtra a tabela.';
    body.appendChild(note);

    var addBtn = btn('+ Adicionar filtro TAG', 'primary', function () {
      var tag = f1.input.value;
      var fld = f2Sel.value;
      var opLabel = opSel.value;
      var opCode = (OPERATORS.filter(function (o) { return o.label === opLabel; })[0] || {}).code || '=';
      var val = valInput.value.trim();
      if (!tag || !fld || !val) return;
      var list = loadActiveChips();
      list.push({ tag: tag, field: fld, op: opCode, value: val });
      persistActiveChips(list);
      renderChips();
      updateFabBadge();
      overlay.remove();
    });
    var cancelBtn = btn('Cancelar', '', function () { overlay.remove(); });
    modal.footer.appendChild(cancelBtn);
    modal.footer.appendChild(addBtn);

    document.body.appendChild(overlay);
  }

  // ---------- modal: salvar filtro ----------
  function openSaveModal() {
    var chips = loadActiveChips();
    if (!chips.length) return;

    var overlay = makeOverlay();
    var modal = makeModalShell('💾 Salvar este filtro');
    overlay.appendChild(modal.root);

    var body = modal.body;

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Ex.: NFs Transportadora 2026';
    var nameF = field('Nome do filtro *', nameInput);
    body.appendChild(nameF.wrap);

    var scopeLbl = document.createElement('label');
    scopeLbl.textContent = 'Escopo';
    scopeLbl.style.cssText = 'display:block;font-size:11px;font-weight:700;color:#6B7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;';
    body.appendChild(scopeLbl);

    var scopeWrap = document.createElement('div'); scopeWrap.className = 'dms-tf-scope-list';
    var selectedScope = 'private';
    SCOPES.forEach(function (sc) {
      var item = document.createElement('label');
      item.className = 'dms-tf-scope-item' + (sc.code === selectedScope ? ' selected' : '');
      var r = document.createElement('input'); r.type = 'radio'; r.name = 'dms-tf-scope'; r.value = sc.code; r.checked = sc.code === selectedScope;
      r.onchange = function () {
        selectedScope = sc.code;
        scopeWrap.querySelectorAll('.dms-tf-scope-item').forEach(function (n, idx) {
          n.classList.toggle('selected', SCOPES[idx].code === selectedScope);
        });
      };
      item.appendChild(r);
      var icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = sc.icon;
      item.appendChild(icon);
      var info = document.createElement('span');
      info.innerHTML = '<span class="name">' + sc.label + '</span><span class="desc">' + sc.desc + '</span>';
      info.style.cssText = 'flex:1;display:flex;flex-direction:column;';
      item.appendChild(info);
      scopeWrap.appendChild(item);
    });
    body.appendChild(scopeWrap);

    var prev = document.createElement('div'); prev.style.marginTop = '12px';
    var pl = document.createElement('label'); pl.textContent = 'Filtros incluídos';
    pl.style.cssText = 'display:block;font-size:11px;font-weight:700;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;';
    prev.appendChild(pl);
    var pBox = document.createElement('div'); pBox.className = 'dms-tf-preview';
    chips.forEach(function (c) {
      var it = document.createElement('div'); it.className = 'item'; it.textContent = '• ' + fmtFilter(c); pBox.appendChild(it);
    });
    prev.appendChild(pBox);
    body.appendChild(prev);

    var cancelBtn = btn('Cancelar', '', function () { overlay.remove(); });
    var saveBtn = btn('Salvar', 'primary', function () {
      var name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      var list = loadSavedFilters();
      list.push({
        id: uid(),
        name: name,
        scope: selectedScope,
        owner: currentUser(),
        pageKey: pageKey(),
        filters: chips.slice(),
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });
      persistSavedFilters(list);
      overlay.remove();
      showToast('Filtro "' + name + '" salvo (' + selectedScope + ')');
    });
    modal.footer.appendChild(cancelBtn);
    modal.footer.appendChild(saveBtn);

    document.body.appendChild(overlay);
  }

  // ---------- drawer: filtros salvos ----------
  function openSavedDrawer() {
    var overlay = makeOverlay();
    var modal = makeModalShell('📑 Filtros salvos');
    overlay.appendChild(modal.root);
    modal.root.style.width = 'min(640px, 92vw)';

    var body = modal.body;
    var tabs = document.createElement('div'); tabs.className = 'dms-tf-tabs';
    var tabBtns = {};
    var current = 'mine';
    ['mine', 'team', 'global'].forEach(function (kind) {
      var b = document.createElement('button');
      b.dataset.kind = kind;
      b.textContent = kind === 'mine' ? 'Meus' : (kind === 'team' ? 'Equipe' : 'Globais');
      b.className = (kind === current ? 'active' : '');
      b.onclick = function () {
        current = kind;
        Object.keys(tabBtns).forEach(function (k) { tabBtns[k].className = (k === current ? 'active' : ''); });
        renderList();
      };
      tabBtns[kind] = b;
      tabs.appendChild(b);
    });
    body.appendChild(tabs);

    var listWrap = document.createElement('div'); listWrap.className = 'dms-tf-saved-list';
    body.appendChild(listWrap);

    function renderList() {
      var all = loadSavedFilters();
      var me = currentUser();
      var filtered = all.filter(function (f) {
        if (current === 'mine') return f.owner === me;
        if (current === 'team') return f.scope === 'team';
        return f.scope === 'global';
      });
      listWrap.innerHTML = '';
      if (!filtered.length) {
        var empty = document.createElement('div'); empty.className = 'dms-tf-empty';
        empty.textContent = current === 'mine' ? 'Você ainda não salvou filtros.' :
                            (current === 'team' ? 'Sem filtros compartilhados pela equipe.' : 'Sem filtros globais.');
        listWrap.appendChild(empty);
        return;
      }
      filtered.sort(function (a, b) { return (b.lastUsed || 0) - (a.lastUsed || 0); });
      filtered.forEach(function (f) {
        var item = document.createElement('div'); item.className = 'dms-tf-saved-item';
        var info = document.createElement('div'); info.className = 'info';
        var nm = document.createElement('div'); nm.className = 'name'; nm.textContent = f.name;
        var meta = document.createElement('div'); meta.className = 'meta';
        meta.innerHTML = '<span class="badge ' + f.scope + '">' + (SCOPES.filter(function (s) { return s.code === f.scope; })[0] || {label: f.scope}).label + '</span>' +
                        ' por ' + f.owner + ' · ' + f.filters.length + ' filtro(s) · página: ' + f.pageKey;
        info.appendChild(nm);
        info.appendChild(meta);
        item.appendChild(info);

        var actions = document.createElement('div'); actions.className = 'actions';
        var apply = document.createElement('button'); apply.className = 'primary'; apply.textContent = 'Aplicar';
        apply.onclick = function () {
          persistActiveChips(f.filters.slice());
          // bump lastUsed
          var all2 = loadSavedFilters();
          all2.forEach(function (x) { if (x.id === f.id) x.lastUsed = Date.now(); });
          persistSavedFilters(all2);
          renderChips();
          updateFabBadge();
          overlay.remove();
          showToast('Filtro "' + f.name + '" aplicado');
        };
        actions.appendChild(apply);

        if (f.owner === me) {
          var edit = document.createElement('button'); edit.textContent = 'Editar';
          edit.onclick = function () {
            var newName = prompt('Novo nome para o filtro:', f.name);
            if (newName && newName.trim()) {
              var all2 = loadSavedFilters();
              all2.forEach(function (x) { if (x.id === f.id) x.name = newName.trim(); });
              persistSavedFilters(all2);
              renderList();
            }
          };
          actions.appendChild(edit);
          var del = document.createElement('button'); del.className = 'danger'; del.textContent = 'Excluir';
          del.onclick = function () {
            if (!confirm('Excluir filtro "' + f.name + '"?')) return;
            var all2 = loadSavedFilters().filter(function (x) { return x.id !== f.id; });
            persistSavedFilters(all2);
            renderList();
          };
          actions.appendChild(del);
        }
        item.appendChild(actions);
        listWrap.appendChild(item);
      });
    }
    renderList();

    var note = document.createElement('div');
    note.className = 'dms-tf-mockup-note';
    note.innerHTML = '⚠️ Mockup conceitual — escopos Privado/Equipe/Global e identidade do owner são simulados.';
    body.appendChild(note);

    var closeBtn = btn('Fechar', '', function () { overlay.remove(); });
    modal.footer.appendChild(closeBtn);

    document.body.appendChild(overlay);
  }

  // ---------- toast ----------
  function showToast(msg) {
    var t = document.createElement('div');
    t.style.cssText = [
      'position:fixed','top:64px','left:50%','transform:translateX(-50%) translateY(-8px)','z-index:10002',
      'background:'+MAR,'color:#fff','padding:10px 16px','border-radius:8px',
      'font-size:13px','font-weight:600','box-shadow:0 8px 24px rgba(0,0,0,0.18)',
      'opacity:0','transition:opacity .22s ease, transform .22s ease',
      'font-family:Inter,system-ui,sans-serif',
    ].join(';');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(-8px)';
      setTimeout(function () { t.remove(); }, 250);
    }, 2400);
  }

  // ---------- FAB ----------
  function buildFab() {
    if (document.getElementById('dms-tf-fab')) return;
    var fab = document.createElement('div');
    fab.id = 'dms-tf-fab';
    fab.className = 'dms-tf-fab';

    var b1 = document.createElement('button');
    b1.id = 'dms-tf-add';
    b1.innerHTML = '🏷️ Filtro TAG <span class="dms-tf-badge" id="dms-tf-add-badge" style="display:none">0</span>';
    b1.onclick = openTagFilterModal;

    var b2 = document.createElement('button');
    b2.id = 'dms-tf-saved';
    b2.innerHTML = '📑 Filtros salvos';
    b2.onclick = openSavedDrawer;

    fab.appendChild(b1);
    fab.appendChild(b2);
    document.body.appendChild(fab);
  }

  function updateFabBadge() {
    var badge = document.getElementById('dms-tf-add-badge');
    if (!badge) return;
    var n = loadActiveChips().length;
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-block' : 'none';
  }

  // ---------- modal helpers ----------
  function makeOverlay() {
    var o = document.createElement('div');
    o.className = 'dms-tf-overlay';
    o.onclick = function (e) { if (e.target === o) o.remove(); };
    return o;
  }
  function makeModalShell(title) {
    var root = document.createElement('div'); root.className = 'dms-tf-modal';
    var hd = document.createElement('header');
    var h = document.createElement('h3'); h.textContent = title;
    var x = document.createElement('button'); x.textContent = '×';
    x.onclick = function () { var ov = root.closest('.dms-tf-overlay'); if (ov) ov.remove(); };
    hd.appendChild(h); hd.appendChild(x);
    root.appendChild(hd);
    var body = document.createElement('div'); body.className = 'body'; root.appendChild(body);
    var footer = document.createElement('div'); footer.className = 'footer'; root.appendChild(footer);
    return { root: root, body: body, footer: footer };
  }
  function field(labelText, inputEl) {
    var w = document.createElement('div'); w.className = 'dms-tf-field';
    var lb = document.createElement('label'); lb.textContent = labelText;
    w.appendChild(lb); w.appendChild(inputEl);
    return { wrap: w, input: inputEl };
  }
  function selectEl(options, onChange) {
    var s = document.createElement('select');
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt === '— Selecione —' ? '' : opt;
      o.textContent = opt;
      s.appendChild(o);
    });
    s.onchange = function () { onChange(s.value); };
    return s;
  }
  function btn(text, kind, onClick) {
    var b = document.createElement('button');
    b.textContent = text;
    if (kind === 'primary') b.className = 'primary';
    b.onclick = onClick;
    return b;
  }

  // ---------- init ----------
  function init() {
    injectStyles();
    seedDefaults(); // garante seed se for primeira vez
    buildFab();
    ensureChipsBar();
    renderChips();
    updateFabBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.dmsTagFilter = {
    open: openTagFilterModal,
    saved: openSavedDrawer,
    chips: loadActiveChips,
    clear: function () { persistActiveChips([]); renderChips(); updateFabBadge(); },
    reseed: function () { try { localStorage.removeItem(STORAGE_SAVED); } catch (e) {} seedDefaults(); },
  };
})();
