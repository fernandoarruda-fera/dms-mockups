# CONCEPT: Configuração de Intervenientes por Módulo

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: ciclo de validação mockups DMSYS V2 — gap detectado em [[CONCEPT-USER-SCOPE-INTERVENIENTES]]: critérios de scope estavam hardcoded (CC/Vendor/Contrato/Empresa). Para suportar novos requisitos e novos módulos sem release de código, scope precisa ser configurável por módulo.
> Relacionado:
> - [[CONCEPT-USER-SCOPE-INTERVENIENTES]] — consumidor: usuário escolhe valores nos critérios habilitados aqui
> - [[CONCEPT-PERMISSIONS]] — a config é protegida por permissão delegável
> - [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] — alterar config dispara revalidação dos stages
> - [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] — `scope_filter` do stage referencia critérios definidos aqui

## 1. Objetivo

Cada módulo do sistema (Compras hoje, outros amanhã) tem um conjunto próprio de **critérios de scope** — quais entidades definem "área de atuação" do usuário dentro daquele módulo. Hoje esses critérios estão hardcoded como CC/Vendor/Contrato/Empresa. Este concept troca o hardcode por **configuração administrável**: o admin marca, num catálogo extensível, quais critérios fazem parte do scope de cada módulo.

Resultado:
- **Novos requisitos** (ex: adicionar "Tag" ao scope de Compras) = admin habilita no configurador, **sem release**.
- **Novos módulos** (ex: módulo Jurídico, RH) = mesma estrutura, basta configurar quais critérios usar.
- **Front genérico** — tela50 aba Intervenientes renderiza dinamicamente as tabs com base na config do módulo, sem código específico por módulo.

## 2. Modelo de dados

### `modules` (catálogo)

| Campo       | Tipo    | Obrigatório | Descrição                                |
| ----------- | ------- | ----------- | ---------------------------------------- |
| id          | uuid    | sim         |                                          |
| codigo      | string  | sim         | Ex: `compras`, `juridico`, `rh`          |
| nome        | string  | sim         | Nome de exibição                         |
| ativo       | bool    | sim         | Módulo habilitado no tenant              |

### `criterio_catalogo` (todos os critérios disponíveis no produto)

| Campo          | Tipo    | Obrigatório | Descrição                                                       |
| -------------- | ------- | ----------- | --------------------------------------------------------------- |
| id             | uuid    | sim         |                                                                 |
| codigo         | string  | sim         | Ex: `cost_center`, `vendor`, `contract`, `company`, `sop`, `procedure`, `tag`, `workflow` |
| label_default  | string  | sim         | Nome amigável padrão (ex: "Centro de Custo")                    |
| tipo_entidade  | string  | sim         | Tabela/recurso referenciado (`cost_centers`, `vendors`, …)      |
| icone          | string  | não         | Ícone Tabler para a tab                                         |
| descricao      | text    | não         | Descrição do critério para o configurador                       |

Catálogo é **seed do sistema** — DMSYS cura. Cliente não cria critério arbitrário no v1 (evita explosão semântica).

### `module_interveniente_config` (config por módulo)

| Campo            | Tipo    | Obrigatório | Descrição                                                        |
| ---------------- | ------- | ----------- | ---------------------------------------------------------------- |
| id               | uuid    | sim         |                                                                  |
| module_id        | uuid    | sim         | FK `modules`                                                     |
| criterio_id      | uuid    | sim         | FK `criterio_catalogo`                                           |
| label            | string  | não         | Override do `label_default` (ex: "Filial" em vez de "Empresa")   |
| obrigatorio      | bool    | sim         | Se admin/Gestão de Profile deve preencher ao menos 1 valor       |
| ordem            | int     | sim         | Ordem das tabs na tela50 aba Intervenientes                      |
| ativo            | bool    | sim         | Habilitado neste módulo                                          |
| created_by       | uuid    | sim         |                                                                  |
| updated_at       | datetime| sim         |                                                                  |

Constraint: `UNIQUE(module_id, criterio_id)`.

## 3. Fluxo

### 3.1 Configuração (admin) — tela81 (nova)

1. Admin entra em **Configurações → Intervenientes por Módulo** (tela81)
2. Lista de módulos ativos no tenant (Compras, …)
3. Seleciona módulo → painel mostra **catálogo de critérios** (left) e **critérios habilitados** (right)
4. Drag-and-drop ou checkbox para habilitar/desabilitar
5. Para cada habilitado, define: label custom (opcional), obrigatório (sim/não), ordem
6. Preview lateral: "Assim ficará a aba Intervenientes na tela50" (renderiza tabs com a ordem e labels definidas)
7. Salva → dispara revalidação ([[CONCEPT-STAGE-OWNERSHIP-VALIDATION]])

