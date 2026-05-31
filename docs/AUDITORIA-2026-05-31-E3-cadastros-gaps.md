# Auditoria E3 — Cadastros e Telas Faltantes

> Data original: 2026-05-31
> **Reconciliado: 2026-05-31** (após Sprints A, B e Seguinte)
> Origem: cruzamento dos 14 concepts em `docs/concepts/` + `docs/TELAS-PENDENTES.md` + `docs/correcoes-mockup.md` + `docs/TODO-WORKFLOWS-DEFAULT.md` + inventário de `tela01-82.html`
> Objetivo: garantir que toda entidade modelada nos concepts tem CRUD funcional no mockup (e dar visibilidade pros PLANs futuros)

## 0. Reconciliação 2026-05-31

Esta auditoria foi escrita ANTES dos sprints A, B e Seguinte (commits `359ff90`, `d008778`, `dede945`). Estado real do repo em 2026-05-31 já fechou parte dos gaps críticos. Itens reconciliados nesta passagem:

| Item original                            | Status atualizado                     | Evidência                                                  |
| ---------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| §2 Crítico #1 — CRUD de Alçadas (tela83) | ✅ ENTREGUE Sprint A (`359ff90`)      | `tela83-alcadas-cadastro.html` (519 linhas)                |
| §2 Crítico #2 — Lista/criar/bloquear User| ✅ ENTREGUE Sprint B (`d008778`)      | `tela84-users-admin.html` (597 linhas, com modal bloqueio) |
| §2 Crítico #3 — CRUD de Fornecedor       | ✅ ENTREGUE Sprint A (`359ff90`)      | `tela86-fornecedores-cadastro.html` (589 linhas)           |
| §2 Crítico #4 — Cadastro de Time         | ✅ ENTREGUE Sprint Seguinte (`dede945` + rename `ced4921`) | `tela87-times-cadastro.html` (612 linhas) |
| §2 Alto #10 — Permission Delegation      | ✅ ENTREGUE Sprint B (`d008778`)      | `tela85-permission-delegations.html` (525 linhas)          |
| §3 T1 / T2 / T6 (telas 83/84/87 Times)   | ✅ ENTREGUE (ver acima)               | 5 arquivos `tela83-87` confirmados no repo                 |
| §4 F1 — Push notification (canais)       | 🟡 concept atualizado, tela pendente  | `CONCEPT-ALERT.md` ganhou canais push (commit `dede945`)   |
| §4 F6 — Multi-tenant (concept + tela)    | 🟡 concept criado, tela pendente      | `CONCEPT-MULTITENANT.md` existe; tela admin não entregue   |

**Não houve descobertas novas** nesta reconciliação — apenas fechamento de gaps já mapeados.

Linhas da matriz (§1) e tabelas de severidade (§2-§3) abaixo foram atualizadas. Permanecem abertos: ~~§2 Crítico #5 (matriz de permissões com save real)~~ ✅ resolvido Passo 5 2026-05-31, §2 Alto #6-9 e #11, todo §2 Médio, T3-T5 e T7-T9, F2-F5/F7. **0 críticos abertos.**

## Sumário (pós-reconciliação)

- **Entidades catalogadas:** 38 (13 transacionais + 12 admin/config + 8 logs/auditoria + 5 governança/seed)
- **CRUD completo (✅):** 13 (+6 vs versão original)
- **CRUD parcial (🟡):** 21
- **Sem CRUD (❌):** 4 (-6 vs versão original)
- **Telas faltantes (não-cadastro):** 6 (-3)
- **Funcionalidades sem mockup:** 7 (F1 e F6 com concept entregue, tela ainda pendente)

A maior dívida remanescente está em **3 frentes**:
1. **Engine & Admin avançado** — Webhooks/SMTP/Tokens/Templates têm lista mas detalhe e configuração avançada são placeholders.
2. **ActionIA & Alert detalhados** — tela77/78 são listas + drawer "novo"; falta editor completo e log de execução.
3. **Logs operacionais de IA/Match** — AI Generation Log, Match Execution Log e Alert Fire History não têm tela.

---

## 1. Matriz Entidade × CRUD

