# CONCEPT: Validação de Propriedade de Stage (1 stage = 1 dono)

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: ciclo de validação mockups DMSYS V2 — regra absoluta de operação: nenhum stage pode cair pra 0 ou 2+ usuários. Detectar e tratar os 2 cenários problemáticos com fallback automático via workflows default.
> Relacionado:
> - [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] — define `funcao_responsavel_id` + `scope_filter` que esta validação consome
> - [[CONCEPT-USER-SCOPE-INTERVENIENTES]] — alterações de scope são um dos triggers de revalidação
> - [[CONCEPT-PERMISSIONS]] — desativar Role é um dos triggers
> - [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] — alterar config de critérios é trigger
> - [[CONCEPT-WORKFLOW-OBLIGATORY]] — workflows default tratam os fallbacks

## 1. Objetivo

**Regra absoluta:** cada stage, quando acionado, **DEVE cair pra exatamente 1 usuário**. Nem zero (stage órfão), nem 2+ (conflito de propriedade).

Sem validação, alterações triviais (bloquear um user, desativar uma Role, remover um CC) podem deixar workflows em produção sem dono — silenciosamente. Cards travam, SLA estoura, ninguém é alertado. Este concept fecha a brecha em 6 dimensões de trigger, com **detecção proativa** e **fallback automático** via workflows default que geram cards to-do pro gestor da cadeira.

## 2. Modelo de dados

### `stage_health_issue`

| Campo            | Tipo     | Obrigatório | Descrição                                                              |
| ---------------- | -------- | ----------- | ---------------------------------------------------------------------- |
| id               | uuid     | sim         |                                                                        |
| stage_id         | uuid     | sim         | FK `workflow_stages`                                                   |
| workflow_id      | uuid     | sim         | Denormalizado para dashboard                                           |
| type             | enum     | sim         | `orphan` (0 donos) · `conflict` (2+ donos)                             |
| detected_at      | datetime | sim         |                                                                        |
| trigger_event    | enum     | sim         | `stage_create` · `user_scope_change` · `user_create` · `user_block` · `role_inactivate` · `scope_entity_removed` |
| trigger_user_id  | uuid     | não         | Quem fez a ação que disparou (admin que bloqueou user, etc.)           |
| trigger_payload  | jsonb    | sim         | Snapshot do contexto (qual entidade removida, qual user bloqueado, …)  |
| eligible_users   | jsonb    | sim         | Lista de user_ids elegíveis no momento (0 = órfão, 2+ = conflito)      |
| status           | enum     | sim         | `open` · `resolved` · `escalated`                                      |
| resolved_at      | datetime | não         |                                                                        |
| resolved_by      | uuid     | não         |                                                                        |
| resolution_note  | text     | não         | "Atribuído user X" / "Role Y reativada" / etc.                         |

Constraint: índice em `(workflow_id, type, status)` para o dashboard tela82.

## 3. Validação obrigatória em 6 dimensões (eventos de trigger)

A função `validate_stage_ownership(stage_id)` deve ser chamada nos 6 eventos abaixo. Cada chamada conta usuários elegíveis (role × scope) e, se ≠ 1, registra `stage_health_issue` + dispara workflow default.

1. **Ao criar/publicar um stage** (tela08 — save/publish)
   - Antes do `INSERT/UPDATE` em `workflow_stages`, simular distribuição. Se 0 ou 2+, bloquear publish (rascunho permitido) e exibir o problema inline na tela08.

2. **Ao alterar intervenientes de um user** (tela50 aba Intervenientes — save)
   - Diff de `user_scope`. Para cada entidade adicionada/removida, revalidar todos os stages com `scope_filter` no critério afetado.

3. **Ao criar novo user**
   - Após criar `users` + `user_roles` + `user_scope` iniciais, revalidar stages cujas roles o user agora ocupa (pode resolver órfãos OU criar conflitos).

4. **Ao bloquear user** (`status = inativo` ou `deleted_at` set)
   - Revalidar todos os stages onde o user era elegível. Geralmente gera órfãos.

