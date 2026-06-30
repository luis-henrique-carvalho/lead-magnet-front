---
title: "Detalhes Básicos da Busca (REST)"
status: "completed"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/002-marketplace-search-creation-form.md"]
user_stories: [13, 14, 15, 16, 17, 18, 21, 68, 69, 70, 71, 72, 83, 85, 86]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Desenvolvimento da rota de detalhes da busca (`/marketplace-searches/:searchId`). Realizar a consulta inicial de dados da busca no endpoint REST `GET /marketplace-searches/:searchId` e exibir o resumo dos filtros solicitados (marketplace, palavra-chave, categoria, limite), status da automação (utilizando rótulos e cores do ciclo de vida das tasks) e contadores de produtos (encontrados vs salvos). Tratar os estados de carregamento, erros temporários com opção de tentar novamente, e rota não encontrada (404).

## Acceptance criteria

- [x] A rota `/marketplace-searches/:searchId` carrega e renderiza com sucesso os dados de resumo da busca.
- [x] Rótulos e cores do status da automação (pendente, processando, concluída, parcial, falhou, ação manual requerida) são apresentados de forma consistente, distinguindo visualmente estados positivos, alertas e falhas.
- [x] Exibe os contadores de "Produtos encontrados" e "Produtos salvos" e o ciclo de vida temporal (criada em, concluída em) formatados no locale `pt-BR`.
- [x] Exibe esqueleto de carregamento (skeletons) coerente com o conteúdo.
- [x] Oferece um fluxo de "Tentar novamente" na ocorrência de falhas na requisição HTTP. Exibe página customizada 404 caso a busca não exista.
- [x] A seção `Result` documenta o comportamento entregue, os contratos HTTP e esquemas usados, e os testes ou validações aplicadas.

## Result

### Comportamento entregue

- A rota autenticada renderiza o resumo da busca no padrão visual do Shadcn Admin, com header fixo, ação para nova busca, filtros solicitados, contadores e datas em `pt-BR`.
- O detalhe usa `GET /marketplace-searches/:searchId`; o status real da automação é consultado em `GET /automation-tasks/:taskId`, pois o contrato do detalhe fornece o `taskId`, mas não o status.
- Os contratos recebidos são validados com Zod antes de chegarem aos componentes. React Query mantém query keys separadas para detalhe, task e produtos.
- Os seis estados de automação possuem rótulos e tons centralizados. Falhas temporárias permitem retry seletivo e HTTP 404 apresenta uma página específica de busca não encontrada.
- Skeletons preservam a estrutura visual do resumo durante o carregamento.

### Arquivos principais

- `src/features/marketplace-searches/details/index.tsx`
- `src/features/marketplace-searches/details/schemas/search-details-schema.ts`
- `src/features/marketplace-searches/details/services/search-details-service.ts`
- `src/features/marketplace-searches/details/hooks/use-search-details.ts`
- `src/features/marketplace-searches/details/components/automation-status-badge.tsx`
- `src/features/marketplace-searches/details/components/search-summary.tsx`
- `src/routes/_authenticated/marketplace-searches/$searchId.tsx`

### Validação

- Testes de browser cobrem carregamento bem-sucedido, resumo, datas, retry, 404 e os seis rótulos de status.
- A implementação foi desenvolvida em ciclos RED-GREEN e validada junto aos cenários do ticket 004.

## Blocked by

[002-marketplace-search-creation-form.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/002-marketplace-search-creation-form.md)
