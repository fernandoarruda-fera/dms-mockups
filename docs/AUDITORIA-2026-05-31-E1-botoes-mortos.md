# Auditoria E1 — Botões/UI sem função

> Varredura estática automatizada das 82 telas + index, executada em **2026-05-31**.
> Critério: padrões `href="#"`, `<button>` sem `onclick`, `<form>` sem `action/onsubmit`, marcadores "em construção", links pra arquivos inexistentes.
> **Disclaimer:** o produto é mockup HTML estático — botões sem handler são esperados na maioria dos casos. O report foca em **CTAs principais sem destino**, **navegação quebrada** e **placeholders não-marcados**.

## Sumário

- **Telas auditadas:** 83 (82 telaXX + index)
- **Telas SEM achados:** 5 (tela54-erro-404, tela55-erro-403, tela56-erro-500, tela57-sessao-expirada, tela58-manutencao)
- **Total de elementos suspeitos:** 702
  - 🔴 **Crítico:** 89 — CTA principal sem destino
  - 🟠 **Alto:** 578 — botão/link secundário sem destino (esperado em mockup; revisar antes de virar produto)
  - 🟡 **Médio:** 7 — marcador "em construção/em breve/não implementado" fora de tela placeholder
  - ⚪ **Info:** 28 — `disabled` documentado (intencional, ex: "‹ Anterior" na 1ª página)
- **Links pra telas inexistentes:** 0 ✅ (todos os `href="telaXX.html"` resolvem)
- **Nav header com `href="#"`:** 36 ocorrências em 31 telas — *padrão consistente, agregado abaixo, não inflado no report*

---

## ✅ Status de entrega

**Rodada 1 — 2026-05-31 (Sprint E1):** 9 telas wired via `mockup-handlers.js` (validação visual de campos required + toast mock):

| Tela | CTA(s) wired | Tipo |
|------|--------------|------|
| `tela47-login` ✅ | Form login (Entrar) | Auth |
| `tela48-reset-senha-request` ✅ | Form (Enviar link) | Auth |
| `tela49-reset-senha-nova` ✅ | Form (Redefinir senha) | Auth |
| `tela53-2fa-challenge` ✅ | Form (Verificar código) | Auth |
| `tela72-convite-signup` ✅ | Form + botão "Criar conta e entrar" | Auth |
| `tela07-editor-sop` ✅ | Salvar rascunho; Publicar nova versão | Builder |
| `tela08-builder-stage-trigger` ✅ | Salvar rascunho; Publicar | Builder |
| `tela09-builder-escalation-trigger` ✅ | Salvar rascunho; Publicar | Builder |
| `tela10-workflow-builder` ✅ | Salvar rascunho; Aprovar v1.0 | Builder |

**Críticos resolvidos nesta rodada:** 9 itens (5 forms auth + 4 conjuntos de CTAs builder).
**Implementação:** `mockup-handlers.js` — auto-bind em `<form>` e botões com texto `Entrar/Salvar/Publicar/Aprovar/Criar conta/...`. Sem backend; toast visual de confirmação + marcação vermelha em campos required vazios.

---

## 🔴 Críticos — CTA principal sem destino

CTAs com texto `Salvar / Publicar / Aprovar / Criar / Confirmar / Enviar / Aplicar / Entrar` etc. que **não têm** `onclick`, `action` ou destino de navegação.