Legenda: ✅ entregue · 🟡 parcial · ❌ ausente · `—` não aplicável (seed/derivado)

### 1.1 Transacionais (compras / financeiro)

| Entidade            | Concept/Origem                  | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| Requisição          | WORKFLOW-OBLIGATORY             | ✅ tela21   | ✅ tela22  | ✅ tela23  | 🟡 via tela22 | 🟡        | ✅     |
| Cotação             | WORKFLOW-OBLIGATORY             | ✅ tela24   | ✅ tela25  | ✅ tela26  | 🟡         | 🟡          | ✅     |
| Pedido              | WORKFLOW-OBLIGATORY             | ✅ tela27   | ✅ tela28  | ✅ tela29  | 🟡         | 🟡          | ✅     |
| Nota Fiscal         | WORKFLOW-OBLIGATORY/MATCH-ENGINE| ✅ tela38   | ❌ ingestão| ✅ tela39  | 🟡         | ❌          | 🟡     |
| Aprovação           | ALCADAS                         | ✅ tela40   | `—`        | ✅ tela41  | `—`         | `—`         | 🟡     |
| Pré-lançamento      | (legado)                        | ✅ tela36   | ❌         | ✅ tela37  | 🟡         | 🟡          | 🟡     |
| Contrato            | WORKFLOW-OBLIGATORY             | ✅ tela44   | ✅ tela45  | ✅ tela46  | 🟡         | 🟡          | ✅     |
| Orçamento           | (legado)                        | ✅ tela42   | ✅ tela43  | ❌         | 🟡         | 🟡          | 🟡     |

### 1.2 Cadastros estruturais

| Entidade            | Concept/Origem                  | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| Empresa             | USER-SCOPE                      | ✅ tela30   | ✅ tela31  | 🟡 via form| ✅ tela31  | 🟡          | ✅     |
| Centro de Custo     | USER-SCOPE                      | ✅ tela32   | ✅ tela33  | 🟡         | ✅ tela33  | 🟡          | ✅     |
| Plano de Contas     | (legado)                        | ✅ tela34   | ✅ tela35  | 🟡         | ✅          | 🟡          | ✅     |
| Tag                 | MATCH-ENGINE/(catálogo)         | ✅ tela01   | ✅ tela02  | 🟡         | ✅          | 🟡          | ✅     |
| Procedure           | (legado)                        | ✅ tela03   | ❌         | ❌         | ❌          | ❌          | 🟡     |
| SOP                 | (legado)                        | ✅ tela06   | ✅ tela07  | 🟡         | ✅ tela07  | 🟡          | ✅     |
| Fornecedor          | USER-SCOPE                      | ✅ tela86   | ✅ tela86  | ✅ tela86  | ✅ tela86  | 🟡          | ✅     |

### 1.3 Engine & Admin (workflow / integrações)

| Entidade            | Concept/Origem                  | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| Workflow            | WORKFLOW-OBLIGATORY             | ✅ tela04   | ✅ tela10  | 🟡 via 10  | ✅ tela10  | 🟡 (def `🔒`)| ✅    |
| Stage Trigger       | STAGE-ROLE-ASSIGNMENT           | 🟡 dentro 04| ✅ tela08  | 🟡         | ✅ tela08  | 🟡          | 🟡     |
| Escalation Trigger  | STAGE-OWNERSHIP                 | 🟡 dentro 04| ✅ tela09  | 🟡         | ✅ tela09  | 🟡          | 🟡     |
| Match Rule          | MATCH-ENGINE                    | 🟡 tela11/79| ✅ tela11  | 🟡         | ✅ tela11  | 🟡          | 🟡     |
| ActionIA            | ACTIONIA                        | ✅ tela77   | ✅ drawer  | ❌         | ❌          | ❌ (em_uso)| 🟡     |
| Alert               | ALERT                           | ✅ tela78   | ✅ drawer  | ❌         | ❌          | 🟡 arquiva  | 🟡     |
| Webhook             | (correcoes)                     | ✅ tela61   | 🟡         | ❌         | ❌          | ❌          | 🟡     |
| Email Template      | ALERT                           | ✅ tela62   | 🟡         | ❌         | ❌          | ❌          | 🟡     |
| API Token           | (correcoes)                     | ✅ tela64   | 🟡         | ❌         | ❌          | 🟡          | 🟡     |
| MAILIA Rule         | (correcoes)                     | ✅ tela15   | 🟡         | 🟡         | 🟡         | 🟡          | 🟡     |
| Integração          | (correcoes)                     | ✅ tela14   | 🟡         | ❌         | ❌          | ❌          | 🟡     |
| SMTP/IMAP Config    | (correcoes)                     | ✅ tela63   | `—` singleton| 🟡       | 🟡         | `—`         | 🟡     |

