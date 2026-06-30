---
title: "Criar contrato e carregamento do historico de buscas"
status: "needs-triage"
type: "AFK"
parent: "docs/marketplace-search-history/prd.md"
blocked_by: ["lead-magnet-back/docs/marketplace-search-history/tickets/001-expor-historico-paginado-de-buscas-de-marketplace.md"]
user_stories: [1, 2, 3, 4, 5, 6, 13, 14, 15, 20, 21]
---

## Parent

`docs/marketplace-search-history/prd.md`

## What to build

Criar a subfeature de historico em `marketplace-searches` para consumir `GET /marketplace-searches` com paginação básica. A tela `/marketplace-searches` deve deixar de ser placeholder e carregar dados reais, exibindo estados de carregamento, vazio e erro.

A implementação deve seguir `docs/frontend-feature-architecture.md`: schemas Zod em `schemas`, chamadas HTTP em `services`, React Query e query keys em `hooks`, e componentes de apresentação sem chamadas diretas ao Axios. A tela deve reaproveitar `Header`, `Main`, `Search`, `ThemeSwitch`, `ConfigDrawer`, `ProfileDropdown` e componentes shadcn existentes em `src/components`.

## Acceptance criteria

- [ ] A rota `/marketplace-searches` importa um entrypoint da feature, sem manter o placeholder inline na rota.
- [ ] A subfeature de historico fica organizada por tela/subfeature conforme `docs/frontend-feature-architecture.md`.
- [ ] Schemas Zod validam a resposta paginada de `GET /marketplace-searches` e os campos de busca/task usados pela UI.
- [ ] O service usa o cliente HTTP global configurado e nao cria instancia local de Axios.
- [ ] O hook de React Query encapsula query key, chamada remota e parametros de paginação inicial.
- [ ] A tela carrega dados reais de `GET /marketplace-searches`.
- [ ] Estado de carregamento usa estrutura visual estavel com componentes shadcn existentes.
- [ ] Estado vazio diferencia ausencia de buscas de erro de carregamento.
- [ ] Estado de erro mostra mensagem compreensivel e acao de tentar novamente.
- [ ] Testes cobrem carregamento com dados, estado vazio, estado de erro e acionamento de retry.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `lead-magnet-back/docs/marketplace-search-history/tickets/001-expor-historico-paginado-de-buscas-de-marketplace.md`
