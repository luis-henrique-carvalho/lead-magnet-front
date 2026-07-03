# Listagem de Automation Tasks - Frontend

## Problem Statement

O operador da plataforma precisa acompanhar as automacoes executadas pelo Lead Magnet em uma tela operacional unica. Hoje a rota de `Tarefas de Automacao` existe no frontend, mas ainda mostra apenas um estado "Em breve". O frontend ja possui diagnostico individual por `taskId`, stream SSE global de eventos de automation tasks e historico de buscas de marketplace, mas nao oferece uma listagem navegavel, filtravel e atualizada das tasks.

Isso dificulta responder perguntas operacionais simples: quais tasks estao processando, quais falharam, quais exigem acao manual, quais foram criadas em um periodo e qual contexto de negocio originou cada task. O usuario tambem precisa navegar manualmente por links de detalhes ou por telas de dominio, em vez de partir de uma visao central de automacoes.

A aplicacao usa o Shadcn Admin como base visual e ja possui uma tela template de tasks que resolve boa parte do padrao de UI/UX para tabela, toolbar, filtros, provider, dialogs e composicao de layout. Tambem ja existe um padrao real de historico de buscas com React Query, schemas Zod, services HTTP, URL state e tabela paginada pelo servidor. A nova tela deve adaptar esses padroes para o dominio real de `AutomationTask`, sem copiar fluxos de criacao, edicao, importacao ou delecao que pertencem apenas ao template.

## Solution

Criar uma tela real de `Tarefas de Automacao` em `/automation-tasks`, usando o endpoint REST `GET /automation-tasks` como fonte de verdade para a listagem e o stream SSE existente como gatilho de atualizacao em tempo real.

A tela deve seguir a composicao Shadcn Admin documentada no projeto: header fixo, area principal com titulo e descricao, controles primarios quando aplicavel, cards compactos de resumo e tabela de dados. A tabela deve reutilizar os componentes globais de data table e adaptar a referencia visual de `template/tasks` apenas onde ela fizer sentido para o caso operacional.

O usuario deve conseguir ver todas as tasks, filtrar por texto, status, tipo, marketplace e intervalo de criacao, navegar para o diagnostico tecnico da task e, quando houver contexto de negocio, abrir a entidade relacionada como acao secundaria. A tela deve exibir estados de carregamento, erro com retry, vazio sem filtros, vazio com filtros e atualizacoes vindas de eventos SSE por invalidacao/refetch de React Query.

## User Stories

1. As an operador da plataforma, I want ver uma lista de automation tasks, so that eu acompanhe o que o sistema executou ou esta executando.
2. As an operador da plataforma, I want acessar a tela pela rota `/automation-tasks`, so that eu tenha uma entrada central para automacoes.
3. As an operador da plataforma, I want ver tasks pendentes e em processamento, so that eu acompanhe trabalho ativo.
4. As an operador da plataforma, I want ver tasks concluidas, parciais, falhas e com acao manual requerida, so that eu entenda o estado completo do pipeline.
5. As an operador da plataforma, I want ver cards compactos de resumo por status, so that eu identifique rapidamente problemas operacionais.
6. As an operador da plataforma, I want que o resumo respeite filtros de contexto, so that os indicadores reflitam o recorte analisado.
7. As an operador da plataforma, I want buscar por texto, so that eu encontre uma task por identificador ou contexto de origem.
8. As an operador da plataforma, I want filtrar por status, so that eu foque em falhas, pendencias ou execucoes ativas.
9. As an operador da plataforma, I want filtrar por tipo de task, so that eu separe buscas de produtos, capturas afiliadas e demais automacoes.
10. As an operador da plataforma, I want filtrar por marketplace, so that eu analise apenas tasks de um canal especifico.
11. As an operador da plataforma, I want filtrar por intervalo de criacao, so that eu investigue tasks de um periodo.
12. As an operador da plataforma, I want filtros sincronizados na URL, so that eu possa compartilhar ou recarregar a mesma visao.
13. As an operador da plataforma, I want paginacao pelo servidor, so that a tela continue eficiente com volume crescente.
14. As an operador da plataforma, I want ver tipo e contexto da task como informacao principal da linha, so that eu reconheca o trabalho sem depender apenas do UUID.
15. As an operador da plataforma, I want ver status com badge consistente, so that eu identifique estados rapidamente.
16. As an operador da plataforma, I want ver marketplace, tentativas, criacao, inicio, conclusao e erro resumido, so that eu tenha contexto operacional suficiente na tabela.
17. As an operador da plataforma, I want abrir o diagnostico da task pela acao principal, so that eu veja tentativas, dependencias e resultado tecnico.
18. As an operador da plataforma, I want abrir a entidade de negocio relacionada quando existir, so that eu navegue para a busca de marketplace ou outro contexto.
19. As an operador da plataforma, I want ver uma tela de carregamento consistente com o restante do app, so that a experiencia nao fique quebrada enquanto os dados carregam.
20. As an operador da plataforma, I want receber uma mensagem de erro com botao de tentar novamente, so that eu consiga recuperar uma falha temporaria da API.
21. As an operador da plataforma, I want ver um estado vazio quando nao houver tasks, so that eu entenda que ainda nao ha automacoes registradas.
22. As an operador da plataforma, I want ver um estado vazio filtrado, so that eu saiba que os filtros atuais nao encontraram resultados.
23. As an operador da plataforma, I want que a lista atualize apos eventos `task.created` e `task.updated`, so that eu nao precise recarregar a pagina manualmente.
24. As an operador da plataforma, I want ver o status de conexao das automacoes quando apropriado, so that eu saiba se atualizacoes em tempo real estao degradadas.
25. As an usuario de teclado, I want navegar por filtros, tabela e links com foco visivel, so that eu consiga usar a tela sem mouse.
26. As an usuario de leitor de tela, I want labels e textos acessiveis em filtros, links e estados, so that eu entenda a finalidade dos controles.
27. As an desenvolvedor, I want schemas Zod para validar respostas da API, so that quebras de contrato sejam detectadas no frontend.
28. As an desenvolvedor, I want services isolados para chamadas HTTP, so that componentes nao dependam diretamente de Axios.
29. As an desenvolvedor, I want hooks React Query com query keys estaveis, so that invalidacoes via SSE e filtros funcionem de forma previsivel.
30. As an desenvolvedor, I want componentes locais pequenos e focados em apresentacao, so that a feature siga a arquitetura documentada do frontend.
31. As an desenvolvedor, I want reaproveitar componentes globais e o template de tasks quando apropriado, so that a tela fique consistente com o Shadcn Admin sem recriar UI.
32. As an mantenedor, I want testes cobrindo carregamento, erro, filtros, navegacao e invalidacao, so that refatoracoes nao quebrem o fluxo operacional.
33. As an mantenedor, I want que a rota de diagnostico por `taskId` continue funcionando, so that links existentes nao sejam quebrados.
34. As an mantenedor, I want que a tela de listagem nao implemente acoes destrutivas, so that a primeira versao permaneça observacional e segura.

