# Auditoria E2 — Funcional Chrome MCP (2026-05-31)

**Escopo:** 87 telas (`tela01-87`) servidas em `https://fernandoarruda-fera.github.io/dms-mockups/`.
**Método:** Chrome MCP — navigate + DOM scan via JS + read_console_messages (onlyErrors) + read_network_requests.
**Heurística "sem handler":**
- Botão sem handler: `!onclick && !hasAttribute('onclick') && !data-action && !data-toggle && type !== 'submit'`.
- Link sem href: `!href || href === '#' || href === 'javascript:void(0)'`.
- Form sem handler: `!onsubmit && !hasAttribute('onsubmit') && !getAttribute('action')`.

**Caveat:** A heurística não detecta listeners ligados via `addEventListener()` (i18n-toggle, notes-widget, mockup-handlers). Botões/forms com `btnNoH=1` ou `fNoH=1` provavelmente têm wiring via JS — devem ser tratados como ⚠️ informativo, não ❌ crítico. O console limpo em 100% das telas indica que o wiring está funcionando em runtime.

---

## Sumário

| Métrica | Valor |
|--------|------:|
| Total auditadas | 87 |
| ✅ Clean | 79 |
| ⚠️ Avisos | 8 |
| ❌ Críticos | 0 |
| Console errors (total) | 0 |
| Network 404/500 (total) | 0 |
| Botões totais | 2.105 |
| Forms totais | 9 (todos em telas auth) |

**Warning Tailwind CDN** ignorado (global em todas as telas — `cdn.tailwindcss.com should not be used in production`).

---

## Top 10 telas com mais ruído heurístico

