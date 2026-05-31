# CONCEPT: Função Responsável por Stage (Stage-Role Assignment)

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: ciclo de validação mockups DMSYS V2 — fecha o triângulo Workflow + Permission + Scope
> Relacionado:
> - [[CONCEPT-PERMISSIONS]] — define o catálogo de funções
> - [[CONCEPT-USER-SCOPE-INTERVENIENTES]] — filtra usuários por entidade
> - [[CONCEPT-WORKFLOW-OBLIGATORY]] — todo documento tem workflow, todo workflow tem stages
> - [[CONCEPT-ACTIONIA]] — ActionIA pode ocupar o papel de "função" em stages automatizáveis
> - [[CONCEPT-ALERT]] — alertas dependem de saber quem é o responsável
> - [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] — **validação obrigatória "1 stage = 1 dono" nos 6 eventos de trigger**
> - [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] — `scope_filter` referencia critérios habilitados no módulo do workflow

## 1. Objetivo

Cada stage de um workflow deve ter uma **função responsável** declarada explicitamente. Quando o stage é acionado, o sistema sabe automaticamente quem ele deve notificar/atribuir o card, combinando:

```
stage.função_responsável
  → busca usuários com essa função      ([[CONCEPT-PERMISSIONS]])
  → filtra por scope da entidade        ([[CONCEPT-USER-SCOPE-INTERVENIENTES]])
  → cards/notificações caem nesses users
```

Sem isso, todo workflow precisaria nomear pessoas específicas (frágil — pessoas mudam de função, saem da empresa) ou todo mundo recebe tudo (inviável em produção).

## 2. Modelo de dados

### `workflow_stages` (estende a tabela existente)

| Campo                       | Tipo      | Obrigatório | Descrição                                              |
| --------------------------- | --------- | ----------- | ------------------------------------------------------ |
| id                          | uuid      | sim         |                                                        |
| workflow_id                 | uuid      | sim         |                                                        |
| ordem                       | int       | sim         |                                                        |
| nome                        | string    | sim         |                                                        |
| **funcao_responsavel_id**   | uuid      | **sim**     | **FK para `roles` (função primária — quem age)**       |
| **funcoes_notificadas**     | jsonb     | não         | **Lista de role_ids (acompanha, não age)**             |
| **scope_filter**            | enum      | sim         | `cost_center` · `vendor` · `contract` · `none`         |
| **escalation_role_id**      | uuid      | não         | Função superior se não houver usuário com função primária |
| sla_horas                   | int       | não         | Prazo para o stage                                     |
| can_be_automated            | bool      | sim         | Se ActionIA pode substituir humano neste stage         |

`funcao_responsavel_id` é NOT NULL — bloqueia criação de workflow com stage sem função.

## 3. Fluxo

### 3.1 Configuração do workflow (admin)

1. Admin edita workflow (tela08 — Stage Trigger)
2. Para cada stage, novo campo obrigatório **"Função responsável"** (select com roles do [[CONCEPT-PERMISSIONS]])
3. Novo campo opcional **"Funções notificadas"** (multi-select)
4. Novo campo obrigatório **"Filtro de scope"** (qual entidade do documento usar pra filtrar — CC, vendor, contrato, ou nenhum)
5. Novo campo opcional **"Função de escalação"** (fallback se não houver usuário matching)
6. Preview lateral: "Este stage hoje afetaria N usuários" (calcula com base no scope)

### 3.2 Execução do stage (runtime)

1. Stage é acionado (manual ou por trigger de workflow)
2. Sistema lê `funcao_responsavel_id` do stage
3. Busca usuários com essa role ativa (via `user_roles`)
4. **Filtra por scope:**
   - Se `scope_filter = cost_center`: usuário precisa ter o CC do documento em `user_scope`
   - Se `scope_filter = vendor`: idem para fornecedor
   - Se `scope_filter = contract`: idem para contrato
   - Se `scope_filter = none`: não filtra (raro, só pra stages globais)
5. Cards aparecem no cockpit dos usuários filtrados
6. Funções notificadas recebem notificação (não card de ação)
7. Stage avança quando qualquer usuário age (primeiro pega)

### 3.3 Fluxo de escalação

1. SLA do stage estourou e ninguém agiu
2. Se `escalation_role_id` definido: re-distribui para usuários com essa função
3. Se não: alerta vai para [[CONCEPT-ALERT]] com tipo "stage sem responsável"
4. Card vai para Gestão de Profile como órfão

## 4. Regras de negócio

