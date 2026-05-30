# CONCEPT: Saved Filters (Filtros Salvos)

> Status: 📝 Proposta
> Última atualização: 2026-05-30
> Origem: ciclo de validação mockups DMSYS V2

## 1. Objetivo

Permitir que usuários **salvem** combinações de filtros aplicados em qualquer lista do sistema, com escopo de compartilhamento (privado / equipe / global), para reuso rápido e padronização de visões operacionais.

Atualmente cada usuário precisa re-aplicar filtros manualmente toda sessão; isso é fricção e gera inconsistência entre membros do mesmo time olhando as mesmas listas.

## 2. Modelo de dados

### `saved_filters`

| Campo            | Tipo       | Obrigatório | Descrição                                                       |
| ---------------- | ---------- | ----------- | --------------------------------------------------------------- |
| id               | uuid       | sim         | Identificador único                                             |
| nome             | string     | sim         | Nome dado pelo usuário (ex: "NFs atrasadas — equipe SP")        |
| escopo           | enum       | sim         | `privado` \| `equipe` \| `global`                               |
| team_id          | uuid       | condicional | Obrigatório se escopo = `equipe`                                |
| owner_id         | uuid       | sim         | Quem criou o filtro                                             |
| page_key         | string     | sim         | Identificador da tela (ex: `nfs.list`, `requisicoes.list`)      |
| filtros          | json       | sim         | Estado serializado dos filtros (incluindo TAG+campo, ordenação) |
| created_at       | datetime   | sim         | Data de criação                                                 |
| last_used_at     | datetime   | não         | Última vez aplicado (por qualquer usuário com acesso)           |
| use_count        | int        | sim         | Contador de aplicações (default 0)                              |

Índices: `(page_key, escopo, team_id)` para listagem eficiente.

## 3. Fluxo do usuário

1. Usuário aplica filtros em uma lista (qualquer combinação, incluindo filtros tipo TAG+campo)
2. Clica em **"💾 Salvar filtro"** no topo
3. Modal abre: digita **nome** + escolhe **escopo** (Privado / Equipe / Global)
4. Salvo, aparece no dropdown **"Filtros salvos"** no topo da lista
5. Dropdown tem toggle: **Meus / Equipe / Todos** para alternar visão
6. Ao selecionar filtro salvo, sistema aplica todo o estado (filtros + ordenação)
7. Filtros podem ser **clonados** (qualquer usuário que vê pode duplicar) ou **editados/deletados** (só owner)

## 4. Regras de negócio

- **Escopo privado:** visível só para `owner_id`.
- **Escopo equipe:** visível para todos membros de `team_id`. Owner ainda é único editor.
- **Escopo global:** visível para todos os usuários do tenant. Editar/deletar exige role admin OU ser owner.
- **Permissões:**
  - Owner: editar, deletar, mudar escopo.
  - Não-owner: apenas aplicar e clonar (clone vira filtro privado do clonador).
- **Mudança de escopo "reduz" (ex: global → equipe → privado):** alerta para usuários que vão perder acesso, com opção de notificar.
- **Validação:** ao salvar, verifica que filtros referenciam campos existentes na `page_key`. Filtros quebrados (campo removido) ficam marcados como "obsoleto".
- **Last used / use_count:** atualizados na aplicação, usados para sugestão de "filtros populares".

## 5. Gaps no front atual

- **Modelo `saved_filters` + endpoints CRUD** — inexistente.
- **Dropdown "Filtros salvos"** com toggle Meus/Equipe/Todos — inexistente.
- **Botão "💾 Salvar filtro"** nos headers de lista — inexistente.
- **Serialização do estado de filtros** para JSON portável (precisa contrato entre componentes) — parcial.
- **Modal de gerenciamento** (renomear, mudar escopo, deletar) — inexistente.
- Esforço estimado: **Médio** (~1.5 sprints — backend simples + componente reutilizável de header).

## 6. Telas relacionadas (mockup)

Aplicar em **todas** as listas com filtros avançados:

`tela01, tela03, tela04, tela06, tela12, tela13, tela21, tela24, tela27, tela30, tela32, tela34, tela36, tela38, tela40, tela44, tela60`

## 7. Decisões tomadas / Pendências

**Decisões:**
- 3 escopos fixos: privado / equipe / global.
- Owner é único editor; outros podem clonar.
- Filtros incluem ordenação (faz parte do estado salvo).
- Filtros TAG+campo entram no JSON normalmente.

**Pendências:**
- Notificação quando alguém aplica um filtro de equipe que você criou — útil ou ruído?
- Versionamento de filtro (histórico de edições) — fora do v1.
- Sugestão automática "salvar este filtro?" depois de N aplicações idênticas — fora do v1.
- Exportar/importar filtro entre tenants — fora do escopo.

## 8. Prioridade

**Médio** — não é bloqueante mas tem alto ROI (reduz fricção diária). Implementar depois de [[CONCEPT-USER-PROFILE-PREFERENCES]] já que ambos exigem persistência de estado por usuário (mesmo padrão de tabela + endpoint).