### 1.4 Governança / Permissões / Scope

| Entidade               | Concept/Origem                | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ---------------------- | ----------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| Role                   | PERMISSIONS                   | ✅ tela80   | ❌         | 🟡 matriz  | 🟡 matriz   | ❌ (is_system)| 🟡   |
| Permission (catálogo)  | PERMISSIONS                   | `—` seed    | `—`        | 🟡 tela80  | `—`         | `—`         | `—`    |
| Permission Delegation  | PERMISSIONS §5                | ✅ tela85   | ✅ tela85  | ✅ tela85  | ✅ tela85  | ✅ revogar  | ✅     |
| User Scope             | USER-SCOPE                    | 🟡 tela50   | 🟡 tela50  | 🟡         | 🟡 tela50  | 🟡          | 🟡     |
| Auto Rule              | USER-SCOPE §8                 | 🟡 bulk    | 🟡 bulk-modal| ❌      | 🟡          | 🟡          | 🟡     |
| Módulo                 | MODULE-INTERVENIENTES         | ✅ tela81   | ❌         | ✅ tela81  | 🟡 só ativo | ❌          | 🟡     |
| Critério (catálogo)    | MODULE-INTERVENIENTES         | `—` seed    | `—` DMSYS  | 🟡 tela81  | `—`         | `—`         | `—`    |
| Module Interveniente Config | MODULE-INTERVENIENTES    | ✅ tela81   | ✅ tela81  | ✅ tela81  | ✅ tela81  | 🟡          | ✅     |
| Alçada                 | ALCADAS                       | ✅ tela83   | ✅ tela83  | ✅ tela83  | ✅ tela83  | 🟡          | ✅     |
| Alcada Aprovação       | ALCADAS                       | 🟡 tela40   | `—` runtime| 🟡 tela41  | `—`         | `—`         | 🟡     |
| Time / Team            | TEAMS / SAVED-FILTERS §2      | ✅ tela87   | ✅ tela87  | ✅ tela87  | ✅ tela87  | 🟡          | ✅     |
| Stage Health Issue     | STAGE-OWNERSHIP               | ✅ tela82   | `—` engine | ✅ tela82  | ✅ resolver| `—`         | ✅     |

### 1.5 Usuários e Profile

| Entidade            | Concept/Origem                  | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| User (próprio)      | PERMISSIONS                     | `—`         | tela72 convite | ✅ tela50 | ✅ tela50 | `—`         | ✅     |
| User (de outros)    | PERMISSIONS §6 Gestão de Profile| ✅ tela84   | ✅ tela84  | ✅ tela84  | ✅ tela84  | 🟡 soft     | ✅     |
| Bloqueio de User    | STAGE-OWNERSHIP §3.4            | ✅ tela84   | ✅ tela84  | ✅ tela84  | ✅ tela84  | `—`         | ✅     |
| User Preferences    | USER-PROFILE-PREFERENCES        | 🟡 drawer   | 🟡         | 🟡         | 🟡         | 🟡 reset    | 🟡     |
| Saved Filter        | SAVED-FILTERS                   | 🟡 tag-filter| 🟡        | 🟡         | 🟡          | 🟡          | 🟡     |
| Anotação            | (mockup-only)                   | ✅ tela76   | ✅         | ✅         | ✅          | ✅          | ✅     |

### 1.6 Logs / Auditoria

