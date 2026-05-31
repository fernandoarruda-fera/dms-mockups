# CONCEPT-ALCADAS — Cadeia de Aprovação por Valor + Tipo

> Status: 📋 Concept inicial
> Origem: [[REVIEW-2026-05-31]] Achado #1 + Achado #19
> Relacionados: [[CONCEPT-PERMISSIONS]] (role "Aprovador Diretor"), [[CONCEPT-WORKFLOW-OBLIGATORY]] (workflow on-the-fly), [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] (stages de aprovação)

## 0. Alinhamento com docs do projeto principal

`CONCEPT-PERMISSIONS` §3 cita role "Aprovador Diretor — cadeia de alçadas — ver [[CONCEPT-ALCADAS]]" mas o doc não existia. Este concept formaliza o modelo.

## 1. Objetivo

Modelar a **cadeia de aprovação por valor monetário + tipo de documento**, evitando que cada workflow nomeie aprovadores específicos por valor (frágil). Inclui também a política de **aprovação para workflows criados on-the-fly** (inline, durante operação).

Sem alçadas formais:
- Cada workflow precisaria condicionais hardcoded ("se valor > 50k, então fulano")
- Mudança de diretor exige editar N workflows
- Workflow on-the-fly não tem regra clara de quem aprova

## 2. Modelo de dados

### `alcadas`

| Campo                | Tipo                       | Obrigatório | Descrição                                                                  |
| -------------------- | -------------------------- | ----------- | -------------------------------------------------------------------------- |
| id                   | uuid PK                    | sim         | Identificador                                                              |
| nome                 | string                     | sim         | Ex: "Aprovação NF até 5k", "Aprovação contrato Diretor"                    |
| tipo_documento       | enum                       | sim         | `nf` \| `requisicao` \| `contrato` \| `workflow_inline` \| `*` (qualquer)  |
| valor_min            | decimal                    | sim         | Faixa inicial (inclusivo). 0 = sem mínimo.                                 |
| valor_max            | decimal NULL               | não         | Faixa final (inclusivo). NULL = sem teto.                                  |
| role_aprovador_id    | uuid FK roles.id           | sim         | Role que aprova nesta faixa                                                |
| ordem                | int                        | sim         | Ordem na cadeia (1 = primeiro a aprovar)                                   |
| is_system            | bool                       | sim         | Alçadas de sistema (default) não podem ser deletadas                       |
| ativa                | bool                       | sim         | Permite suspender sem deletar                                              |
| created_at           | datetime                   | sim         |                                                                            |

**Constraint:** dado um `tipo_documento` e um valor, deve existir **exatamente uma** alçada com `valor_min <= valor <= valor_max` (ou `valor_max IS NULL`). Faixas não podem se sobrepor.

### `alcada_aprovacoes` (instâncias)

| Campo               | Tipo                       | Descrição                                                  |
| ------------------- | -------------------------- | ---------------------------------------------------------- |
| id                  | uuid PK                    |                                                            |
| alcada_id           | uuid FK alcadas.id         | Qual regra disparou                                        |
| documento_tipo      | enum                       | `nf` \| `requisicao` \| `contrato` \| `workflow_inline`    |
| documento_id        | uuid                       | ID do documento sendo aprovado                             |
| valor               | decimal                    | Valor que disparou a alçada (snapshot)                     |
| aprovador_user_id   | uuid FK users.id NULL      | Usuário concreto que aprovou (NULL enquanto pendente)      |
| status              | enum                       | `pendente` \| `aprovado` \| `rejeitado` \| `escalado`      |
| decidido_em         | timestamp NULL             |                                                            |
| comentario          | text                       | Obrigatório se `rejeitado`                                 |

## 3. Cadeia de aprovação

### 3.1 Resolução da cadeia (compose)

Dado um documento com `tipo` e `valor`:

1. Sistema busca todas as alçadas `ativas` com `tipo_documento` igual ao tipo do doc (ou `*`)
2. Filtra por faixa: `valor_min <= valor <= COALESCE(valor_max, ∞)`
3. Ordena por `ordem ASC` → produz a cadeia (1, 2, 3...)
4. Cada `role_aprovador_id` precisa aprovar em sequência (não paralelo no v1)

### 3.2 Execução

1. Doc atinge stage de aprovação no workflow
2. Sistema resolve cadeia (§3.1)
3. Para cada elo:
   - Notifica usuários da `role_aprovador_id` (via [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] §3.2 — busca user com role + scope que cobre o doc)
   - Aguarda decisão → grava em `alcada_aprovacoes`
   - **Aprovado:** vai pro próximo elo da cadeia
   - **Rejeitado:** workflow termina com rejeição (não escala)
   - **Timeout (SLA do stage):** escala via `escalation_role_id` do stage
4. Cadeia completa = doc aprovado, workflow avança

### 3.3 Pulo de elos

