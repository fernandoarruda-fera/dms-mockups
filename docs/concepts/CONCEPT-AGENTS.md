# CONCEPT: Agents (Agentes Inteligentes)

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Agentes Inteligentes são entidades configuráveis do sistema responsáveis por executar tarefas autônomas ou semi-autônomas dentro de workflows. Substituem/complementam regras estáticas com lógica baseada em IA, validações programadas, roteamento dinâmico e notificações contextuais.

O objetivo é centralizar a configuração desses "executores" para que workflows possam compô-los sem código, permitindo que o time de operações crie automações complexas de forma declarativa.

## 2. Modelo de dados

| Campo            | Tipo         | Obrigatório | Descrição                                                              |
| ---------------- | ------------ | ----------- | ---------------------------------------------------------------------- |
| id               | uuid         | sim         | Identificador único                                                    |
| nome             | string       | sim         | Nome do agente (ex: "Validador NF Fiscal")                             |
| tipo             | enum         | sim         | `actionai` \| `validacao` \| `roteamento` \| `notificacao`             |
| descricao        | text         | não         | Descrição livre do propósito                                           |
| skills           | string[]     | não         | Tags/chips de capacidades (ex: "OCR", "comparação fiscal", "cálculo")  |
| config           | json         | sim         | Configuração específica do tipo (ver abaixo)                           |
| status           | enum         | sim         | `rascunho` \| `ativo` \| `em_uso` \| `inativo`                         |
| owner_id         | uuid         | sim         | Usuário que criou                                                      |
| created_at       | datetime     | sim         | Data de criação                                                        |
| updated_at       | datetime     | sim         | Última atualização                                                     |

### Config por tipo

- **ActionAI:** `{ prompt_template, model, max_tokens, tools[] }`
- **Validação:** `{ rules[], on_fail: 'block' | 'warn', message_template }`
- **Roteamento:** `{ conditions[], targets[], fallback }`
- **Notificação:** `{ channels[], template_id, recipients_expr }`

## 3. Fluxo do usuário

1. Usuário acessa **Configurações → Agentes** (tela77)
2. Vê lista de agentes com filtros por tipo e status
3. Clica em **+ Novo Agente** → seleciona tipo → preenche nome, descrição, skills
4. Configura parâmetros específicos do tipo (form dinâmico)
5. Salva como **rascunho** ou ativa direto
6. Vincula o agente a um workflow pela aba "Agentes" da tela10 (workflow editor)
7. Monitora uso/execuções via lista (coluna "Em uso por")

## 4. Regras de negócio

- Agente com status `em_uso` não pode ser excluído — apenas inativado.
- Inativar um agente em uso emite alerta nos workflows que o utilizam.
- Skills (chips) são livres mas sugeridas de um catálogo compartilhado.
- ActionAI exige prompt template validado antes da ativação.
- Roteamento exige pelo menos 1 condition + 1 target.
- Auditoria: toda mudança de config registra autor + diff.

## 5. Gaps no front atual

- `AgentsList.jsx` e `AgentEdit.jsx` já existem no React **mas marcados como DÚVIDA** — sem mockup nem spec até agora.
- Falta: tabela `agents`, endpoints CRUD, form dinâmico por tipo.
- Falta: integração com workflow editor (aba "Agentes" da tela10).
- Esforço estimado: **Alto** (~2 sprints — entidade nova com 4 sub-tipos + integração).

## 6. Telas relacionadas (mockup)

- **tela77** (novo) — lista + edição de agentes
- **tela10** — aba "Agentes" do workflow editor (vinculação)

## 7. Decisões tomadas / Pendências

**Decisões:**
- 4 tipos fixos no v1 (ActionAI, Validação, Roteamento, Notificação).
- Skills como tags livres (não rígido).
- Status `em_uso` calculado dinamicamente (não persistido).

**Pendências:**
- Catálogo sugerido de skills — quem cura?
- Versionamento de config (rollback?) — fora do v1.
- Templates/agentes pré-configurados do sistema — listar os 5-10 mais úteis.

## 8. Prioridade

**Médio** — entidade já existe como placeholder no front, mas não bloqueia operação. Implementar depois que MATCH-ENGINE e WORKFLOW-OBLIGATORY estiverem prontos (agentes serão consumidos por ambos).
