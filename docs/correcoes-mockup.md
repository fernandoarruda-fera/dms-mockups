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

## Documentos a atualizar ao final do ciclo

- `docs/sessions/2026-05-27/PLAN-CAT0-IMPLEMENTACAO.md`
- `docs/sessions/2026-05-27/PLAN-CAT1-IMPLEMENTACAO.md`
- `docs/sessions/2026-05-27/PLAN-CAT2-IMPLEMENTACAO.md`
- Sprint plan (se houver)
- README do projeto se rename DMSYS V2 afeta
- Roadmap (criar item Cat 3 com "Vinculação a Workflow" pra match rules + Dashboard via IA + Personalização por perfil + i18n)
