# CONCEPT: User Scope (Intervenientes do Usuário)

> Status: 📝 Proposta
> Última atualização: 2026-05-31
> Origem: ciclo de validação mockups DMSYS V2 — sem este conceito o cockpit não consegue distribuir cards corretamente
> Relacionado:
> - [[CONCEPT-PERMISSIONS]] — define O QUE (este define EM QUAIS entidades)
> - [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] — distribuição de cards = função × scope
> - [[CONCEPT-USER-PROFILE-PREFERENCES]] — outra dimensão do profile (UI prefs)
> - [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] — **fonte de quais critérios fazem parte do scope (dinâmico, não hardcoded)**
> - [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] — alterar scope dispara revalidação dos stages

## 1. Objetivo

Definir, para cada usuário, **sobre quais entidades específicas ele atua**: centros de custo (CCs), fornecedores, contratos, empresas. Esse "escopo de intervenientes" complementa a função (Permission) e é o que permite ao cockpit distribuir cards apenas para quem realmente cuida daquele documento.

Dois eixos ortogonais:

| Eixo                                 | Resposta                                  |
| ------------------------------------ | ----------------------------------------- |
| [[CONCEPT-PERMISSIONS]] (função)     | "O que este usuário pode fazer?"          |
| **User Scope (este concept)**        | "Em quais entidades ele atua?"            |

Sem esse conceito, qualquer usuário com função "Aprovador" receberia cards de **todas** as áreas — inviável em uma operação real com dezenas de CCs e centenas de fornecedores.

## 2. Modelo de dados

### `user_scope`

| Campo          | Tipo     | Obrigatório | Descrição                                                            |
| -------------- | -------- | ----------- | -------------------------------------------------------------------- |
| id             | uuid     | sim         |                                                                      |
| user_id        | uuid     | sim         | Usuário                                                              |
| entity_type    | enum     | sim         | `cost_center` · `vendor` · `contract` · `company` · `sop` · `procedure` |
| entity_id      | uuid     | sim         | FK polimórfica para a entidade                                       |
| role_context   | string   | não         | Opcional — papel específico ("gestor", "backup", "viewer")           |
| created_at     | datetime | sim         |                                                                      |
| created_by     | uuid     | sim         | Quem atribuiu                                                        |

Constraint: `UNIQUE(user_id, entity_type, entity_id, role_context)`.

**Extensível e dinâmico por módulo.** `entity_type` não é mais um enum hardcoded — vem do catálogo de critérios de [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]]. Cada módulo (Compras, Jurídico, etc.) define quais critérios fazem parte do seu scope. O front renderiza as tabs da aba Intervenientes dinamicamente com base na config do módulo, sem código específico por critério.

### Exemplo: scope JSON varia por módulo

```json
// Usuário no módulo Compras (config: CC + Vendor + Contract + Tag)
{
  "user_id": "u-123",
  "module": "compras",
  "scope": {
    "cost_center": ["cc-sp", "cc-rj"],
    "vendor": ["v-acme", "v-globex"],
    "contract": ["k-2025-001"],
    "tag": ["alto-risco", "fiscal"]
  }
}

// Mesmo usuário no módulo Jurídico (config: Empresa + SOP)
{
  "user_id": "u-123",
  "module": "juridico",
  "scope": {
    "company": ["empresa-x"],
    "sop": ["sop-contencioso"]
  }
}
```

O backend continua armazenando linha-a-linha em `user_scope`; o JSON acima é só a forma agregada de leitura por módulo.

## 3. Fluxo do usuário

### 3.1 Configuração (admin ou Gestão de Profile na tela50)

1. Abre profile de um usuário → aba **"Intervenientes"** (a criar)
2. Tabs internas **dinâmicas** — vêm de [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] do módulo ativo. Ex: módulo Compras pode mostrar **CCs · Fornecedores · Contratos · Empresas · Tags**; módulo Jurídico pode mostrar **Empresas · SOPs**.
3. Em cada tab, multi-select da entidade + botão "Adicionar"
4. Lista mostra entidades já atribuídas + botão remover
5. Salvar persiste delta → dispara [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] (revalidação dos stages impactados)