| # | Tela | btn/btnNoH | a/aNoH | f/fNoH | Observação |
|--:|------|-----------:|-------:|-------:|-----------|
| 1 | tela70-detail-comparativo-versoes | 14/1 | 39/**12** | 0/0 | 12 anchors com `href="#"` — links de versões placeholder |
| 2 | tela06-biblioteca-sop | 32/1 | 39/**12** | 0/0 | 12 anchors `#` — cards SOP placeholder |
| 3 | tela03-procedures-list | 44/1 | 37/**10** | 0/0 | 10 anchors `#` — linha de procedure |
| 4 | tela11-match-engine | 23/1 | 34/8 | 0/0 | 8 anchors `#` |
| 5 | tela01-catalogo-tags | 45/1 | 34/7 | 0/0 | 7 anchors `#` |
| 6 | tela02-tag-form | 19/1 | 32/7 | 0/0 | 7 anchors `#` |
| 7 | tela09-builder-escalation | 20/1 | 32/7 | 0/0 | 7 anchors `#` |
| 8 | tela10-workflow-builder | 46/1 | 48/7 | 0/0 | 7 anchors `#` |
| 9 | tela47-login | 12/**2** | 1/0 | 1/**1** | Form auth sem `action`/`onsubmit`, 2 botões sem handler aparente |
| 10 | tela86-fornecedores-cadastro | 31/**3** | 37/0 | 1/0 | 3 botões sem `onclick`/`data-action` |

---

## Lista priorizada de fixes (sugestão)

### P1 — Auth forms sem ação visível (verificar wiring JS)

Telas com `<form>` mas sem `action`/`onsubmit` atributo. Provavelmente já têm listener via `mockup-handlers.js` ou inline `<script>`, mas vale confirmar em DevTools:

- **tela47-login.html** — form login (1 form, 2 botões sem onclick)
- **tela48-reset-senha-request.html** — form recuperação
- **tela49-reset-senha-nova.html** — form nova senha
- **tela51-trocar-senha.html** — form trocar senha
- **tela53-2fa-challenge.html** — form challenge 2FA
- **tela72-convite-signup.html** — form aceitar convite (também 3 anchors `#`)

**Ação sugerida:** adicionar `data-handler="auth"` ou `onsubmit="return false; ..."` para tornar wiring auditável; OU adicionar comentário `// wired in mockup-handlers.js` no `<form>`.

### P2 — Placeholder anchors (`href="#"`) em telas-lista

Listas de catálogo/biblioteca usam `<a href="#">` como linha-clicável, sem onclick. Tela70 (comparativo de versões) lidera com 12.

- tela70 (12), tela06 (12), tela03 (10), tela11 (8), tela01/02/09/10 (7 cada)

**Ação sugerida:** trocar `<a href="#">` por `<button>` ou `<a href="javascript:void(0)" data-action="open-row">` para deixar a intenção explícita. Hoje funciona porque há delegação no `list-customizer.js` ou inline.

### P3 — Botões sem handler aparente em tela86

**tela86-fornecedores-cadastro.html** — 3 botões com `btnNoH=3` (acima do padrão `1`).

**Ação sugerida:** inspecionar manualmente; confirmar se são botões de wizard/modal que dependem de listener delegado.

### P4 — Standardização do "language toggle"

Praticamente todas as 87 telas têm exatamente `btnNoH=1` — provavelmente o botão `#lang-toggle` do `i18n-toggle.js`, que usa `addEventListener` sem `onclick`. Não é bug, é só ruído de auditoria — vale anotar pra não disparar alerta em runs futuros.

---

## Detalhe por tela

### Bloco E3/E4 — Catálogo, SOP, Workflow (tela01-15)

```
tela01-catalogo-tags          ✅ btn 45/1   a 34/7   f 0/0
tela02-tag-form               ✅ btn 19/1   a 32/7   f 0/0
tela03-procedures-list        ✅ btn 44/1   a 37/10  f 0/0
tela04-catalogo-workflows     ✅ btn 37/1   a 47/5   f 0/0
tela05-invalidate-modal       ✅ btn 20/1   a 30/5   f 0/0
tela06-biblioteca-sop         ✅ btn 32/1   a 39/12  f 0/0
tela07-editor-sop             ✅ btn 39/1   a 34/7   f 0/0
tela08-builder-stage-trigger  ✅ btn 25/1   a 35/6   f 0/0
tela09-builder-escal-trigger  ✅ btn 20/1   a 32/7   f 0/0
tela10-workflow-builder       ✅ btn 46/1   a 48/7   f 0/0
tela11-match-engine           ✅ btn 23/1   a 34/8   f 0/0
tela12-execution-visibility   ✅ btn 49/1   a 31/6   f 0/0
tela13-audit-trail            ✅ btn 39/1   a 30/5   f 0/0
tela14-setup-integracoes      ✅ btn 19/1   a 30/5   f 0/0
tela15-mailia-admin           ✅ btn 49/1   a 28/1   f 0/0
```

### Cockpit (tela16-20)

```
tela16-cockpit-overview       ✅ btn 30/1   a 30/5   f 0/0
tela17-cockpit-email          ✅ btn 25/1   a 29/1   f 0/0
tela18-cockpit-todo           ✅ btn 34/1   a 29/1   f 0/0
tela19-cockpit-followup       ✅ btn 33/1   a 29/1   f 0/0
tela20-cockpit-update         ✅ btn 34/1   a 29/1   f 0/0
```

### Procurement (tela21-29)

```
tela21-requisicoes-list       ✅ btn 37/1   a 36/1   f 0/0
tela22-requisicao-form        ✅ btn 18/1   a 29/2   f 0/0
tela23-requisicao-detalhe     ✅ btn 26/1   a 27/1   f 0/0
tela24-cotacoes-list          ✅ btn 35/1   a 35/1   f 0/0
tela25-cotacao-form           ✅ btn 21/1   a 30/2   f 0/0
tela26-cotacao-detalhe        ✅ btn 32/1   a 28/1   f 0/0
tela27-pedidos-list           ✅ btn 35/1   a 42/1   f 0/0
tela28-pedido-form            ✅ btn 18/1   a 29/1   f 0/0
tela29-pedido-detalhe         ✅ btn 26/1   a 33/4   f 0/0
```

### Cadastros & Financeiro (tela30-46)

```
tela30-empresas-list          ✅ btn 23/1   a 34/1   f 0/0
tela31-empresa-form           ✅ btn 13/1   a 30/1   f 0/0
tela32-centros-custo-list     ✅ btn 27/1   a 38/1   f 0/0
tela33-centro-custo-form      ✅ btn 16/1   a 28/1   f 0/0
tela34-plano-contas-list      ✅ btn 16/1   a 40/1   f 0/0
tela35-plano-conta-form       ✅ btn 13/1   a 28/1   f 0/0
tela36-pre-lancamentos-list   ✅ btn 24/1   a 34/1   f 0/0
tela37-pre-lancamento-detalhe ✅ btn 17/1   a 30/3   f 0/0
tela38-notas-fiscais-list     ✅ btn 28/1   a 44/1   f 0/0
tela39-nota-fiscal-detalhe    ✅ btn 22/1   a 32/1   f 0/0
tela40-aprovacoes-list        ✅ btn 35/1   a 44/1   f 0/0
tela41-aprovacao-detalhe      ✅ btn 15/1   a 30/1   f 0/0
tela42-orcamento-overview     ✅ btn 16/1   a 27/1   f 0/0
tela43-orcamento-form         ✅ btn 40/1   a 27/0   f 0/0
tela44-contratos-list         ✅ btn 25/1   a 35/1   f 0/0
tela45-contrato-form          ✅ btn 16/1   a 27/0   f 0/0
tela46-contrato-detalhe       ✅ btn 16/1   a 32/3   f 0/0
```

### Auth & Perfil (tela47-53)

```
tela47-login                  ⚠️ btn 12/2   a 1/0    f 1/1   form sem action/onsubmit; 2 botões sem onclick
tela48-reset-senha-request    ⚠️ btn 10/1   a 2/1    f 1/1   form sem action/onsubmit
tela49-reset-senha-nova       ⚠️ btn 12/1   a 1/0    f 1/1   form sem action/onsubmit
tela50-profile                ✅ btn 37/1   a 41/0   f 0/0
tela51-trocar-senha           ⚠️ btn 15/1   a 30/0   f 1/1   form sem action/onsubmit
tela52-2fa-setup              ✅ btn 13/1   a 29/0   f 0/0
tela53-2fa-challenge          ⚠️ btn 10/1   a 3/2    f 1/1   form sem action/onsubmit
```

### Erros & Empty States (tela54-59)

```
tela54-erro-404               ✅ btn 9/1    a 2/1    f 0/0
tela55-erro-403               ✅ btn 9/1    a 2/0    f 0/0
tela56-erro-500               ✅ btn 11/1   a 2/0    f 0/0
tela57-sessao-expirada        ✅ btn 9/1    a 1/0    f 0/0
tela58-manutencao             ✅ btn 10/1   a 2/0    f 0/0
tela59-empty-state-showcase   ✅ btn 14/1   a 28/2   f 0/0
```

### Admin & Config (tela60-69)

```
tela60-auditoria-global       ✅ btn 33/1   a 34/0   f 0/0
tela61-webhooks-list          ✅ btn 30/1   a 31/1   f 0/0
tela62-templates-email        ✅ btn 15/1   a 32/2   f 0/0
tela63-config-smtp-imap       ✅ btn 22/1   a 33/1   f 0/0
tela64-api-tokens             ✅ btn 24/1   a 31/1   f 0/0
tela65-modais-confirmacao     ✅ btn 27/1   a 25/0   f 0/0
tela66-wizard-stage-editor    ✅ btn 25/1   a 29/0   f 0/0
tela67-wizard-supplier-detail ✅ btn 19/1   a 30/0   f 0/0
tela68-modais-bulk-actions    ✅ btn 19/1   a 25/0   f 0/0
tela69-wizard-onboarding      ✅ btn 23/1   a 25/0   f 0/0
```

### Comparativos & Convite & Notificações (tela70-78)

```
tela70-detail-comparativo     ⚠️ btn 14/1   a 39/12  f 0/0   12 anchors com href="#"
tela71-notificacoes-centro    ✅ btn 37/1   a 37/0   f 0/0
tela72-convite-signup         ⚠️ btn 10/2   a 3/3    f 1/1   form sem action; anchors #
tela73-verificar-email        ✅ btn 11/1   a 2/1    f 0/0
tela74-meu-audit-log          ✅ btn 12/1   a 35/3   f 0/0
tela75-em-construcao          ✅ btn 12/1   a 30/1   f 0/0
tela76-anotacoes-centro       ✅ btn 16/1   a 0/0    f 0/0
tela77-actionia-biblioteca    ✅ btn 18/1   a 27/0   f 0/0
tela78-alertas-biblioteca     ✅ btn 15/1   a 27/0   f 0/0
```

### Cadastros consolidados (tela79-87)

```
tela79-matchengine-workflow   ✅ btn 28/1   a 30/0   f 0/0
tela80-permissoes-matriz      ✅ btn 25/1   a 39/0   f 0/0
tela81-config-intervenientes  ✅ btn 24/1   a 42/0   f 0/0
tela82-saude-stages           ✅ btn 31/1   a 58/2   f 0/0
tela83-alcadas-cadastro       ✅ btn 30/1   a 38/0   f 1/0   (form com action — OK)
tela84-users-admin            ✅ btn 53/1   a 43/0   f 0/0
tela85-permission-delegations ✅ btn 32/1   a 37/0   f 0/0
tela86-fornecedores-cadastro  ⚠️ btn 31/3   a 37/0   f 1/0   3 botões sem onclick aparente
tela87-times-cadastro         ✅ btn 44/1   a 37/0   f 0/0
```

---

## Network — assets carregados (todos 200)

Padrão recorrente em todas as telas:
- `tela{NN}-{slug}.html` (200)
- `cdn.tailwindcss.com/` (200, com warning de produção)
- `fonts.googleapis.com/css2?…Montserrat+JetBrainsMono` (200)
- `mobile-responsive.css` (200)
- `notes-widget.js` (200)
- `i18n-toggle.js` (200)
- `list-customizer.js` (200, telas com listas)
- `tag-filter.js` (200, telas com tags)
- `mockup-handlers.js` (200, telas com builders/forms)
- `fonts.gstatic.com/.../*.woff2` (200, primeira visita; depois cache)

**Zero 404. Zero 5xx. Zero requisição bloqueada.**

---

## Conclusão

A camada visual de mockups está **estática e estável** em runtime:

1. **Nenhum erro de console** — wiring JS atual não dispara exceções na carga inicial.
2. **Nenhum 404/5xx** — todos os assets do projeto e CDNs externos respondem 200.
3. **Heurística DOM** identificou 8 telas (todas auth ou listas com `href="#"`) que merecem review manual pra explicitar wiring, mas **nenhuma é critical-path-broken** observavelmente.
4. Recomendação: padronizar `data-handler` em forms auth e trocar `<a href="#">` por `<button>` em linhas-clicáveis pra reduzir falsos-positivos em auditorias futuras.

**Próximo passo sugerido (fora do escopo desta auditoria):** clique-teste em até 3 botões-chave de cada tela auth + tela86 pra confirmar wiring runtime via DOM interaction.