| Entidade            | Concept/Origem                  | Lista       | Filtros    | Drill      | Export      | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ------ |
| Audit Trail global  | (correcoes)                     | ✅ tela60   | ✅         | 🟡         | 🟡          | ✅     |
| Audit Trail por workflow | (correcoes)                | ✅ tela13   | ✅         | ✅         | 🟡          | ✅     |
| Meu Audit Log       | PERMISSIONS                     | ✅ tela74   | 🟡         | 🟡         | 🟡          | ✅     |
| AI Generation Log   | AI-GENERATION                   | ❌          | ❌         | ❌         | ❌          | ❌     |
| Match Execution Log | MATCH-ENGINE §2.2               | ❌          | ❌         | ❌         | ❌          | ❌     |
| Alert Fire History  | ALERT §2 `last_fired_at`        | ❌          | ❌         | ❌         | ❌          | ❌     |
| Notification        | ALERT §0 (data-model)           | ✅ tela71   | 🟡         | 🟡         | ❌          | 🟡     |

---

## 2. Gaps por severidade

### 🔴 Crítico — bloqueia operação ou governança em produção

| # | Entidade/Tela faltante                | Concept origem            | Status / Justificativa                                                                                     |
| - | ------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1 | ~~CRUD de Alçadas (tela83)~~          | ALCADAS                   | ✅ ENTREGUE Sprint A 2026-05-31 — `tela83-alcadas-cadastro.html`. Integração com tela40/41 ainda pendente. |
| 2 | ~~Lista de Usuários + criar/bloquear~~| PERMISSIONS §6, STAGE-OWNERSHIP §3.3-3.4 | ✅ ENTREGUE Sprint B 2026-05-31 — `tela84-users-admin.html` (modal bloqueio com análise de impacto). |
| 3 | ~~CRUD de Fornecedor~~                | USER-SCOPE                | ✅ ENTREGUE Sprint A 2026-05-31 — `tela86-fornecedores-cadastro.html`.                                     |
| 4 | ~~Cadastro de Time (Team)~~           | TEAMS / SAVED-FILTERS §2  | ✅ ENTREGUE Sprint Seguinte 2026-05-31 — `tela87-times-cadastro.html` (lista + árvore + drawer + criar).   |
| 5 | ~~Edição da Matriz de Permissões~~    | PERMISSIONS §4.2          | ✅ ENTREGUE Passo 5 2026-05-31 — `tela80` agora tem células clicáveis, dirty-state, modal preview (concessões/revogações), confirmar dispara mock-commit + toast "N delegações geradas", + drawer "Delegar permissão específica" (cria entry em `permission_delegations` mockada). Hook real para tela85 fica para wave seguinte. |

### 🟠 Alto — bloqueia features secundárias ou cria buracos de auditoria

| # | Entidade/Tela faltante                       | Concept origem        | Justificativa                                                                              |
| - | -------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| 6 | **CRUD/detalhe de ActionIA**                 | ACTIONIA §6           | tela77 tem lista + drawer "novo", falta página de detalhe + edição + flag `can_replace_stage_user` exigindo Admin Geral. |
| 7 | **CRUD/detalhe de Alert**                    | ALERT §6              | tela78 mesmo gap — drawer cria mas não tem edição completa, preview de mensagem, log de disparos. |
| 8 | **Lista de Match Rules (separada da tela11)**| MATCH-ENGINE §6       | tela11 é editor de regra única; tela79 é config por workflow. Falta catálogo `match_rules` indexável por status/modo/input_type. |
| 9 | **Tela de detalhe de Procedure**             | (legado)              | tela03 tem lista, sem form de criar/editar/detalhe. Procedures são referenciadas em SOP/Stage/Workflow. |
| 10| ~~Gestão de Permission Delegation~~          | PERMISSIONS §5 regras 7-10 | ✅ ENTREGUE Sprint B 2026-05-31 — `tela85-permission-delegations.html` (cadeia + revogação cascata). |
| 11| **Detalhe + edição de Auto Rule**            | USER-SCOPE §8         | Bulk-modal cria regra mas não há gestão consolidada de "minhas regras automáticas" do user. |

### 🟡 Médio — workaround existe, mas não atende sustentabilidade

