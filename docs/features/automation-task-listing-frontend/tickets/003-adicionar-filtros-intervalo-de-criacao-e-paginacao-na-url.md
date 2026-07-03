---
title: "Adicionar filtros, intervalo de criacao e paginacao na URL"
status: "needs-triage"
type: "AFK"
parent: "docs/features/automation-task-listing-frontend/prd.md"
blocked_by: ["docs/features/automation-task-listing-frontend/tickets/002-renderizar-resumo-operacional-e-tabela-de-automation-tasks.md"]
user_stories: [7, 8, 9, 10, 11, 12, 13, 22, 25, 26, 29, 32]
---

## Parent

`docs/features/automation-task-listing-frontend/prd.md`

## What to build

Adicionar busca, filtros e paginação sincronizados na URL da rota `/automation-tasks`. A query string deve validar e propagar `page`, `limit`, `query`, `status`, `type`, `marketplace`, `createdFrom` e `createdTo` para o hook de listagem, mantendo paginação pelo servidor.

Os filtros devem reaproveitar `useTableUrlState`, componentes globais de data table e componentes existentes de data quando atenderem ao caso. Caso o intervalo de criação exija componente novo, criar um componente local pequeno em `listing/components/`.

## Acceptance criteria

- [ ] A rota valida `page`, `limit`, `query`, `status`, `type`, `marketplace`, `createdFrom` e `createdTo` com Zod.
- [ ] `page` inicia em 1 e `limit` respeita o limite maximo aceito pelo backend.
- [ ] `createdFrom` e `createdTo` trafegam como datas simples `YYYY-MM-DD`, sem conversao para date-time no frontend.
- [ ] Busca por texto atualiza `query` na URL e refaz a query da listagem.
- [ ] Filtro de status atualiza `status` na URL e permite focar em falhas, pendencias, execucoes ativas e demais estados.
- [ ] Filtro de tipo atualiza `type` na URL com labels em portugues.
- [ ] Filtro de marketplace atualiza `marketplace` na URL com labels amigaveis.
- [ ] Intervalo de criação atualiza `createdFrom` e `createdTo` na URL.
- [ ] Mudanças de filtro resetam `page` para 1 quando o padrão `useTableUrlState` exigir.
- [ ] Paginação manual envia `page` e `limit` para o backend e usa `total`/`rowCount` para calcular paginas.
- [ ] Estado vazio filtrado informa que os filtros atuais nao encontraram resultados e nao se confunde com ausência total de tasks.
- [ ] A query key React Query inclui os filtros em formato estavel e previsivel para invalidacao por raiz/lista.
- [ ] O código evita trabalho cliente desnecessario: nao filtra localmente dados ja paginados pelo servidor e usa dependencias primitivas/memoizadas onde fizer sentido.
- [ ] Testes cobrem atualização da URL para texto, status, tipo, marketplace, datas e paginação.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/features/automation-task-listing-frontend/tickets/002-renderizar-resumo-operacional-e-tabela-de-automation-tasks.md`
