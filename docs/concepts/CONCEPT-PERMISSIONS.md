# CONCEPT: Matriz de Permissões (Role × Tela × Ação)

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: ciclo de validação mockups DMSYS V2 — gap entre Sprint 2.2 (backend Permissions Engine já em prod) e mockup (sem tela)
> Relacionado:
> - [[CONCEPT-USER-SCOPE-INTERVENIENTES]] — scope sobre entidades (complementa permissão)
> - [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] — função do stage consome este motor
> - [[CONCEPT-ACTIONIA]] — ActionIA pode herdar permissões de uma role virtual

## 1. Objetivo

Definir **o que cada função (role) pode fazer no sistema**: quais telas vê, quais ações pode disparar (Ver, Editar, Incluir, Excluir, Aprovar). A matriz é a fonte única de verdade para autorização — backend já tem o motor (Sprint 2.2, 64 permissões catalogadas), falta o mockup da UI de gestão.

Decisão chave: permissão fala sobre **capacidade** ("este cargo pode aprovar?"), não sobre **escopo de entidades** ("em quais CCs ele pode aprovar?"). Escopo é o [[CONCEPT-USER-SCOPE-INTERVENIENTES]].

## 2. Modelo de dados

Já existe no backend (Sprint 2.2). Resumo:

### `roles`

| Campo       | Tipo    | Descrição                                       |
| ----------- | ------- | ----------------------------------------------- |
| id          | uuid    | Identificador                                   |
| nome        | string  | Ex: "Compras Adm", "Aprovador Diretor"          |
| descricao   | string  | Texto livre                                     |
| is_system   | bool    | Roles de sistema não podem ser deletadas        |
| created_at  | datetime|                                                 |

### `permissions` (catálogo, seed)

| Campo       | Tipo    | Descrição                                       |
| ----------- | ------- | ----------------------------------------------- |
| id          | uuid    |                                                 |
| codigo      | string  | Ex: `nfs.aprovar`, `cotacoes.editar`            |
| modulo      | string  | Compras, Cockpit, Profile, etc.                 |
| tela        | string  | Identificador da tela (`tela01`, `tela50`, …)   |
| acao        | enum    | `ver` · `incluir` · `editar` · `excluir` · `aprovar` |

### `role_permissions` (N×M)

| Campo          | Tipo  |
| -------------- | ----- |
| role_id        | uuid  |
| permission_id  | uuid  |

### `user_roles` (N×M — usuário multi-role)

| Campo     | Tipo  |
| --------- | ----- |
| user_id   | uuid  |
| role_id   | uuid  |

**Permissão efetiva do usuário** = união de `role_permissions` de todas as `user_roles` dele.

## 3. Roles de referência (seed)

| Role                  | Descrição                                                    |
| --------------------- | ------------------------------------------------------------ |
| Admin Geral           | Acesso total a tudo (incluindo gestão de roles e usuários)   |
| Compras Adm           | Configura workflows, fornecedores, contratos                 |
| Compras Operacional   | Executa requisições, cotações, pedidos                       |
| Contas a Pagar        | Recebe NFs, executa pagamentos, fecha conciliação            |
| Aprovador Diretor     | Só aprova (cadeia de alçadas — ver [[CONCEPT-ALCADAS]])      |
| Gestão de Profile     | Master que edita profile de outros + recebe cards órfãos     |
| Viewer                | Read-only em todos os módulos                                |

## 4. UI (tela80 — a criar)

### 4.1 Lista de roles

- Tabela: Nome · Descrição · Nº usuários · Nº permissões · Editar
- Botão **"+ Nova role"**

### 4.2 Edição de role (matriz)

Layout de **planilha**: linhas = telas/módulos agrupados, colunas = ações, células = checkbox.

```
                          Ver  Incluir  Editar  Excluir  Aprovar
─────────────────────────────────────────────────────────────────
[Compras]
  tela01 NFs              [✓]   [✓]      [✓]     [ ]      [ ]
  tela02 Cotações         [✓]   [✓]      [✓]     [ ]      [ ]
  tela07 Pedidos          [✓]   [ ]      [ ]     [ ]      [ ]
[Cockpit]
  tela11 Cockpit          [✓]   [—]      [—]     [—]      [—]
[Profile]
  tela50 Profile próprio  [✓]   [—]      [✓]     [—]      [—]
  tela50 Profile outros   [ ]   [—]      [ ]     [—]      [—]
```

- Header "selecionar coluna inteira" para bulk
- Linha "selecionar tela inteira" para bulk
- Botão **"Salvar"** persiste delta apenas

### 4.3 Atribuição de roles ao usuário (na tela50, aba a criar)

- Multi-select de roles disponíveis
- Preview lateral: "Esta combinação dá acesso a X telas e Y ações"

### 4.4 "Minhas permissões" (read-only para usuário não-admin)

- Cada usuário pode consultar suas próprias permissões agregadas
- Modal/drawer simples acessível pelo header do profile

## 5. Regras de negócio

1. **Permissão = capacidade, não escopo.** "Pode aprovar NF" não diz "em quais CCs" — isso é [[CONCEPT-USER-SCOPE-INTERVENIENTES]].
2. **Multi-role union.** Usuário com 2 roles recebe união das permissões; nunca interseção.
3. **Admin Geral é irremovível.** Sistema impede deletar a última role com `roles.gerenciar`.
4. **Roles `is_system = true`** podem ter permissões editadas mas não podem ser deletadas (Admin Geral, Viewer).
5. **Ações inaplicáveis** (`—` na matriz, ex: "incluir" em Cockpit que é só visualização) ficam disabled.
6. **Permissão de gestão de outros profiles** (`profile.editar_outros`) é separada — quem tem isso vira candidato a "Gestão de Profile" para órfãos.

## 6. Gaps front

- **Frontend já tem** `RolesList.jsx`, `RoleEdit.jsx`, `UserRolesAssign.jsx`, `MyPermissions.jsx` (Sprint 2.2)
- **Falta mockup** que valide UX da matriz — especialmente densidade visual com 64+ permissões
- **Falta integração** com aba "Roles" no profile (tela50)

## 7. Telas relacionadas

- **tela80** (nova) — gestão da matriz de roles
- **tela50** — aba "Roles" no profile (atribuição de roles ao usuário)
- **tela50** — modal "Minhas permissões"
- **tela08** — Stage Trigger consome roles para selecionar "função responsável" ([[CONCEPT-STAGE-ROLE-ASSIGNMENT]])

## 8. Decisões

- ✅ Matriz como planilha (não wizard, não árvore): densidade > guidance porque público é admin técnico
- ✅ Multi-role com union (não hierarquia): simples, previsível, alinha com Sprint 2.2
- ✅ Escopo (CCs/vendors) é concept separado — não misturar com permissões
- ✅ Roles de sistema não podem ser deletadas (proteção contra lockout)
- ❌ Não suportar "deny override" (negar explicitamente acima da role) — complexidade não justifica

## 9. Prioridade

**CRÍTICO.** Backend já está em produção (Sprint 2.2). Sem mockup, admin precisa configurar via API ou seed — bloqueia onboarding de novos clientes.
