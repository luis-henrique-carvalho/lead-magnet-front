---
title: "Integração de Atualizações SSE em Tempo Real"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/003-basic-search-details-view.md"]
user_stories: [19, 20, 82, 91, 92, 93, 94, 95, 96]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Implementação do cliente e hook reutilizável de Server-Sent Events (SSE) que consome o endpoint autenticado global `GET /automation-tasks/events`. O fluxo de eventos atualizará em tempo real a interface da busca ativa e seus produtos com base no recebimento de notificações estruturadas (`task.created`, `task.updated`), invalidando chaves de cache correspondentes no React Query. A conexão única global deve tratar heartbeats, desconexão visual, tentativas de reconexão e reconciliação dos dados no retorno.

## Acceptance criteria

- [ ] Abre uma única conexão `EventSource` global autenticada. Fecha a conexão em caso de logout do usuário.
- [ ] Processa eventos do stream de forma tipada e descarta IDs de eventos duplicados já processados.
- [ ] Quando um evento afetar a busca ativa ou produtos exibidos na tela, invalida ou atualiza as queries correspondentes no React Query para refletir novos contadores e dados.
- [ ] Deixa de sincronizar e acompanhar uma task de automação de busca específica assim que ela atinge um estado terminal (`completed`, `partial`, `failed`, `manual_required`).
- [ ] Implementa reconexão automática (respeitando as diretrizes de retry do stream) e invalidado/reconciliação manual/automática dos dados ao restabelecer a conexão.
- [ ] Exibe indicador visual de estado da conexão SSE (conectado vs desconectado/degradado) no cabeçalho ou área de status.
- [ ] A seção `Result` documenta o fluxo de dados SSE, mapeamento de eventos, integração de cache, tratamento de reconexão e testes efetuados com eventos simulados.

## Blocked by

[003-basic-search-details-view.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/003-basic-search-details-view.md)
