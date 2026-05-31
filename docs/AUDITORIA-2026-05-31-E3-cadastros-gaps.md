# Auditoria E3 — Cadastros e Telas Faltantes

> Data: 2026-05-31
> Origem: cruzamento dos 14 concepts em `docs/concepts/` + `docs/TELAS-PENDENTES.md` + `docs/correcoes-mockup.md` + `docs/TODO-WORKFLOWS-DEFAULT.md` + inventário de `tela01-82.html`
> Objetivo: garantir que toda entidade modelada nos concepts tem CRUD funcional no mockup (e dar visibilidade pros PLANs futuros)

## Sumário

- **Entidades catalogadas:** 38 (13 transacionais + 12 admin/config + 8 logs/auditoria + 5 governança/seed)
- **CRUD completo (✅):** 7
- **CRUD parcial (🟡):** 21
- **Sem CRUD (❌):** 10
- **Telas faltantes (não-cadastro):** 9
- **Funcionalidades sem mockup:** 7

A maior dívida está em **3 frentes**:
1. **Gestão de usuários** — não existe lista de users, criar user, bloquear user, redefinir senha de outros. Tela50 só edita o próprio profile.
2. **Governança financeira** — Alçadas (tela83) e cadeias de aprovação não têm mockup; bloqueia tela40/41.
3. **Engine & Admin** — Webhooks/SMTP/Tokens/Templates têm lista mas detalhe e configuração avançada são placeholders.

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
| Fornecedor          | USER-SCOPE                      | ❌          | ❌         | 🟡 wizard67| ❌         | ❌          | ❌     |

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
| Permission Delegation  | PERMISSIONS §5                | ❌          | ❌         | ❌         | ❌          | ❌          | ❌     |
| User Scope             | USER-SCOPE                    | 🟡 tela50   | 🟡 tela50  | 🟡         | 🟡 tela50  | 🟡          | 🟡     |
| Auto Rule              | USER-SCOPE §8                 | 🟡 bulk    | 🟡 bulk-modal| ❌      | 🟡          | 🟡          | 🟡     |
| Módulo                 | MODULE-INTERVENIENTES         | ✅ tela81   | ❌         | ✅ tela81  | 🟡 só ativo | ❌          | 🟡     |
| Critério (catálogo)    | MODULE-INTERVENIENTES         | `—` seed    | `—` DMSYS  | 🟡 tela81  | `—`         | `—`         | `—`    |
| Module Interveniente Config | MODULE-INTERVENIENTES    | ✅ tela81   | ✅ tela81  | ✅ tela81  | ✅ tela81  | 🟡          | ✅     |
| Alçada                 | ALCADAS                       | ❌ (→ tela83)| ❌        | ❌         | ❌          | ❌          | ❌     |
| Alcada Aprovação       | ALCADAS                       | 🟡 tela40   | `—` runtime| 🟡 tela41  | `—`         | `—`         | 🟡     |
| Time / Team            | SAVED-FILTERS §2              | ❌          | ❌         | ❌         | ❌          | ❌          | ❌     |
| Stage Health Issue     | STAGE-OWNERSHIP               | ✅ tela82   | `—` engine | ✅ tela82  | ✅ resolver| `—`         | ✅     |

### 1.5 Usuários e Profile

| Entidade            | Concept/Origem                  | Lista       | Criar      | Detalhe    | Editar      | Excluir     | Status |
| ------------------- | ------------------------------- | ----------- | ---------- | ---------- | ----------- | ----------- | ------ |
| User (próprio)      | PERMISSIONS                     | `—`         | tela72 convite | ✅ tela50 | ✅ tela50 | `—`         | ✅     |
| User (de outros)    | PERMISSIONS §6 Gestão de Profile| ❌          | ❌ (Gestão)| ❌         | ❌          | ❌          | ❌     |
| Bloqueio de User    | STAGE-OWNERSHIP §3.4            | ❌          | ❌         | ❌         | ❌          | ❌          | ❌     |
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

| # | Entidade/Tela faltante                | Concept origem            | Justificativa                                                                                              |
| - | ------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1 | **CRUD de Alçadas (tela83)**          | ALCADAS                   | Sem isso, tela40/41 não tem cadeia configurável; toda compra com valor depende de seed manual ou hardcode. |
| 2 | **Lista de Usuários + criar/bloquear**| PERMISSIONS §6, STAGE-OWNERSHIP §3.3-3.4 | Não existe tela admin de gestão de users. Gestão de Profile não tem onde agir; bloqueio user (trigger STAGE-OWNERSHIP) não tem UI. tela72 só convida. |
| 3 | **CRUD de Fornecedor**                | USER-SCOPE                | Vendor é critério core de scope (tela50 lista 80 fornecedores) mas não há tela30-style. Wizard67 é só preview. |
| 4 | **Cadastro de Time (Team)**           | SAVED-FILTERS §2          | Saved filter escopo "equipe" assume `team_id` mas não há onde criar time nem associar users.              |
| 5 | **Edição da Matriz de Permissões**    | PERMISSIONS §4.2          | tela80 mostra matriz mas o save não dispara fluxo de delegação/cadeia (§5 regras 7-10) — só UI conceitual. |

### 🟠 Alto — bloqueia features secundárias ou cria buracos de auditoria

