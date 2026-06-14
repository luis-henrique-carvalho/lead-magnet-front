---
title: "Formulário de Criação de Nova Busca"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: []
user_stories: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 71, 72, 73, 74, 79, 80, 85, 86, 87, 88]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Desenvolvimento da página e rota de criação de busca (`/marketplace-searches/new`). Implementar o formulário que consome o endpoint `POST /marketplaces/search`, contendo inputs para Marketplace (select de opções habilitadas), Palavra-chave, Categoria (opcional) e Limite (campo numérico com validação). O formulário deve apresentar validações imediatas e estados visuais de envio (loading), prevenindo submissões duplicadas e tratando erros com mensagens em português.

## Acceptance criteria

- [ ] A rota `/marketplace-searches/new` exibe um formulário funcional com validação via React Hook Form e Zod.
- [ ] O select de Marketplace exibe opções configuradas do backend (Mercado Livre, Amazon, Shopee), tratando limitações de providers se aplicável.
- [ ] Validações imediatas impedem o envio de limites fora da faixa aceita pela API. Indica claramente campos opcionais e obrigatórios.
- [ ] Exibe feedback de "loading/processando" ao enviar e desabilita o botão para evitar submissões repetidas.
- [ ] Trata erros HTTP convertendo-os em mensagens de domínio claras em português.
- [ ] Após o sucesso na API (`POST /marketplaces/search`), o operador é redirecionado para `/marketplace-searches/:searchId`.
- [ ] A seção `Result` documenta o comportamento entregue, os contratos HTTP e schemas de validação usados, e as validações automatizadas/manuais efetuadas.

## Blocked by

None - can start immediately.
