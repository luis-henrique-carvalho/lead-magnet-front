---
title: "Lista de Produtos Descobertos com Paginação na URL"
status: "completed"
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

- [x] Consome `GET /marketplace-searches/:searchId/products?page=...&limit=...` com limite máximo respeitando as regras do backend (máx 100).
- [x] Exibe os produtos em grid/lista com imagem, título, preço formatado em BRL, avaliação, quantidade de reviews, volume de vendas e categoria.
- [x] Apresenta de forma consistente campos ausentes (ex: exibe "Não disponível" ou ícone apropriado, sem converter para zero).
- [x] O componente de paginação é sincronizado bidirecionalmente com os query params da URL e corrige automaticamente páginas fora do range de resultados.
- [x] Exibe um estado vazio descritivo enquanto a busca ativa ainda não encontrou produtos e uma mensagem clara quando a busca é concluída e não há produtos.
- [x] Os links externos para a página original do produto abrem em uma nova aba com diretivas de segurança (`rel="noopener noreferrer"`).
- [x] A seção `Result` documenta os componentes criados ou adaptados, a integração com o estado de URL, e os cenários testados (com e sem dados).

## Result

### Comportamento entregue

- A query de produtos consome `GET /marketplace-searches/:searchId/products` com `page` e `limit`; a consulta começa em paralelo ao detalhe da busca para evitar waterfall desnecessário.
- Os resultados são exibidos em cards responsivos com imagem lazy, título, marketplace, categoria, preço BRL, rating, reviews, vendas e link externo protegido por `target="_blank"` e `rel="noopener noreferrer"`.
- Campos opcionais nulos permanecem semanticamente ausentes e usam “Não disponível” ou fallback visual de imagem, sem coerção para zero.
- `page` e `limit` são validados pela rota com Zod. Os controles atualizam a URL, restaurações do browser alimentam a query e páginas acima do último resultado são corrigidas automaticamente.
- O seletor oferece limites de 10, 20, 50 e 100 itens. Estados vazios distinguem busca ativa de execução terminal; falhas exclusivas dos produtos têm retry próprio.
- Os cards usam `content-visibility: auto` e imagens com `loading="lazy"` para reduzir trabalho de renderização fora da viewport.

### Arquivos principais

- `src/features/marketplace-searches/details/schemas/search-products-schema.ts`
- `src/features/marketplace-searches/details/components/product-card.tsx`
- `src/features/marketplace-searches/details/components/products-list.tsx`
- `src/features/marketplace-searches/details/components/products-pagination.tsx`
- `src/features/marketplace-searches/details/hooks/use-correct-products-page.ts`
- `src/routes/_authenticated/marketplace-searches/$searchId.tsx`

### Cenários testados

- Produto completo, campos opcionais ausentes e link externo seguro.
- Busca ativa sem resultados e busca concluída sem resultados.
- Próxima página, mudança de limite, correção de página inválida e sincronização real com query params da rota.
- Falha temporária exclusiva da listagem com retry sem invalidar o resumo já carregado.

## Blocked by

[003-basic-search-details-view.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/003-basic-search-details-view.md)