| Tela | Elementos sem ação |
|------|---------------------|
| `tela02-tag-form` | `[btn-sem-onclick]` **Salvar** |
| `tela04-catalogo-workflows` | `[btn-sem-onclick]` **Excluir** |
| `tela05-invalidate-modal` | `[btn-sem-onclick]` **Aplicar e Invalidar** |
| `tela07-editor-sop` ✅ | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Publicar nova versão**; `[btn-sem-onclick]` **Aplicar stages aceitos** |
| `tela08-builder-stage-trigger` ✅ | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Publicar** |
| `tela09-builder-escalation-trigger` ✅ | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Publicar** |
| `tela10-workflow-builder` ✅ | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Aprovar v1.0**; `[btn-sem-onclick]` **Remover** |
| `tela11-match-engine` | `[btn-sem-onclick]` **Salvar critérios**; `[btn-sem-onclick]` **Criar workflow específico →** |
| `tela12-execution-visibility` | `[btn-sem-onclick]` **Confirmar intervenção** |
| `tela15-mailia-admin` | `[btn-sem-onclick]` **Aplicar todas correções** |
| `tela16-cockpit-overview` | `[btn-sem-onclick]` **Aprovar REQ-0142** |
| `tela17-cockpit-email` | `[btn-sem-onclick]` **Enviar** |
| `tela22-requisicao-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Enviar para aprovação** |
| `tela23-requisicao-detalhe` | `[btn-sem-onclick]` **Aprovar**; `[btn-sem-onclick]` **Rejeitar** |
| `tela25-cotacao-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Enviar para fornecedores** |
| `tela26-cotacao-detalhe` | `[btn-sem-onclick]` **Excluir convidado** |
| `tela28-pedido-form` | `[btn-sem-onclick]` **Salvar rascunho** |
| `tela29-pedido-detalhe` | `[btn-sem-onclick]` **Confirmar recebimento** |
| `tela31-empresa-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Salvar e ativar** |
| `tela33-centro-custo-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Salvar e ativar** |
| `tela35-plano-conta-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Salvar e ativar** |
| `tela41-aprovacao-detalhe` | `[btn-sem-onclick]` **Aprovar**; `[btn-sem-onclick]` **Rejeitar** |
| `tela43-orcamento-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Submeter para aprovação** |
| `tela45-contrato-form` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Submeter para aprovação** |
| `tela47-login` ✅ | `[btn-sem-onclick]` **Entrar com Google**; `[form-sem-handler]` **(form)** |
| `tela48-reset-senha-request` ✅ | `[form-sem-handler]` **(form)** |
| `tela49-reset-senha-nova` ✅ | `[form-sem-handler]` **(form)** |
| `tela52-2fa-setup` | `[btn-sem-onclick]` **Verificar e ativar 2FA** |
| `tela53-2fa-challenge` ✅ | `[form-sem-handler]` **(form)** |
| `tela59-empty-state-showcase` | `[btn-sem-onclick]` **Criar primeiro item** |
| `tela60-auditoria-global` | `[btn-sem-onclick]` **Aplicar** |
| `tela61-webhooks-list` | `[btn-sem-onclick]` **Aplicar**; `[btn-sem-onclick]` **Desativar**; `[btn-sem-onclick]` **Excluir** |
| `tela62-templates-email` | `[btn-sem-onclick]` **Desativar** |
| `tela63-config-smtp-imap` | `[btn-sem-onclick]` **Enviar agora**; `[btn-sem-onclick]` **Salvar configuração** |
| `tela64-api-tokens` | `[btn-sem-onclick]` **Excluir histórico** |
| `tela65-modais-confirmacao` | `[btn-sem-onclick]` **Excluir mesmo assim**; `[btn-sem-onclick]` **Aprovar com exceção** |
| `tela66-wizard-stage-editor` | `[btn-sem-onclick]` **Publicar versão** |
| `tela67-wizard-supplier-detail` | `[btn-sem-onclick]` **Salvar alterações**; `[btn-sem-onclick]` **remover** |
| `tela68-modais-bulk-actions` | `[btn-sem-onclick]` **Aprovar 12** |
| `tela70-detail-comparativo-versoes` | `[btn-sem-onclick]` **Aprovar v2.5 como definitiva** |
| `tela71-notificacoes-centro` | `[btn-sem-onclick]` **Aprovar** |
| `tela72-convite-signup` ✅ | `[btn-sem-onclick]` **Criar conta e entrar**; `[form-sem-handler]` **(form)** |
| `tela76-anotacoes-centro` | `[btn-sem-onclick]` **Excluir** |
| `tela77-actionia-biblioteca` | `[btn-sem-onclick]` **Salvar rascunho**; `[btn-sem-onclick]` **Ativar** |
| `tela78-alertas-biblioteca` | `[btn-sem-onclick]` **Salvar** |
| `tela79-matchengine-workflow` | `[btn-sem-onclick]` **Salvar configuração** |
| `tela80-permissoes-matriz` | `[btn-sem-onclick]` **Salvar mudanças (3)** |
| `tela81-config-intervenientes-modulo` | `[btn-sem-onclick]` **Salvar configuração**; `[btn-sem-onclick]` **Remover** |

