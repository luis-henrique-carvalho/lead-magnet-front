---
title: "Adicionar filtros e paginacao sincronizados na URL"
status: "needs-triage"
type: "AFK"
parent: "docs/marketplace-search-history/prd.md"
blocked_by: ["docs/marketplace-search-history/tickets/001-criar-contrato-e-carregamento-do-historico-de-buscas.md", "lead-magnet-back/docs/marketplace-search-history/tickets/002-filtrar-historico-de-buscas-por-query-marketplace-e-status.md"]
user_stories: [7, 8, 9, 16, 17, 19, 22]
---

## Parent

`docs/marketplace-search-history/prd.md`

## What to build

Adicionar filtros por termo, marketplace e status ao historico de buscas, com paginação sincronizada nos search params da rota. A tela deve preservar filtros e pagina ao recarregar, voltar ou avançar no navegador.

A implementação deve reaproveitar padrões existentes como `useTableUrlState`, `DataTableToolbar`, `DataTablePagination`, `Input`, `Select`, filtros facetados e demais componentes shadcn já instalados. Componentes de UI não devem montar URLs nem chamar o backend diretamente.

## Acceptance criteria

- [ ] Filtro por termo atualiza a URL e dispara nova consulta com `query`.
- [ ] Filtro por marketplace atualiza a URL e dispara nova consulta com `marketplace`.
- [ ] Filtro por status atualiza a URL e dispara nova consulta com `status`.
- [ ] Filtros combinados preservam paginação, total e ordenação entregue pelo backend.
- [ ] Mudança de filtro volta para a primeira página quando necessário.
- [ ] Paginação atualiza a URL e dispara consulta com `page` e `limit`.
- [ ] Recarregar a rota restaura filtros e paginação a partir da URL.
- [ ] Resultado vazio por filtro mostra mensagem própria, distinta de histórico sem buscas e de erro de API.
- [ ] A implementação usa hooks/services/schemas da subfeature, sem requisições diretas em componentes de apresentação.
- [ ] Testes cobrem filtros individuais, filtros combinados, paginação, restauração por URL e estado vazio filtrado.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/marketplace-search-history/tickets/001-criar-contrato-e-carregamento-do-historico-de-buscas.md`
- `lead-magnet-back/docs/marketplace-search-history/tickets/002-filtrar-historico-de-buscas-por-query-marketplace-e-status.md`