### 3.2 Edição em lote (admin)

- Bulk action na lista de usuários: "Atribuir CC X a estes 10 usuários"
- Útil em onboarding de nova área

### 3.3 Consumo automático (cockpit)

Quando o sistema precisa decidir "quem recebe este card":

1. Stage do workflow tem **função responsável** (ver [[CONCEPT-STAGE-ROLE-ASSIGNMENT]])
2. Busca usuários com essa função (via [[CONCEPT-PERMISSIONS]])
3. **Filtra** por scope: usuário deve ter a entidade do documento (CC, fornecedor, contrato) atribuída
4. Cards/notificações vão apenas para o subconjunto filtrado

## 4. Regras de negócio

1. **Usuário sem scope ≠ recebe tudo.** Sem scope = recebe **nada**. Proteção contra esquecimento de configuração no onboarding (decisão de design — privilégio mínimo).
2. **Exceção: Admin Geral e Gestão de Profile.** Por design recebem órfãos e podem ver tudo, contornando o scope.
3. **Match por hierarquia.** Se entidade tem pai (ex: CC raiz com filhos), atribuir ao pai expande implicitamente para os filhos. Indicado visualmente como "herdado".
4. **Auditoria obrigatória.** Toda alteração de scope é logada (created_by + timestamp) — afeta quem vê dados financeiros.
5. **Scope não substitui permissão.** Mesmo com scope no CC X, sem permissão `nfs.aprovar` o usuário não aprova nada.
6. **Remoção de scope não retira histórico.** Cards já distribuídos permanecem; novos cards param de chegar.

## 5. Edge cases

- **Usuário com scope órfão** (entidade deletada): scope é soft-removed, alerta no profile
- **Documento sem entidade atribuída** (NF chega sem CC reconhecido): cai pra Gestão de Profile como órfão
- **Vendor compartilhado entre vários usuários**: todos recebem o card (e o cockpit dedupe quando alguém "pega")
- **Mudança de área** (usuário troca de CC): scope antigo pode ser arquivado, novo atribuído

## 6. Gaps front

- **Nenhum componente existente** — conceito é novo no produto
- Aba "Intervenientes" na **tela50** precisa ser criada do zero
- Backend precisa expor endpoint `GET /users/:id/scope` e `PUT /users/:id/scope/:entity_type`

## 7. Telas relacionadas

- **tela50** (existente) — adicionar aba "Intervenientes"
- **tela80** (nova, [[CONCEPT-PERMISSIONS]]) — atalho lateral "Editar intervenientes deste usuário"
- **tela11** (Cockpit) — leitura do scope para distribuir cards
- **tela08** (Stage Trigger) — preview "Esta config + função X afeta N usuários"

## 8. Seleção em lote + regras automáticas

**Problema.** Usuários com scope grande (35 de 80 fornecedores, 12 de 30 CCs) inviabilizam autocomplete-um-por-um. Adicionar 35 itens manualmente é frustrante e propenso a erro.

**Solução** — duas abordagens combinadas, expostas via widget `bulk-select.js`:

### 8.1 Modal "Gerenciar em lote" (seleção manual)
- Tabela searchable com **checkbox por linha** + filtros por categoria/UF/status
- Coluna **"Já gerido por"** mostra outros usuários que já cuidam do item — evita duplicação de ownership sem querer
- Botões "Selecionar todos visíveis" / "Limpar"
- Footer fixo com contador + "Aplicar seleção"
- Use case: usuário sabe exatamente quais fornecedores quer e já tem critério de busca em mente

