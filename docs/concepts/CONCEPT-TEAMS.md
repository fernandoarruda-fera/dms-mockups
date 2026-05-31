---
name: teams
description: Estrutura de times/departamentos pra agrupar usuários. Usado em saved filters escopo "equipe", reports agregados, hierarquia organizacional.
type: concept
---

# CONCEPT: Teams (Times/Departamentos)

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: gap de auditoria E3 (saved filters escopo "Equipe" não tinham entidade de equipe declarada)

## 0. Alinhamento com docs do projeto principal

- `CONCEPT-SAVED-FILTERS.md` cita escopo "Equipe" mas não define o que é uma equipe — este concept fecha o gap.
- `~/dms/M-dulo-de-compras-dms-/docs/data-model.md` tem `users` e `roles` mas não `teams` — esta entidade é nova.
- Não confundir com `dms_companies` (CONCEPT-EMPRESA = filial jurídica) nem com `roles` (CONCEPT-PERMISSIONS = o que pode fazer).

## 1. Objetivo

Agrupar usuários em times pra:
- Saved filters compartilháveis com escopo "Equipe" (vide [[saved-filters]])
- Reports e dashboards agregados por time
- Hierarquia organizacional (espelhar org real — diretorias, departamentos, células)
- Distribuição de cards: stages podem ser direcionados pra um time inteiro (não só role específica)

## 2. Modelo de dados

### Tabela `teams`

| Campo            | Tipo                  | Descrição                                  |
| ---------------- | --------------------- | ------------------------------------------ |
| id               | UUID PK               |                                            |
| nome             | text                  | ex: "Compras Logística SP"                 |
| codigo           | text unique           | ex: "CMP-LOG-SP"                           |
| parent_team_id   | UUID FK teams.id NULL | hierarquia (recursiva)                     |
| gestor_user_id   | UUID FK users.id NULL | gestor responsável                         |
| empresa_id       | UUID FK dms_companies.id | tenant-scope                            |
| ativo            | boolean               | soft-delete                                |
| created_at       | timestamp             |                                            |

### Tabela `team_members`

| Campo         | Tipo                                | Descrição                       |
| ------------- | ----------------------------------- | ------------------------------- |
| user_id       | UUID FK users.id                    |                                 |
| team_id       | UUID FK teams.id                    |                                 |
| role_in_team  | enum (membro/gestor/observador)     | papel dentro do time            |
| joined_at     | timestamp                           |                                 |
| **PK**        | (user_id, team_id)                  |                                 |

## 3. Fluxo do usuário

1. Admin / Gestão de Profile acessa **Admin → Times** (tela88)
2. Cadastra time: nome, código, empresa, parent (opcional), gestor, members
3. User pode pertencer a múltiplos times (ex: gestor pertence ao seu time + ao time-pai como membro)
4. Saved filters escopo "Equipe" filtram por user pertencente ao mesmo `team_id` do owner

## 4. Regras de negócio

- Time inativo: membros mantêm referência mas filters escopo "Equipe" não retornam o filtro.
- Time com gestor inativo/bloqueado: dispara alert pra Admin (analogamente a stages órfãos).
- Deletar time: bloqueia se houver saved filters dependentes; oferece transferir ownership pra outro time.
- Hierarquia: depth máxima **5 níveis** (constraint dura — evita ciclos e árvores patológicas).
- Code unique por empresa (não global).
- Times **não cruzam empresa** (1 time = 1 empresa). Multi-empresa resolve no nível do tenant (CONCEPT-MULTITENANT).

## 5. Gaps no front atual

- **tela88** (Times) — não existe → criar nesta sprint
- **tela50** profile — aba "Times" não existe → adicionar nesta sprint
- **tela80** permissions — permissão "Gerenciar Times" não está mapeada → adicionar à matriz numa próxima rodada

## 6. Telas relacionadas

- **tela88** — cadastro/listagem/edição de times (novo)
- **tela50** — aba "Times" mostrando teams do user logado (somente leitura)
- **tela80** — permission "Gerenciar Times" (delegável via tela85)
- **tela16** cockpit — futuramente, filtro "minha equipe"

## 7. Decisões tomadas / Pendências

**Decisões:**
- Hierarquia recursiva via `parent_team_id` (max 5 níveis).
- Time = 1 empresa (não multi-empresa).
- 3 papéis dentro do time: membro / gestor / observador.

**Pendências:**
- ❓ Times multi-empresa? **Proposta: NÃO** — time pertence a 1 empresa, [[multitenant]] resolve.
- ❓ Importar times de RH externo (Senior, Totvs)? — fora do v1, deixar como placeholder.
- ❓ Permissão "Gerenciar Times" — herda de Admin Geral ou role separada? Decidir antes de tela80 update.

## 8. Prioridade

**Alto** — destrava saved filters escopo "Equipe" (hoje sem entidade) + reports agregados. Sem isso, escopo "Equipe" em [[saved-filters]] fica ambíguo (cai pra role-based como fallback).
