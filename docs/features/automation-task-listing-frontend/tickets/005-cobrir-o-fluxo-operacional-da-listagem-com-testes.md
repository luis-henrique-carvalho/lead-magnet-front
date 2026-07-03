---
title: "Cobrir o fluxo operacional da listagem com testes"
status: "needs-triage"
type: "AFK"
parent: "docs/features/automation-task-listing-frontend/prd.md"
blocked_by: ["docs/features/automation-task-listing-frontend/tickets/002-renderizar-resumo-operacional-e-tabela-de-automation-tasks.md", "docs/features/automation-task-listing-frontend/tickets/003-adicionar-filtros-intervalo-de-criacao-e-paginacao-na-url.md", "docs/features/automation-task-listing-frontend/tickets/004-invalidar-a-listagem-com-eventos-sse-de-automation-tasks.md"]
user_stories: [19, 20, 21, 22, 23, 25, 26, 32, 33, 34]
---

## Parent

`docs/features/automation-task-listing-frontend/prd.md`

## What to build

Consolidar a cobertura automatizada do fluxo operacional da listagem de automation tasks. Os testes devem cobrir contrato, hook, rota, estados remotos, filtros, navegação e invalidacao SSE, reutilizando como prior art os testes de `automation-events-provider`, diagnostico de automation tasks, historico de buscas e template tasks.

Este ticket deve fechar lacunas que permanecerem após os tickets anteriores e garantir que a primeira versão observacional continue sem ações destrutivas.

## Acceptance criteria

- [ ] Teste de rota cobre `/automation-tasks` carregando a tela com parametros de busca validados.
- [ ] Teste de service cobre parse Zod da resposta valida de `GET /automation-tasks`.
- [ ] Teste de service cobre rejeição de payload invalido.
- [ ] Teste de hook React Query cobre query key estavel e chamada ao service com filtros corretos.
- [ ] Testes de tela cobrem loading com skeleton, erro com retry, vazio sem filtros e vazio filtrado.
- [ ] Testes de tela cobrem cards de resumo renderizados a partir de `summary`.
- [ ] Testes de tabela cobrem task de busca de marketplace, task de captura afiliada e fallback sem contexto relacional.
- [ ] Testes de navegação cobrem link principal para `/automation-tasks/$taskId`.
- [ ] Testes de navegação cobrem link secundario para origem quando houver `originUrl` ou identificador equivalente.
- [ ] Testes de URL state cobrem texto, status, tipo, marketplace, `createdFrom`, `createdTo`, `page` e `limit`.
- [ ] Testes de SSE cobrem que eventos `task.created` e `task.updated` invalidam query keys da listagem.
- [ ] Testes garantem que a rota de diagnostico por `taskId` continua funcionando.
- [ ] Testes ou asserções de UI garantem que a tela nao expõe criar, editar, importar, deletar, bulk actions, retry manual de task, cancelamento ou reprocessamento.
- [ ] A cobertura respeita boas práticas React: componentes testados por comportamento observavel, sem depender de detalhes internos desnecessarios, e mocks de API no limite dos services/hooks.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/features/automation-task-listing-frontend/tickets/002-renderizar-resumo-operacional-e-tabela-de-automation-tasks.md`
- `docs/features/automation-task-listing-frontend/tickets/003-adicionar-filtros-intervalo-de-criacao-e-paginacao-na-url.md`
- `docs/features/automation-task-listing-frontend/tickets/004-invalidar-a-listagem-com-eventos-sse-de-automation-tasks.md`
