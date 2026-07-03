---
title: "Renderizar resumo operacional e tabela de automation tasks"
status: "needs-triage"
type: "AFK"
parent: "docs/features/automation-task-listing-frontend/prd.md"
blocked_by: ["docs/features/automation-task-listing-frontend/tickets/001-criar-contrato-e-carregamento-da-listagem-de-automation-tasks.md"]
user_stories: [3, 4, 5, 6, 14, 15, 16, 17, 18, 22, 25, 26, 30, 31, 34]
---

## Parent

`docs/features/automation-task-listing-frontend/prd.md`

## What to build

Renderizar a experiência operacional principal da listagem: cards compactos de resumo baseados no `summary` retornado pelo backend e tabela de automation tasks com colunas, labels, badges e ações descritas no PRD.

A tabela deve reutilizar os componentes globais de data table e adaptar os padrões de `template/tasks` e do historico de buscas sem copiar ações de criar, editar, importar, deletar ou bulk actions. Componentes locais devem ficar em `src/features/automation-tasks/listing/components/`; provider, primary buttons e dialogs devem existir conforme arquitetura, mesmo que sejam mínimos por esta tela ser observacional.

## Acceptance criteria

- [ ] A tela exibe cards compactos de resumo por status usando `summary` do backend.
- [ ] O resumo respeita o recorte retornado pela API e nao calcula indicadores divergentes no cliente.
- [ ] A tabela usa TanStack Table com paginação manual e `rowCount` vindo do backend.
- [ ] As colunas visiveis incluem task, status, marketplace, tentativas, criada em, inicio, conclusão, erro e ações.
- [ ] A coluna principal prioriza tipo e contexto da task, com identificador curto como suporte.
- [ ] Status usa badge consistente com o componente existente quando houver export publico adequado, ou helper local pequeno quando nao houver.
- [ ] Tipos de task recebem labels em portugues: busca de produtos, captura de afiliado, captura HTML, geracao de conteudo e publicacao.
- [ ] Marketplaces conhecidos recebem labels amigaveis: Amazon, Mercado Livre e Shopee.
- [ ] Erro resumido usa truncamento visual seguro sem quebrar layout.
- [ ] A ação principal navega para `/automation-tasks/$taskId` com os parametros de diagnostico esperados.
- [ ] A ação secundaria navega para a entidade de negocio relacionada quando `context` trouxer `originUrl` ou identificador equivalente.
- [ ] Tasks sem contexto relacional exibem fallback claro e nao renderizam link secundario quebrado.
- [ ] Componentes locais focam em apresentação e nao chamam Axios, services ou React Query diretamente.
- [ ] A UI evita re-renderizações evitaveis: opções de filtro/labels estaticas ficam fora do render quando possivel e componentes pesados nao sao definidos inline.
- [ ] Filtros, links e ações têm labels acessiveis e foco visivel.
- [ ] Testes cobrem cards de resumo, linhas com contexto de busca de marketplace, linhas com contexto de captura afiliada, fallback sem contexto, link principal e link secundario.
- [ ] A secao `Result` documenta o comportamento entregue, Diagrama Mermaid caso aplicavel, os principais arquivos ou contratos, Responsabilidade de cada arquivo, explicações sobre conceitos (caso aplicavel e necessario), decisoes e limites relevantes e as validacoes executadas.

## Blocked by

- `docs/features/automation-task-listing-frontend/tickets/001-criar-contrato-e-carregamento-da-listagem-de-automation-tasks.md`
