---
title: "Ajustes de Layout e Configuração de Navegação"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: []
user_stories: [1, 75, 76, 77, 85]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Reorganização e limpeza do layout principal e da barra de navegação lateral para destacar os fluxos de negócio reais do Lead Magnet (Buscas, Produtos e Capturas) e remover ou ocultar itens puramente demonstrativos do template. Adicionar um atalho de acesso rápido para iniciar uma "Nova Busca" na navegação principal.

## Acceptance criteria

- [ ] A barra de navegação lateral apresenta apenas links do domínio Lead Magnet: Nova Busca (`/marketplace-searches/new`), Histórico de Buscas (ou espaço reservado) e Acesso a Logs Técnicos/Diagnósticos.
- [ ] Itens de menu demonstrativos ou de exemplo que não possuem relação direta com o produto são ocultados da navegação principal.
- [ ] A navegação é acessível via teclado (foco e ativação consistentes).
- [ ] O visual respeita o tema, as fontes e as preferências visuais existentes no template.
- [ ] A seção `Result` documenta o comportamento entregue, os principais arquivos modificados e responsabilidades, decisões relevantes e validações visuais ou de acessibilidade executadas.

## Blocked by

None - can start immediately.