- Se o aprovador de um elo `N` também tem a role do elo `N+1`, o sistema **não pula** automaticamente — exige aprovação explícita do mesmo user em cada elo (auditoria + intencionalidade). Decisão consciente.

## 4. Política de aprovação para workflow inline

Workflow criado on-the-fly ([[CONCEPT-WORKFLOW-OBLIGATORY]] §3.2, `created_inline = true`) precisa de aprovação. Regra:

| Condição                                              | Aprovação                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Workflow inline **sem valor associado** (puro fluxo)  | Auto-aprovado pelo owner (criador) — fica em audit log                          |
| Workflow inline **com valor < R$ 5.000**              | Auto-aprovado pelo owner                                                        |
| Workflow inline **com valor R$ 5.000 ≤ X < R$ 50.000**| Cadeia de alçada padrão (`tipo_documento = workflow_inline`)                    |
| Workflow inline **com valor ≥ R$ 50.000**             | Cadeia + revisão obrigatória por Admin Geral antes de virar template reutilizável |

**Limite de auto-aprovação inline:** R$ 5.000 fixo no v1, ajustável via config global no v2.

**Auditoria:** todo workflow inline aprovado registra (owner, valor, alçada disparada, aprovadores). Vira candidato a virar template; Admin Geral revisa e pode "promover" pra workflow default ([[TODO-WORKFLOWS-DEFAULT]]).

## 5. Regras de negócio

- Alçadas com `is_system = true` (default seed) não podem ser deletadas — apenas suspensas (`ativa = false`).
- Tentativa de criar 2 alçadas com mesmo `tipo_documento` e faixas sobrepostas é bloqueada (constraint).
- Alteração de `role_aprovador_id` em alçada ativa: registra em audit log + notifica todos os aprovadores envolvidos em cadeias pendentes.
- Documento com valor que não cai em nenhuma alçada (gap de faixa): bloqueia com erro "faixa de alçada não configurada para X" — Admin Geral precisa corrigir.
- Rejeição de qualquer elo **encerra a cadeia** (não há "recurso" no v1).

## 6. Seed de alçadas default (sugestão inicial)

| Tipo            | Faixa            | Role                                                         |
| --------------- | ---------------- | ------------------------------------------------------------ |
| nf              | 0 — 5.000        | Coordenador Operação                                         |
| nf              | 5.001 — 50.000   | Gestor Área                                                  |
| nf              | 50.001 — 500.000 | Aprovador Diretor                                            |
| nf              | > 500.000        | Aprovador Diretor + CFO (cadeia 2 elos)                      |
| requisicao      | 0 — 10.000       | Gestor Área                                                  |
| requisicao      | > 10.000         | Aprovador Diretor                                            |
| contrato        | * (qualquer)     | Aprovador Diretor                                            |
| workflow_inline | 0 — 4.999        | (auto-aprovado owner — sem alçada)                           |
| workflow_inline | 5.000 — 49.999   | Gestor Área                                                  |
| workflow_inline | ≥ 50.000         | Aprovador Diretor + Admin Geral (promoção a template)        |

## 7. Gaps front

- **Tela nova (a criar):** gestor de alçadas (CRUD `alcadas` + visualização de cadeias). Provavelmente acoplada a Engine & Admin.
- **Tela50:** se user é "Aprovador Diretor", mostrar caixa de pendências por alçada.
- **Tela04 (workflows):** badge "exige cadeia de alçada" quando o workflow tem stage de aprovação.
- **Esforço estimado:** **Alto** (~1.5 sprint — entidade + cadeia + integração com workflow + UI de gestão).

## 8. Telas relacionadas

- **tela83** (nova, a criar) — Gestor de Alçadas
- **tela50** — caixa de pendências de aprovação por alçada
- **tela04** — badge em workflows com aprovação
- **tela10** — workflow editor mostra "cadeia de alçada será aplicada" quando há stage de aprovação

## 9. Decisões / Pendências

**Decisões:**
- Cadeia sequencial no v1 (não paralelo).
- Rejeição encerra (sem recurso) no v1.
- Limite de auto-aprovação inline fixo em R$ 5.000 no v1 — configurável no v2.
- Sem promotion automática de inline → template: sempre exige revisão humana ≥ 50k.

**Pendências:**
- Multi-moeda? (R$ fixo no v1)
- Delegação temporária de aprovador ("estou de férias, X aprova por mim") — usa [[CONCEPT-PERMISSIONS]] §5 delegação ou tabela própria?
- Recurso/segunda instância — fora do v1.
- Política de SLA por elo da cadeia — herda do stage ou tem campo próprio em `alcadas`?

## 10. Prioridade

**Alto** — bloqueia operação de NF/requisição/contrato com valor. Workflow inline já chegou em mockup ([[CONCEPT-WORKFLOW-OBLIGATORY]] §3.2) mas sem alçada formal vira buraco de governança.
