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

## 8. Decisões

- ✅ Scope é entidade separada de Permission (dois eixos ortogonais)
- ✅ Sem scope = sem cards (privilégio mínimo)
- ✅ Multi-tipo na mesma tabela `user_scope` (extensível via enum) — não criar tabela por tipo
- ✅ `role_context` opcional permite "backup" e "gestor" no mesmo CC
- ❌ Não usar grupos intermediários (user → group → entities) no MVP — adiciona indireção
- ❌ Não suportar exclusão explícita ("este CC NÃO" override) — default whitelist já cobre

## 9. Prioridade

**CRÍTICO.** Sem isso, [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] não consegue distribuir cards corretamente — cockpit fica disfuncional em qualquer operação com mais de 1 CC.