5. **Ao desativar uma Role/Função** (tela80 — `roles.ativo = false`)
   - Revalidar todos os stages com `funcao_responsavel_id` = role desativada. Tipicamente gera órfãos em massa.

6. **Ao remover/excluir CC/Vendor/Contrato/Empresa do scope** (entidade dropada ou removida da config do módulo via [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]])
   - Cascade em `user_scope`. Revalidar stages com `scope_filter` nesse critério.

## 4. Cenários problemáticos

### 4.1 Stage órfão (0 donos)
Nenhum usuário matcha `funcao_responsavel_id + scope_filter` no contexto atual. Cards travarão quando o stage for acionado.

### 4.2 Stage com conflito (2+ donos)
Múltiplos usuários matcham. Cards seriam duplicados/distribuídos ambiguamente — quebra a regra de propriedade única.

> Nota sobre [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] regra 7 ("primeiro a pegar resolve"): aquela regra trata distribuição de carga **dentro de um pool de N elegíveis**. Este concept trata da **definição** de quem é elegível: a regra absoluta é 1 dono lógico (1 user no pool). Conflito = mais de 1 user no pool elegível antes de qualquer "pegar".

## 5. Fallback automático — workflows default

Quando problema detectado, sistema **não falha silenciosamente**: dispara um workflow default que **gera card to-do pro gestor da cadeira** (gestor = definido pela hierarquia da Role; fallback Admin Geral).

### 5.1 Workflows default associados (na biblioteca tela04, protegidos `🔒 sistema`)

| Workflow                              | Disparado por                                       | Ação principal                                              |
| ------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| **WF-DEFAULT-Stage-Orfao**            | Detecção genérica de 0 donos                        | Card to-do "Atribuir responsável ao stage X (workflow Y)"   |
| **WF-DEFAULT-Conflito-2-Donos**       | Detecção de 2+ donos                                | Card to-do "Resolver conflito de propriedade no stage X"    |
| **WF-DEFAULT-User-Bloqueado-Impacto** | Bloqueio de user gera ≥1 órfão                      | Card to-do "User X bloqueado — N stages órfãos a redistribuir" |
| **WF-DEFAULT-Role-Inativada-Impacto** | Desativação de Role gera ≥1 órfão                   | Card to-do "Role X inativada — N stages a re-funcionar"     |
| **WF-DEFAULT-Scope-Removido-Impacto** | Remoção de entidade de scope gera ≥1 órfão          | Card to-do "Entidade X removida — N stages impactados"      |

Cada workflow default é **customizável mas não deletável** (`is_system = true`, `is_deletable = false`). Cliente pode trocar canais de notificação, ajustar SLA, adicionar etapas — mas não remover o workflow do sistema. Ver [[CONCEPT-WORKFLOW-OBLIGATORY]] para o registro completo de defaults.

### 5.2 Quem é o "gestor da cadeira"

Resolução em ordem:
1. Hierarquia da Role (`roles.parent_role_id` → quem reporta a essa role)
2. Owner da Role (quem criou) se a hierarquia não resolve
3. Admin Geral como fallback final

## 6. Dashboard "Saúde dos Stages" — tela82 (nova)

Painel único onde gestores enxergam o estado de integridade dos stages do tenant.

### 6.1 KPIs (topo)
- N stages órfãos
- N stages em conflito
- N issues resolvidos nos últimos 7 dias
- Top 3 workflows mais impactados

### 6.2 Lista principal
Tabela de `stage_health_issue` com status `open`:

| Stage | Workflow | Tipo | Trigger | Quem fez | Quando | Sugestão |
|-------|----------|------|---------|----------|--------|----------|
| Aprovação CC | WF Compras SP | 🔴 Órfão | Bloqueio user | admin@x.com | 12h atrás | Reativar user Y · Atribuir CC ao user Z · Editar stage |

### 6.3 Drill-down
Clica numa linha → drawer com:
- **Contexto da quebra:** qual ação disparou, quem fez, quando, payload completo
- **Workflows afetados:** lista (mesmo issue pode impactar vários se a Role for usada em N workflows)
- **Sugestão de correção** automatizada (gerada pela engine)
- Botões: "Aplicar sugestão" · "Atribuir manualmente" · "Marcar resolvido"