### 🔴 Formulários de autenticação sem `action`/`onsubmit`

Telas onde submeter o form **não leva a lugar nenhum** — UX espera redirect/feedback após login/reset.

| Tela | Observação |
|------|------------|
| `tela47-login` ✅ | `<form>` sem `action` → botão "Entrar" não navega |
| `tela48-reset-senha-request` ✅ | `<form>` sem `action` → não navega pra confirmação |
| `tela49-reset-senha-nova` ✅ | `<form>` sem `action` → não navega pra login |
| `tela53-2fa-challenge` ✅ | `<form>` sem `action` → não valida nem navega |
| `tela72-convite-signup` ✅ | `<form>` sem `action` → não navega pra próximo passo |

> **Sugestão:** em mockup, ao menos adicionar `onsubmit="event.preventDefault(); location.href='telaXX.html';"` para preview funcional do fluxo.

---

## 🟠 Alto — top 15 telas por volume

Volume agregado por tela (clique em "elementos" pra ver detalhe). Mockup HTML estático normalmente tem muitos — o que importa é coerência: existe destino lógico pra esse botão?

| # | Tela | 🔴 | 🟠 | ⚪ | Total | Achados principais (🟠) |
|---|------|----|----|----|-------|--------------------------|
| 1 | `tela10-workflow-builder` | 7 | 13 | 0 | 20 | _Catálogo de Tags_; _Procedures_; _Biblioteca SOP_; _Catálogo de Workflows_ (+6) |
| 2 | `tela61-webhooks-list` | 7 | 13 | 0 | 20 | _cadastre uma nova integração_; _+ Novo Webhook_; _Testar_; _Editar_ (+1) |
| 3 | `tela81-config-intervenientes-modulo` | 6 | 9 | 0 | 15 | _+ Novo_; _+ Habilitar_; _+ Conceder a outra role_; _Revogar_ (+2) |
| 4 | `tela11-match-engine` | 4 | 6 | 0 | 10 | _Biblioteca SOP_; _Match Engine_; _Workflow Builder_; _Cancelar_ (+1) |
| 5 | `tela07-editor-sop` | 3 | 19 | 0 | 22 | _Catálogo de Tags_; _Procedures_; _Biblioteca SOP_; _Catálogo de Workflows_ (+14) |
| 6 | `tela67-wizard-supplier-detail` | 3 | 5 | 0 | 8 | _Bloquear_; _+ Anexar certidão_; _+ Vincular regra_; _+ Adicionar conta_ (+1) |
| 7 | `tela71-notificacoes-centro` | 2 | 24 | 0 | 26 | _Marcar todas como lidas_; _Todas (28)_; _Não lidas 7_; _Aprovações (4)_ (+8) |
| 8 | `tela43-orcamento-form` | 2 | 14 | 0 | 16 | _Anual_; _Mensal_; _Adicionar CC_; _Igual_ (+2) |
| 9 | `tela65-modais-confirmacao` | 2 | 14 | 0 | 16 | _Cancelar_; _Bloquear_; _Recusar_; _Aceitar divergência_ (+4) |
| 10 | `tela09-builder-escalation-trigger` | 2 | 11 | 0 | 13 | _Catálogo de Tags_; _Procedures_; _Biblioteca SOP_; _Catálogo de Workflows_ (+6) |
| 11 | `tela08-builder-stage-trigger` | 2 | 10 | 0 | 12 | _Catálogo de Tags_; _Procedures_; _Biblioteca SOP_; _Catálogo de Workflows_ (+5) |
| 12 | `tela63-config-smtp-imap` | 2 | 10 | 0 | 12 | _ver NF_; _Mostrar_; _Testar conexão_; _📥 Receber NF de teste Simula c_ (+4) |
| 13 | `tela23-requisicao-detalhe` | 2 | 7 | 1 | 10 | _Compartilhar_; _Editar_; _Detalhes_; _Itens 6_ (+3) |
| 14 | `tela72-convite-signup` | 2 | 3 | 0 | 5 | _Termos de Uso_; _Política de Privacidade_; _Ignorar este convite_ |
| 15 | `tela22-requisicao-form` | 2 | 2 | 0 | 4 | _Ver regra completa_; _Adicionar item_ |

