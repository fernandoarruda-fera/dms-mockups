/* DMS Mockups — Sidebar dirigida por permissão (piloto)
 * Carregar via <script src="sidebar-permissions.js" defer></script>
 * Esconde itens de `.sb-item` quando role atual não tem permissão na tela.
 * Headers (.sb-section-title) somem se todos os itens do grupo somem.
 * Toggle flutuante (bottom-left, ao lado do i18n) permite trocar de perfil.
 *
 * Roles extraídos da tela80-permissoes-matriz.html (matriz oficial).
 * Storage: localStorage `dms-role`. Default: admin.
 */
(function () {
  if (window.__dmsPermsLoaded) return;
  window.__dmsPermsLoaded = true;

  var STORAGE_KEY = 'dms-role';
  var DEFAULT_ROLE = 'admin';
  var MAR = '#00386C';
  var PRIMARY = '#643585';
  var BG = '#F8F9FA';
  var BORDER = '#E5E7EB';

  // ----- Roles (espelhando tela80 ROLE_LABEL) -----
  var ROLES = [
    { code: 'admin',  label: 'Admin Geral',         icon: '👑' },
    { code: 'cmpAdm', label: 'Compras Adm',         icon: '🛒' },
    { code: 'cmpOp',  label: 'Compras Op',          icon: '📦' },
    { code: 'capAdm', label: 'CAP Adm',             icon: '💵' },
    { code: 'capOp',  label: 'CAP Op',              icon: '🧾' },
    { code: 'aprDir', label: 'Aprovador Diretor',   icon: '✅' },
    { code: 'aprGer', label: 'Aprovador Gerente',   icon: '☑️' },
    { code: 'viewer', label: 'Viewer',              icon: '👁️' },
  ];

  // ----- Matriz role → telas permitidas (ver/abrir) -----
  // '*' = todas as telas. Heurística: alinhada com a coluna V (Ver) da tela80.
  // tela50 (Meu Perfil) sempre liberada — todo usuário tem profile.
  var ALL = ['tela50'];
  var WORKSPACE_FULL  = ['tela16','tela17','tela18','tela19','tela20'];
  var COMPRAS_FULL    = ['tela21','tela24','tela27','tela44','tela38','tela40'];
  var FINANCEIRO_FULL = ['tela36','tela42'];
  var CADASTROS_FULL  = ['tela30','tela32','tela34'];
  var BIBLIO_FULL     = ['tela01','tela03','tela04','tela06','tela12','tela13'];

  window.PERMS_MATRIX = {
    admin: {
      label: 'Admin Geral',
      telas: ['*'],
    },
    cmpAdm: {
      label: 'Compras Adm',
      telas: ALL.concat(
        WORKSPACE_FULL,
        COMPRAS_FULL,
        FINANCEIRO_FULL,
        CADASTROS_FULL,
        BIBLIO_FULL,
        ['tela11', 'tela86'] // Match Engine + Fornecedores
      ),
    },
    cmpOp: {
      label: 'Compras Op',
      telas: ALL.concat(
        WORKSPACE_FULL,
        ['tela21','tela24','tela27','tela44'], // sem NF nem Aprovações
        ['tela30','tela32'],
        ['tela01','tela03','tela04','tela06']
      ),
    },
    capAdm: {
      label: 'CAP Adm',
      telas: ALL.concat(
        WORKSPACE_FULL,
        ['tela38','tela44'],             // NF + Contratos
        FINANCEIRO_FULL,
        ['tela34'],                       // Plano de Contas
        ['tela13']                        // Audit Trail (CAP audita)
      ),
    },
    capOp: {
      label: 'CAP Op',
      telas: ALL.concat(
        ['tela16','tela17','tela18'],
        ['tela38'],
        ['tela36']
      ),
    },
    aprDir: {
      label: 'Aprovador Diretor',
      telas: ALL.concat(
        WORKSPACE_FULL,
        ['tela21','tela24','tela27','tela38','tela44','tela40'],
        ['tela42'],
        ['tela13']
      ),
    },
    aprGer: {
      label: 'Aprovador Gerente',
      telas: ALL.concat(
        WORKSPACE_FULL,
        ['tela21','tela24','tela27','tela40']
      ),
    },
    viewer: {
      label: 'Viewer',
      telas: ALL.concat(
        ['tela16','tela18'],
        ['tela01','tela04','tela06']
      ),
    },
  };

  // ----- Storage helpers -----
  function getRole() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_ROLE; }
    catch (e) { return DEFAULT_ROLE; }
  }
  function setRole(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
    window.CURRENT_ROLE = code;
  }
  function getRoleObj(code) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].code === code) return ROLES[i];
    return ROLES[0];
  }

  // ----- Core filter -----
  // Extrai código `telaNN` do href de um sb-item
  function telaCodeFromHref(href) {
    if (!href) return null;
    var m = href.match(/tela(\d{2})/i);
    return m ? ('tela' + m[1]) : null;
  }

  function canSeeTela(role, telaCode) {
    if (!telaCode) return true; // links sem tela (âncoras internas) ficam visíveis
    var perms = window.PERMS_MATRIX[role];
    if (!perms) return true;
    if (perms.telas.indexOf('*') !== -1) return true;
    return perms.telas.indexOf(telaCode) !== -1;
  }

  function applyPermissions() {
    var role = getRole();
    window.CURRENT_ROLE = role;
    var sidebar = document.getElementById('dms-sidebar');
    if (!sidebar) return;

    // 1) Itens individuais
    var items = sidebar.querySelectorAll('.sb-item, a.sb-item, ul li > a');
    items.forEach(function (a) {
      // só processa âncoras dentro de <li> em grupos da sidebar
      var li = a.closest('li');
      if (!li) return;
      var href = a.getAttribute('href') || '';
      var code = telaCodeFromHref(href);
      // Se for âncora externa ou sem tela, deixa visível
      if (!code) { li.style.display = ''; return; }
      li.style.display = canSeeTela(role, code) ? '' : 'none';
    });

    // 2) Headers de grupo: esconder se todos os itens do grupo estão escondidos
    var groups = sidebar.querySelectorAll('div'); // cada bloco tem um <p class="sb-section-title"> + <ul>
    groups.forEach(function (g) {
      var title = g.querySelector('.sb-section-title');
      if (!title) return;
      var lis = g.querySelectorAll('ul > li');
      if (!lis.length) return;
      var anyVisible = false;
      lis.forEach(function (li) {
        if (li.style.display !== 'none') anyVisible = true;
      });
      g.style.display = anyVisible ? '' : 'none';
    });
  }

  // ----- Toast -----
  function showToast(msg) {
    var existing = document.getElementById('dms-perm-toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.id = 'dms-perm-toast';
    t.textContent = msg;
    t.style.cssText = [
      'position:fixed','bottom:80px','left:140px','z-index:10001',
      'background:' + PRIMARY,'color:#fff','padding:10px 16px',
      'border-radius:8px','font-size:13px','font-weight:600',
      'box-shadow:0 8px 24px rgba(0,0,0,0.18)',
      'opacity:0','transform:translateY(8px)',
      'transition:opacity .22s ease, transform .22s ease',
      'font-family:Inter,system-ui,sans-serif',
    ].join(';');
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1'; t.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity = '0'; t.style.transform = 'translateY(8px)';
      setTimeout(function () { t.remove(); }, 250);
    }, 2400);
  }

  // ----- Toggle UI (floating, bottom-left, ao lado do i18n) -----
  function buildToggle() {
    if (document.getElementById('dms-perm-toggle')) return;

    var wrap = document.createElement('div');
    wrap.id = 'dms-perm-toggle';
    wrap.style.cssText = [
      'position:fixed','bottom:24px','left:120px','z-index:9999',
      'font-family:Inter,system-ui,sans-serif',
    ].join(';');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'dms-perm-btn';
    btn.style.cssText = [
      'display:inline-flex','align-items:center','gap:6px',
      'background:#fff','border:1px solid ' + BORDER,
      'padding:6px 10px','border-radius:8px',
      'font-size:12px','font-weight:700','color:' + MAR,
      'cursor:pointer','box-shadow:0 2px 6px rgba(0,0,0,0.06)',
      'transition:box-shadow .15s ease, border-color .15s ease',
    ].join(';');

    function renderBtn() {
      var cur = getRoleObj(getRole());
      btn.innerHTML =
        '<span style="font-size:14px;line-height:1">' + cur.icon + '</span>' +
        '<span style="font-size:10px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Perfil:</span>' +
        '<span style="letter-spacing:0.02em">' + cur.label + '</span>' +
        '<svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" style="opacity:.6"><path d="M5 7l5 6 5-6H5z"/></svg>';
    }
    renderBtn();

    var menu = document.createElement('div');
    menu.id = 'dms-perm-menu';
    menu.style.cssText = [
      'position:absolute','bottom:calc(100% + 6px)','left:0',
      'background:#fff','border:1px solid ' + BORDER,
      'border-radius:10px','min-width:240px',
      'box-shadow:0 12px 32px rgba(0,0,0,0.14)',
      'overflow:hidden','display:none',
    ].join(';');

    var header = document.createElement('div');
    header.textContent = 'Trocar perfil (mock)';
    header.style.cssText = [
      'padding:10px 14px','font-size:11px','font-weight:700',
      'letter-spacing:0.06em','text-transform:uppercase',
      'color:#6B7280','background:' + BG,'border-bottom:1px solid ' + BORDER,
    ].join(';');
    menu.appendChild(header);

    ROLES.forEach(function (role) {
      var item = document.createElement('button');
      item.type = 'button';
      item.style.cssText = [
        'display:flex','align-items:center','gap:10px','width:100%',
        'padding:9px 14px','background:transparent','border:0',
        'cursor:pointer','font-size:13px','color:' + MAR,
        'text-align:left','transition:background .12s ease',
      ].join(';');
      item.onmouseover = function () { item.style.background = BG; };
      item.onmouseout  = function () { item.style.background = 'transparent'; };

      function checkMark(r) {
        return '<span style="width:14px;display:inline-block;text-align:center;color:' + PRIMARY + ';font-weight:700">' +
               (r === getRole() ? '✓' : '') + '</span>';
      }

      item.innerHTML =
        '<span style="font-size:18px;line-height:1">' + role.icon + '</span>' +
        '<span style="flex:1;font-weight:600">' + role.label + '</span>' +
        checkMark(role.code);

      item.onclick = function (e) {
        e.stopPropagation();
        setRole(role.code);
        applyPermissions();
        renderBtn();
        var items = menu.querySelectorAll('button');
        items.forEach(function (it, idx) {
          var span = it.querySelector('span:last-child');
          if (span) span.textContent = (ROLES[idx].code === role.code ? '✓' : '');
        });
        closeMenu();
        var visibleCount = document.querySelectorAll('#dms-sidebar li:not([style*="display: none"]) > a').length;
        showToast('Perfil alterado para: ' + role.label + ' (' + visibleCount + ' itens visíveis)');
      };
      menu.appendChild(item);
    });

    var footer = document.createElement('div');
    footer.textContent = 'Mock — sidebar dirigida por permissão (piloto)';
    footer.style.cssText = [
      'padding:8px 14px','font-size:10px','color:#9CA3AF',
      'background:' + BG,'border-top:1px solid ' + BORDER,
      'text-align:center','font-style:italic',
    ].join(';');
    menu.appendChild(footer);

    function openMenu()  { menu.style.display = 'block'; }
    function closeMenu() { menu.style.display = 'none'; }
    function toggleMenu(){ menu.style.display === 'block' ? closeMenu() : openMenu(); }

    btn.onclick = function (e) { e.stopPropagation(); toggleMenu(); };
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    document.body.appendChild(wrap);
  }

  function init() {
    window.CURRENT_ROLE = getRole();
    buildToggle();
    applyPermissions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.dmsPerms = {
    apply: applyPermissions,
    get: getRole,
    set: function (code) {
      if (!window.PERMS_MATRIX[code]) return false;
      setRole(code); applyPermissions();
      return true;
    },
    matrix: function () { return window.PERMS_MATRIX; },
    countVisible: function () {
      return document.querySelectorAll('#dms-sidebar li:not([style*="display: none"]) > a').length;
    },
  };
})();
