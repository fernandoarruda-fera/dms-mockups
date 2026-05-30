# Correções e decisões — Mockup DMSYS V2

> Registro de todas as decisões tomadas durante validação dos mockups. Ao final do ciclo, este documento será usado pra atualizar os PLANS Cat 0/1/2, sprint plan e demais documentos do projeto.

## Lote A — entregue (commit `4e82fd3`, 2026-05-29)

1. Rename global "Módulo de Compras"/"DMS Compras"/"Mockups MVP v2" → **"DMSYS V2"**.
2. Login: Microsoft SSO → **Google SSO**.
3. Tela07 (Editor SOP): grid 7/5 + overflow fix.
4. Tela07: botões "ver histórico" → tela13; "dependências" → tela04.
5. Tela08: botões Cancelar/Salvar/Publicar movidos pro **footer fixo**.
6. Tela09: overflow texto botões "modo de escalation".
7. Tela10: colisão menu × título resolvida.
8. Tela11: card "critérios de match" com scroll horizontal + fade.
9. Tela76: sidebar 70% no mobile resolvida.
10. Badges de contagem reduzidos (KPI tiles + tab counts).

## Lote B parte 1 — em execução (2026-05-29)

### C15 — Tela08 (Builder Stage Trigger)
- **Botão "Gerar via IA"** abre modal:
  - Textarea "Descreva a procedure que você precisa em linguagem natural"
  - Botão "Gerar com IA"
  - Retorna estrutura proposta + 3 opções: **Aceitar / Editar / Refazer**
- IA preenche campos existentes + **sugere criação de campos novos com flag "novo, revisar"**.

### C16 — Tela09 (Builder Escalation Trigger)
- Seção "Metadados" renomeada → **"Identificação do trigger"** (decisão: separar visualmente, ficar claro que é só rotulagem).
- Checkbox "SLA Cliente excedido" → **select "Disparar quando:"** com 3 opções:
  - SLA Cliente
  - SLA DMS
  - Ambos
  (Sem "Qualquer um" — decisão do Fernando.)
- **Gatilhos disponíveis:** apenas **Stage** e **MAILIA rule**. Decisão de produto: não adicionar workflow concluído / documento manual / tag específica neste momento.
- **Botão "Gerar via IA"** mesmo fluxo do tela08.

### C17 — Tela11 (Match Engine) — Regra de negócio chave
- **Adicionar seção "Vinculação a Workflow"** no form de criar regra.
- **Regra de negócio:**
  - Cada compra deve ter um workflow específico.
  - Pode usar o mesmo workflow se for **mesmo fornecedor/contrato**.
  - Se for usado workflow **default** → **alerta visual em todos os cards/views** indicando "Workflow padrão em uso — criar específico recomendado".
- **Critério de vinculação ainda não tem front no React** → marcar como gap a ser implementado (Cat 3 ou ajuste no Cat 1).

## Lote B parte 2 — entregue (2026-05-29)

- **list-customizer.js**: widget global de personalização (colunas/ordem/badges). Injetado em tela01, 03, 04, 06, 12, 13. Salva em localStorage por perfil (chave `dms-prefs-default-user-{pageKey}`). UI funcional do drawer com 3 abas + toast de confirmação. Conceitual — reflexo real na tabela é placeholder.
- **Tela12 refactor**: layout virou grid de cards por workflow (padrão cockpit), cada card mostra métricas-chave (ativas/concluídas/atrasadas/SLA crítico/exceções) + sparkline + botão "Ver execuções" + botão ⚙️ "Editar card" que abre modal pra escolher métricas exibidas. Salvo em localStorage `dms-prefs-default-user-tela12-cards`.
- **Botão "✨ Customizar via IA"** topo direito tela12 e tela13: modal com textarea + sugestões de prompt + preview de proposta (com nome editável e widgets sugeridos) + ações Aceitar/Editar/Refazer. Aceitar adiciona view no dropdown "View ativo" com badge "✨ View salvo".
- **Tela13**: layout principal mantido (log de auditoria). Só adicionado o botão IA + modal + filtros avançados.
- **Filtros avançados em tela12 e tela13** (colapsável): Time (multi-select), Setor (select), Cliente (autocomplete), Fornecedor (autocomplete), Procedure (autocomplete).

## Lote B parte 3 — entregue (2026-05-29)

