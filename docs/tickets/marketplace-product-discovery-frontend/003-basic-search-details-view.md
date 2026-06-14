---
title: "Detalhes Básicos da Busca (REST)"
status: "needs-triage"
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

- [ ] A rota `/marketplace-searches/:searchId` carrega e renderiza com sucesso os dados de resumo da busca.
- [ ] Rótulos e cores do status da automação (pendente, processando, concluída, parcial, falhou, ação manual requerida) são apresentados de forma consistente, distinguindo visualmente estados positivos, alertas e falhas.
- [ ] Exibe os contadores de "Produtos encontrados" e "Produtos salvos" e o ciclo de vida temporal (criada em, concluída em) formatados no locale `pt-BR`.
- [ ] Exibe esqueleto de carregamento (skeletons) coerente com o conteúdo.
- [ ] Oferece um fluxo de "Tentar novamente" na ocorrência de falhas na requisição HTTP. Exibe página customizada 404 caso a busca não exista.
- [ ] A seção `Result` documenta o comportamento entregue, os contratos HTTP e esquemas usados, e os testes ou validações aplicadas.

## Blocked by

[002-marketplace-search-creation-form.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/002-marketplace-search-creation-form.md)
