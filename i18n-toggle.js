/* DMS Mockups — i18n Toggle
 * Self-contained. Inject via <script src="i18n-toggle.js" defer></script>
 * Adds a floating language switcher (top-right) with 5 locales.
 * Storage: localStorage `dms-locale`. Default: pt-BR.
 * Elements marked with [data-i18n="key"] get textContent replaced.
 * Mockup conceitual — cobre ~150 chaves em 5 idiomas (cobertura parcial).
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
      // nav.*
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
      'nav.workflow': 'Workflow',
      'nav.fiscal': 'Fiscal',
      'nav.audit': 'Auditoria',
      // btn.*
      'btn.save': 'Salvar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Criar',
      'btn.delete': 'Excluir',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Buscar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Novo',
      'btn.apply': 'Aplicar',
      'btn.reset': 'Limpar',
      'btn.close': 'Fechar',
      'btn.confirm': 'Confirmar',
      'btn.back': 'Voltar',
      'btn.next': 'Próximo',
      'btn.generate': 'Gerar',
      'btn.customize': 'Personalizar',
      'btn.share': 'Compartilhar',
      'btn.duplicate': 'Duplicar',
      'btn.archive': 'Arquivar',
      // label.*
      'label.status': 'Status',
      'label.actions': 'Ações',
      'label.created': 'Criado em',
      'label.updated': 'Atualizado em',
      'label.user': 'Usuário',
      'label.name': 'Nome',
      'label.description': 'Descrição',
      'label.type': 'Tipo',
      'label.value': 'Valor',
      'label.total': 'Total',
      'label.count': 'Quantidade',
      'label.date': 'Data',
      'label.priority': 'Prioridade',
      'label.owner': 'Responsável',
      'label.tags': 'Tags',
      'label.category': 'Categoria',
      'label.code': 'Código',
      'label.amount': 'Montante',
      'label.source': 'Origem',
      'label.destination': 'Destino',
      'label.expires': 'Expira em',
      'label.deadline': 'Prazo',
      'label.sla': 'SLA',
      'label.severity': 'Severidade',
      'label.channel': 'Canal',
      'label.condition': 'Condição',
      'label.message': 'Mensagem',
      'label.score': 'Pontuação',
      'label.version': 'Versão',
      'label.email': 'E-mail',
      'label.phone': 'Telefone',
      // filter.*
      'filter.all': 'Todos',
      'filter.active': 'Ativos',
      'filter.inactive': 'Inativos',
      'filter.pending': 'Pendentes',
      'filter.completed': 'Concluídos',
      'filter.cancelled': 'Cancelados',
      'filter.approved': 'Aprovados',
      'filter.rejected': 'Rejeitados',
      'filter.expired': 'Expirados',
      'filter.draft': 'Rascunhos',
      'filter.archived': 'Arquivados',
      'filter.latest': 'Mais recentes',
      'filter.this-week': 'Esta semana',
      'filter.this-month': 'Este mês',
      'filter.custom': 'Personalizado',
      // status.*
      'status.ok': 'OK',
      'status.error': 'Erro',
      'status.warning': 'Atenção',
      'status.info': 'Info',
      'status.processing': 'Processando',
      'status.queued': 'Em fila',
      'status.ready': 'Pronto',
      'status.failed': 'Falhou',
      'status.success': 'Sucesso',
      'status.neutral': 'Neutro',
      'status.normal': 'Normal',
      'status.critical': 'Crítico',
      'status.urgent': 'Urgente',
      'status.expired': 'Expirado',
      'status.suspended': 'Suspenso',
      // msg.*
      'msg.loading': 'Carregando...',
      'msg.empty': 'Nenhum resultado encontrado',
      'msg.saved': 'Salvo com sucesso',
      'msg.error': 'Ocorreu um erro',
      'msg.success': 'Operação realizada com sucesso',
      'msg.no-data': 'Sem dados disponíveis',
      'msg.deleted': 'Excluído com sucesso',
      'msg.copied': 'Copiado',
      'msg.sent': 'Enviado',
      'msg.received': 'Recebido',
      'msg.generated': 'Gerado',
      'msg.applied': 'Aplicado',
      'msg.restored': 'Restaurado',
      'msg.refreshed': 'Atualizado',
      'msg.validated': 'Validado',
      // page.*
      'page.dashboard': 'Painel',
      'page.settings': 'Configurações',
      'page.profile': 'Perfil',
      'page.notifications': 'Notificações',
      'page.audit': 'Auditoria',
      'page.search-results': 'Resultados da busca',
      'page.library': 'Biblioteca',
      'page.builder': 'Construtor',
      'page.editor': 'Editor',
      'page.detail': 'Detalhe',
      'page.configuration': 'Configuração',
      'page.integration': 'Integração',
      'page.history': 'Histórico',
      'page.statistics': 'Estatísticas',
      'page.reports': 'Relatórios',
      // section.*
      'section.identification': 'Identificação',
      'section.configuration': 'Configuração',
      'section.summary': 'Resumo',
      'section.details': 'Detalhes',
      'section.items': 'Itens',
      'section.attachments': 'Anexos',
      'section.comments': 'Comentários',
      'section.history': 'Histórico',
      'section.related': 'Relacionados',
      'section.integrations': 'Integrações',
      'section.permissions': 'Permissões',
      'section.schedule': 'Agendamento',
      'section.notifications': 'Notificações',
      'section.advanced': 'Avançado',
      'section.basic': 'Básico',
      // placeholder.*
      'placeholder.search': 'Buscar...',
      'placeholder.email': 'voce@empresa.com',
      'placeholder.name': 'Digite o nome',
      'placeholder.description': 'Digite uma descrição',
      'placeholder.value': 'Digite o valor',
      'placeholder.select': 'Selecione...',
      'placeholder.tags': 'Adicione tags',
      'placeholder.comment': 'Escreva um comentário',
      'placeholder.code': 'Código',
      'placeholder.url': 'https://...',
      // toast
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
      'nav.workflow': 'Workflow',
      'nav.fiscal': 'Fiscal',
      'nav.audit': 'Audit',
      'btn.save': 'Save',
      'btn.cancel': 'Cancel',
      'btn.create': 'Create',
      'btn.delete': 'Delete',
      'btn.edit': 'Edit',
      'btn.export': 'Export',
      'btn.search': 'Search',
      'btn.filter': 'Filter',
      'btn.new': 'New',
      'btn.apply': 'Apply',
      'btn.reset': 'Reset',
      'btn.close': 'Close',
      'btn.confirm': 'Confirm',
      'btn.back': 'Back',
      'btn.next': 'Next',
      'btn.generate': 'Generate',
      'btn.customize': 'Customize',
      'btn.share': 'Share',
      'btn.duplicate': 'Duplicate',
      'btn.archive': 'Archive',
      'label.status': 'Status',
      'label.actions': 'Actions',
      'label.created': 'Created',
      'label.updated': 'Updated',
      'label.user': 'User',
      'label.name': 'Name',
      'label.description': 'Description',
      'label.type': 'Type',
      'label.value': 'Value',
      'label.total': 'Total',
      'label.count': 'Count',
      'label.date': 'Date',
      'label.priority': 'Priority',
      'label.owner': 'Owner',
      'label.tags': 'Tags',
      'label.category': 'Category',
      'label.code': 'Code',
      'label.amount': 'Amount',
      'label.source': 'Source',
      'label.destination': 'Destination',
      'label.expires': 'Expires',
      'label.deadline': 'Deadline',
      'label.sla': 'SLA',
      'label.severity': 'Severity',
      'label.channel': 'Channel',
      'label.condition': 'Condition',
      'label.message': 'Message',
      'label.score': 'Score',
      'label.version': 'Version',
      'label.email': 'Email',
      'label.phone': 'Phone',
      'filter.all': 'All',
      'filter.active': 'Active',
      'filter.inactive': 'Inactive',
      'filter.pending': 'Pending',
      'filter.completed': 'Completed',
      'filter.cancelled': 'Cancelled',
      'filter.approved': 'Approved',
      'filter.rejected': 'Rejected',
      'filter.expired': 'Expired',
      'filter.draft': 'Drafts',
      'filter.archived': 'Archived',
      'filter.latest': 'Latest',
      'filter.this-week': 'This week',
      'filter.this-month': 'This month',
      'filter.custom': 'Custom',
      'status.ok': 'OK',
      'status.error': 'Error',
      'status.warning': 'Warning',
      'status.info': 'Info',
      'status.processing': 'Processing',
      'status.queued': 'Queued',
      'status.ready': 'Ready',
      'status.failed': 'Failed',
      'status.success': 'Success',
      'status.neutral': 'Neutral',
      'status.normal': 'Normal',
      'status.critical': 'Critical',
      'status.urgent': 'Urgent',
      'status.expired': 'Expired',
      'status.suspended': 'Suspended',
      'msg.loading': 'Loading...',
      'msg.empty': 'No results found',
      'msg.saved': 'Saved successfully',
      'msg.error': 'An error occurred',
      'msg.success': 'Operation completed successfully',
      'msg.no-data': 'No data available',
      'msg.deleted': 'Deleted successfully',
      'msg.copied': 'Copied',
      'msg.sent': 'Sent',
      'msg.received': 'Received',
      'msg.generated': 'Generated',
      'msg.applied': 'Applied',
      'msg.restored': 'Restored',
      'msg.refreshed': 'Refreshed',
      'msg.validated': 'Validated',
      'page.dashboard': 'Dashboard',
      'page.settings': 'Settings',
      'page.profile': 'Profile',
      'page.notifications': 'Notifications',
      'page.audit': 'Audit',
      'page.search-results': 'Search results',
      'page.library': 'Library',
      'page.builder': 'Builder',
      'page.editor': 'Editor',
      'page.detail': 'Detail',
      'page.configuration': 'Configuration',
      'page.integration': 'Integration',
      'page.history': 'History',
      'page.statistics': 'Statistics',
      'page.reports': 'Reports',
      'section.identification': 'Identification',
      'section.configuration': 'Configuration',
      'section.summary': 'Summary',
      'section.details': 'Details',
      'section.items': 'Items',
      'section.attachments': 'Attachments',
      'section.comments': 'Comments',
      'section.history': 'History',
      'section.related': 'Related',
      'section.integrations': 'Integrations',
      'section.permissions': 'Permissions',
      'section.schedule': 'Schedule',
      'section.notifications': 'Notifications',
      'section.advanced': 'Advanced',
      'section.basic': 'Basic',
      'placeholder.search': 'Search...',
      'placeholder.email': 'you@company.com',
      'placeholder.name': 'Enter name',
      'placeholder.description': 'Enter a description',
      'placeholder.value': 'Enter value',
      'placeholder.select': 'Select...',
      'placeholder.tags': 'Add tags',
      'placeholder.comment': 'Write a comment',
      'placeholder.code': 'Code',
      'placeholder.url': 'https://...',
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
      'nav.workflow': 'Workflow',
      'nav.fiscal': 'Fiscal',
      'nav.audit': 'Auditoría',
      'btn.save': 'Guardar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Crear',
      'btn.delete': 'Eliminar',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Buscar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Nuevo',
      'btn.apply': 'Aplicar',
      'btn.reset': 'Limpiar',
      'btn.close': 'Cerrar',
      'btn.confirm': 'Confirmar',
      'btn.back': 'Volver',
      'btn.next': 'Siguiente',
      'btn.generate': 'Generar',
      'btn.customize': 'Personalizar',
      'btn.share': 'Compartir',
      'btn.duplicate': 'Duplicar',
      'btn.archive': 'Archivar',
      'label.status': 'Estado',
      'label.actions': 'Acciones',
      'label.created': 'Creado el',
      'label.updated': 'Actualizado el',
      'label.user': 'Usuario',
      'label.name': 'Nombre',
      'label.description': 'Descripción',
      'label.type': 'Tipo',
      'label.value': 'Valor',
      'label.total': 'Total',
      'label.count': 'Cantidad',
      'label.date': 'Fecha',
      'label.priority': 'Prioridad',
      'label.owner': 'Responsable',
      'label.tags': 'Etiquetas',
      'label.category': 'Categoría',
      'label.code': 'Código',
      'label.amount': 'Monto',
      'label.source': 'Origen',
      'label.destination': 'Destino',
      'label.expires': 'Expira el',
      'label.deadline': 'Plazo',
      'label.sla': 'SLA',
      'label.severity': 'Severidad',
      'label.channel': 'Canal',
      'label.condition': 'Condición',
      'label.message': 'Mensaje',
      'label.score': 'Puntuación',
      'label.version': 'Versión',
      'label.email': 'Correo',
      'label.phone': 'Teléfono',
      'filter.all': 'Todos',
      'filter.active': 'Activos',
      'filter.inactive': 'Inactivos',
      'filter.pending': 'Pendientes',
      'filter.completed': 'Completados',
      'filter.cancelled': 'Cancelados',
      'filter.approved': 'Aprobados',
      'filter.rejected': 'Rechazados',
      'filter.expired': 'Expirados',
      'filter.draft': 'Borradores',
      'filter.archived': 'Archivados',
      'filter.latest': 'Más recientes',
      'filter.this-week': 'Esta semana',
      'filter.this-month': 'Este mes',
      'filter.custom': 'Personalizado',
      'status.ok': 'OK',
      'status.error': 'Error',
      'status.warning': 'Aviso',
      'status.info': 'Info',
      'status.processing': 'Procesando',
      'status.queued': 'En cola',
      'status.ready': 'Listo',
      'status.failed': 'Fallido',
      'status.success': 'Éxito',
      'status.neutral': 'Neutro',
      'status.normal': 'Normal',
      'status.critical': 'Crítico',
      'status.urgent': 'Urgente',
      'status.expired': 'Expirado',
      'status.suspended': 'Suspendido',
      'msg.loading': 'Cargando...',
      'msg.empty': 'No se encontraron resultados',
      'msg.saved': 'Guardado correctamente',
      'msg.error': 'Ocurrió un error',
      'msg.success': 'Operación completada correctamente',
      'msg.no-data': 'No hay datos disponibles',
      'msg.deleted': 'Eliminado correctamente',
      'msg.copied': 'Copiado',
      'msg.sent': 'Enviado',
      'msg.received': 'Recibido',
      'msg.generated': 'Generado',
      'msg.applied': 'Aplicado',
      'msg.restored': 'Restaurado',
      'msg.refreshed': 'Actualizado',
      'msg.validated': 'Validado',
      'page.dashboard': 'Panel',
      'page.settings': 'Configuración',
      'page.profile': 'Perfil',
      'page.notifications': 'Notificaciones',
      'page.audit': 'Auditoría',
      'page.search-results': 'Resultados de búsqueda',
      'page.library': 'Biblioteca',
      'page.builder': 'Constructor',
      'page.editor': 'Editor',
      'page.detail': 'Detalle',
      'page.configuration': 'Configuración',
      'page.integration': 'Integración',
      'page.history': 'Historial',
      'page.statistics': 'Estadísticas',
      'page.reports': 'Informes',
      'section.identification': 'Identificación',
      'section.configuration': 'Configuración',
      'section.summary': 'Resumen',
      'section.details': 'Detalles',
      'section.items': 'Ítems',
      'section.attachments': 'Adjuntos',
      'section.comments': 'Comentarios',
      'section.history': 'Historial',
      'section.related': 'Relacionados',
      'section.integrations': 'Integraciones',
      'section.permissions': 'Permisos',
      'section.schedule': 'Programación',
      'section.notifications': 'Notificaciones',
      'section.advanced': 'Avanzado',
      'section.basic': 'Básico',
      'placeholder.search': 'Buscar...',
      'placeholder.email': 'tu@empresa.com',
      'placeholder.name': 'Ingrese el nombre',
      'placeholder.description': 'Ingrese una descripción',
      'placeholder.value': 'Ingrese el valor',
      'placeholder.select': 'Seleccione...',
      'placeholder.tags': 'Añadir etiquetas',
      'placeholder.comment': 'Escriba un comentario',
      'placeholder.code': 'Código',
      'placeholder.url': 'https://...',
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
      'nav.workflow': 'Workflow',
      'nav.fiscal': 'Fiscal',
      'nav.audit': 'Auditoria',
      'btn.save': 'Guardar',
      'btn.cancel': 'Cancelar',
      'btn.create': 'Criar',
      'btn.delete': 'Eliminar',
      'btn.edit': 'Editar',
      'btn.export': 'Exportar',
      'btn.search': 'Procurar',
      'btn.filter': 'Filtrar',
      'btn.new': 'Novo',
      'btn.apply': 'Aplicar',
      'btn.reset': 'Limpar',
      'btn.close': 'Fechar',
      'btn.confirm': 'Confirmar',
      'btn.back': 'Voltar',
      'btn.next': 'Seguinte',
      'btn.generate': 'Gerar',
      'btn.customize': 'Personalizar',
      'btn.share': 'Partilhar',
      'btn.duplicate': 'Duplicar',
      'btn.archive': 'Arquivar',
      'label.status': 'Estado',
      'label.actions': 'Ações',
      'label.created': 'Criado em',
      'label.updated': 'Atualizado em',
      'label.user': 'Utilizador',
      'label.name': 'Nome',
      'label.description': 'Descrição',
      'label.type': 'Tipo',
      'label.value': 'Valor',
      'label.total': 'Total',
      'label.count': 'Quantidade',
      'label.date': 'Data',
      'label.priority': 'Prioridade',
      'label.owner': 'Responsável',
      'label.tags': 'Etiquetas',
      'label.category': 'Categoria',
      'label.code': 'Código',
      'label.amount': 'Montante',
      'label.source': 'Origem',
      'label.destination': 'Destino',
      'label.expires': 'Expira em',
      'label.deadline': 'Prazo',
      'label.sla': 'SLA',
      'label.severity': 'Severidade',
      'label.channel': 'Canal',
      'label.condition': 'Condição',
      'label.message': 'Mensagem',
      'label.score': 'Pontuação',
      'label.version': 'Versão',
      'label.email': 'E-mail',
      'label.phone': 'Telefone',
      'filter.all': 'Todos',
      'filter.active': 'Ativos',
      'filter.inactive': 'Inativos',
      'filter.pending': 'Pendentes',
      'filter.completed': 'Concluídos',
      'filter.cancelled': 'Cancelados',
      'filter.approved': 'Aprovados',
      'filter.rejected': 'Rejeitados',
      'filter.expired': 'Expirados',
      'filter.draft': 'Rascunhos',
      'filter.archived': 'Arquivados',
      'filter.latest': 'Mais recentes',
      'filter.this-week': 'Esta semana',
      'filter.this-month': 'Este mês',
      'filter.custom': 'Personalizado',
      'status.ok': 'OK',
      'status.error': 'Erro',
      'status.warning': 'Atenção',
      'status.info': 'Info',
      'status.processing': 'A processar',
      'status.queued': 'Em fila',
      'status.ready': 'Pronto',
      'status.failed': 'Falhou',
      'status.success': 'Sucesso',
      'status.neutral': 'Neutro',
      'status.normal': 'Normal',
      'status.critical': 'Crítico',
      'status.urgent': 'Urgente',
      'status.expired': 'Expirado',
      'status.suspended': 'Suspenso',
      'msg.loading': 'A carregar...',
      'msg.empty': 'Nenhum resultado encontrado',
      'msg.saved': 'Guardado com sucesso',
      'msg.error': 'Ocorreu um erro',
      'msg.success': 'Operação concluída com sucesso',
      'msg.no-data': 'Sem dados disponíveis',
      'msg.deleted': 'Eliminado com sucesso',
      'msg.copied': 'Copiado',
      'msg.sent': 'Enviado',
      'msg.received': 'Recebido',
      'msg.generated': 'Gerado',
      'msg.applied': 'Aplicado',
      'msg.restored': 'Restaurado',
      'msg.refreshed': 'Atualizado',
      'msg.validated': 'Validado',
      'page.dashboard': 'Painel',
      'page.settings': 'Definições',
      'page.profile': 'Perfil',
      'page.notifications': 'Notificações',
      'page.audit': 'Auditoria',
      'page.search-results': 'Resultados da procura',
      'page.library': 'Biblioteca',
      'page.builder': 'Construtor',
      'page.editor': 'Editor',
      'page.detail': 'Detalhe',
      'page.configuration': 'Configuração',
      'page.integration': 'Integração',
      'page.history': 'Histórico',
      'page.statistics': 'Estatísticas',
      'page.reports': 'Relatórios',
      'section.identification': 'Identificação',
      'section.configuration': 'Configuração',
      'section.summary': 'Resumo',
      'section.details': 'Detalhes',
      'section.items': 'Itens',
      'section.attachments': 'Anexos',
      'section.comments': 'Comentários',
      'section.history': 'Histórico',
      'section.related': 'Relacionados',
      'section.integrations': 'Integrações',
      'section.permissions': 'Permissões',
      'section.schedule': 'Agendamento',
      'section.notifications': 'Notificações',
      'section.advanced': 'Avançado',
      'section.basic': 'Básico',
      'placeholder.search': 'Procurar...',
      'placeholder.email': 'tu@empresa.com',
      'placeholder.name': 'Introduza o nome',
      'placeholder.description': 'Introduza uma descrição',
      'placeholder.value': 'Introduza o valor',
      'placeholder.select': 'Selecione...',
      'placeholder.tags': 'Adicionar etiquetas',
      'placeholder.comment': 'Escreva um comentário',
      'placeholder.code': 'Código',
      'placeholder.url': 'https://...',
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
      'nav.workflow': 'Workflow',
      'nav.fiscal': 'Steuer',
      'nav.audit': 'Audit',
      'btn.save': 'Speichern',
      'btn.cancel': 'Abbrechen',
      'btn.create': 'Erstellen',
      'btn.delete': 'Löschen',
      'btn.edit': 'Bearbeiten',
      'btn.export': 'Exportieren',
      'btn.search': 'Suchen',
      'btn.filter': 'Filtern',
      'btn.new': 'Neu',
      'btn.apply': 'Anwenden',
      'btn.reset': 'Zurücksetzen',
      'btn.close': 'Schließen',
      'btn.confirm': 'Bestätigen',
      'btn.back': 'Zurück',
      'btn.next': 'Weiter',
      'btn.generate': 'Generieren',
      'btn.customize': 'Anpassen',
      'btn.share': 'Teilen',
      'btn.duplicate': 'Duplizieren',
      'btn.archive': 'Archivieren',
      'label.status': 'Status',
      'label.actions': 'Aktionen',
      'label.created': 'Erstellt am',
      'label.updated': 'Aktualisiert am',
      'label.user': 'Benutzer',
      'label.name': 'Name',
      'label.description': 'Beschreibung',
      'label.type': 'Typ',
      'label.value': 'Wert',
      'label.total': 'Gesamt',
      'label.count': 'Anzahl',
      'label.date': 'Datum',
      'label.priority': 'Priorität',
      'label.owner': 'Verantwortlich',
      'label.tags': 'Schlagwörter',
      'label.category': 'Kategorie',
      'label.code': 'Code',
      'label.amount': 'Betrag',
      'label.source': 'Quelle',
      'label.destination': 'Ziel',
      'label.expires': 'Läuft ab',
      'label.deadline': 'Frist',
      'label.sla': 'SLA',
      'label.severity': 'Schweregrad',
      'label.channel': 'Kanal',
      'label.condition': 'Bedingung',
      'label.message': 'Nachricht',
      'label.score': 'Punktzahl',
      'label.version': 'Version',
      'label.email': 'E-Mail',
      'label.phone': 'Telefon',
      'filter.all': 'Alle',
      'filter.active': 'Aktiv',
      'filter.inactive': 'Inaktiv',
      'filter.pending': 'Ausstehend',
      'filter.completed': 'Abgeschlossen',
      'filter.cancelled': 'Storniert',
      'filter.approved': 'Genehmigt',
      'filter.rejected': 'Abgelehnt',
      'filter.expired': 'Abgelaufen',
      'filter.draft': 'Entwürfe',
      'filter.archived': 'Archiviert',
      'filter.latest': 'Neueste',
      'filter.this-week': 'Diese Woche',
      'filter.this-month': 'Diesen Monat',
      'filter.custom': 'Benutzerdefiniert',
      'status.ok': 'OK',
      'status.error': 'Fehler',
      'status.warning': 'Warnung',
      'status.info': 'Info',
      'status.processing': 'In Bearbeitung',
      'status.queued': 'In Warteschlange',
      'status.ready': 'Bereit',
      'status.failed': 'Fehlgeschlagen',
      'status.success': 'Erfolg',
      'status.neutral': 'Neutral',
      'status.normal': 'Normal',
      'status.critical': 'Kritisch',
      'status.urgent': 'Dringend',
      'status.expired': 'Abgelaufen',
      'status.suspended': 'Ausgesetzt',
      'msg.loading': 'Wird geladen...',
      'msg.empty': 'Keine Ergebnisse gefunden',
      'msg.saved': 'Erfolgreich gespeichert',
      'msg.error': 'Ein Fehler ist aufgetreten',
      'msg.success': 'Vorgang erfolgreich abgeschlossen',
      'msg.no-data': 'Keine Daten verfügbar',
      'msg.deleted': 'Erfolgreich gelöscht',
      'msg.copied': 'Kopiert',
      'msg.sent': 'Gesendet',
      'msg.received': 'Empfangen',
      'msg.generated': 'Generiert',
      'msg.applied': 'Angewendet',
      'msg.restored': 'Wiederhergestellt',
      'msg.refreshed': 'Aktualisiert',
      'msg.validated': 'Validiert',
      'page.dashboard': 'Übersicht',
      'page.settings': 'Einstellungen',
      'page.profile': 'Profil',
      'page.notifications': 'Benachrichtigungen',
      'page.audit': 'Audit',
      'page.search-results': 'Suchergebnisse',
      'page.library': 'Bibliothek',
      'page.builder': 'Builder',
      'page.editor': 'Editor',
      'page.detail': 'Detail',
      'page.configuration': 'Konfiguration',
      'page.integration': 'Integration',
      'page.history': 'Verlauf',
      'page.statistics': 'Statistiken',
      'page.reports': 'Berichte',
      'section.identification': 'Identifikation',
      'section.configuration': 'Konfiguration',
      'section.summary': 'Zusammenfassung',
      'section.details': 'Details',
      'section.items': 'Positionen',
      'section.attachments': 'Anhänge',
      'section.comments': 'Kommentare',
      'section.history': 'Verlauf',
      'section.related': 'Verknüpft',
      'section.integrations': 'Integrationen',
      'section.permissions': 'Berechtigungen',
      'section.schedule': 'Zeitplan',
      'section.notifications': 'Benachrichtigungen',
      'section.advanced': 'Erweitert',
      'section.basic': 'Grundlegend',
      'placeholder.search': 'Suchen...',
      'placeholder.email': 'sie@firma.com',
      'placeholder.name': 'Name eingeben',
      'placeholder.description': 'Beschreibung eingeben',
      'placeholder.value': 'Wert eingeben',
      'placeholder.select': 'Auswählen...',
      'placeholder.tags': 'Schlagwörter hinzufügen',
      'placeholder.comment': 'Kommentar schreiben',
      'placeholder.code': 'Code',
      'placeholder.url': 'https://...',
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
      n.textContent = val;
    }
    // placeholder translations
    var phNodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phNodes.length; j++) {
      var pn = phNodes[j];
      var pkey = pn.getAttribute('data-i18n-placeholder');
      if (!pkey) continue;
      pn.setAttribute('placeholder', t(pkey));
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

  window.dmsI18n = { t: t, apply: applyTranslations, get: getLocale, set: function (c) {
    if (!DICT[c]) return false;
    setLocale(c);
    applyTranslations();
    return true;
  }};
})();