1. **`funcao_responsavel_id` é obrigatório.** Workflow não pode ser ativado com stages sem função — validação no save.
2. **1 função primária, N notificadas.** Decisão para evitar conflito de propriedade: 1 cadeira age, N acompanham.
3. **Função sem usuários** (criada mas ninguém tem) = stage trava → escalação OU alerta.
4. **Usuário com função mas sem scope** = não recebe (não vira erro, vira filtro) — admin pode ver no preview da tela08.
5. **ActionIA substitui usuário humano** se `can_be_automated = true` e existir ActionIA configurada para o tipo de ação. Quando IA age, registra no histórico como "agente: nome-da-actionIA" ao invés de user_id.
6. **Mudança de função do stage** em workflow ativo: cards já distribuídos permanecem; novos seguem nova regra.
7. **Auditoria.** Toda execução registra: stage_id, função_resolvida, users_elegíveis, user_que_agiu.

## 5. Edge cases

- **Workflow novo com função inexistente**: select pré-popula apenas funções ativas; impede salvar com FK quebrada
- **Função deletada após criação do workflow**: workflow vira "irregular" — alerta de governança, bloqueia novos disparos
- **Stage com 0 usuários elegíveis**: escala ou vira órfão (sem silent fail)
- **Múltiplas entidades no documento** (NF com 2 CCs rateados): match se usuário tem **pelo menos um** dos CCs
- **Documento sem entidade do tipo do filtro** (NF sem CC quando `scope_filter = cost_center`): vira órfão

## 6. Gaps front

- **tela08 (Stage Trigger)** precisa ganhar 4 campos novos:
  - "Função responsável" (select obrigatório)
  - "Funções notificadas" (multi-select)
  - "Filtro de scope" (radio: CC / vendor / contrato / nenhum)
  - "Função de escalação" (select opcional)
  - Preview "N usuários afetados" no rodapé
- **tela11 (Cockpit)** já consome distribuição de cards — backend precisa adaptar query
- **Auditoria de workflow** (futuro): tela mostrando "este stage acionou X vezes, foi resolvido por Y users"

## 7. Telas relacionadas

- **tela08** — Stage Trigger (ajuste obrigatório)
- **tela80** — Permissions (referência cruzada — admin que cria função pode ver onde ela é usada)
- **tela50 aba Intervenientes** — preview "Você é responsável por N stages em M workflows"
- **tela11** — Cockpit consome
- **Telas de workflow ativo** (tela07 etc.) — exibem função responsável atual no detalhe do stage

## 8. Decisões

- ✅ Função é por stage, não por workflow inteiro (granularidade fina é o ponto)
- ✅ 1 primária + N notificadas (não múltiplas primárias) — evita conflito de propriedade
- ✅ Scope filter por entidade única (não combinação AND/OR) no MVP — suficiente e simples
- ✅ Escalação por função (não por usuário específico) — escala consistente com modelo
- ✅ ActionIA é "função virtual" que pode ocupar o slot — não precisa modelo paralelo
- ❌ Não suportar "lista de usuários específicos" no stage — quebra abstração de função
- ❌ Não suportar atribuição aleatória/round-robin entre elegíveis no MVP — primeiro a pegar resolve

## 8.1 Validação "1 stage = 1 dono"

Regra absoluta complementar: quando um stage é acionado, ele DEVE cair pra exatamente **1 usuário** — nem zero (órfão), nem 2+ (conflito).

Esta regra é validada em 6 eventos de trigger (criação/publicação de stage, alteração de intervenientes, criação/bloqueio de user, desativação de Role, remoção de entidade de scope) e tem fallback automático via workflows default que geram card to-do pro gestor da cadeira.

Detalhamento completo, modelo `stage_health_issue`, dashboard tela82 e lista dos workflows default: **[[CONCEPT-STAGE-OWNERSHIP-VALIDATION]]**.

Nota sobre a regra 7 da seção 4 ("primeiro a pegar resolve"): aquela regra trata distribuição **dentro de um pool de N elegíveis legítimos**; a validação 1-dono trata da **definição** do pool — deve ter exatamente 1 elegível antes de qualquer "pegar".

## 9. Prioridade

**CRÍTICO.** É o conector entre Workflow ([[CONCEPT-WORKFLOW-OBLIGATORY]]), Permission ([[CONCEPT-PERMISSIONS]]) e Scope ([[CONCEPT-USER-SCOPE-INTERVENIENTES]]). Sem este concept, os outros três não se conversam — cockpit não consegue distribuir cards.