## Implementation Decisions

- A tela sera implementada na feature de automation tasks, em uma subfeature propria de listagem.
- A rota `/automation-tasks` deixara de ser placeholder e passara a renderizar a tela real.
- A rota `/automation-tasks/$taskId` de diagnostico individual sera preservada.
- A composicao visual seguira o padrao Shadcn Admin documentado: `Header fixed`, `Search`, `ThemeSwitch`, `ConfigDrawer`, `ProfileDropdown`, `Main`, titulo, descricao, conteudo principal e dialogs quando houver necessidade real.
- A referencia visual de `template/tasks` sera usada para tabela, colunas, toolbar, URL state e padrao geral de data table, mas nao serao copiadas acoes de criar, editar, importar, deletar ou bulk actions que nao existem para automation tasks.
- A tela real de historico de buscas sera usada como prior art para service HTTP, hook React Query, schema Zod, loading/error/empty states e tabela com paginacao manual.
- O endpoint REST consumido sera `GET /automation-tasks`.
- A query string da rota deve validar `page`, `limit`, `query`, `status`, `type`, `marketplace`, `createdFrom` e `createdTo`.
- `page` deve iniciar em 1 e `limit` deve respeitar o limite maximo aceito pelo backend.
- `createdFrom` e `createdTo` devem trafegar como datas simples `YYYY-MM-DD`, sem conversao para date-time no frontend.
- A API REST sera a fonte de verdade. O SSE nao deve tentar aplicar patches otimistas linha a linha.
- Eventos SSE `task.created` e `task.updated` devem invalidar as query keys da listagem para disparar refetch.
- A invalidacao atual de automation events devera incluir a raiz/lista de automation tasks, alem das chaves ja existentes de marketplace searches.
- A tela deve exibir um resumo compacto usando o `summary` retornado pelo backend.
- Os cards de resumo devem ser funcionais e discretos, adequados a uma tela operacional, nao a um dashboard analitico amplo.
- As colunas visiveis da primeira versao serao: task, status, marketplace, tentativas, criada em, inicio, conclusao, erro e acoes.
- A coluna principal deve priorizar tipo e contexto da task, com identificador curto como suporte.
- A acao principal da linha deve navegar para o diagnostico tecnico da task.
- A acao secundaria deve navegar para a entidade de negocio relacionada quando `context` trouxer `originUrl` ou identificador equivalente.
- O status deve usar badge consistente com o componente existente de status de automacao quando possivel.
- Tipos de task devem receber labels em portugues: busca de produtos, captura de afiliado, captura HTML, geracao de conteudo e publicacao.
- Marketplaces devem receber labels amigaveis quando conhecidos: Amazon, Mercado Livre e Shopee.
- O erro deve ser resumido na tabela, com truncamento visual seguro e sem quebrar layout.
- A tabela deve usar paginacao manual do TanStack Table com `rowCount` vindo do backend.
- Filtros de status, tipo e marketplace devem usar os componentes globais de data table/faceted filters quando atenderem ao caso.
- O filtro de data deve reutilizar componente global existente quando possivel. Caso o componente atual nao atenda intervalo, um componente local pequeno pode ser criado.
- Services devem usar o cliente HTTP global.
- Hooks devem encapsular React Query e query keys.
- Schemas devem usar Zod e inferir types a partir dos schemas.
- Componentes nao devem chamar Axios diretamente.
- A feature deve exportar a tela pelo entrypoint publico da feature de automation tasks.
- A feature nao deve importar arquivos internos de marketplace-searches, exceto quando houver export publico apropriado. Caso seja necessario compartilhar labels ou badges, preferir mover para `automation-tasks/shared` ou criar helpers locais pequenos.
- Nenhuma alteracao de schema backend e parte desta feature.
- Nenhuma alteracao de contrato SSE backend e parte desta feature.

