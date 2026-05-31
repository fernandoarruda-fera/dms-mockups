/* DMS BULK SELECT — widget global pra seleção em lote + regras automáticas em multi-select grandes.
   API: window.dmsBulkSelect.attach({ ... }). Self-contained, idempotente. */
(function () {
  if (window.dmsBulkSelect) return;

  // ============================================================
  // CSS (inject once)
  // ============================================================
  var styleEl = document.createElement('style');
  styleEl.id = 'dms-bulk-style';
  styleEl.textContent = '\
    .dbs-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; font-size:12px; font-weight:600; border-radius:6px; cursor:pointer; white-space:nowrap; transition: all .15s; }\
    .dbs-btn-bulk { color:#00386C; border:1px solid #00AEEE; background:#fff; }\
    .dbs-btn-bulk:hover { background:#F0F9FF; }\
    .dbs-btn-rule { color:#fff; background:#643585; border:1px solid #643585; }\
    .dbs-btn-rule:hover { opacity:.9; }\
    .dbs-overlay { position:fixed; inset:0; background:rgba(15,27,76,.55); z-index:60; display:none; align-items:center; justify-content:center; padding:24px; }\
    .dbs-overlay.show { display:flex; }\
    .dbs-modal { background:#fff; border-radius:10px; box-shadow:0 20px 50px -10px rgba(0,0,0,.35); width:100%; max-width:1100px; max-height:90vh; display:flex; flex-direction:column; }\
    .dbs-modal-sm { max-width:780px; }\
    .dbs-modal-header { padding:18px 22px; border-bottom:1px solid #E5E7EB; display:flex; align-items:start; justify-content:space-between; gap:16px; }\
    .dbs-modal-title { font-size:18px; font-weight:700; color:#00386C; margin:0; }\
    .dbs-modal-sub { font-size:12px; color:#656464; margin-top:4px; }\
    .dbs-modal-close { background:transparent; border:0; font-size:22px; color:#656464; cursor:pointer; line-height:1; padding:0 4px; }\
    .dbs-modal-body { flex:1; overflow:auto; padding:18px 22px; }\
    .dbs-modal-footer { padding:14px 22px; border-top:1px solid #E5E7EB; display:flex; align-items:center; justify-content:space-between; gap:12px; background:#FAFBFC; border-radius:0 0 10px 10px; }\
    .dbs-input { padding:8px 10px; font-size:13px; border:1px solid #E5E7EB; border-radius:6px; background:#fff; }\
    .dbs-input:focus { outline:none; border-color:#00AEEE; box-shadow:0 0 0 3px rgba(0,174,238,.15); }\
    .dbs-toolbar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px; }\
    .dbs-toolbar .dbs-input { flex:1; min-width:200px; }\
    .dbs-link { font-size:12px; font-weight:600; color:#00386C; background:transparent; border:0; cursor:pointer; text-decoration:underline; padding:4px 6px; }\
    .dbs-link:hover { color:#005290; }\
    .dbs-counter { font-size:12px; color:#656464; font-family: "JetBrains Mono", Consolas, monospace; }\
    .dbs-table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }\
    .dbs-table thead th { position:sticky; top:0; background:#F8F9FA; border-bottom:1px solid #E5E7EB; padding:8px 10px; text-align:left; font-size:11px; font-weight:700; color:#656464; text-transform:uppercase; letter-spacing:.04em; z-index:2; }\
    .dbs-table tbody tr { cursor:pointer; }\
    .dbs-table tbody tr:hover { background:#F0F9FF; }\
    .dbs-table tbody tr.sel { background:#FFFBEB; }\
    .dbs-table tbody td { padding:8px 10px; border-bottom:1px solid #F1F3F5; vertical-align:middle; color:#1A1A1A; }\
    .dbs-table input[type=checkbox] { accent-color:#643585; cursor:pointer; }\
    .dbs-chip-mini { display:inline-flex; align-items:center; gap:4px; padding:2px 6px; border-radius:10px; font-size:10px; font-weight:600; background:#F1F3F5; color:#656464; border:1px solid #E5E7EB; }\
    .dbs-chip-mini-warn { background:#FFFBEB; color:#854D0E; border-color:#FDE68A; }\
    .dbs-rule-row { display:grid; grid-template-columns:auto 1fr 110px 1fr auto; gap:8px; align-items:center; padding:10px; background:#F8F9FA; border:1px solid #E5E7EB; border-radius:6px; margin-bottom:8px; }\
    .dbs-rule-conn { font-size:11px; font-weight:700; color:#643585; background:#F3E8FF; border:1px solid #E9D5FF; border-radius:4px; padding:2px 8px; text-transform:uppercase; }\
    .dbs-rule-conn[data-conn="OR"] { color:#0369A1; background:#E0F2FE; border-color:#BAE6FD; }\
    .dbs-preview { background:#F0FDF4; border:1px solid #BBF7D0; border-radius:6px; padding:12px; margin-top:14px; }\
    .dbs-preview-count { font-size:14px; font-weight:700; color:#166534; display:flex; align-items:center; gap:8px; }\
    .dbs-rule-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 9px; border-radius:6px; font-size:12px; font-weight:600; background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD; cursor:pointer; }\
    .dbs-rule-chip:hover { background:#BAE6FD; }\
    .dbs-rule-chip .dbs-rule-x { background:transparent; border:0; cursor:pointer; color:inherit; padding:0 2px; font-size:14px; }\
    .dbs-rule-count { font-family: "JetBrains Mono", Consolas, monospace; font-weight:700; background:rgba(255,255,255,.6); padding:1px 5px; border-radius:8px; font-size:10px; }\
  ';
  document.head.appendChild(styleEl);

  // ============================================================
  // Helpers
  // ============================================================
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function fmtList(arr) { return arr.length === 1 ? arr[0] : arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1]; }
  function uniqValues(catalog, key) {
    var seen = {}, out = [];
    catalog.forEach(function (it) { var v = it[key]; if (v && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out.sort();
  }
  function evalRule(item, rule) {
    if (!rule || !rule.conditions || !rule.conditions.length) return false;
    var result = null;
    rule.conditions.forEach(function (c, i) {
      var v = item[c.field]; var hit = false;
      if (c.op === '=') hit = String(v).toLowerCase() === String(c.value).toLowerCase();
      else if (c.op === 'contém') hit = String(v || '').toLowerCase().indexOf(String(c.value).toLowerCase()) >= 0;
      else if (c.op === 'em') hit = (c.value || '').split(',').map(function (x) { return x.trim().toLowerCase(); }).indexOf(String(v).toLowerCase()) >= 0;
      else if (c.op === '>') hit = parseFloat(v) > parseFloat(c.value);
      if (i === 0) result = hit;
      else if (c.connector === 'AND') result = result && hit;
      else result = result || hit;
    });
    return result;
  }
  function countRule(catalog, rule) { return catalog.filter(function (it) { return evalRule(it, rule); }).length; }

  // ============================================================
  // Modal: Gerenciar em lote
  // ============================================================
  function openBulkModal(inst) {
    var st = inst.state;
    var overlay = el('<div class="dbs-overlay show"></div>');
    var modal = el(
      '<div class="dbs-modal">' +
      '  <div class="dbs-modal-header">' +
      '    <div>' +
      '      <h3 class="dbs-modal-title">Gerenciar ' + inst.config.entityPlural + ' em lote</h3>' +
      '      <p class="dbs-modal-sub">Catálogo completo (' + st.catalog.length + ' itens). Clique numa linha pra selecionar. Coluna "Já gerido por" mostra outros usuários que já cuidam — evita duplicação.</p>' +
      '    </div>' +
      '    <button class="dbs-modal-close" aria-label="Fechar">×</button>' +
      '  </div>' +
      '  <div class="dbs-modal-body">' +
      '    <div class="dbs-toolbar">' +
      '      <input type="text" class="dbs-input dbs-search" placeholder="🔎 Buscar por nome...">' +
      (inst.config.filterFields || []).map(function (f) {
        var opts = ['<option value="">— ' + f.label + ': todos —</option>'].concat(uniqValues(st.catalog, f.key).map(function (v) { return '<option>' + v + '</option>'; }));
        return '<select class="dbs-input dbs-filter" data-field="' + f.key + '">' + opts.join('') + '</select>';
      }).join('') +
      '      <button class="dbs-link dbs-sel-all">Selecionar visíveis</button>' +
      '      <button class="dbs-link dbs-clear">Limpar</button>' +
      '      <span class="dbs-counter dbs-count-text"></span>' +
      '    </div>' +
      '    <div style="max-height:50vh; overflow:auto; border:1px solid #E5E7EB; border-radius:6px;">' +
      '      <table class="dbs-table">' +
      '        <thead><tr>' +
      '          <th style="width:32px;"></th>' +
      '          <th>Nome</th>' +
      (inst.config.columns || []).map(function (c) { return '<th>' + c.label + '</th>'; }).join('') +
      '          <th>Já gerido por</th>' +
      '        </tr></thead>' +
      '        <tbody class="dbs-tbody"></tbody>' +
      '      </table>' +
      '    </div>' +
      '  </div>' +
      '  <div class="dbs-modal-footer">' +
      '    <span class="dbs-counter dbs-count-footer">0 selecionados</span>' +
      '    <div style="display:flex; gap:8px;">' +
      '      <button class="dbs-link dbs-cancel" style="text-decoration:none; padding:8px 14px; border:1px solid #E5E7EB; border-radius:6px;">Cancelar</button>' +
      '      <button class="dbs-btn dbs-btn-rule dbs-apply">Aplicar seleção</button>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var selected = new Set(st.selected);
    var tbody = modal.querySelector('.dbs-tbody');
    var search = modal.querySelector('.dbs-search');
    var filters = modal.querySelectorAll('.dbs-filter');
    var countText = modal.querySelector('.dbs-count-text');
    var countFooter = modal.querySelector('.dbs-count-footer');

    function render() {
      var q = (search.value || '').toLowerCase();
      var activeFilters = {};
      filters.forEach(function (f) { if (f.value) activeFilters[f.dataset.field] = f.value; });
      var visibleIds = [];
      var rows = st.catalog.filter(function (it) {
        if (q && it.name.toLowerCase().indexOf(q) < 0) return false;
        for (var k in activeFilters) { if (it[k] !== activeFilters[k]) return false; }
        return true;
      });
      tbody.innerHTML = rows.map(function (it) {
        visibleIds.push(it.id);
        var managed = (inst.config.alreadyManaged || {})[it.id] || [];
        var managedHtml = managed.length
          ? managed.map(function (u) { return '<span class="dbs-chip-mini dbs-chip-mini-warn">' + u + '</span>'; }).join(' ')
          : '<span style="color:#9CA3AF; font-size:11px;">—</span>';
        var checked = selected.has(it.id) ? 'checked' : '';
        var cls = selected.has(it.id) ? 'sel' : '';
        var cells = (inst.config.columns || []).map(function (c) { return '<td>' + (it[c.key] || '—') + '</td>'; }).join('');
        return '<tr class="' + cls + '" data-id="' + it.id + '">' +
          '<td><input type="checkbox" ' + checked + '></td>' +
          '<td><strong>' + it.name + '</strong></td>' +
          cells +
          '<td>' + managedHtml + '</td>' +
        '</tr>';
      }).join('');
      countText.textContent = rows.length + ' de ' + st.catalog.length + ' visíveis';
      countFooter.textContent = selected.size + ' selecionados';
      tbody._visibleIds = visibleIds;
    }

    tbody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-id]'); if (!tr) return;
      var id = tr.dataset.id;
      if (selected.has(id)) selected.delete(id); else selected.add(id);
      render();
    });
    search.addEventListener('input', render);
    filters.forEach(function (f) { f.addEventListener('change', render); });
    modal.querySelector('.dbs-sel-all').addEventListener('click', function () { (tbody._visibleIds || []).forEach(function (id) { selected.add(id); }); render(); });
    modal.querySelector('.dbs-clear').addEventListener('click', function () { selected.clear(); render(); });

    function close() { document.body.removeChild(overlay); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    modal.querySelector('.dbs-modal-close').addEventListener('click', close);
    modal.querySelector('.dbs-cancel').addEventListener('click', close);
    modal.querySelector('.dbs-apply').addEventListener('click', function () {
      st.selected = Array.from(selected);
      renderChips(inst);
      if (inst.config.onApply) inst.config.onApply(st.selected, st.rules);
      close();
    });
    render();
  }

  // ============================================================
  // Modal: Definir por regra
  // ============================================================
  function openRuleModal(inst, existingRule) {
    var st = inst.state;
    var working = existingRule
      ? JSON.parse(JSON.stringify(existingRule))
      : { id: 'rule-' + Date.now(), conditions: [{ field: (inst.config.ruleFields[0] || {}).key, op: '=', value: '', connector: 'AND' }] };

    var overlay = el('<div class="dbs-overlay show"></div>');
    var modal = el(
      '<div class="dbs-modal dbs-modal-sm">' +
      '  <div class="dbs-modal-header">' +
      '    <div>' +
      '      <h3 class="dbs-modal-title">' + (existingRule ? 'Editar regra automática' : 'Nova regra automática') + '</h3>' +
      '      <p class="dbs-modal-sub">Inclui automaticamente todos os ' + inst.config.entityPlural + ' que satisfazem as condições. Novos itens cadastrados também entram no seu scope se baterem a regra.</p>' +
      '    </div>' +
      '    <button class="dbs-modal-close">×</button>' +
      '  </div>' +
      '  <div class="dbs-modal-body">' +
      '    <div class="dbs-rule-conditions"></div>' +
      '    <div style="display:flex; gap:8px; margin-top:6px;">' +
      '      <button class="dbs-link dbs-add-and">+ AND</button>' +
      '      <button class="dbs-link dbs-add-or">+ OR</button>' +
      '    </div>' +
      '    <div class="dbs-preview">' +
      '      <div class="dbs-preview-count"><span style="font-size:18px;">📐</span> <span class="dbs-preview-text">A regra atual selecionaria 0 itens.</span></div>' +
      '      <details style="margin-top:8px;"><summary style="cursor:pointer; font-size:12px; color:#166534; font-weight:600;">Ver itens selecionados</summary>' +
      '        <ul class="dbs-preview-list" style="margin-top:8px; max-height:160px; overflow:auto; font-size:12px; padding-left:18px; color:#1A1A1A;"></ul>' +
      '      </details>' +
      '    </div>' +
      '  </div>' +
      '  <div class="dbs-modal-footer">' +
      '    <span class="dbs-counter">Regras existentes: ' + (st.rules.length) + '</span>' +
      '    <div style="display:flex; gap:8px;">' +
      '      <button class="dbs-link dbs-cancel" style="text-decoration:none; padding:8px 14px; border:1px solid #E5E7EB; border-radius:6px;">Cancelar</button>' +
      '      <button class="dbs-btn dbs-btn-rule dbs-save">Salvar regra</button>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var condBox = modal.querySelector('.dbs-rule-conditions');
    var previewText = modal.querySelector('.dbs-preview-text');
    var previewList = modal.querySelector('.dbs-preview-list');

    function renderConditions() {
      condBox.innerHTML = working.conditions.map(function (c, i) {
        var fieldOpts = inst.config.ruleFields.map(function (f) { return '<option value="' + f.key + '"' + (f.key === c.field ? ' selected' : '') + '>' + f.label + '</option>'; }).join('');
        var opOpts = ['=', 'contém', 'em', '>'].map(function (o) { return '<option' + (o === c.op ? ' selected' : '') + '>' + o + '</option>'; }).join('');
        var connBadge = i === 0
          ? '<span class="dbs-rule-conn">Quando</span>'
          : '<span class="dbs-rule-conn" data-conn="' + c.connector + '">' + c.connector + '</span>';
        var rem = i === 0 ? '' : '<button class="dbs-link dbs-rm-cond" data-i="' + i + '" style="color:#DC2626;">×</button>';
        return '<div class="dbs-rule-row">' + connBadge +
          '<select class="dbs-input dbs-c-field" data-i="' + i + '">' + fieldOpts + '</select>' +
          '<select class="dbs-input dbs-c-op" data-i="' + i + '">' + opOpts + '</select>' +
          '<input class="dbs-input dbs-c-val" data-i="' + i + '" type="text" placeholder="valor (ex: Transportes; pra \'em\': v1,v2,v3)" value="' + (c.value || '').replace(/"/g, '&quot;') + '">' +
          rem + '</div>';
      }).join('');
      updatePreview();
    }
    function updatePreview() {
      var count = countRule(st.catalog, working);
      previewText.innerHTML = '<strong>' + count + '</strong> ' + inst.config.entityPlural + ' selecionados pela regra atual.';
      previewList.innerHTML = st.catalog.filter(function (it) { return evalRule(it, working); }).slice(0, 50).map(function (it) {
        return '<li>' + it.name + '<span style="color:#656464; font-size:11px;"> · ' + (it.categoria || it.estado || '') + '</span></li>';
      }).join('') || '<li style="color:#9CA3AF;">Nenhum item ainda.</li>';
    }
    condBox.addEventListener('input', function (e) {
      var t = e.target; var i = parseInt(t.dataset.i, 10);
      if (t.classList.contains('dbs-c-field')) working.conditions[i].field = t.value;
      else if (t.classList.contains('dbs-c-op')) working.conditions[i].op = t.value;
      else if (t.classList.contains('dbs-c-val')) working.conditions[i].value = t.value;
      updatePreview();
    });
    condBox.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') updatePreview(); });
    condBox.addEventListener('click', function (e) {
      var t = e.target.closest('.dbs-rm-cond'); if (!t) return;
      working.conditions.splice(parseInt(t.dataset.i, 10), 1); renderConditions();
    });
    modal.querySelector('.dbs-add-and').addEventListener('click', function () { working.conditions.push({ field: inst.config.ruleFields[0].key, op: '=', value: '', connector: 'AND' }); renderConditions(); });
    modal.querySelector('.dbs-add-or').addEventListener('click', function () { working.conditions.push({ field: inst.config.ruleFields[0].key, op: '=', value: '', connector: 'OR' }); renderConditions(); });
    function close() { document.body.removeChild(overlay); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    modal.querySelector('.dbs-modal-close').addEventListener('click', close);
    modal.querySelector('.dbs-cancel').addEventListener('click', close);
    modal.querySelector('.dbs-save').addEventListener('click', function () {
      var i = st.rules.findIndex(function (r) { return r.id === working.id; });
      if (i >= 0) st.rules[i] = working; else st.rules.push(working);
      renderChips(inst);
      if (inst.config.onApply) inst.config.onApply(st.selected, st.rules);
      close();
    });
    renderConditions();
  }

  // ============================================================
  // Render dos chips de regra (azul claro) — injetados antes dos chips manuais
  // ============================================================
  function renderChips(inst) {
    if (!inst.config.chipsContainer) return;
    var box = (typeof inst.config.chipsContainer === 'string')
      ? document.querySelector(inst.config.chipsContainer) : inst.config.chipsContainer;
    if (!box) return;
    // limpa chips de regra anteriores
    box.querySelectorAll('.dbs-rule-chip').forEach(function (c) { c.remove(); });
    // insere novos
    var html = inst.state.rules.map(function (r) {
      var firstCond = r.conditions[0] || {};
      var fld = (inst.config.ruleFields.find(function (f) { return f.key === firstCond.field; }) || {}).label || firstCond.field;
      var label = fld + ' ' + firstCond.op + ' ' + (firstCond.value || '…') + (r.conditions.length > 1 ? ' +' + (r.conditions.length - 1) : '');
      var count = countRule(inst.state.catalog, r);
      return '<span class="dbs-rule-chip" data-rule-id="' + r.id + '" title="Clique pra editar a regra">📐 ' + label + ' <span class="dbs-rule-count">' + count + '</span><button class="dbs-rule-x" data-rm="' + r.id + '" title="Remover regra">×</button></span>';
    }).join(' ');
    if (html) {
      var wrap = document.createElement('span');
      wrap.innerHTML = html;
      while (wrap.firstChild) box.insertBefore(wrap.firstChild, box.firstChild);
    }
    // wire chip events
    box.querySelectorAll('.dbs-rule-chip').forEach(function (c) {
      c.addEventListener('click', function (e) {
        if (e.target.closest('.dbs-rule-x')) return;
        var rid = c.dataset.ruleId;
        var rule = inst.state.rules.find(function (r) { return r.id === rid; });
        if (rule) openRuleModal(inst, rule);
      });
      var rm = c.querySelector('.dbs-rule-x');
      if (rm) rm.addEventListener('click', function (ev) {
        ev.stopPropagation();
        inst.state.rules = inst.state.rules.filter(function (r) { return r.id !== rm.dataset.rm; });
        renderChips(inst);
      });
    });
  }

  // ============================================================
  // API
  // ============================================================
  window.dmsBulkSelect = {
    instances: [],
    attach: function (config) {
      var inst = {
        config: config,
        state: {
          catalog: config.catalog || [],
          selected: config.initialSelected || [],
          rules: config.initialRules || []
        }
      };
      var tgt = (typeof config.buttonContainer === 'string') ? document.querySelector(config.buttonContainer) : config.buttonContainer;
      if (tgt) {
        var bulkBtn = el('<button class="dbs-btn dbs-btn-bulk" type="button">📋 Gerenciar em lote</button>');
        var ruleBtn = el('<button class="dbs-btn dbs-btn-rule" type="button">📐 Definir por regra</button>');
        bulkBtn.addEventListener('click', function () { openBulkModal(inst); });
        ruleBtn.addEventListener('click', function () { openRuleModal(inst); });
        tgt.appendChild(bulkBtn);
        tgt.appendChild(ruleBtn);
      }
      this.instances.push(inst);
      renderChips(inst);
      return inst;
    }
  };
})();