### C14 — Internacionalização (i18n)
- **`i18n-toggle.js`**: widget global de troca de idioma. Injetado em todas as **76 telas + index** (77 arquivos). Botão fixo top-right (z-9999) com flag + código do idioma atual.
- **5 idiomas suportados** (dicionário interno self-contained, sem dependência externa):
  - 🇧🇷 PT-BR (default) — Português (Brasil)
  - 🇺🇸 EN — English
  - 🇪🇸 ES — Español
  - 🇵🇹 PT-PT — Português (Portugal) — distingue de PT-BR ("Eliminar", "Encomendas", "Procurar", "Registos", "Utilizador", "A carregar...")
  - 🇩🇪 DE — Deutsch
- **Persistência:** `localStorage.dms-locale`. Qualquer página lê e aplica no load.
- **Mecanismo:** elementos com atributo `data-i18n="chave"` têm `textContent` substituído pela tradução. **~80 pontos-chave** já marcados em todas as telas (nav lateral, botões "Novo X" das bibliotecas, headers "Status"/"Ações" de tabelas).
- **30 chaves universais** traduzidas nos 5 idiomas:
  - **nav** (12): cockpit, email, tasks, followup, updates, purchases, requisitions, quotes, orders, registrations, libraries, admin
  - **btn** (9): save, cancel, create, delete, edit, export, search, filter, new
  - **label** (5): status, actions, created, updated, user
  - **msg** (4): loading, empty, saved, error
- **UX do toggle:** click no botão abre dropdown com 5 opções (flag + nome completo + código + check ✓ no idioma ativo). Header "Idioma · Language". Footer com nota "Mockup conceitual — tradução parcial". Toast top-right confirmando troca: "Idioma alterado para [X]".
- **API pública:** `window.dmsI18n.set('en')`, `.get()`, `.t('key')`, `.apply()` — útil pra debug e futuras integrações.

> **Observação:** mockup conceitual demonstra o efeito do toggle. Tradução completa de todas as strings das 76 telas será feita após validação do conceito (Cat 3 / sprint dedicado).

## Validação inline de anotações — 2026-05-29

Sistema adicionado: cada anotação tem botões ✓ OK / ✗ Não OK pra Fernando marcar se a correção ficou boa. Se "Não OK", abre textarea pra descrever o que não ficou bom. Status + feedback persistem em localStorage e aparecem no export Markdown.

- Disponível na tela76 central e no widget de cada tela.
- 3 estados: pending / ok / not-ok.
- Visual: borda esquerda verde/vermelha/neutra + ícone + label.
- Export Markdown agora separa anotações por status.
- KPIs da tela76 ganharam contadores de aprovadas/precisam ajuste/pendentes + filtros por status (tabs).
- Migração transparente: anotações antigas viram `pending` automaticamente no load.

---

## Concepts criados (2026-05-30, em docs/concepts/)

- **AGENTS** — entidade nova, mockup tela77
- **ALERTS** — entidade nova, mockup tela78
- **WORKFLOW-OBLIGATORY** — regra de negócio CRÍTICA
- **MATCH-ENGINE** — 3 modos, mockup tela79
- **SAVED-FILTERS** — feature nova (escopo privado/equipe/global)
- **AI-GENERATION** — contrato genérico unificado
- **USER-PROFILE-PREFERENCES** — personalização por user

Cada concept precisa aprovação do Fernando antes de virar PLAN de implementação no React.

---

## Documentos a atualizar ao final do ciclo

- `docs/sessions/2026-05-27/PLAN-CAT0-IMPLEMENTACAO.md`
- `docs/sessions/2026-05-27/PLAN-CAT1-IMPLEMENTACAO.md`
- `docs/sessions/2026-05-27/PLAN-CAT2-IMPLEMENTACAO.md`
- Sprint plan (se houver)
- README do projeto se rename DMSYS V2 afeta
- Roadmap (criar item Cat 3 com "Vinculação a Workflow" pra match rules + Dashboard via IA + Personalização por perfil + i18n)

---

## Lote C Task 1 — entregue (2026-05-30)

**3 telas novas criadas:**