### 8.2 Modal "Definir por regra" (regras automáticas)
- Construtor AND/OR: `categoria = Transportes AND estado = SP`
- Preview ao vivo: "Regra atual selecionaria 35 itens" + lista colapsável
- Salvar a regra cria um **chip especial azul claro** (`📐 Categoria: Transportes · 35 atuais`)
- Click no chip = editar regra; X = remover regra
- **Comportamento dinâmico**: quando um novo fornecedor for cadastrado e bater a regra, **entra automaticamente** no scope do usuário (sem ação manual)
- Use case: "todos os fornecedores de Transportes em SP são meus" — declarativo, não enumeração

### 8.3 Chips por origem
- **Chip cinza/colorido padrão** = item adicionado manualmente (selecionado no modal bulk ou na busca)
- **Chip azul claro com 📐** = item virá de uma regra automática (grupo virtual, mostra contagem atual)
- Item pode estar nos dois (manual + bater regra): se a regra mudar e o item sair dela, ele **permanece no scope** porque foi marcado manualmente também

### 8.4 Modelo de dados — extensão

Nova tabela `auto_rules`:
```
auto_rules (
  id              UUID PK,
  owner_user_id   UUID FK users,
  target_type     ENUM ('cost_center','vendor','contract','company','sop','procedure','tag','workflow'),
  filter_json     JSONB,  -- { conditions: [{field, op, value, connector}], ... }
  module          TEXT,    -- 'compras', etc
  created_at      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ
)
```

Coluna nova em `user_scope`:
```
auto_rule_id    UUID NULL FK auto_rules
```
- `NULL` = adicionado manualmente
- não-NULL = derivado de regra (recalculado quando novo item bate a regra ou regra é editada)
- Ambos podem coexistir: item pode ter linha manual + linha derivada de regra (chave composta `(user_id, entity_type, entity_id, COALESCE(auto_rule_id, '0'))`)

### 8.5 Cascata de manutenção

- **Quando regra muda**: recomputa items derivados — adiciona novos matches, remove os que saíram (a menos que também estejam marcados manualmente)
- **Quando item novo é cadastrado** (ex: vendor V-099): job avalia todas as `auto_rules` ativas e popula `user_scope` para quem bate
- **Quando regra é removida**: items derivados saem do scope (manuais permanecem)
- **Reflexo em ownership de stages**: roda mesmo gatilho do scope manual ([[CONCEPT-STAGE-OWNERSHIP-VALIDATION]])

### 8.6 Edge cases

- **Regra com 0 matches**: salva mesmo assim, mostra warning "Nenhum item atualmente bate" (útil pra preparar pra novos itens)
- **Regra muito ampla** (ex: `status = ativo` em 5k vendors): UI alerta antes de salvar — "Esta regra incluirá 4.832 itens. Confirmar?"
- **User removido do scope da regra** (regra editada): item sai do scope automaticamente; se também era manual, fica
- **Conflito com `Já gerido por`**: o widget só informa visualmente; não bloqueia — produto decide se distribui ou dedupe via cockpit

### 8.7 Onde aplicar

- **tela50** (Profile · aba Intervenientes): cada um dos 4 cards (CCs, Vendors, Contratos, Empresas) recebe os botões
- **tela81** (Configurador de Intervenientes): card "Critérios habilitados" usa o mesmo widget para incluir/excluir critérios em lote ou via regra
- **tag-filter.js**: filtros salvos podem evoluir pra suportar regras automáticas (extensão futura, mesmo modelo)

## 9. Decisões

- ✅ Scope é entidade separada de Permission (dois eixos ortogonais)
- ✅ Sem scope = sem cards (privilégio mínimo)
- ✅ Multi-tipo na mesma tabela `user_scope` (extensível via enum) — não criar tabela por tipo
- ✅ `role_context` opcional permite "backup" e "gestor" no mesmo CC
- ❌ Não usar grupos intermediários (user → group → entities) no MVP — adiciona indireção
- ❌ Não suportar exclusão explícita ("este CC NÃO" override) — default whitelist já cobre

## 10. Prioridade

**CRÍTICO.** Sem isso, [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] não consegue distribuir cards corretamente — cockpit fica disfuncional em qualquer operação com mais de 1 CC.