| # | Entidade/Tela faltante                | Concept origem            | Justificativa                                                                |
| - | ------------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| 12| **CRUD de Workflow Default**          | WORKFLOW-OBLIGATORY §7.1 + STAGE-OWNERSHIP §5.1 | tela04 lista com badge `🔒` mas não há tela para gestão dos 5+ defaults (canais, SLA, etapas). |
| 13| **CRUD de Webhook completo**          | (correcoes)               | tela61 lista — falta form de criar/editar com auth, headers, payload mapping. |
| 14| **CRUD de Email Template**            | ALERT (consumo)           | tela62 lista — sem editor de template com vars, preview, fallback i18n.       |
| 15| **CRUD de API Token**                 | (correcoes)               | tela64 lista — sem criar token com scope, expiração, copy-once, revogar.      |
| 16| **CRUD de MAILIA Rule (admin)**       | (correcoes)               | tela15 admin parcial — sem CRUD completo de regras MAILIA (consumidas por escalation). |
| 17| **Gestão de Saved Filter (admin)**    | SAVED-FILTERS             | tag-filter.js tem drawer mas falta admin: "ver todos os filtros equipe/global, transferir owner, marcar obsoletos". |
| 18| **CRUD de Anotação centralizado**     | (mockup-only)             | tela76 ok pra mockup, mas em produção seria entidade real com soft-delete, autor, status. |

### 🟢 Baixo — pode ficar pra depois

| # | Entidade/Tela faltante              | Justificativa                                              |
| - | ----------------------------------- | ---------------------------------------------------------- |
| 19| Plano de Contas — detalhe dedicado  | Forma + lista cobrem o essencial; detalhe pode ser página única.|
| 20| Detalhe de Empresa/CC/Tag dedicado  | Hoje é o próprio form de edição — UX aceitável.            |
| 21| CRUD de Critério (catálogo)         | É seed DMSYS por design — não vai ter CRUD cliente.        |
| 22| CRUD de Permission (catálogo)       | É seed por design.                                         |

---

## 3. Telas faltantes (não-cadastro)

| # | Tela sugerida                                | Concept pede                                | Prioridade | Status / Justificativa                                                     |
| - | -------------------------------------------- | ------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| T1| ~~tela83 — Gestor de Alçadas~~               | ALCADAS §7                                  | Crítico    | ✅ ENTREGUE Sprint A — `tela83-alcadas-cadastro.html`.                       |
| T2| ~~tela84 — Lista/Admin de Usuários~~         | PERMISSIONS §6, STAGE-OWNERSHIP §3.3-3.4    | Crítico    | ✅ ENTREGUE Sprint B — `tela84-users-admin.html`.                            |
| T3| **tela detalhe de ActionIA**                 | ACTIONIA §6                                 | Alto       | ❌ Edição completa, config por sub-tipo, histórico de execução, vinculações. |
| T4| **tela detalhe de Alert + histórico**        | ALERT §6                                    | Alto       | ❌ Edição, preview de mensagem renderizada, log de disparos, throttling.     |
| T5| **tela Lista de Match Rules**                | MATCH-ENGINE §6                             | Alto       | ❌ Catálogo de regras por status/modo + acesso à tela11/79 de edição.        |
| T6| ~~tela Times (CRUD)~~                        | TEAMS / SAVED-FILTERS §2                    | Crítico    | ✅ ENTREGUE Sprint Seguinte — `tela87-times-cadastro.html` (renomeada de tela88). |
| T7| **Painel de AI Generation Logs**             | AI-GENERATION §2                            | Médio      | ❌ Auditoria de gerações IA (prompts, tokens, rejeições) — governance + custo. |
| T8| **Painel de Match Execution Logs**           | MATCH-ENGINE §2.2                           | Médio      | ❌ Visibilidade de matches/órfãos/ambiguidades pra calibrar regras.          |
| T9| **Centro de Workflow Defaults**              | WORKFLOW-OBLIGATORY §7.1                    | Médio      | ❌ Customização dos 5 workflows `🔒 sistema` (canais/SLA/etapas) sem deletar. |

> Nota numeração: a tela de Times foi inicialmente planejada como `tela88` e depois renomeada para `tela87` (commit `ced4921`), substituindo a alocação original de "Match Rules" — esta última volta ao backlog T5 sem número fixo.

