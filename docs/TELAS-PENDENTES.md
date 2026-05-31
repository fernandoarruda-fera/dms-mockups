# Telas Pendentes (consolidado dos concepts)

> Status: 📋 Consolidação cruzada
> Última atualização: 2026-05-31
> Origem: varredura de `docs/concepts/*.md` por menções "a criar" / "nova" / "refactor"
> Atualizar conforme telas forem entregues ou novos concepts apontarem gaps.

## 1. Já entregues no mockup

| #   | Tela                        | Concept de origem                            | Status         |
| --- | --------------------------- | -------------------------------------------- | -------------- |
| 80  | Permissões — matriz Role × Tela × Ação | [[CONCEPT-PERMISSIONS]]            | ✅ entregue    |
| 81  | Configurador Intervenientes por Módulo | [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] | ✅ entregue |
| 82  | Saúde dos Stages (dashboard) | [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]]      | ✅ entregue (Task 3 — 2026-05-31) |
| 84  | Usuários — admin CRUD (bloqueio com análise impacto + drawer) | [[CONCEPT-PERMISSIONS]] + [[CONCEPT-USER-SCOPE-INTERVENIENTES]] | ✅ entregue (Sprint Imediato B — 2026-05-31) |
| 85  | Permission Delegations — cadeia + revogação cascata | [[CONCEPT-PERMISSIONS]] §5.1 e regra 10 | ✅ entregue (Sprint Imediato B — 2026-05-31) |
| 12  | Dashboards — cards customizáveis | [[CONCEPT-USER-PROFILE-PREFERENCES]]    | ✅ entregue (Lote B parte 2) |
| 13  | Auditoria + filtros avançados | [[CONCEPT-USER-PROFILE-PREFERENCES]]       | ✅ entregue (Lote B parte 2) |
| —   | i18n toggle global (5 idiomas) | implícito (Lote B parte 3)                 | ✅ entregue    |

## 2. Refactors apontados em concepts (telas existentes)

| #   | Tela                        | Concept de origem                            | Mudança requerida                                       | Prioridade |
| --- | --------------------------- | -------------------------------------------- | ------------------------------------------------------- | ---------- |
| 04  | Biblioteca de workflows     | [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] §9, [[CONCEPT-WORKFLOW-OBLIGATORY]] §7.1 | Badge `🔒 sistema` + tooltip nos workflows default | Alto |
| 08  | Stage Trigger               | [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] §6, [[CONCEPT-STAGE-OWNERSHIP-VALIDATION]] §9, [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] §7 | + 4 campos (função responsável, notificadas, scope filter, escalação) + validação inline 1-dono + scope dinâmico vindo do módulo | Crítico |
| 10  | Workflow Editor             | [[CONCEPT-ACTIONIA]] §6, [[CONCEPT-ALERT]] §6 | Abas "Agentes" e "Alertas" (vinculação)                | Alto |
| 11  | Cockpit                     | [[CONCEPT-WORKFLOW-OBLIGATORY]] §6, [[CONCEPT-STAGE-ROLE-ASSIGNMENT]] §6 | Badge "sem workflow" + distribuição via função × scope | Crítico |
| 50  | Profile do usuário          | [[CONCEPT-USER-SCOPE-INTERVENIENTES]] §6, [[CONCEPT-PERMISSIONS]] §7, [[CONCEPT-MODULE-INTERVENIENTES-CONFIG]] §7 | Aba "Intervenientes" dinâmica + aba "Roles" + modal "Minhas permissões" | Crítico |

## 3. A criar (gaps de mockup)

