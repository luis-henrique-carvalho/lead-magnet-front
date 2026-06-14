---
title: "Integração de Atualizações SSE em Tempo Real"
status: "completed"
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

- [x] Abre uma única conexão `EventSource` global autenticada. Fecha a conexão em caso de logout do usuário.
- [x] Processa eventos do stream de forma tipada e descarta IDs de eventos duplicados já processados.
- [x] Quando um evento afetar a busca ativa ou produtos exibidos na tela, invalida ou atualiza as queries correspondentes no React Query para refletir novos contadores e dados.
- [x] Deixa de sincronizar e acompanhar uma task de automação de busca específica assim que ela atinge um estado terminal (`completed`, `partial`, `failed`, `manual_required`).
- [x] Implementa reconexão automática (respeitando as diretrizes de retry do stream) e invalidado/reconciliação manual/automática dos dados ao restabelecer a conexão.
- [x] Exibe indicador visual de estado da conexão SSE (conectado vs desconectado/degradado) no cabeçalho ou área de status.
- [x] A seção `Result` documenta o fluxo de dados SSE, mapeamento de eventos, integração de cache, tratamento de reconexão e testes efetuados com eventos simulados.

## Result

### Fluxo entregue

- `AutomationEventsProvider` é montado uma única vez no layout autenticado e abre `GET /automation-tasks/events` com `withCredentials: true`. A alteração ou remoção da sessão fecha a instância ativa.
- Eventos `task.created` e `task.updated` são validados com Zod. Notificações inválidas e heartbeats sem mudança de domínio são ignorados; `eventId` já processado não dispara nova sincronização.
- Eventos de busca invalidam task, detalhe e todas as páginas de produtos da busca. Eventos de captura invalidam task e a coleção de capturas relacionada ao `searchId`.
- Tasks terminais são reconciliadas uma última vez e deixam de produzir invalidacões específicas. As invalidações independentes são executadas em paralelo.
- O `EventSource` mantém sua reconexão nativa. Cada evento `open`, inclusive após queda, reconcilia as queries ativas; durante degradação o cabeçalho exibe estado desconectado e a ação `Atualizar dados`.
- O backend presente nesta worktree ainda não expõe a rota SSE; o cliente segue o contrato definido neste PRD e permanece testável por uma fonte de eventos controlada.

### Testes

- Conexão única com credenciais e indicador conectado.
- Deduplicação, validação e invalidação direcionada para busca e captura.
- Encerramento após logout e interrupção após estado terminal.
- Estado degradado, reconciliação manual e reconciliação automática no retorno.

## Blocked by

[003-basic-search-details-view.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/003-basic-search-details-view.md)
