---
title: "Ação de Iniciar Captura de Link Afiliado"
status: "completed"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/004-products-discovered-list-url-pagination.md"]
user_stories: [39, 40, 41, 42, 43, 71]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Adição do botão e mutação para iniciar o processo de captura de link afiliado para um produto específico a partir da lista de descobertas. A ação deve fazer um `POST /affiliate-link-capture` passando os dados extraídos do produto e do contexto da busca (searchId, productId, marketplace, originalProductUrl) sem exigir preenchimento manual de dados conhecidos pelo operador.

## Acceptance criteria

- [x] Exibe botão de "Iniciar Captura de Link Afiliado" (ou ícone correspondente de ação) em cada cartão/linha de produto na lista.
- [x] O clique executa uma mutação que envia a requisição `POST /affiliate-link-capture` populando corretamente o payload com os dados do produto/busca.
- [x] Desabilita o botão e exibe spinner de carregamento imediatamente para evitar múltiplos envios simultâneos para o mesmo item.
- [x] Exibe notificação (toast) de sucesso indicando que a captura foi enfileirada, ou de erro caso a requisição falhe.
- [x] Invalida a query de capturas da busca para atualizar a lista relacionada após o enfileiramento com sucesso.
- [x] A seção `Result` documenta a mutação criada, o payload enviado, o mapeamento de respostas/erros HTTP e o comportamento visual testado.

## Result

### Comportamento entregue

- Cada card de produto exibe a ação acessível `Iniciar captura de link afiliado para <produto>` junto ao link externo existente.
- A mutação envia `POST /affiliate-link-capture` com `searchId`, `productId`, `marketplace` e `originalProductUrl` derivados do contexto da busca e do produto, sem entrada manual.
- A resposta `{ taskId, statusUrl }` é validada com Zod. Durante o envio, somente o botão daquele produto fica desabilitado e apresenta spinner e o texto `Enfileirando...`.
- Sucesso e falha apresentam toasts em português. Após HTTP 201, a chave `['marketplace-searches', 'captures', searchId]` é invalidada para integração com a listagem do ticket 007.

### Testes

- Payload completo derivado da busca e do produto.
- Feedback de sucesso e falha.
- Bloqueio imediato contra múltiplos envios do mesmo item.
- Invalidação da coleção de capturas após sucesso.

## Blocked by

[004-products-discovered-list-url-pagination.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/004-products-discovered-list-url-pagination.md)
