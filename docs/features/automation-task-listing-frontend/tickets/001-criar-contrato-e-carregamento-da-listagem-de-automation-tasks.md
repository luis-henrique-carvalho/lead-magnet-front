---
title: "Criar contrato e carregamento da listagem de automation tasks"
status: "needs-triage"
type: "AFK"
parent: "docs/features/automation-task-listing-frontend/prd.md"
blocked_by: []
user_stories: [1, 2, 19, 20, 21, 27, 28, 29, 30, 31, 33]
---

## Parent

`docs/features/automation-task-listing-frontend/prd.md`

## What to build

Criar a subfeature de listagem em `src/features/automation-tasks/listing/` para consumir `GET /automation-tasks` com paginação inicial e estados remotos basicos. A rota `/automation-tasks` deve deixar de ser placeholder e renderizar a tela real, preservando a rota `/automation-tasks/$taskId`.

A implementação deve seguir `docs/frontend-feature-architecture.md`: schemas Zod em `schemas`, chamadas HTTP em `services`, React Query e query keys em `hooks`, componentes de apresentação sem chamadas diretas ao Axios, export pelo entrypoint publico de `automation-tasks` e composição visual com `Header`, `Main`, `Search`, `ThemeSwitch`, `ConfigDrawer` e `ProfileDropdown`.

## Acceptance criteria

- [ ] A rota `/automation-tasks` importa um entrypoint publico da feature `automation-tasks`, sem manter placeholder ou lógica de tela inline na rota.
- [ ] A subfeature `listing` fica organizada conforme `docs/frontend-feature-architecture.md`, com pastas `schemas`, `services`, `hooks` e `components`.
- [ ] Schemas Zod validam a resposta paginada de `GET /automation-tasks`, incluindo `items`, `page`, `limit`, `total` e `summary`.
- [ ] O service usa o cliente HTTP global `@/lib/api-client` e nao cria instancia local de Axios.
- [ ] O hook React Query encapsula query key estavel, chamada ao service e parametros iniciais de paginação.
- [ ] A tela carrega dados reais de `GET /automation-tasks` usando a API REST como fonte de verdade.
- [ ] Estado de carregamento usa estrutura visual estavel e consistente com o app.
- [ ] Estado de erro mostra mensagem compreensivel e botao de tentar novamente que chama `refetch`.
- [ ] Estado vazio sem filtros diferencia ausencia de automation tasks de falha de carregamento.
- [ ] A rota `/automation-tasks/$taskId` continua funcionando com seus parametros atuais.
- [ ] A implementação evita waterfalls desnecessarios iniciando a query da listagem no nivel da tela e mantendo componentes visuais sem fetch proprio.
- [ ] Testes cobrem carregamento com dados, estado vazio, estado de erro e acionamento de retry.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

None - can start immediately.