---

## 🟡 Médio — marcadores "em construção/em breve" fora de tela placeholder

Strings que indicam funcionalidade não-pronta em telas que NÃO são `tela75-em-construcao` / `tela58-manutencao` / `tela59-empty-state-showcase`. Sinaliza inconsistência se for produção, ou intencional (badge "Q3 2026") se for roadmap UI.

| Tela | Marcador | Contexto |
|------|----------|----------|
| `tela10-workflow-builder` ✅ | `Em construção` | ms-ceu"> Em construção |
| `tela14-setup-integracoes` | `não implementado` | er bg-gray-100 text-gray-600">não implementado |
| `tela81-config-intervenientes-modulo` | `em breve` | ecnologia mt-0.5">Compras · 3 em breve |
| `tela81-config-intervenientes-modulo` | `em breve` | 11px] text-dms-tecnologia/70">em breve |
| `tela81-config-intervenientes-modulo` | `em breve` | 11px] text-dms-tecnologia/70">em breve |
| `tela81-config-intervenientes-modulo` | `em breve` | 11px] text-dms-tecnologia/70">em breve |
| `index` | `Em construção` | s & Onboarding', label: '75 · Em construção (placeholder)' }, { src: |

### Marcadores legítimos (telas placeholder oficiais)

Encontrados 12 marcadores em `tela75`, `tela59`, `tela58`, `index` — esperado, são as telas que **comunicam** "não pronto" intencionalmente.

---

## ⚪ Info — botões `disabled` (intencional)

| Tela | Botão | Provável motivo |
|------|-------|------------------|
| `tela01-catalogo-tags` | `‹ Anterior` | paginação (1ª/última página) |
| `tela03-procedures-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela04-catalogo-workflows` | `Excluir 🔒` | sem permissão |
| `tela06-biblioteca-sop` | `‹ Anterior` | paginação (1ª/última página) |
| `tela13-audit-trail` | `‹ Anterior` | paginação (1ª/última página) |
| `tela16-cockpit-overview` | `${t.label} ${t.tag} ${isSelected ? ' ' : atLimit ?` | ? |
| `tela18-cockpit-todo` | `‹` | paginação (1ª/última página) |
| `tela19-cockpit-followup` | `‹` | paginação (1ª/última página) |
| `tela20-cockpit-update` | `‹` | paginação (1ª/última página) |
| `tela21-requisicoes-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela23-requisicao-detalhe` | `Gerar Cotação` | aguardando estado anterior |
| `tela24-cotacoes-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela26-cotacao-detalhe` | `Gerar PO` | aguardando estado anterior |
| `tela26-cotacao-detalhe` | `—` | ? |
| `tela27-pedidos-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela30-empresas-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela30-empresas-list` | `Próximo ›` | paginação (1ª/última página) |
| `tela32-centros-custo-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela32-centros-custo-list` | `Próximo ›` | paginação (1ª/última página) |
| `tela36-pre-lancamentos-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela38-notas-fiscais-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela38-notas-fiscais-list` | `Próximo ›` | paginação (1ª/última página) |
| `tela39-nota-fiscal-detalhe` | `Aprovar match` | ? |
| `tela40-aprovacoes-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela40-aprovacoes-list` | `Próximo ›` | paginação (1ª/última página) |
| `tela41-aprovacao-detalhe` | `Selecione uma decisão` | ? |
| `tela44-contratos-list` | `‹ Anterior` | paginação (1ª/última página) |
| `tela44-contratos-list` | `Próximo ›` | paginação (1ª/última página) |

---

## Nav header `href="#"` (agregado — não inflar)

Todas as telas têm um header com links de navegação genéricos (Cockpit, Requisições, Cotações, etc.) usando `href="#"`. Isso é **sistemático** (31 telas, 36 ocorrências) e segue o padrão do mockup. **Não listado individualmente** pra não poluir o report.

**Recomendação:** centralizar o header num componente compartilhado e popular `href` real (já existem links em outras telas pra essas seções).

