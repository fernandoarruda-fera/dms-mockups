# CONCEPT: Workflow Obrigatório por Compra

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Toda compra registrada no DMSYS V2 **DEVE** estar vinculada a um workflow específico. Compras sem workflow são consideradas **irregulares** — operacionalmente, não poderiam ter sido feitas dentro do processo padrão.

O objetivo é fechar a brecha onde compras "soltas" entram no sistema (NFs recebidas por email, lançamentos manuais, integrações legadas) sem rastro de processo, impossibilitando auditoria de governança e cálculo correto de SLA/escalation.

Esta é uma **regra de negócio crítica** que afeta toda a cadeia: Requisição → Cotação → Pedido → Nota Fiscal.

## 2. Modelo de dados

Não introduz entidade nova. Adiciona/reforça campos existentes:

| Tabela          | Campo            | Mudança                                              |
| --------------- | ---------------- | ---------------------------------------------------- |
| `requisicoes`   | `workflow_id`    | **NOT NULL** (era nullable)                          |
| `cotacoes`      | `workflow_id`    | **NOT NULL**                                         |
| `pedidos`       | `workflow_id`    | **NOT NULL**                                         |
| `notas_fiscais` | `workflow_id`    | **NOT NULL** + flag `is_orphan` se chegou sem match  |
| `workflows`     | `fornecedor_id`  | indexado — reuso restrito a mesmo fornecedor         |
| `workflows`     | `contrato_id`    | indexado — reuso restrito a mesmo contrato           |

Backfill: registros legados sem workflow recebem `workflow_id = workflow_orfao_default_id` e flag `is_orphan = true`.

## 3. Fluxo do usuário

### 3.1 Fluxo nominal (compra com workflow)

1. Usuário inicia compra → sistema exige seleção de workflow ativo
2. Lista de workflows filtrada por fornecedor/contrato da compra
3. Compra prossegue normalmente

### 3.2 Fluxo on-the-fly (workflow não existe)

1. Usuário inicia compra → não acha workflow adequado
2. Clica em **"Criar workflow específico pra este caso"**
3. Wizard cria workflow vinculado ao contexto da compra (pré-preenche fornecedor, contrato, etc.)
4. Workflow novo é criado e vinculado à compra na mesma transação

### 3.3 Detecção de órfão (compra chegou sem workflow)

1. NF/pedido chega via email/integração sem match de workflow
2. Sistema marca `is_orphan = true` e exibe badge vermelho **"sem workflow"** na lista (tela11)
3. Operador vê em destaque, clica para resolver: **vincular a workflow existente** ou **criar on-the-fly**
4. Enquanto órfão, compra não avança no fluxo de aprovação

## 4. Regras de negócio

- **Bloqueio:** nenhuma compra avança de stage sem `workflow_id` válido.
- **Reuso restrito:** um workflow só pode ser reaproveitado em compras do **mesmo fornecedor** OU vinculadas ao **mesmo contrato** (qualquer um dos dois).
- **Tentativa de reuso cruzado** (fornecedor/contrato diferente) → erro de validação + sugestão de criar workflow novo.
- **Compra órfã** = bug ou irregularidade. Sistema gera alerta crítico para gestor responsável.
- **Audit log** registra: quem criou o workflow, quem vinculou à compra, se foi on-the-fly.
- **Workflow específico criado on-the-fly** fica com flag `created_inline = true` para análise de processo (alto volume desses pode indicar processo mal modelado).

## 5. Gaps no front atual

- **Validação de obrigatoriedade** em forms de Requisição/Cotação/Pedido/NF — inexistente.
- **Badge "sem workflow"** nas listas — inexistente.
- **Wizard de criação on-the-fly** a partir do contexto — inexistente.
- **Filtro "Órfãs"** nas listas de NF/pedido — inexistente.
- **Endpoint de detecção de órfãos** + job periódico — inexistente.
- Esforço estimado: **Alto** (~3 sprints — toca 5 telas + backfill + validações em cascata).

## 6. Telas relacionadas (mockup)

- **tela11** (refatorada — em andamento Lote C T3) — lista NF com badge órfão + ação de vinculação
- **tela01, 03, 04, 06** — listas de requisição/cotação/pedido com flag órfão
- **tela10** — workflow editor (origem dos workflows)
- Telas de criação de Req/Cot/Pedido/NF — adicionar seletor obrigatório de workflow

## 7. Decisões tomadas / Pendências

**Decisões:**
- Workflow é **obrigatório**, não opcional. Sem fallback "compra sem processo".
- Reuso restrito a mesmo fornecedor **ou** mesmo contrato (OR, não AND).
- Compra órfã é exceção visível, não estado normal.
- Backfill: legados ficam vinculados a `workflow_orfao_default` para não quebrar histórico.

**Pendências:**
- Quem aprova workflow criado on-the-fly? Auto-aprovado ou exige revisão?
- Limite de quantidade de workflows on-the-fly por usuário/mês (anti-abuso)?
- Migração dos dados existentes — plano de comunicação com clientes.

## 8. Prioridade

**🚨 CRÍTICO** — é a regra que mais impacta governança. Bloqueia outras features (SLA, escalation, dashboards de compliance) que assumem workflow vinculado. Implementar **antes** de [[CONCEPT-MATCH-ENGINE]] e [[CONCEPT-ACTIONIA]].