---

## 4. Funcionalidades sem mockup (implícitas em concepts)

| # | Funcionalidade                                | Concept origem              | Justificativa                                                                                |
| - | --------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| F1| **Push notification real (não só centro)**    | ALERT §2 (`canais`)         | 🟡 Concept ALERT atualizado em `dede945` (canais push); tela de setup de credenciais por canal continua pendente. |
| F2| **Engine de DSL de `trigger_condition`**      | ALERT §2                    | Concept marca DSL como pendência; nenhuma tela mostra editor de condição estruturado.        |
| F3| **Engine de `destinatarios_expr`**            | ALERT §2                    | Mesma situação — drawer tela78 tem textarea livre, sem validação semântica.                  |
| F4| **Resolução manual de ambiguidade match**     | MATCH-ENGINE §3.2 (>1 caso) | Fila de "matches ambíguos" não tem tela.                                                     |
| F5| **Backfill workflow_id em legados**           | WORKFLOW-OBLIGATORY §2      | Wizard de migração + dashboard de progresso — sem UI.                                        |
| F6| **Multi-tenant — isolamento e retenção**     | AI-GENERATION §4, REVIEW #18| 🟡 `CONCEPT-MULTITENANT.md` criado em `dede945`; tela admin de tenant continua pendente.     |
| F7| **Promoção workflow inline → template**       | ALCADAS §4, WORKFLOW-OBLIGATORY §3.2 | Modelo decidido (Admin Geral revisa ≥50k); sem UI de revisão/promoção.            |

---

## 5. Recomendações priorizadas

### Já concluído nesta data (2026-05-31)

- ✅ **tela83 Alçadas** (Sprint A) — falta apenas integração com tela40/41.
- ✅ **tela84 Usuários** (Sprint B) — lista + criar + bloquear + análise impacto.
- ✅ **tela85 Permission Delegations** (Sprint B) — cadeia + revogação cascata.
- ✅ **tela86 Fornecedores** (Sprint A).
- ✅ **tela87 Times** (Sprint Seguinte).
- ✅ **CONCEPT-TEAMS** e **CONCEPT-MULTITENANT** criados (Sprint Seguinte).

### Sprint atual (próximas entregas)

1. **Integração tela83 ↔ tela40/41** — fecha o loop de aprovação por valor.
2. **Hook save da matriz tela80 → cadeia tela85** — fecha §2 Crítico #5 (única pendência crítica restante).
3. **Detalhe/edição completa de ActionIA + Alert** — sem isso telas77/78 são vitrines, não editores.

### Próximas sprints

4. **Lista de Match Rules** + **Painel de Match Execution Logs** — calibragem de regras vira data-driven.
5. **Centro de Workflow Defaults** — entrega controle sobre os 5 workflows `🔒` (canais/SLA/etapas).
6. **CRUD completo de Webhook/Email Template/API Token (tela61-64)** — engine & admin pra valer.
7. **Painel de AI Generation Logs** — governance + custo IA.
8. **Tela admin de Multi-tenant** — agora que `CONCEPT-MULTITENANT` existe, tela pode ser planejada.
9. **Setup de canais push (Slack/email)** — agora que `CONCEPT-ALERT` define canais.

### Backlog (validar com PO)

- F1 Push real (Slack/email — depende de setup multi-canal).
- F4 Resolução manual de match ambíguo (precisa volume real).
- F5 Backfill (one-shot — vira deploy specific).
- F6 Multi-tenant + tela admin de tenant (escala de produto).
- F7 Promoção workflow inline → template (depende de adoção real).

### Decisões pendentes que destravam telas

- **Tensão "Agentes vs ActionIA"** (REVIEW #2) — define se tela85 é genérica ou só RPA.
- **Schema de DSL de `trigger_condition`** (F2/F3) — define UI de tela86.
- **CONCEPT-TEAMS vs CONCEPT-PERMISSIONS** (REVIEW #13) — define se tela87 é entidade própria ou subset de roles.
- **CONCEPT-MULTITENANT** (REVIEW #18) — define escopo de quase tudo em admin.