---

## Links pra telas inexistentes

✅ **Nenhum** — todos os `href="telaXX.html"` resolvem pra arquivo existente.

Resultado consistente com a auditoria cruzada da resolver (`REVIEW-2026-05-31.md`).

---

## Recomendações

### 🔴 Crítico (corrigir antes de demo)

1. **Forms de autenticação (47/48/49/53/72)** — adicionar `onsubmit="event.preventDefault(); location.href='<tela-destino>';"` pra fluxo navegável. Hoje clicar em "Entrar"/"Enviar" não faz nada visível.
2. **CTAs de aprovação em telas de detalhe** (tela23 "Aprovar/Rejeitar", tela26/29 "Gerar Cotação/PO" disabled) — definir destino esperado ou marcar como `disabled` + tooltip explicando estado.
3. **Builders (tela07/08/09/10) "Salvar rascunho" + "Publicar"** — em mockup pode redirecionar pra tela do item criado (tela01-catalogo, tela04-workflows). Hoje o usuário "salva" e tela continua igual.

### 🟠 Alto (revisar antes de produção)

1. **`tela81-config-intervenientes-modulo`** — 6 CTAs críticos sem destino (Salvar configuração + 5x Remover). Tela recente (commit 29ae76e), provavelmente não terminou wiring.
2. **`tela61-webhooks-list`** — 7 CTAs críticos (Aplicar, Desativar x4). Lista de configuração precisa de ação real.
3. **`tela71-notificacoes-centro` (26 achados)** e **`tela15-mailia-admin` (25)** — alto volume de botões secundários sem ação. Auditar se algum deveria ser link.
4. **Nav header global** — extrair em include compartilhado e popular `href` reais (eliminaria 36 falsos-positivos em 31 telas).

### 🟡 Médio (decidir intenção)

1. **`tela81` "Compras · 3 em breve"** — é badge legítimo de roadmap? Se sim, manter; se não, remover.
2. **`tela14-setup-integracoes` "não implementado"** — badge ao lado de integração específica. Verificar se é intencional (integração futura) ou debt.
3. **`tela10-workflow-builder` "Em construção"** — strip se a tela já é considerada pronta; manter se é seção interna pendente.

### ⚪ Aceitar como placeholder (documentado)

1. Telas 54/55/56/57/58 (erros + manutenção) — sem achados. ✅
2. tela59 (empty-states showcase) e tela75 (em-construcao) — marcadores são o **propósito** da tela. ✅
3. Botões `disabled` de paginação (‹ Anterior na 1ª pg) — padrão UX correto. ✅

---

## Metodologia

Script Python varreu os 83 arquivos HTML detectando:

- `<a>` com `href` em `{"", "#", "#!", "javascript:void(0)"}` + sem `onclick` real
- `<button>` sem `onclick` (ou `onclick="//"`, `console.log(...)`, `alert("em breve")`) e fora de `<form type=submit>`
- `<form>` sem `action` nem `onsubmit`
- Strings: `em construção`, `em breve`, `coming soon`, `em desenvolvimento`, `não implementado`, `WIP`, `stub`
- `href="telaXX.html"` cruzado com lista de arquivos existentes

**Filtros aplicados (anti-ruído):**

- Botões de ícone óbvios (notification bell, search, menu hamburger, dropdown chevron) — ignorados
- Atributo `placeholder=` de inputs — não conta como marcador
- Palavra "todo" isolada — ignorada (legítima em telas Cockpit To-Do)
- Nav header com `href="#"` — agregado, não listado individualmente
- Telas placeholder oficiais (54-58, 59, 75) — marcadores "em construção" não viram 🟡

**Severidade — critérios aplicados:**

- 🔴 Crítico: texto contém CTA primário (`Salvar|Aprovar|Publicar|Criar|Confirmar|Enviar|Excluir|Aplicar|Submeter|Finalizar|Entrar|Cadastrar|Ativar`) e tamanho < 35 chars
- 🟠 Alto: demais botões/links com texto >= 2 chars sem ação
- 🟡 Médio: marcador "em construção" em tela funcional (não placeholder oficial)
- ⚪ Info: atributo `disabled` presente
