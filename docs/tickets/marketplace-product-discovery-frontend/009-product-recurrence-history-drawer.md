---
title: "Histórico de Recorrência do Produto (Ocorrências)"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/004-products-discovered-list-url-pagination.md"]
user_stories: [63, 64, 65, 66, 71, 72]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Implementação de um Drawer (painel lateral deslizante) ou Modal que apresenta o histórico de ocorrências de um produto ao longo de diferentes buscas na plataforma, consumindo o endpoint `GET /marketplace-products/:productId/searches`. O painel deve listar cada busca onde o produto reapareceu, exibindo a query usada, marketplace, categoria e data da descoberta, permitindo navegar diretamente para a busca correspondente. Deve incluir uma nota explicando que associações legadas não comprovadas não estão listadas.

## Acceptance criteria

- [ ] Clicar em um produto (ou no indicador de recorrência) na lista de produtos abre o painel lateral com a listagem de buscas onde ele foi descoberto.
- [ ] Consome `GET /marketplace-products/:productId/searches` com paginação opcional/necessária no painel.
- [ ] Exibe os campos correspondentes de cada ocorrência: palavra-chave (query), categoria, marketplace e data formatada no locale `pt-BR`.
- [ ] O clique em um item da lista do painel redireciona o usuário diretamente para `/marketplace-searches/:searchId` correspondente daquela ocorrência.
- [ ] Exibe de forma visível a nota informativa: "Associações legadas não comprovadas não estão incluídas neste histórico."
- [ ] O Drawer é responsivo e adaptável a telas menores, preservando usabilidade com teclado e acessibilidade do botão de fechar.
- [ ] A seção `Result` documenta o componente de Drawer/Modal, a integração com o endpoint REST e os testes visuais e funcionais executados.

## Blocked by

[004-products-discovered-list-url-pagination.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/004-products-discovered-list-url-pagination.md)

## Result

Implementado como Drawer responsivo em cada card de produto descoberto, acionado pelo botão "Histórico de recorrência".

Componente:
- `ProductRecurrenceHistoryDrawer` usa o Sheet/Radix existente, preservando foco, teclado e botão de fechar acessível.
- O endpoint só é consultado quando o Drawer é aberto.
- O painel lista query, categoria, marketplace e data formatada em `pt-BR`.
- Cada ocorrência é um link para `/marketplace-searches/:searchId`.
- A nota "Associações legadas não comprovadas não estão incluídas neste histórico." fica visível no topo do painel.

Endpoint REST integrado:
- `GET /marketplace-products/:productId/searches` com `page=1` e `limit=10` no painel.

Fluxos testados:
- Abrir o Drawer pelo produto.
- Carregar ocorrências pelo endpoint de histórico.
- Exibir query, categoria, marketplace e data em `pt-BR`.
- Navegar diretamente para a busca relacionada pelo item do histórico.
- Exibir a nota de associações legadas.
