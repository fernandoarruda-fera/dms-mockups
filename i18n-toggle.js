/* DMS Mockups — i18n Toggle
 * Self-contained. Inject via <script src="i18n-toggle.js" defer></script>
 * Adds a floating language switcher (top-right) with 5 locales.
 * Storage: localStorage `dms-locale`. Default: pt-BR.
 * Elements marked with [data-i18n="key"] get textContent replaced.
 * Mockup conceitual — não cobre todas as strings do app.
 */
(function () {
  if (window.__dmsI18nLoaded) return;
  window.__dmsI18nLoaded = true;

  var PRIMARY = '#643585';
  var MAR = '#00386C';
  var BG = '#F8F9FA';
  var BORDER = '#E5E7EB';

  var STORAGE_KEY = 'dms-locale';
  var DEFAULT_LOCALE = 'pt-BR';

  var LOCALES = [
    { code: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)', short: 'PT-BR' },
    { code: 'en',    flag: '🇺🇸', label: 'English',             short: 'EN'    },
    { code: 'es',    flag: '🇪🇸', label: 'Español',             short: 'ES'    },
    { code: 'pt-PT', flag: '🇵🇹', label: 'Português (Portugal)', short: 'PT-PT' },
    { code: 'de',    flag: '🇩🇪', label: 'Deutsch',             short: 'DE'    },
  ];

  var DICT = {
    'pt-BR': {
      'nav.cockpit': 'Cockpit',
      'nav.email': 'E-mail',
      'nav.tasks': 'Tarefas',
      'nav.followup': 'Follow-up',
      'nav.updates': 'Atualizações',
      'nav.purchases': 'Compras',
      'nav.requisitions': 'Requisições',
      'nav.quotes': 'Cotações',
      'nav.orders': 'Pedidos',
      'nav.registrations': 'Cadastros',
      'nav.libraries': 'Bibliotecas',
      'nav.admin': 'Admin',
      'btn.save': 'Salvar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Criar',
      'btn.delete': 'Excluir',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Buscar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Novo',
      'label.status': 'Status',
      'label.actions': 'Ações',
      'label.created': 'Criado em',
      'label.updated': 'Atualizado em',
      'label.user': 'Usuário',
      'msg.loading': 'Carregando...',
      'msg.empty': 'Nenhum resultado encontrado',
      'msg.saved': 'Salvo com sucesso',
      'msg.error': 'Ocorreu um erro',
      'toast.langChanged': 'Idioma alterado para',
    },
    'en': {
      'nav.cockpit': 'Cockpit',
      'nav.email': 'Email',
      'nav.tasks': 'Tasks',
      'nav.followup': 'Follow-up',
      'nav.updates': 'Updates',
      'nav.purchases': 'Purchases',
      'nav.requisitions': 'Requisitions',
      'nav.quotes': 'Quotes',
      'nav.orders': 'Purchase Orders',
      'nav.registrations': 'Registrations',
      'nav.libraries': 'Libraries',
      'nav.admin': 'Admin',
      'btn.save': 'Save',
      'btn.cancel': 'Cancel',
      'btn.create': 'Create',
      'btn.delete': 'Delete',
      'btn.edit': 'Edit',
      'btn.export': 'Export',
      'btn.search': 'Search',
      'btn.filter': 'Filter',
      'btn.new': 'New',
      'label.status': 'Status',
      'label.actions': 'Actions',
      'label.created': 'Created',
      'label.updated': 'Updated',
      'label.user': 'User',
      'msg.loading': 'Loading...',
      'msg.empty': 'No results found',
      'msg.saved': 'Saved successfully',
      'msg.error': 'An error occurred',
      'toast.langChanged': 'Language changed to',
    },
    'es': {
      'nav.cockpit': 'Cockpit',
      'nav.email': 'Correo',
      'nav.tasks': 'Tareas',
      'nav.followup': 'Seguimiento',
      'nav.updates': 'Actualizaciones',
      'nav.purchases': 'Compras',
      'nav.requisitions': 'Requisiciones',
      'nav.quotes': 'Cotizaciones',
      'nav.orders': 'Órdenes de Compra',
      'nav.registrations': 'Registros',
      'nav.libraries': 'Bibliotecas',
      'nav.admin': 'Admin',
      'btn.save': 'Guardar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Crear',
      'btn.delete': 'Eliminar',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Buscar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Nuevo',
      'label.status': 'Estado',
      'label.actions': 'Acciones',
      'label.created': 'Creado el',
      'label.updated': 'Actualizado el',
      'label.user': 'Usuario',
      'msg.loading': 'Cargando...',
      'msg.empty': 'No se encontraron resultados',
      'msg.saved': 'Guardado correctamente',
      'msg.error': 'Ocurrió un error',
      'toast.langChanged': 'Idioma cambiado a',
    },
    'pt-PT': {
      'nav.cockpit': 'Cockpit',
      'nav.email': 'E-mail',
      'nav.tasks': 'Tarefas',
      'nav.followup': 'Seguimento',
      'nav.updates': 'Atualizações',
      'nav.purchases': 'Compras',
      'nav.requisitions': 'Requisições',
      'nav.quotes': 'Cotações',
      'nav.orders': 'Encomendas',
      'nav.registrations': 'Registos',
      'nav.libraries': 'Bibliotecas',
      'nav.admin': 'Administração',
      'btn.save': 'Guardar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Criar',
      'btn.delete': 'Eliminar',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Procurar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Novo',
      'label.status': 'Estado',
      'label.actions': 'Ações',
      'label.created': 'Criado em',
      'label.updated': 'Atualizado em',
      'label.user': 'Utilizador',
      'msg.loading': 'A carregar...',
      'msg.empty': 'Nenhum resultado encontrado',
      'msg.saved': 'Guardado com sucesso',
      'msg.error': 'Ocorreu um erro',
      'toast.langChanged': 'Idioma alterado para',
    },
    'de': {
      'nav.cockpit': 'Cockpit',
      'nav.email': 'E-Mail',
      'nav.tasks': 'Aufgaben',
      'nav.followup': 'Nachverfolgung',
      'nav.updates': 'Aktualisierungen',
      'nav.purchases': 'Einkauf',
      'nav.requisitions': 'Bedarfsanforderungen',
      'nav.quotes': 'Angebote',
      'nav.orders': 'Bestellungen',
      'nav.registrations': 'Stammdaten',
      'nav.libraries': 'Bibliotheken',
      'nav.admin': 'Verwaltung',
      'btn.save': 'Speichern',
      'btn.cancel': 'Abbrechen',
      'btn.create': 'Erstellen',
      'btn.delete': 'Löschen',
      'btn.edit': 'Bearbeiten',
      'btn.export': 'Exportieren',
      'btn.search': 'Suchen',
      'btn.filter': 'Filtern',
      'btn.new': 'Neu',
      'label.status': 'Status',
      'label.actions': 'Aktionen',
      'label.created': 'Erstellt am',
      'label.updated': 'Aktualisiert am',
      'label.user': 'Benutzer',
      'msg.loading': 'Wird geladen...',
      'msg.empty': 'Keine Ergebnisse gefunden',
      'msg.saved': 'Erfolgreich gespeichert',
      'msg.error': 'Ein Fehler ist aufgetreten',
      'toast.langChanged': 'Sprache geändert zu',
    },
  };

  function getLocale() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v && DICT[v]) return v;
    } catch (e) {}
    return DEFAULT_LOCALE;
  }

  function setLocale(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }

  function t(key) {
    var loc = getLocale();
    return (DICT[loc] && DICT[loc][key]) || (DICT[DEFAULT_LOCALE] && DICT[DEFAULT_LOCALE][key]) || key;
  }

  function applyTranslations() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var key = n.getAttribute('data-i18n');
      if (!key) continue;
      if (!n.hasAttribute('data-i18n-original')) {
        n.setAttribute('data-i18n-original', n.textContent.trim());
      }
      var val = t(key);
      // preserve leading/trailing whitespace if simple text node only
      n.textContent = val;
    }
  }

  function getLocaleObj(code) {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].code === code) return LOCALES[i];
    return LOCALES[0];
  }

  function showToast(message) {
    var existing = document.getElementById('dms-i18n-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'dms-i18n-toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed', 'top:64px', 'right:20px', 'z-index:10001',
      'background:' + MAR, 'color:#fff', 'padding:10px 16px',
      'border-radius:8px', 'font-size:13px', 'font-weight:600',
      'box-shadow:0 8px 24px rgba(0,0,0,0.18)',
      'opacity:0', 'transform:translateY(-8px)',
      'transition:opacity .22s ease, transform .22s ease',
      'font-family:Inter,system-ui,sans-serif',
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      setTimeout(function () { toast.remove(); }, 250);
    }, 2200);
  }

  function buildToggle() {
    if (document.getElementById('dms-i18n-toggle')) return;

    var wrap = document.createElement('div');
    wrap.id = 'dms-i18n-toggle';
    wrap.style.cssText = [
      'position:fixed', 'top:12px', 'right:16px', 'z-index:9999',
      'font-family:Inter,system-ui,sans-serif',
    ].join(';');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'dms-i18n-btn';
    btn.style.cssText = [
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'background:#fff', 'border:1px solid ' + BORDER,
      'padding:6px 10px', 'border-radius:8px',
      'font-size:12px', 'font-weight:700', 'color:' + MAR,
      'cursor:pointer', 'box-shadow:0 2px 6px rgba(0,0,0,0.06)',
      'transition:box-shadow .15s ease, border-color .15s ease',
    ].join(';');

    function renderBtn() {
      var cur = getLocaleObj(getLocale());
      btn.innerHTML = '<span style="font-size:14px;line-height:1">' + cur.flag + '</span>' +
                      '<span style="letter-spacing:0.02em">' + cur.short + '</span>' +
                      '<svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" style="opacity:.6"><path d="M5 7l5 6 5-6H5z"/></svg>';
    }
    renderBtn();

    var menu = document.createElement('div');
    menu.id = 'dms-i18n-menu';
    menu.style.cssText = [
      'position:absolute', 'top:calc(100% + 6px)', 'right:0',
      'background:#fff', 'border:1px solid ' + BORDER,
      'border-radius:10px', 'min-width:230px',
      'box-shadow:0 12px 32px rgba(0,0,0,0.14)',
      'overflow:hidden', 'display:none',
    ].join(';');

    var header = document.createElement('div');
    header.textContent = 'Idioma · Language';
    header.style.cssText = [
      'padding:10px 14px', 'font-size:11px', 'font-weight:700',
      'letter-spacing:0.06em', 'text-transform:uppercase',
      'color:#6B7280', 'background:' + BG, 'border-bottom:1px solid ' + BORDER,
    ].join(';');
    menu.appendChild(header);

    LOCALES.forEach(function (loc) {
      var item = document.createElement('button');
      item.type = 'button';
      item.style.cssText = [
        'display:flex', 'align-items:center', 'gap:10px', 'width:100%',
        'padding:10px 14px', 'background:transparent', 'border:0',
        'cursor:pointer', 'font-size:13px', 'color:' + MAR,
        'text-align:left', 'transition:background .12s ease',
      ].join(';');
      item.onmouseover = function () { item.style.background = BG; };
      item.onmouseout  = function () { item.style.background = 'transparent'; };

      var check = '<span style="width:14px;display:inline-block;text-align:center;color:' + PRIMARY + ';font-weight:700">' +
                  (loc.code === getLocale() ? '✓' : '') + '</span>';
      item.innerHTML =
        '<span style="font-size:18px;line-height:1">' + loc.flag + '</span>' +
        '<span style="flex:1"><span style="font-weight:600">' + loc.label + '</span>' +
          '<span style="display:block;font-size:11px;color:#9CA3AF;font-weight:500;margin-top:1px">' + loc.short + '</span></span>' +
        check;

      item.onclick = function (e) {
        e.stopPropagation();
        setLocale(loc.code);
        applyTranslations();
        renderBtn();
        // update checkmarks
        var items = menu.querySelectorAll('button');
        items.forEach(function (it, idx) {
          var span = it.querySelector('span:last-child');
          if (span) span.textContent = (LOCALES[idx].code === loc.code ? '✓' : '');
        });
        closeMenu();
        showToast(t('toast.langChanged') + ' ' + loc.label);
      };
      menu.appendChild(item);
    });

    var footer = document.createElement('div');
    footer.textContent = 'Mockup conceitual — tradução parcial';
    footer.style.cssText = [
      'padding:8px 14px', 'font-size:10px', 'color:#9CA3AF',
      'background:' + BG, 'border-top:1px solid ' + BORDER,
      'text-align:center', 'font-style:italic',
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
    buildToggle();
    applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging / future hooks
  window.dmsI18n = { t: t, apply: applyTranslations, get: getLocale, set: function (c) {
    if (!DICT[c]) return false;
    setLocale(c);
    applyTranslations();
    return true;
  }};
})();
