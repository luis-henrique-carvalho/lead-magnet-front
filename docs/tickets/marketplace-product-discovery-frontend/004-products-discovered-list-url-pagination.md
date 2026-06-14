---
title: "Lista de Produtos Descobertos com Paginação na URL"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/003-basic-search-details-view.md"]
user_stories: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 68, 69, 70, 71, 72, 81, 84, 85, 89]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Exibição da lista paginada de produtos descobertos integrada dentro da página `/marketplace-searches/:searchId`. A lista consome o endpoint `GET /marketplace-searches/:searchId/products` aceitando parâmetros de paginação (`page` e `limit`). O estado da paginação deve ser refletido nos parâmetros de busca (query params) da URL para suportar recarregamento e navegação do browser. Os produtos devem ser apresentados em ordem de descoberta com imagem, título, preço formatado, reviews/ratings, vendas, categoria, marketplace de origem e link externo seguro para a página original.

## Acceptance criteria

- [ ] Consome `GET /marketplace-searches/:searchId/products?page=...&limit=...` com limite máximo respeitando as regras do backend (máx 100).
- [ ] Exibe os produtos em grid/lista com imagem, título, preço formatado em BRL, avaliação, quantidade de reviews, volume de vendas e categoria.
- [ ] Apresenta de forma consistente campos ausentes (ex: exibe "Não disponível" ou ícone apropriado, sem converter para zero).
- [ ] O componente de paginação é sincronizado bidirecionalmente com os query params da URL e corrige automaticamente páginas fora do range de resultados.
- [ ] Exibe um estado vazio descritivo enquanto a busca ativa ainda não encontrou produtos e uma mensagem clara quando a busca é concluída e não há produtos.
- [ ] Os links externos para a página original do produto abrem em uma nova aba com diretivas de segurança (`rel="noopener noreferrer"`).
- [ ] A seção `Result` documenta os componentes criados ou adaptados, a integração com o estado de URL, e os cenários testados (com e sem dados).

## Blocked by

[003-basic-search-details-view.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/003-basic-search-details-view.md)
