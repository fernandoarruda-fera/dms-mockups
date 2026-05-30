# CONCEPT: MatchEngine

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

MatchEngine é o componente responsável por vincular **automaticamente** um input (email recebido, documento, evento) a **exatamente 1 workflow** já existente no sistema. Garante a regra de [[CONCEPT-WORKFLOW-OBLIGATORY]] na entrada de dados externos.

O resultado do match deve ser **único e determinístico**: ou casa com 1 workflow (e prossegue), ou não casa com nenhum (e vira órfão), ou casa com mais de 1 (e isso é tratado como **erro de configuração** que precisa ser resolvido pelo operador).

## 2. Modelo de dados

### 2.1 Regra de match (`match_rules`)

| Campo            | Tipo       | Obrigatório | Descrição                                                  |
| ---------------- | ---------- | ----------- | ---------------------------------------------------------- |
| id               | uuid       | sim         | Identificador único                                        |
| workflow_id      | uuid       | sim         | Workflow ao qual essa regra aponta                         |
| modo             | enum       | sim         | `manual` \| `ia_assistida` \| `ia_validacao`               |
| input_type       | enum       | sim         | `email` \| `documento` \| `evento_api`                     |
| mapping          | json       | sim         | Campos do input → campos do workflow                       |
| tags             | string[]   | não         | Tags que ativam a regra (combinação AND)                   |
| confidence_min   | float      | não         | Threshold mínimo (modos IA)                                |
| status           | enum       | sim         | `rascunho` \| `ativo` \| `inativo`                         |
| created_by       | uuid       | sim         | Autor                                                      |

### 2.2 Log de execução (`match_executions`)

| Campo            | Tipo       | Descrição                                                 |
| ---------------- | ---------- | --------------------------------------------------------- |
| id               | uuid       | Identificador                                             |
| input_payload    | json       | Snapshot do input recebido                                |
| matched_count    | int        | 0 = órfão, 1 = ok, >1 = ambiguidade (erro)                |
| matched_workflow | uuid       | Workflow vinculado (nullable)                             |
| confidence       | float      | Score (se IA)                                             |
| action_taken     | enum       | `vinculado` \| `orfao` \| `bloqueado_ambiguidade`         |
| executed_at      | datetime   | Timestamp                                                 |

## 3. Fluxo do usuário

### 3.1 Configuração de regra (tela79)

1. Usuário acessa **Configurações → Regras de Match** (tela79)
2. Clica **+ Nova Regra** → escolhe workflow alvo + input type
3. Seleciona um dos **3 modos**:
   - **Manual:** aponta campos do input → campos do workflow (drag&drop ou form)
   - **IA Assistida:** IA propõe mapeamento, usuário aprova/edita campo a campo
   - **IA + Validação:** IA mapeia + valida que a regra resulta em match **único** (testa contra base de workflows existentes)
4. Define tags que ativam a regra (opcional)
5. Salva como rascunho ou ativa

### 3.2 Execução (runtime)

1. Input chega (email novo, NF parseada, webhook)
2. MatchEngine roda todas as regras ativas compatíveis com `input_type`
3. Conta workflows que casam:
   - **= 1:** vincula input ao workflow, dispara ação (continuar workflow ativo / iniciar novo)
   - **= 0:** marca input como **órfão** (ver [[CONCEPT-WORKFLOW-OBLIGATORY]])
   - **> 1:** **bloqueio**, dispara alerta crítico ("ambiguidade de match"), input fica em fila de resolução manual

## 4. Regras de negócio

- **Unicidade obrigatória:** se uma regra ativa casa com >1 workflow → bloqueio + alerta. NUNCA escolhe arbitrariamente.
- **Modo `ia_validacao`** roda simulação no save: testa contra workflows existentes e bloqueia salvamento se gerar ambiguidade detectável.
- **Tags são combinadas em AND** (se regra tem tags A+B, todas devem estar presentes no input).
- **Confidence threshold** (modos IA): match abaixo do mínimo = trata como 0 matches (vira órfão).
- **Auditoria total:** toda execução vira linha em `match_executions` com snapshot do input.
- **Resolução manual de ambiguidade** registra qual workflow foi escolhido + motivo → vira input pra retreino da regra.

## 5. Gaps no front atual

- **Tela de configuração de regras** — inexistente (tela79 é nova).
- **Integração com LLM** para modos `ia_assistida` e `ia_validacao` — inexistente.
- **Validador de unicidade** que simula match contra base — inexistente.
- **Fila de resolução manual** de ambiguidades — inexistente.
- **Hook na ingestão de emails/NFs** que chama o MatchEngine — parcial (precisa refator).
- Esforço estimado: **Muito alto** (~4 sprints — IA + simulador + ingestão).

## 6. Telas relacionadas (mockup)

- **tela79** (novo) — lista + edição de regras de match
- **tela11** — destino: NFs órfãs aparecem aqui
- **tela10** — workflow editor (regras de match são associadas a workflows)

## 7. Decisões tomadas / Pendências

**Decisões:**
- 3 modos fixos (manual / IA assistida / IA + validação).
- Ambiguidade é **sempre erro** — nunca seleção heurística.
- Confidence default = 0.85 nos modos IA (configurável por regra).

**Pendências:**
- Modelo LLM usado — interno ou API externa (Anthropic, OpenAI)? → afeta custo e privacidade.
- Suporte a regex/lookups customizados no modo manual?
- Estratégia para emails com múltiplos anexos (1 regra por anexo ou 1 por email)?
- Permitir override manual com aprovação após confidence baixo (vs. ir direto pra órfão)?

## 8. Prioridade

**Alto** — depende de [[CONCEPT-WORKFLOW-OBLIGATORY]] estar implementado. É o que viabiliza ingestão automática mantendo a regra de workflow único. Sem MatchEngine, todo input externo vira órfão e precisa resolução manual = inviável em volume.