## Testing Decisions

- Testar a rota `/automation-tasks` carregando a tela de listagem com parametros de busca validados.
- Testar o service de listagem parseando a resposta com Zod e rejeitando payload invalido.
- Testar o hook de listagem com React Query para garantir query key estavel e chamada ao service com filtros corretos.
- Testar que filtros de texto, status, tipo, marketplace e datas atualizam a URL usando o padrao `useTableUrlState` ou equivalente.
- Testar estado de loading com skeleton.
- Testar estado de erro com alerta e botao de retry.
- Testar estado vazio sem filtros.
- Testar estado vazio com filtros ativos.
- Testar renderizacao de cards de resumo a partir do `summary`.
- Testar renderizacao de linhas com contexto de busca de marketplace.
- Testar renderizacao de linhas com contexto de captura afiliada.
- Testar fallback para tasks sem contexto relacional.
- Testar link principal para `/automation-tasks/$taskId`.
- Testar link secundario para origem quando houver `originUrl`.
- Testar que a invalidacao por evento SSE inclui query keys da listagem de automation tasks.
- Reutilizar como prior art os testes de `automation-events-provider`, rota de diagnostico de automation tasks, tela de historico de buscas e componentes de template tasks.
- Testes de e2e completos com backend real ficam fora do minimo obrigatorio desta PRD, mas uma rota renderizada com mocks de API deve ser coberta quando o padrao atual permitir.
- Componentes puramente visuais e triviais podem ser cobertos indiretamente por testes da tela quando nao tiverem regra propria.

## Out of Scope

- Criar, editar, importar ou deletar automation tasks.
- Criar acoes em lote.
- Implementar retry manual, cancelamento ou reprocessamento de tasks.
- Alterar a tela de diagnostico individual alem de preservar sua navegacao.
- Alterar o endpoint REST backend `GET /automation-tasks`.
- Alterar o contrato SSE backend.
- Implementar atualizacao otimista linha a linha a partir de eventos SSE.
- Criar dashboard analitico completo de duracao media, taxa de falha ou performance historica.
- Criar grafo visual de dependencias na listagem.
- Expor historico completo de tentativas dentro da tabela.
- Expor payloads grandes ou resultados completos dentro da listagem.
- Resolver autenticacao/isolamento multiusuario do stream SSE.
- Refatorar globalmente o template Shadcn Admin.

## Further Notes

- Assumimos que o backend `GET /automation-tasks` ja entrega `items`, `page`, `limit`, `total` e `summary`.
- Assumimos que o backend usa `createdFrom` e `createdTo` como datas simples `YYYY-MM-DD`, com `createdTo` inclusivo na experiencia do usuario.
- Assumimos que o `summary` do backend ignora apenas o filtro de status, mantendo filtros de contexto.
- Assumimos que a listagem sera observacional na primeira versao; qualquer acao mutavel deve virar nova PRD ou novo ticket.
- O frontend ja possui `AutomationEventsProvider` no layout autenticado, entao a tela nao deve abrir uma segunda conexao SSE propria.
- O hook atual de eventos invalida chaves de marketplace searches. A listagem precisara de query keys proprias para permitir invalidacao direta.
- O SSE existente no backend tem pontos de autenticacao comentados. A tela deve tratar status `degraded` como sinal operacional, mas nao tentar resolver autenticacao do stream nesta entrega.
- A tela de template tasks e util como referencia de UI, mas contem acoes de CRUD/import/delete que nao pertencem a automation tasks.
- A tela de historico de buscas e a referencia mais proxima para dados reais, paginação manual e estados remotos.
- O projeto possui regra explicita de arquitetura de features: services para HTTP, hooks para React Query e componentes locais apenas para apresentacao.
