# CONCEPT: User Profile Preferences (Personalização por Usuário)

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Permitir que **cada usuário individual** customize a forma como vê listas e dashboards: colunas visíveis, ordem das colunas, badges/KPIs exibidos, e métricas que aparecem em cada card de dashboard.

Decisão de design tomada: escopo de personalização é **por usuário** (não por role). Cada um adapta sua visão sem afetar colegas. Defaults são definidos por admin ou pelo sistema, e qualquer um pode resetar a qualquer momento.

## 2. Modelo de dados

### `user_preferences`

| Campo            | Tipo       | Obrigatório | Descrição                                                          |
| ---------------- | ---------- | ----------- | ------------------------------------------------------------------ |
| id               | uuid       | sim         | Identificador único                                                |
| user_id          | uuid       | sim         | Usuário dono da preferência                                        |
| page_key         | string     | sim         | Tela/contexto (ex: `nfs.list`, `dashboards.tela12.card_atrasadas`) |
| preferences      | json       | sim         | Estado serializado (colunas, ordem, badges, métricas, etc.)        |
| version          | int        | sim         | Versão do schema de `preferences` (para migrations)                |
| created_at       | datetime   | sim         | Data de criação                                                    |
| updated_at       | datetime   | sim         | Última atualização                                                 |

Constraint: `UNIQUE(user_id, page_key)` — uma preferência por usuário por contexto.

### Estrutura típica do JSON `preferences`

```json
{
  "columns_visible": ["numero", "fornecedor", "valor", "status"],
  "columns_order": ["numero", "fornecedor", "status", "valor"],
  "badges_visible": ["sla_estouro", "workflow_orfao"],
  "metrics_visible": ["total_mes", "media_atraso"]
}
```

## 3. Fluxo do usuário

### 3.1 Personalização de lista

1. Usuário acessa uma lista (ex: tela01)
2. Clica no botão **⚙️ "Personalizar"** no topo direito
3. Drawer abre mostrando:
   - Lista de **colunas** (toggle visibilidade + drag para reordenar)
   - Lista de **badges/KPIs** disponíveis (multi-select)
4. Mudanças aplicam em tempo real (preview imediato)
5. Salva ao fechar o drawer (auto-save)
6. Botão **"🔄 Restaurar padrão"** sempre visível no drawer

### 3.2 Personalização de dashboard (tela12)

1. Usuário acessa dashboard
2. Cada card tem botão **⚙️** no canto
3. Abre painel mostrando métricas disponíveis para aquele tipo de card
4. Usuário marca/desmarca métricas → card atualiza em tempo real
5. Cada card persiste sua preferência separada (`page_key` único por card)

### 3.3 Sincronização cross-device

- No **mockup**: persistência em `localStorage` (rápido e sem backend).
- No **React**: persistência em banco via endpoint, com `localStorage` como cache otimista.
- Login em novo device puxa preferências do banco no primeiro load.

## 4. Regras de negócio

- **Escopo individual** — preferência NUNCA é por role/equipe (decisão tomada).
- **Default por tela** — admin pode definir um "view default" por `page_key`; se não definir, usa default do sistema.
- **Reset volta ao default** atual da tela (não ao default histórico).
- **Migration de schema** — quando estrutura de `preferences` muda, `version` permite re-processar preferências antigas.
- **Campos removidos** — se uma coluna que estava nas prefs foi removida do sistema, simplesmente ignora (não erro).
- **Quota** — sem limite por usuário no v1, mas observar tamanho médio do JSON.
- **Audit log** — não necessário (preferência é cosmética, não governança).

## 5. Gaps no front atual

- **Tabela `user_preferences` + endpoints GET/PUT** — inexistente no backend.
- **Drawer de personalização** — **mockup já pronto** (`list-customizer.js`).
- **Cards editáveis com botão ⚙️** — **mockup já pronto** (tela12 cards).
- **Hook React** que carrega preferences no mount + persiste no save — inexistente.
- **Cache `localStorage`** sincronizado com banco — inexistente.
- **Página admin de "view default"** por tela — inexistente.
- Esforço estimado: **Médio** (~1.5 sprints — UI já mockada; foco em backend + hook).

## 6. Telas relacionadas (mockup)

- `list-customizer.js` (componente reutilizável) — base para todas as listas
- **tela12** — cards editáveis de dashboard
- Aplicar em todas as listas que têm filtros (mesmas da [[CONCEPT-SAVED-FILTERS]])

## 7. Decisões tomadas / Pendências

**Decisões:**
- **Por usuário, não por role** — confirmado.
- `localStorage` no mockup; banco no React de produção.
- Reset = volta ao default atual (não histórico).

**Pendências:**
- Default por tela é configurável por admin? Ou só hard-coded no sistema?
- Permitir admin "forçar" override (resetar prefs de todo mundo) em mudanças grandes?
- Exportar/importar preferências entre contas — fora do v1.

## 8. Prioridade

**Médio** — UI já mockada, esforço concentrado em backend simples. Boa vitória rápida de UX. Implementar junto com [[CONCEPT-SAVED-FILTERS]] (mesmo padrão de tabela `user_*` + endpoints CRUD).
