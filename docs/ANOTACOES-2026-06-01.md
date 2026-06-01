# Anotações Fernando — 2026-06-01

> Lista completa das 30 anotações revisadas em 01/06/2026 durante walkthrough
> dos mockups. Serve de rastro versionado e referência para validação.
>
> **Resumo:** 30 anotações em 12 telas — 20 aprovadas · 9 precisam ajuste · 1 pendente.

---

## tela04 — Catálogo de Workflows ✅
- (aprovada) Visual do filtro lateral consolidado bom
- (aprovada) Card "dependências" expansível ficou claro

## tela07 — Editor de SOP 🟡 (ajuste)
- (ajuste) Botões **"Ver histórico"** e **"Ver dependências"** levam pra listagem
  genérica mas **não filtram** pela SOP que estava aberta. Precisa passar query
  string com ID da SOP e a tela destino mostrar banner "Filtrando por SOP X
  [limpar filtro]".

## tela09 — Builder Escalation Trigger 🟡 (ajuste)
- (ajuste) **"Como faço o link entre stage/mailia no escalation?"** UI atual
  mostra escolha entre 2 opções mas não fica claro como ligar. Precisa
  dropdown de stages / regras Mailia após escolher tipo.
- (ajuste) **Botões "Redirecionar / Outros" do modo escalation vazando do card.**
  Corrigir CSS (padding + overflow + flex-wrap).
- (pendente, deixar pra frente) **Metadados x escalation** — relação entre os
  dois precisa de UX melhor. Por ora marcar TODO inline.

## tela10 — Workflow Builder 🟡 (ajuste)
- (ajuste) **Textos vazando nas 3 colunas.** Aplicar word-break/max-width.
- (ajuste) **Warning delay sem qtde de horas.** Remover input de horas.
  Após warning acabar, vira delay automaticamente.
- (ajuste) **Aba SOP — refator de fluxo:**
  - Tab SOP carrega SOP default vinculada ao stage
  - Botões: "Editar inline" · "Criar do zero" · "Copiar e editar"
  - Após editar: "Validar com IA" → modal placeholder com sugestões
  - Regra visível no topo: "📌 1 stage = 1 tarefa. Se a edição gerar mais de
    1 tarefa, IA sugere criar stage adicional."
- (ajuste) **Botão MatchEngine sem comportamento.** Click deve abrir
  modal/drawer com seleção de funções + TAGs.

## tela11 — Match Engine 🟡 (ajuste)
- (ajuste) **Permitir cadastrar regras de match no front.** Botão "+ Nova regra
  de match" + modal com campos (nome, escopo, condição, ação, prioridade).
- (ajuste) **Card "Critérios de match" com rolagem difícil.** Adicionar scroll
  horizontal suave.

## tela12 — Execution Visibility 🟡 (ajuste)
- (ajuste) **Filtros básicos + botão personalizar + IA dashboard.** Fernando
  não entendeu botão "Personalizar" nem "Gerar via IA". Precisa:
  - Filtros básicos visíveis (Time / Setor / Cliente / Fornecedor)
  - Botão "Personalizar visualização" → drawer com checkboxes/ordem
  - Botão "Gerar via IA" → modal mock com textarea + preview gerado
  - Comentário visível "⚙️ IA real chega em F3 (Copilot)"
- (ajuste) **i18n traduzir 90%** (exceto nomes próprios: ActionIA,
  WorkflowBuilder, MatchEngine, DMSYS, Mailia, Cockpit, SOP, Tag scheme).
  Meta: pelo menos 200 novas chaves cobrindo tela12 + sidebar + header +
  breadcrumb + mensagens.

## tela13 — Audit Trail + GLOBAL ✅/🟡
- (ajuste) **Filtro avançado por TAG + dado da TAG** — componente global
  reutilizável. Tab "Filtros avançados" em todas as telas com filtro avançado
  deve permitir: escolher TAG → escolher qual dado dessa TAG → input do valor
  → adicionar filtro. Múltiplos filtros TAG empilhados (AND/OR).
  - Aplica em: tela04, tela07, tela13, tela16-20, tela81, tela82.

## tela16 — Cockpit Overview ❌ (pendente)
- (pendente) **Cards top 5 editáveis (TAG ou IA).** Cada card top 5 ganha
  botão "⚙️ Editar":
  - Drawer com 2 abas: "Editar via TAG" / "Gerar via IA"
  - Editar via TAG: dropdown TAG + dropdown campos + filtros
  - Gerar via IA: textarea + placeholder "IA real chega em F3"
  - "Salvar visualização" → toast mock + memória in-memory (NÃO localStorage)

## tela17 — Cockpit Email ✅
- (aprovada) Bulk actions ok
- (aprovada) Filtros por status bom

## tela18 — Cockpit Todo ✅
- (aprovada) Layout cards aprovado
- (aprovada) Drag&drop visual ok

## tela19 — Cockpit Followup ✅
- (aprovada) Timeline visual aprovado

## tela20 — Cockpit Update ✅
- (aprovada) Formulário de update ok

---

## Itens transversais aprovados
- ✅ Sidebar permission-driven com toggle de perfil — funcionando bem em todas
- ✅ Padrão consolidado de 34 itens replicado nas 61 telas — visualmente
  uniforme
- ✅ i18n com 5 idiomas — base sólida (precisa expansão de cobertura)
- ✅ Tag filter component — usado de forma consistente

## Cronograma
- **2026-06-01**: revisão + 30 anotações
- **2026-06-02 a 06-04**: implementação dos 10 fixes priorizados (este commit)
- **2026-06-05**: re-revisão com Fernando

---

_Documento versionado em git para rastreabilidade._
