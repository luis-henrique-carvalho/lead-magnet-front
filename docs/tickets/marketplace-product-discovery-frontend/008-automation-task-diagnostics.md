---
title: "Diagnóstico Técnico da Automation Task"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/003-basic-search-details-view.md"]
user_stories: [22, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 67, 71, 72, 78]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Desenvolvimento da tela de diagnóstico técnico de automação (`/automation-tasks/:taskId`). Ela consome dados da task (`GET /automation-tasks/:taskId`), histórico de tentativas (`GET /automation-tasks/:taskId/attempts`), dependências predecessoras e sucessoras (`GET /automation-tasks/:taskId/dependencies`, `/dependents`) e predecessoras pendentes (`/dependencies/pending`). A interface deve exibir status, classificação de erros se aplicável, contagem de retries, tabela paginada de tentativas, dependências obrigatórias vs opcionais e atalhos para navegar diretamente para tasks relacionadas ou voltar para a busca/negócio de origem.

## Acceptance criteria

- [ ] A página na rota `/automation-tasks/:taskId` carrega e exibe informações básicas da task (tipo, marketplace, estado, timestamps).
- [ ] Exibe o erro e sua classificação (se a task falhou) e quantidade de tentativas realizadas.
- [ ] Renderiza tabela paginada das tentativas (`attempts`) exibindo número, job, estado, erro e timestamps.
- [ ] Lista dependências predecessoras e sucessoras, discriminando dependências obrigatórias de opcionais, e listando predecessoras obrigatórias ainda pendentes.
- [ ] Permite navegação direta clicando em qualquer id de task relacionada nas dependências.
- [ ] Oferece um botão claro para retornar ao fluxo de negócio correspondente (ex: voltar para a busca ou produto de origem) evitando IDs técnicos puros.
- [ ] Suporta carregamento direto/links profundos via URL.
- [ ] A seção `Result` documenta a estrutura da página, os endpoints REST de diagnóstico integrados e os fluxos de navegação testados.

## Blocked by

[003-basic-search-details-view.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/003-basic-search-details-view.md)

## Result

Implementado em `/automation-tasks/:taskId` com carregamento direto por URL e paginação de tentativas via `attemptPage`/`attemptLimit`.

Estrutura da página:
- Cabeçalho operacional com busca, tema, configurações e perfil.
- Resumo técnico da task com tipo, marketplace, estado, contagem de tentativas, timestamps e erro/classificação quando aplicável.
- Tabela paginada de tentativas com número, job, estado, erro, início e fim.
- Seções de predecessoras, bloqueios pendentes e sucessoras com links diretos para tasks relacionadas.
- Atalho de retorno para `/marketplace-searches/:searchId` quando o `result.searchId` existe; fallback para `/marketplace-searches`.

Endpoints REST integrados:
- `GET /automation-tasks/:taskId`
- `GET /automation-tasks/:taskId/attempts`
- `GET /automation-tasks/:taskId/dependencies`
- `GET /automation-tasks/:taskId/dependents`
- `GET /automation-tasks/:taskId/dependencies/pending`

Fluxos testados:
- Renderização de dados básicos, erro, classificação, tentativas e dependências.
- Navegação por links para predecessoras/sucessoras.
- Retorno para busca de origem sem expor apenas IDs técnicos.
- Deep link `/automation-tasks/:taskId` com sincronização da paginação de tentativas na URL.
