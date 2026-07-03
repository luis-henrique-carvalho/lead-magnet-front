---
title: "Aba de Capturas Relacionadas à Busca"
status: "done"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/006-enqueue-affiliate-link-capture-action.md"]
user_stories: [44, 45, 46, 47, 48, 49, 50, 52, 71, 72, 165, 166]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Desenvolvimento da aba ou seção de Capturas dentro da página de detalhes da busca `/marketplace-searches/:searchId`. Esta aba exibe a listagem paginada das tarefas de captura originadas por essa busca, consumindo `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks` com paginação independente e sincronizada com a URL. Exibir o status de cada captura, link de afiliado gerado (com opção de copiar/abrir), timestamps do ciclo de vida da tarefa e atalho de diagnóstico para a task de automação de origem.

## Acceptance criteria

- [x] A aba exibe a listagem consumindo `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks?page=...&limit=...` de forma paginada.
- [x] Para cada item, exibe o nome do produto correspondente, o status da tarefa de captura, timestamps (criada, iniciada, finalizada) formatados e o link afiliado (quando disponível).
- [x] Adiciona botão para copiar a URL de afiliado e outro para abri-la em uma nova aba com proteções de segurança.
- [x] Permite abrir a task correspondente via link direto para a rota de diagnóstico `/automation-tasks/:taskId`.
- [x] Sinaliza claramente tarefas que exigem ação manual (`manual_required`).
- [x] Sincroniza a paginação desta aba na URL de forma independente da listagem de produtos.
- [x] A listagem se atualiza automaticamente em tempo real através dos eventos SSE (quando integrados via Slice 5).
- [x] A seção `Result` documenta o componente de tabela/capturas, estado de URL e validação de re-atualizações.

## Blocked by

[006-enqueue-affiliate-link-capture-action.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/006-enqueue-affiliate-link-capture-action.md)

## Result

Foi entregue a seção `Capturas de link afiliado` na página `/marketplace-searches/:searchId`, consumindo `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks` com paginação independente por `capturePage` e `captureLimit`. A consulta usa a chave React Query `['marketplace-searches', 'captures', searchId, page, limit]`, preservando a invalidação por prefixo já usada pelos eventos SSE de `affiliate_link_capture`.

Cada captura exibe produto, status com o mesmo badge do ciclo de vida das automações, URL afiliada quando disponível e datas de criação, início, finalização e captura no locale `pt-BR`. Capturas em `manual_required` aparecem como `Ação manual requerida`.

As ações disponíveis são: copiar URL afiliada com feedback via toast, abrir a URL em nova aba com `target="_blank"` e `rel="noopener noreferrer"`, e abrir o diagnóstico por link direto para `/automation-tasks/:taskId`. Quando não há URL afiliada, a ação de copiar fica desabilitada e o link externo não é renderizado.

Arquivos principais:

- `src/features/marketplace-searches/details/schemas/search-captures-schema.ts`
- `src/features/marketplace-searches/details/components/search-captures-list.tsx`
- `src/features/marketplace-searches/details/services/search-details-service.ts`
- `src/features/marketplace-searches/details/hooks/use-search-details.ts`
- `src/features/marketplace-searches/details/index.tsx`
- `src/routes/_authenticated/marketplace-searches/$searchId.tsx`

Validações executadas:

- `npm test -- --run src/features/marketplace-searches/details/search-details.test.tsx`
- `npm test -- --run src/routes/_authenticated/marketplace-searches/-search-details-route.test.tsx`
- `npm test`
- `npm run lint`

`npm run build` foi executado e ainda falha por referências antigas do template a rotas não registradas (`/settings`, `/apps`, `/tasks`, `/users`), fora do escopo deste ticket. O erro relacionado ao redirecionamento de nova busca foi corrigido incluindo `capturePage` e `captureLimit`.