### 3.2 Consumo — tela50 aba Intervenientes

1. Tela50 abre profile do usuário → aba Intervenientes
2. Carrega `module_interveniente_config` do módulo ativo (ou de todos, agrupados)
3. Renderiza tabs **dinamicamente** com base na config (não hardcoded)
4. Cada tab = um critério: usuário escolhe valores (multi-select da entidade)
5. Salva em `user_scope` ([[CONCEPT-USER-SCOPE-INTERVENIENTES]]) com `entity_type` = `criterio.codigo`

### 3.3 Consumo — tela08 Stage Trigger

- Campo "Filtro de scope" do stage agora lista critérios **habilitados no módulo do workflow** (não enum fixo)
- Se admin adiciona critério "Tag" na config, esse critério passa a aparecer no select de scope dos stages do módulo Compras

## 4. Regras de negócio

1. **Critério é catálogo do sistema** — cliente habilita/desabilita por módulo, mas não cria critério novo arbitrário (DMSYS cura o catálogo).
2. **Habilitar critério ≠ retroativo automático.** Habilitar "Tag" não preenche tags dos usuários existentes; ficam vazios até alguém atribuir. Dashboard alerta "N usuários sem critério obrigatório X".
3. **Desabilitar critério obrigatório** dispara [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]]: pode gerar stages órfãos se algum stage usa esse `scope_filter`.
4. **Tornar critério obrigatório** valida usuários atuais — quem está sem valor para o critério é flagado.
5. **Ordem importa** — define a ordem visual das tabs (tela50) e a ordem dos selects (tela08).
6. **Auditoria total.** Toda mudança na config registra autor + diff + timestamp (impacta governança).

## 5. Edge cases

- **Critério desabilitado mas com valores existentes em `user_scope`**: soft-mantém os valores; query do scope ignora critérios desabilitados; toggle "reativar" recupera sem reatribuir.
- **Módulo sem critérios habilitados**: tela50 aba Intervenientes mostra estado vazio com link "Admin precisa configurar" + tela81.
- **Critério com label custom** ("Filial" para `company`): label aparece nas tabs e selects, mas FK e `entity_type` continuam canônicos (`company`) — não quebra integrações.

## 6. Permissão associada (delegável)

- Nova permission no catálogo: `intervenientes_config.gerenciar:<module_codigo>` (granular por módulo)
- **Flag `delegavel = true`** ([[CONCEPT-PERMISSIONS]]): quem tem a permission pode conceder a outros usuários
- Caso de uso: Admin Geral delega config do módulo Compras a "Compras Adm" sem dar acesso a outros módulos

## 7. Gaps front

- **tela81 (a criar)** — Configurador de Intervenientes por Módulo
- **tela50 aba Intervenientes (refactor)** — hoje tabs hardcoded (CC/Vendor/Contrato/Empresa); precisa render dinâmico baseado em `module_interveniente_config`
- **tela08 (refactor)** — campo "Filtro de scope" hoje enum fixo; precisa puxar critérios do módulo
- Backend: tabelas `modules`, `criterio_catalogo` (seed), `module_interveniente_config` + endpoints CRUD + endpoint `GET /modules/:id/criterios-ativos`

## 8. Telas relacionadas

- **tela81** (nova) — admin define critérios por módulo
- **tela50** aba Intervenientes (refactor) — consome config
- **tela08** Stage Trigger (refactor) — consome config no `scope_filter`
- **tela80** Permissions (referência) — exibir permission `intervenientes_config.gerenciar:*` na matriz com badge "delegável"

## 9. Decisões

- ✅ Catálogo de critérios é seed DMSYS (não cliente arbitrário) — controla explosão semântica e mantém consistência cross-tenant
- ✅ Habilitação por módulo (não global) — diferentes módulos têm diferentes "áreas de atuação"
- ✅ Permission delegável — admin de módulo administra seu módulo sem precisar de Admin Geral
- ✅ Label override sem mudar `entity_type` canônico — flexibilidade visual sem quebrar integração
- ❌ Não suportar critério customizado por tenant no v1 — risco de divergência em multi-tenant
- ❌ Não suportar dependências entre critérios ("Tag X só ativa se Vendor selecionado") — over-engineering pro MVP

## 10. Prioridade

**ALTO.** Bloqueia evolução: cada novo critério ou módulo hoje exige release. Habilita os 2 próximos pedidos típicos do produto (Tag no scope, módulo Jurídico) sem código novo.
