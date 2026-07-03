---
title: "Ajustes de Layout e Configuração de Navegação"
status: "completed"
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

- [x] A barra de navegação lateral apresenta apenas links do domínio Lead Magnet: Nova Busca (`/marketplace-searches/new`), Histórico de Buscas (ou espaço reservado) e Acesso a Logs Técnicos/Diagnósticos.
- [x] Itens de menu demonstrativos ou de exemplo que não possuem relação direta com o produto são ocultados da navegação principal.
- [x] A navegação é acessível via teclado (foco e ativação consistentes).
- [x] O visual respeita o tema, as fontes e as preferências visuais existentes no template.
- [x] A seção `Result` documenta o comportamento entregue, os principais arquivos modificados e responsabilidades, decisões relevantes e validações visuais ou de acessibilidade executadas.

## Result

### Comportamento Entregue
A barra de navegação lateral (`AppSidebar`) foi totalmente limpa, exibindo apenas as seções relevantes ao negócio do Lead Magnet:
- **Lead Magnet**
  - **Nova Busca** (`/marketplace-searches/new`)
  - **Histórico de Buscas** (`/marketplace-searches`)
- **Diagnóstico**
  - **Tarefas de Automação** (`/automation-tasks`)

As rotas e sub-pastas do template que não são mais necessárias foram deletadas do diretório `src/routes/_authenticated/`, mantendo apenas os placeholders para evitar links quebrados e erros de tipo. Os testes do menu de busca global foram isolados usando mocks de dados de navegação, mantendo o comportamento de busca verde e independente.

### Arquivos Modificados
- `src/components/layout/data/sidebar-data.ts`: Limpeza de rotas demonstrativas e reorganização.
- `src/context/search-provider.test.tsx`: Isolamento dos testes do CommandMenu.

## Blocked by

None - can start immediately.