| # | Entidade/Tela faltante                       | Concept origem        | Justificativa                                                                              |
| - | -------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| 6 | **CRUD/detalhe de ActionIA**                 | ACTIONIA §6           | tela77 tem lista + drawer "novo", falta página de detalhe + edição + flag `can_replace_stage_user` exigindo Admin Geral. |
| 7 | **CRUD/detalhe de Alert**                    | ALERT §6              | tela78 mesmo gap — drawer cria mas não tem edição completa, preview de mensagem, log de disparos. |
| 8 | **Lista de Match Rules (separada da tela11)**| MATCH-ENGINE §6       | tela11 é editor de regra única; tela79 é config por workflow. Falta catálogo `match_rules` indexável por status/modo/input_type. |
| 9 | **Tela de detalhe de Procedure**             | (legado)              | tela03 tem lista, sem form de criar/editar/detalhe. Procedures são referenciadas em SOP/Stage/Workflow. |
| 10| **Gestão de Permission Delegation**          | PERMISSIONS §5 regras 7-10 | Modelo `permission_delegations` existe; falta UI de "delegar", "revogar", "ver cadeia". Drawer no tela50? |
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

| # | Tela sugerida                                | Concept pede                                | Prioridade | Justificativa                                                              |
| - | -------------------------------------------- | ------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| T1| **tela83 — Gestor de Alçadas**               | ALCADAS §7                                  | Crítico    | Já apontada em TELAS-PENDENTES; bloqueia tela40/41.                         |
| T2| **tela84 — Lista/Admin de Usuários**         | PERMISSIONS §6, STAGE-OWNERSHIP §3.3-3.4    | Crítico    | Lista + criar + bloquear + atribuir roles + scope inicial.                  |
| T3| **tela85 — Detalhe de ActionIA**             | ACTIONIA §6                                 | Alto       | Edição completa, config por sub-tipo, histórico de execução, vinculações.   |
| T4| **tela86 — Detalhe de Alert + histórico**    | ALERT §6                                    | Alto       | Edição, preview de mensagem renderizada, log de disparos, throttling.       |
| T5| **tela87 — Lista de Match Rules**            | MATCH-ENGINE §6                             | Alto       | Catálogo de regras por status/modo + acesso à tela11/79 de edição.          |
| T6| **tela87 — Times (CRUD)**                    | SAVED-FILTERS §2                            | Crítico    | Sem time, escopo "equipe" do saved filter quebra.                            |
| T7| **tela89 — Painel de AI Generation Logs**    | AI-GENERATION §2                            | Médio      | Auditoria de gerações IA (prompts, tokens, rejeições) — governance + custo. |
| T8| **tela90 — Painel de Match Execution Logs**  | MATCH-ENGINE §2.2                           | Médio      | Visibilidade de matches/órfãos/ambiguidades pra calibrar regras.             |
| T9| **tela91 — Centro de Workflow Defaults**     | WORKFLOW-OBLIGATORY §7.1                    | Médio      | Customização dos 5 workflows `🔒 sistema` (canais/SLA/etapas) sem deletar.   |

---

## 4. Funcionalidades sem mockup (implícitas em concepts)

| # | Funcionalidade                                | Concept origem              | Justificativa                                                                                |
| - | --------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| F1| **Push notification real (não só centro)**    | ALERT §2 (`canais`)         | tela71 é centro inapp; canais `email`/`slack` não têm setup de credenciais por canal.        |
| F2| **Engine de DSL de `trigger_condition`**      | ALERT §2                    | Concept marca DSL como pendência; nenhuma tela mostra editor de condição estruturado.        |
| F3| **Engine de `destinatarios_expr`**            | ALERT §2                    | Mesma situação — drawer tela78 tem textarea livre, sem validação semântica.                  |
| F4| **Resolução manual de ambiguidade match**     | MATCH-ENGINE §3.2 (>1 caso) | Fila de "matches ambíguos" não tem tela.                                                     |
| F5| **Backfill workflow_id em legados**           | WORKFLOW-OBLIGATORY §2      | Wizard de migração + dashboard de progresso — sem UI.                                        |
| F6| **Multi-tenant — isolamento e retenção**     | AI-GENERATION §4, REVIEW #18| Sem concept CONCEPT-MULTITENANT; sem tela admin de tenant.                                   |
| F7| **Promoção workflow inline → template**       | ALCADAS §4, WORKFLOW-OBLIGATORY §3.2 | Modelo decidido (Admin Geral revisa ≥50k); sem UI de revisão/promoção.            |

---

## 5. Recomendações priorizadas

### Sprint atual (entregar antes de ativar produção)

1. **tela83 Alçadas** + integração com tela40/41 — fecha gap crítico de governança financeira.
2. **tela84 Usuários** — sem isso Admin Geral não consegue criar/bloquear users (já é trigger validado em STAGE-OWNERSHIP §3.3-3.4).
3. **tela87 Times** — pequena mas destrava saved filter escopo "equipe" que já está em produção mockup.
4. **CRUD de Fornecedor** (tela30-style) — vendor é base de scope; sem ele tela50 lista IDs sem fonte.
5. **Detalhe/edição completa de ActionIA (tela85) + Alert (tela86)** — sem isso telas77/78 são vitrines, não editores.

### Próximas sprints

6. **tela87 Match Rules (catálogo)** + **tela90 Match Execution Logs** — calibragem de regras vira data-driven.
7. **Permission Delegation (UI)** + **revisão da matriz tela80** para refletir delegação real.
8. **tela91 Centro de Workflow Defaults** — entrega controle sobre os 5 workflows `🔒` (canais/SLA/etapas).
9. **CRUD completo de Webhook/Email Template/API Token (tela61-64)** — engine & admin pra valer.
10. **tela89 AI Generation Logs** — governance + custo IA.

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