### 6.4 Filtros
Tipo (órfão/conflito) · Trigger · Workflow · Severidade · Status

## 7. Regras de negócio

1. **Validação síncrona no save** (eventos 1-5). Bloqueia ação que CRIA órfão se admin tentar ativar um stage problemático.
2. **Validação assíncrona em cascata** (evento 6 e impacto de 4/5): cascade pode atingir centenas de stages — job em background com progresso.
3. **Issue duplicado:** se já existe `open` para `(stage_id, type)`, atualiza `trigger_*` e `eligible_users` em vez de criar novo.
4. **Auto-resolve:** ao re-rodar validação e descobrir que o problema sumiu (1 dono agora), marca `resolved` com `resolution_note = "auto: voltou a 1 elegível"`.
5. **Escalation:** issue `open` há > SLA (configurável, default 48h) muda para `escalated` e dispara alerta ([[CONCEPT-ALERT]]) ao Admin Geral.
6. **Auditoria total.** Toda transição de status é logada.

## 8. Edge cases

- **Workflow inativo com stage órfão:** baixa prioridade. Cria issue mas sem card to-do (workflow não dispara, nada trava).
- **Stage com ActionIA elegível** (`can_be_automated = true`): ActionIA conta como dono. Se ActionIA + 1 humano elegível = conflito; ActionIA sozinha = ok (1 dono).
- **Bloqueio em massa** (deactivate N users): consolida issues no mesmo workflow default em 1 card to-do em vez de N — evita inundar gestor.
- **Re-ativação de user/role:** auto-revalida e marca issues `resolved` quando aplicável.

## 9. Gaps front

- **tela82 (a criar)** — Dashboard Saúde dos Stages
- **tela08 publish (validação inline)** — bloquear publish se stage entra órfão/conflito + exibir contexto
- **tela50 save (revalidação)** — ao salvar intervenientes, mostrar diálogo "Esta mudança gera N issues" se aplicável
- **Criação de user (revalidação)** — silenciosa em sucesso; warning se cria conflito
- **Bloqueio de user (revalidação)** — modal "Bloquear este user gera N stages órfãos — confirma?"
- **tela80 desativar Role** — modal "Desativar esta Role gera N stages órfãos — confirma?"
- **tela04 (biblioteca workflows)** — exibir badge `🔒 sistema` + tooltip nos 5 workflows default
- Backend: tabela `stage_health_issue`, função `validate_stage_ownership`, hooks nos 6 eventos, job em background para cascade, endpoint dashboard

## 10. Telas relacionadas

- **tela82** (nova) — dashboard
- **tela08** — validação no publish
- **tela50** aba Intervenientes — validação no save
- **tela80** — validação ao desativar Role
- **tela04** — biblioteca exibe workflows default com badge
- Criação/bloqueio de user (telas a definir) — validação no save

## 11. Decisões

- ✅ Validação obrigatória em 6 dimensões — cobre todos os triggers conhecidos hoje
- ✅ Bloqueio síncrono nos eventos diretos (publish/save) — não deixa criar problema novo
- ✅ Cascade assíncrono em background — eventos com impacto amplo (Role inativada) não podem travar UI
- ✅ Workflows default são customizáveis mas não deletáveis — garante que fallback sempre existe
- ✅ Dashboard único (tela82) — gestor não procura issues espalhados em N telas
- ❌ Não permitir "ignorar" um issue permanentemente sem resolver — força resolução real
- ❌ Não permitir múltiplos donos por design ("co-aprovação") no v1 — quebraria a regra absoluta; tratar via stages paralelos no futuro

## 12. Prioridade

**CRÍTICO.** Sem isso, alterações de admin (bloquear user, mudar scope, desativar role) podem deixar workflows inteiros em produção sem dono — silenciosamente. Bug de governança que só aparece quando algum card trava em produção e ninguém vê. Implementar antes de habilitar gestão de scope/roles para clientes em produção.