| # sugerido | Tela                                | Concept de origem                            | Prioridade | Justificativa                                                   |
| ---------- | ----------------------------------- | -------------------------------------------- | ---------- | --------------------------------------------------------------- |
| ~~77~~ ✅  | ~~Lista + edição de Agentes (ActionIA)~~ | ~~[[CONCEPT-ACTIONIA]] §6~~              | ~~Médio~~  | **Entregue 2026-05-31 (Passo 4)** — `tela77-actionia-biblioteca.html` (4 tipos + can_replace_stage_user + drawer + modal) |
| ~~78~~ ✅  | ~~Lista + edição de Alertas~~        | ~~[[CONCEPT-ALERT]] §6~~                    | ~~Médio~~  | **Entregue 2026-05-31 (Passo 4)** — `tela78-alertas-biblioteca.html` (2 abas Regras+Histórico, DSL editor, 4 canais) |
| ~~79~~ ✅  | ~~Regras de Match Engine~~           | ~~[[CONCEPT-MATCH-ENGINE]] §6~~              | ~~Alto~~   | **Entregue 2026-05-31 (Passo 4)** — `tela79-matchengine-workflow.html` (3 modos + mapping editor + simulação) |
| ~~83~~ ✅  | ~~CRUD de Alçadas~~                 | ~~[[CONCEPT-ALCADAS]] §5~~                   | ~~Alto~~   | **Entregue 2026-05-31 (Sprint A)** — `tela83-alcadas-cadastro.html` |
| ~~86~~ ✅  | ~~CRUD de Fornecedores (Vendors)~~  | Gap E3 cadastros                             | ~~Alto~~   | **Entregue 2026-05-31 (Sprint A)** — `tela86-fornecedores-cadastro.html` |
| ~~88~~ ✅  | ~~Times e Departamentos~~           | ~~[[CONCEPT-TEAMS]] §6~~                     | ~~Alto~~   | **Entregue 2026-05-31 (Sprint Seguinte)** — `tela87-times-cadastro.html` (lista + árvore + drawer + modal criar) |

## 4. Cobertura por concept

| Concept                                  | Cobertura            | Observação                                                  |
| ---------------------------------------- | -------------------- | ----------------------------------------------------------- |
| CONCEPT-PERMISSIONS                      | 100% mockup (tela80) | Refactor tela50 aba Roles pendente                          |
| CONCEPT-MODULE-INTERVENIENTES-CONFIG     | 100% mockup (tela81) | Refactor tela50/tela08 pendente                             |
| CONCEPT-STAGE-OWNERSHIP-VALIDATION       | 100% mockup (tela82) | Validações inline em tela08/50/80 pendentes                 |
| CONCEPT-STAGE-ROLE-ASSIGNMENT            | 0% — depende tela08  | Refactor tela08 é core                                      |
| CONCEPT-WORKFLOW-OBLIGATORY              | 0% — refactor tela11 | Badge órfão + wizard on-the-fly pendentes                   |
| CONCEPT-ACTIONIA                         | 100% mockup (tela77) | Refactor tela10 aba "Agentes" pendente                      |
| CONCEPT-ALERT                            | 100% mockup (tela78) | Refactor tela10 aba "Alertas" + tela09 (consumidor) pendente |
| CONCEPT-MATCH-ENGINE                     | 100% mockup (tela79) | Hook ingestão emails/NFs + integração LLM são backend       |
| CONCEPT-ALCADAS                          | 0% — tela83          | Concept recém-criado, mockup não iniciado                   |
| CONCEPT-USER-SCOPE-INTERVENIENTES        | 0% — refactor tela50 | Aba "Intervenientes" não existe ainda                       |
| CONCEPT-SAVED-FILTERS                    | Parcial (tela12/13)  | Filtros salvos genéricos pendentes em listas tela01-tela60  |
| CONCEPT-USER-PROFILE-PREFERENCES         | 60% (tela12, list-customizer) | Demais listas customizáveis pendentes              |
| CONCEPT-AI-GENERATION                    | Parcial (tela08, 09, 12) | "Gerar via IA" ainda não em tela13/79                  |

## 5. Próximos passos sugeridos

1. **tela08 refactor** — desbloqueia STAGE-ROLE-ASSIGNMENT + STAGE-OWNERSHIP-VALIDATION (já entregue) + MODULE-INTERVENIENTES-CONFIG
2. **tela50 refactor (abas Intervenientes + Roles)** — desbloqueia 3 concepts
3. **tela77/78/79** — completam universo de configuração avançada
4. **tela83 (Alçadas)** — desbloqueia tela40/41 (approvals)
