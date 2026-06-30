---
title: "Renderizar tabela operacional do historico de buscas"
status: "needs-triage"
type: "AFK"
parent: "docs/marketplace-search-history/prd.md"
blocked_by: ["docs/marketplace-search-history/tickets/001-criar-contrato-e-carregamento-do-historico-de-buscas.md"]
user_stories: [3, 4, 5, 6, 10, 11, 12, 18, 19, 22]
---

## Parent

`docs/marketplace-search-history/prd.md`

## What to build

Renderizar a listagem operacional de buscas usando componentes existentes do projeto. Cada linha deve tratar a busca como entidade principal, mostrar contexto de negocio e manter atalhos tecnicos uteis para uso pessoal.

A implementação deve usar primeiro componentes shadcn ja instalados em `src/components`, incluindo tabela, badges, botoes, tooltips e componentes de data table quando aplicavel. As telas de template em `src/features/template/tasks` e `src/features/template/users` devem ser usadas como referencia de composição, tabela, colunas e ações, sem copiar dados fake para a feature final.

## Acceptance criteria

- [ ] A tela segue a composição com provider, `Header fixed`, `Main`, cabeçalho de conteúdo, botões primários e dialogs quando necessário.
- [ ] A listagem exibe marketplace, termo, categoria, limite solicitado, status, encontrados, salvos, criação e conclusão quando disponível.
- [ ] O status usa a representação visual já usada em detalhes/diagnóstico, evitando uma nova linguagem visual para os mesmos estados.
- [ ] Buscas `failed` e `manual_required` exibem erro resumido quando a API fornecer erro.
- [ ] A ação principal de cada busca navega para `/marketplace-searches/:searchId`.
- [ ] A ação secundária navega para `/automation-tasks/:taskId`.
- [ ] `taskId` aparece apenas de forma secundária ou abreviada, preservando a busca como entidade principal.
- [ ] A tabela/lista permanece utilizável em viewport desktop e menor, sem sobreposição de texto ou controles.
- [ ] Controles interativos possuem nomes acessíveis e navegação por teclado.
- [ ] Testes cobrem renderização das colunas/campos principais, todos os estados de task, erro resumido e navegação para detalhes/diagnóstico.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/marketplace-search-history/tickets/001-criar-contrato-e-carregamento-do-historico-de-buscas.md`
