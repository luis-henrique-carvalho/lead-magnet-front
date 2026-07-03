---
title: "Invalidar a listagem com eventos SSE de automation tasks"
status: "needs-triage"
type: "AFK"
parent: "docs/features/automation-task-listing-frontend/prd.md"
blocked_by: ["docs/features/automation-task-listing-frontend/tickets/001-criar-contrato-e-carregamento-da-listagem-de-automation-tasks.md"]
user_stories: [23, 24, 29, 32]
---

## Parent

`docs/features/automation-task-listing-frontend/prd.md`

## What to build

Integrar a listagem com o stream SSE existente de automation tasks usando invalidação/refetch do React Query. Eventos `task.created` e `task.updated` devem invalidar as query keys da listagem para que a API REST continue sendo a fonte de verdade.

A tela nao deve abrir uma segunda conexão SSE propria e nao deve aplicar patches otimistas linha a linha. A invalidacao atual de automation events deve continuar atendendo diagnostico e marketplace searches, acrescentando a raiz/lista de automation tasks.

## Acceptance criteria

- [ ] Query keys da listagem expõem uma raiz/lista adequada para invalidar todas as variações de filtros.
- [ ] `invalidateAutomationEventQueries` invalida a raiz/lista de automation tasks em eventos `task.created`.
- [ ] `invalidateAutomationEventQueries` invalida a raiz/lista de automation tasks em eventos `task.updated`.
- [ ] Invalidacoes existentes de diagnostico e marketplace searches continuam funcionando.
- [ ] A tela usa o `AutomationEventsProvider` ja montado no layout autenticado e nao cria nova conexão SSE.
- [ ] A lista refaz fetch apos invalidacao e continua usando `GET /automation-tasks` como fonte de verdade.
- [ ] O status de conexão das automações é exibido quando apropriado usando componente existente ou composição local discreta.
- [ ] Estado `degraded` é tratado como sinal operacional de tempo real degradado, sem tentar resolver autenticação do stream nesta entrega.
- [ ] A integração usa `Promise.all` ou padrão equivalente para invalidacoes independentes, evitando waterfalls artificiais.
- [ ] Testes cobrem invalidacao da listagem para `task.created`, invalidacao da listagem para `task.updated` e preservação das invalidacoes existentes.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/features/automation-task-listing-frontend/tickets/001-criar-contrato-e-carregamento-da-listagem-de-automation-tasks.md`