- **`tela77-agentes-biblioteca.html`** — Biblioteca de Agentes inteligentes. 4 KPIs (Total/Ativos/Inativos/Em uso), filtros (busca, tipo, status), tabela com 14 agentes plausíveis (ActionAI Aprovação NF, Validador CNPJ Brasil, Roteador SLA Crítico, etc.), badges coloridos por tipo, chips de skills, contador de workflows vinculados, drawer lateral "+ Novo Agente" com form (Nome, Tipo, Descrição, Skills, Config), empty state.
- **`tela78-alertas-biblioteca.html`** — Biblioteca de Alertas configuráveis. 4 KPIs (Total/Ativos/Disparados 24h/Workflows usando), filtros (busca, severidade, canal, status), tabela com 12 alertas (SLA Crítico, Divergência NF, Stage Atrasado, Workflow Órfão, etc.), drawer "+ Novo Alerta" com form completo (Severidade radio cards, Canais multi-check, Trigger condition mono, Mensagem template com vars, Ativo toggle).
- **`tela79-matchengine-workflow.html`** — MatchEngine config por workflow com **3 modos de configuração**: 🛠️ Manual (A) = mapeamentos editáveis; ✨ IA Assistida (B, default) = sugestões IA com toggle aprovar/editar + textarea "refinar prompt" + botão "re-gerar"; 🤖 IA + Validação (C) = mapeamentos discriminantes/redundantes + selo "Match único garantido" e estado alternativo "Ambiguidade detectada" (collapsible). Cards "Como vai funcionar" (preview email→workflow) e "Tags que disparam match" compartilhados entre os 3 modos. Footer fixo com Cancelar / Testar / Salvar. Toggle de modo troca todo o conteúdo via JS.

**`tela10-workflow-builder.html` atualizada:**

- Link "Configurar no Match Engine →" agora aponta pra `tela79-matchengine-workflow.html`.
- Aba **Alertas** ganhou conteúdo real: lista de alertas vinculados (1 chip "SLA em Risco"), autocomplete "Adicionar alerta existente", botão "+ Criar novo alerta" → linka pra tela78.
- Aba **Agentes** ganhou conteúdo real: lista de agentes vinculados (2 chips: ActionAI Aprovação NF + Detector Divergência), autocomplete + botão "+ Criar novo agente" → linka pra tela77. Contador da aba passou de (0) pra (2).
- Sidebar consolidada ganhou links Agentes 🤖 e Alertas 🚨 na seção Bibliotecas.

**`index.html` atualizado:**

- 3 entradas adicionadas no novo grupo "Bibliotecas Avançadas".
- Header bumpado de "75 telas" → "79 telas".

**Próximos itens do Lote C (pendentes):**

- Task 2 — outras telas/ajustes a definir
- Task 3 — em aberto

## Lote C Task 3 — entregue (2026-05-30)

- **tela07**: links "Ver histórico" e "Ver dependências" agora carregam query params (`?sop=SOP-001` / `?relatedTo=SOP-001`) para filtrar a tela destino pela SOP atual.
- **tela13 + tela04**: banner amarelo "🔍 Filtrado por SOP: X · Limpar filtro" no topo + JS que oculta linhas/cards que não casam com o filtro, lido via `URLSearchParams`.
- **tela09**: novo select dependente "Qual Stage/MAILIA rule?" com opções pré-populadas trocando dinamicamente conforme origem do gatilho · fix overflow agressivo dos cards `.mode-card` (min-width:0, word-break, font-size 13px, flex-wrap).
- **tela11**: refactor completo — removida seção "Vinculação a Workflow" como critério; adicionado banner no topo explicando que a tela cria UMA regra; adicionada seção destacada **"Workflow resultante *"** no final do form (obrigatório, com opção "+ Criar novo workflow específico"); adicionada seção "Compras irregulares (sem workflow vinculado)" com badge vermelho `⚠ Sem workflow` + botão "Criar workflow específico".
- **tela12 + tela13 (Customizar via IA)**: tooltips `title=` nos botões "Personalizar" e "Customizar via IA"; barra de progresso 3 passos (Descreva / Gerando / Aplique) sempre visível no modal IA, com estado ativo destacado roxo; toast `"✓ View 'Nome' salvo em Filtros Customizados"` ao aceitar.
- **list-customizer.js**: tooltip "Escolha quais colunas, badges e métricas aparecem na sua visão"; pulse animation 1.2s + hint flutuante "Experimente! ✨" por 3s após load; toast atualizado para "✓ Preferências atualizadas".
- **tela10**: removidos inputs "qtde horas no delay" (Delay automático após warning, sem configuração); CSS global `min-width:0` em `.grid > *` e `.escalation-card` pra evitar overflow nas 3 colunas; aba Procedures convertida de placeholder pra UI real (lista de procedures + autocomplete + "Criar nova procedure" → tela03); aba SLA+Escalation ganhou autocomplete "Buscar escalation existente" + botão "Criar nova" → tela09.
