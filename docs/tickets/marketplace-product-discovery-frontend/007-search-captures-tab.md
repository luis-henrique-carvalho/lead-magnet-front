---
title: "Aba de Capturas Relacionadas à Busca"
status: "needs-triage"
type: "AFK"
parent: "lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md"
blocked_by: ["lead-magnet-front/docs/tickets/006-enqueue-affiliate-link-capture-action.md"]
user_stories: [44, 45, 46, 47, 48, 49, 50, 52, 71, 72, 165, 166]
---

## Parent

[PRD - Fluxo de descoberta de produtos no frontend](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/prds/marketplace-product-discovery-frontend.md)

## What to build

Desenvolvimento da aba ou seção de Capturas dentro da página de detalhes da busca `/marketplace-searches/:searchId`. Esta aba exibe a listagem paginada das tarefas de captura originadas por essa busca, consumindo `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks` com paginação independente e sincronizada com a URL. Exibir o status de cada captura, link de afiliado gerado (com opção de copiar/abrir), timestamps do ciclo de vida da tarefa e atalho de diagnóstico para a task de automação de origem.

## Acceptance criteria

- [ ] A aba exibe a listagem consumindo `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks?page=...&limit=...` de forma paginada.
- [ ] Para cada item, exibe o nome do produto correspondente, o status da tarefa de captura, timestamps (criada, iniciada, finalizada) formatados e o link afiliado (quando disponível).
- [ ] Adiciona botão para copiar a URL de afiliado e outro para abri-la em uma nova aba com proteções de segurança.
- [ ] Permite abrir a task correspondente via link direto para a rota de diagnóstico `/automation-tasks/:taskId`.
- [ ] Sinaliza claramente tarefas que exigem ação manual (`manual_required`).
- [ ] Sincroniza a paginação desta aba na URL de forma independente da listagem de produtos.
- [ ] A listagem se atualiza automaticamente em tempo real através dos eventos SSE (quando integrados via Slice 5).
- [ ] A seção `Result` documenta o componente de tabela/capturas, estado de URL e validação de re-atualizações.

## Blocked by

[006-enqueue-affiliate-link-capture-action.md](file:///home/luis/Documentos/Git/lead_magnet/lead-magnet-front/docs/tickets/006-enqueue-affiliate-link-capture-action.md)
