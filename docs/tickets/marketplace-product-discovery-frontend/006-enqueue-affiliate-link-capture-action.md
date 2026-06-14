---
title: "Ação de Iniciar Captura de Link Afiliado"
status: "needs-triage"
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

- [ ] Exibe botão de "Iniciar Captura de Link Afiliado" (ou ícone correspondente de ação) em cada cartão/linha de produto na lista.
- [ ] O clique executa uma mutação que envia a requisição `POST /affiliate-link-capture` populando corretamente o payload com os dados do produto/busca.
- [ ] Desabilita o botão e exibe spinner de carregamento imediatamente para evitar múltiplos envios simultâneos para o mesmo item.
- [ ] Exibe notificação (toast) de sucesso indicando que a captura foi enfileirada, ou de erro caso a requisição falhe.
- [ ] Invalida a query de capturas da busca para atualizar a lista relacionada após o enfileiramento com sucesso.
- [ ] A seção `Result` documenta a mutação criada, o payload enviado, o mapeamento de respostas/erros HTTP e o comportamento visual testado.

## Blocked by

[004-products-discovered-list-url-pagination.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/004-products-discovered-list-url-pagination.md)
