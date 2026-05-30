# CONCEPT: Alerts (Alertas Configuráveis)

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Alertas Configuráveis são entidades que definem **quando** o sistema deve avisar **quem**, por **qual canal**, com **qual mensagem**. Substituem notificações hard-coded por uma camada declarativa que opera junto a stages, escalation rules, condições MAILIA e regras de match.

O objetivo é dar ao time de operações controle sobre o ruído do sistema — silenciar o que é barulho, intensificar o que é crítico — sem precisar de deploy.

## 2. Modelo de dados

| Campo               | Tipo         | Obrigatório | Descrição                                                          |
| ------------------- | ------------ | ----------- | ------------------------------------------------------------------ |
| id                  | uuid         | sim         | Identificador único                                                |
| nome                | string       | sim         | Nome do alerta (ex: "NF sem PO há mais de 3 dias")                 |
| severidade          | enum         | sim         | `info` \| `atencao` \| `critico`                                   |
| canais              | enum[]       | sim         | Multi-select: `email` \| `inapp` \| `slack`                        |
| trigger_condition   | text         | sim         | Expressão/condição que dispara o alerta (DSL ou textarea)          |
| mensagem_template   | text         | sim         | Template com variáveis (ex: `{{workflow.nome}} parado há {{h}}h`)  |
| destinatarios_expr  | text         | sim         | Expressão de destinatários (role, owner, lista)                    |
| status              | enum         | sim         | `rascunho` \| `ativo` \| `disparado` \| `arquivado`                |
| owner_id            | uuid         | sim         | Usuário criador                                                    |
| last_fired_at       | datetime     | não         | Última vez que disparou                                            |
| fire_count          | int          | sim         | Contador de disparos (default 0)                                   |
| created_at          | datetime     | sim         | Data de criação                                                    |
| updated_at          | datetime     | sim         | Última atualização                                                 |

## 3. Fluxo do usuário

1. Usuário acessa **Configurações → Alertas** (tela78)
2. Vê lista com filtros por severidade, canal, status
3. Clica **+ Novo Alerta** → escolhe severidade → define canais → escreve condição e template
4. Faz **preview** da mensagem renderizada (com variáveis mock)
5. Salva como rascunho ou ativa
6. Vincula o alerta a um workflow na aba "Alertas" da tela10
7. Alerta também pode ser disparado por: stages (entrada/saída), escalation rules (SLA estourado), condições MAILIA

## 4. Regras de negócio

- Alerta `critico` exige pelo menos 2 canais distintos.
- Throttling: mesmo alerta + mesmo contexto não dispara mais de 1x por hora (configurável).
- Inativar alerta em uso emite warning, mas não bloqueia.
- Variáveis do template validadas no save (não pode referenciar campo inexistente).
- `fire_count` e `last_fired_at` zerados ao mudar a condição (evita histórico inconsistente).
- Arquivar = soft delete; histórico de disparos preservado.

## 5. Gaps no front atual

- `AlertsList.jsx` e `AlertEdit.jsx` existem como **DÚVIDA** — sem mockup até agora.
- Falta: tabela `alerts`, endpoints CRUD, engine de avaliação de `trigger_condition`.
- Falta: integração com workflow editor (aba "Alertas" da tela10).
- Falta: histórico/log de disparos por alerta.
- Esforço estimado: **Alto** (~2 sprints — engine de condições é a parte complexa).

## 6. Telas relacionadas (mockup)

- **tela78** (novo) — lista + edição de alertas
- **tela10** — aba "Alertas" do workflow editor
- **tela09** — escalation rules (consumidor de alertas)

## 7. Decisões tomadas / Pendências

**Decisões:**
- 3 severidades fixas (info/atenção/crítico).
- Canais multi-select (email/inapp/slack) no v1; WhatsApp e SMS fora do escopo.
- Throttling default = 1h, configurável por alerta.

**Pendências:**
- DSL para `trigger_condition` vs textarea livre interpretada por IA?
- Quem consome `destinatarios_expr` — formato exato (JSON path, JS expr, etc.)?
- Integração Slack: app oficial DMSYS ou webhook genérico no v1? → **decidir antes da implementação**

## 8. Prioridade

**Médio** — depende de definição da DSL de condições. Implementar em paralelo com [[CONCEPT-AGENTS]] já que ambos consomem o workflow editor (tela10).
