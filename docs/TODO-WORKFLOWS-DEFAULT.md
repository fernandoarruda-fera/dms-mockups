# TODO: Workflows Default do Sistema

Workflows default são pré-criados pelo time DMSYS, publicados na biblioteca (tela04) com flag `🔒 sistema`, customizáveis mas não deletáveis. Cobrem cenários onde o sistema precisa de fallback automático.

Ver detalhes em [[CONCEPT-WORKFLOW-OBLIGATORY]] (seção 7.1) e [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]].

## Já planejados (Task 3) — ✅ entregues em 2026-05-31

- [x] **WF-DEFAULT-Stage-Orfao** — criado em [[tela04-catalogo-workflows]] com flag `🔒 sistema`; card de recovery pro gestor da cadeira (48h SLA)
- [x] **WF-DEFAULT-Conflito-2-Donos** — criado; lista candidatos e pede decisão pro gestor
- [x] **WF-DEFAULT-User-Bloqueado-Impacto** — criado; scan stages do user bloqueado e dispara `Stage-Orfao` se houver órfão novo
- [x] **WF-DEFAULT-Role-Inativada-Impacto** — criado; consolida órfãos em massa num único card
- [x] **WF-DEFAULT-Scope-Removido-Impacto** — criado; cascade async em background

Todos publicados na biblioteca tela04 como `is_system = true` (Excluir disabled, Editar habilitado). Dashboard de monitoramento em [[tela82-saude-stages]].

## A criar conforme surgir (anotar aqui)
- (vazio por enquanto)
