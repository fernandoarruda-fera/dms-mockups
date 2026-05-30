# CONCEPT: AI Generation (Geração de Entidades via IA)

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Definir um **contrato genérico e unificado** para o fluxo de "gerar entidade via IA" que aparece em múltiplas features do sistema (procedures, escalation rules, dashboards, match rules, etc.).

Em vez de cada tela implementar seu próprio fluxo IA, padronizamos: mesma UX, mesma camada de validação, mesmo audit log, mesmo loop de feedback. Resultado: usuários reconhecem o padrão em qualquer contexto e nós economizamos esforço de implementação.

## 2. Modelo de dados

### `ai_generation_logs`

| Campo               | Tipo       | Obrigatório | Descrição                                                |
| ------------------- | ---------- | ----------- | -------------------------------------------------------- |
| id                  | uuid       | sim         | Identificador único                                      |
| entity_type         | string     | sim         | Tipo gerado (ex: `procedure`, `dashboard`, `match_rule`) |
| prompt              | text       | sim         | Texto livre do usuário                                   |
| ai_output_raw       | json       | sim         | Resposta bruta do LLM                                    |
| ai_output_parsed    | json       | sim         | Resposta estruturada pós-parser                          |
| accepted_fields     | string[]   | não         | Lista de campos que o usuário aceitou                    |
| rejected_fields     | string[]   | não         | Lista de campos rejeitados                               |
| edit_diff           | json       | não         | Diff entre output_parsed e estado final aplicado         |
| rejection_reason    | text       | não         | Motivo (se rejeitou geração inteira)                     |
| applied_entity_id   | uuid       | não         | ID da entidade criada/atualizada (se aplicou)            |
| user_id             | uuid       | sim         | Quem rodou                                               |
| created_at          | datetime   | sim         | Timestamp                                                |
| latency_ms          | int        | sim         | Tempo de geração                                         |
| model               | string     | sim         | Modelo LLM usado                                         |

## 3. Fluxo do usuário (6 passos padronizados)

Todo botão **"✨ Gerar via IA"** segue exatamente esta sequência:

1. **Descrever** — usuário abre painel com textarea livre em linguagem natural.
   *Ex: "criar dashboard com 4 cards: total NF mês, % atrasadas, top 5 fornecedores, ticket médio".*
2. **Gerar** — IA processa, retorna proposta estruturada (entidade pré-preenchida).
3. **Aprovar** — usuário vê preview lado-a-lado (state atual vs. proposto) com checkboxes campo a campo. Campos novos que não existem no front recebem flag **"novo · revisar"**.
4. **Editar (opcional)** — antes de aplicar, usuário pode ajustar valores manualmente. Edições registradas no `edit_diff`.
5. **Aplicar** — confirmar cria/atualiza entidade. Mostra confirmação com link "ver auditoria".
6. **Feedback** — se rejeitar a geração inteira, modal pede **motivo** (opcional mas incentivado). Esse motivo + prompt original alimentam fine-tuning futuro.

## 4. Regras de negócio

- **Preview obrigatório** — nunca aplicar direto sem usuário ver e confirmar.
- **Diff visual** — campos modificados/novos em destaque (cor/badge).
- **Campos "novo · revisar"** — qualquer campo que o LLM gerou mas não existe na entidade hoje deve ser flagado como decisão pendente do usuário (ele pode aceitar/rejeitar isso).
- **Auditoria total** — toda geração (mesmo rejeitada) vira linha em `ai_generation_logs`.
- **Idempotência** — gerar 2x com mesmo prompt **não deve** criar 2 entidades; segunda chamada exige confirmação explícita.
- **Rate limit** — máx N gerações/min por usuário (anti-abuso de tokens).
- **Fallback graceful** — se LLM falha/timeouts, mostrar erro claro com link "tentar de novo" + opção "criar manualmente".
- **Privacidade** — prompt e output podem conter dados sensíveis; respeitar política de retenção do tenant.

## 5. Gaps no front atual

- **Camada de integração com LLM** (cliente, retry, parsing) — inexistente.
- **Parser de output estruturado** por `entity_type` — inexistente.
- **Componente reutilizável de preview com diff** (checkboxes por campo) — inexistente.
- **Modal padrão "Gerar via IA"** + textarea — inexistente.
- **Audit log + tela de consulta** — inexistente.
- **Loop de feedback** (capturar motivo de rejeição) — inexistente.
- Esforço estimado: **Alto** (~3 sprints — componente base + parsers específicos por entity_type).

## 6. Telas relacionadas (mockup)

Aplicado nas features com botão "✨ Gerar via IA":

- **tela08** — procedures (geração)
- **tela09** — escalation rules
- **tela12** — dashboards (geração de cards)
- **tela13** — dashboards (variante)
- **tela79** — match rules ([[CONCEPT-MATCH-ENGINE]])

Componente base reutilizado em todas.

## 7. Decisões tomadas / Pendências

**Decisões:**
- Fluxo fixo de 6 passos. Nenhuma tela pode "pular" o passo de preview.
- Audit log único para todas as gerações (entity_type discrimina origem).
- Feedback de rejeição é opcional pro usuário mas obrigatório como funcionalidade.

**Pendências:**
- Modelo LLM padrão — interno (auto-hospedado) vs. API externa? → ver alinhamento com [[CONCEPT-MATCH-ENGINE]].
- Suporte a streaming na geração (mostrar output token a token) — v1 ou v2?
- Permitir templates de prompt salvos? → considerar junto com [[CONCEPT-SAVED-FILTERS]].
- Quem paga pelos tokens — bilhetagem por tenant ou subsidiada?

## 8. Prioridade

**Alto** — é fundação para várias features. Implementar **componente base + audit log primeiro**, depois ir habilitando feature a feature (tela08 e tela12 são bons pilotos por terem demanda real).
