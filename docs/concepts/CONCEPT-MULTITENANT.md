---
name: multitenant
description: Arquitetura multi-tenant. Cada empresa cliente tem seu próprio espaço isolado de dados, mesmo backend compartilhado.
type: concept
---

# CONCEPT: Multi-Tenant

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: gap arquitetural — não havia doc explicitando estratégia de isolamento.

## 0. Alinhamento com docs do projeto principal

- `~/dms/M-dulo-de-compras-dms-/docs/VISAO_GERAL_DO_PROJETO.md` assume SaaS multi-tenant mas não documenta a estratégia.
- `~/dms/M-dulo-de-compras-dms-/docs/data-model.md` não tem coluna `tenant_id` declarada — gap a fechar antes de qualquer onboarding além de DMS Matriz.
- Confundir não: **tenant ≠ empresa**. Tenant = cliente SaaS (uma "instalação lógica"). Empresa = filial jurídica dentro do tenant ([[empresa]]).

## 1. Objetivo

DMSYS é SaaS multi-tenant. Cada empresa cliente vê apenas seus dados, mesmo rodando no mesmo backend, mesma versão de schema, mesmas instâncias de aplicação.

## 2. Modelo

**Estratégia: row-level isolation com `tenant_id`**

- Toda tabela transacional carrega `tenant_id` (UUID, NOT NULL).
- Queries automaticamente filtradas por `tenant_id` (middleware/policy de DB — RLS no Postgres ou guarded query layer no app).
- Index composto em `(tenant_id, id)` e `(tenant_id, <campo-mais-filtrado>)` pra performance.

### Tabela `tenants`

| Campo            | Tipo                       | Descrição                                  |
| ---------------- | -------------------------- | ------------------------------------------ |
| id               | UUID PK                    |                                            |
| nome             | text                       | ex: "DMS Logística Grupo"                  |
| subdomain        | text unique                | ex: "dmslog" → `dmslog.dmsys.com`          |
| plano            | enum (free/pro/enterprise) | tier comercial                             |
| ativo            | boolean                    | tenant suspenso vê página de billing       |
| limite_users     | int                        | quota dura                                 |
| limite_workflows | int                        | quota dura                                 |
| created_at       | timestamp                  |                                            |

### Tabela `tenant_users`

| Campo     | Tipo               | Descrição                                      |
| --------- | ------------------ | ---------------------------------------------- |
| user_id   | UUID FK users.id   |                                                |
| tenant_id | UUID FK tenants.id |                                                |
| role_saas | enum (owner/member)| owner = pode trocar plano/billing             |
| **PK**    | (user_id, tenant_id) | user pertence a 1+ tenants (ex: consultor) |

### Acesso

- URL: `{subdomain}.dmsys.com` (preferencial) ou path-based `dmsys.com/{subdomain}` (fallback dev)
- Login redireciona pra tenant correto (cookie + JWT carregam `tenant_id` ativo)
- Se user multi-tenant, **tela de seleção de tenant** entre login e cockpit

## 3. Regras de negócio

- Isolamento estrito: queries cross-tenant **bloqueadas** (exceto admin global SaaS, fora do escopo MVP).
- Backup/restore **por tenant** (dump filtrado por `tenant_id`).
- Billing por tenant (não por user, não por empresa-dentro-do-tenant).
- Multi-empresa DENTRO de tenant continua existindo: [[empresa]] é filial jurídica de um tenant.
- Tenant inativo (suspenso): dados preservados (cold storage) por **90 dias**, depois purga (LGPD).
- Quotas (`limite_users`, `limite_workflows`) checadas em create — bloqueia ação e mostra upgrade prompt.

## 4. Gaps no front atual

- Tela de **seleção de tenant** no login (se user multi-tenant) — não existe (assume tenant único).
- **Admin SaaS panel** (gestão de tenants, billing, métricas globais) — outro produto, fora do escopo MVP dos mockups V2.
- Header sticky deveria mostrar `tenant.nome` como contexto visível — hoje só mostra empresa.

## 5. Decisões tomadas / Pendências

**Decisões:**
- ✅ Strategy: row-level isolation (não schema-per-tenant) — mais simples, escala bem até ~1000 tenants.
- ✅ Subdomain único por tenant (preferencial).
- ✅ User pode ser multi-tenant (suporta consultores, parceiros).

**Pendências:**
- ❓ Database-per-tenant pra enterprise tier: deixar pra **Fase 2** quando houver cliente exigindo.
- ❓ Isolamento de IA (vector stores, RAG): cada tenant tem seu próprio namespace? **Proposta: sim**, alinhar com [[ai-generation]].
- ❓ Logs operacionais (auditoria) compartilham ou separam? **Proposta: tabela única com `tenant_id`** (igual ao resto).

## 6. Prioridade

**Crítico** — define arquitetura inteira. Implementação Fase 1 (antes de qualquer cliente além de DMS). Se entrar segundo cliente sem isso, retrabalho é gigante.
