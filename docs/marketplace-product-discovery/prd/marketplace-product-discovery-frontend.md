# PRD - Fluxo de descoberta de produtos no frontend

## Problem Statement

O Lead Magnet possui uma API funcional para pesquisar produtos em marketplaces, acompanhar o processamento assincrono, consultar produtos descobertos e iniciar capturas de links afiliados. O frontend, entretanto, ainda e composto quase integralmente pelas telas demonstrativas do template shadcn-admin e nao oferece um fluxo de negocio utilizavel para essas capacidades.

Como operador da plataforma, o usuario precisa sair do terminal e da documentacao da API para realizar o trabalho principal de descoberta e preparacao de produtos. Hoje ele nao consegue iniciar uma busca, acompanhar sua conclusao, avaliar os produtos encontrados ou verificar a captura de links afiliados em uma interface integrada.

O primeiro incremento do frontend precisa entregar um percurso real e coerente, usando os contratos REST existentes e adicionando um stream SSE para notificacoes de mudanca das automacoes, sem simular dashboards, listagens globais ou outras operacoes ainda nao suportadas pela API.

## Solution

Criar no frontend um fluxo autenticado de descoberta de produtos que permita:

- iniciar uma busca informando marketplace, palavra-chave, categoria e limite;
- acompanhar o estado da automacao que executa a busca;
- consultar os dados e contadores da busca;
- navegar pelos produtos descobertos com paginacao;
- iniciar a captura do link afiliado de um produto;
- acompanhar as capturas originadas pela busca;
- receber atualizacoes das automacoes em tempo real por Server-Sent Events (SSE);
- abrir uma visao tecnica da automacao para investigar tentativas, erros e dependencias;
- consultar em quais buscas um produto voltou a aparecer.

A experiencia sera construida sobre o layout e os componentes existentes do shadcn-admin, substituindo gradualmente a navegacao demonstrativa por uma navegacao orientada ao dominio do Lead Magnet. Os conceitos de busca, produto e captura serao apresentados como elementos principais do negocio. Task, tentativa e dependencia permanecerao disponiveis em uma area de diagnostico, sem dominar o fluxo principal.

## User Stories

1. Como operador da plataforma, quero acessar uma opcao clara para pesquisar produtos, para iniciar meu fluxo de descoberta sem usar diretamente a API.
2. Como operador da plataforma, quero selecionar o marketplace da busca, para executar o provider adequado ao canal que desejo explorar.
3. Como operador da plataforma, quero pesquisar por palavra-chave, para descobrir produtos relacionados a um nicho ou intencao comercial.
4. Como operador da plataforma, quero informar uma categoria opcional, para restringir a descoberta quando essa informacao for relevante.
5. Como operador da plataforma, quero definir o limite de produtos da busca, para controlar o volume de resultados processados.
6. Como operador da plataforma, quero entender quais campos da busca sao opcionais e obrigatorios, para preencher o formulario corretamente.
7. Como operador da plataforma, quero receber validacao imediata dos dados informados, para corrigir erros antes de enviar a busca.
8. Como operador da plataforma, quero impedir o envio de limites fora da faixa aceita pela API, para evitar requisicoes invalidas.
9. Como operador da plataforma, quero ver um estado de envio enquanto a busca e criada, para saber que minha acao esta sendo processada.
10. Como operador da plataforma, quero evitar envios duplicados enquanto a criacao estiver em andamento, para nao iniciar buscas acidentalmente repetidas.
11. Como operador da plataforma, quero receber uma mensagem compreensivel quando a criacao falhar, para saber que a busca nao foi iniciada.
12. Como operador da plataforma, quero ser direcionado para a busca criada, para acompanhar imediatamente sua execucao.
13. Como operador da plataforma, quero ver o marketplace, a palavra-chave, a categoria e o limite solicitados, para confirmar o contexto da busca aberta.
14. Como operador da plataforma, quero ver quando a busca foi criada, para compreender sua recencia.
15. Como operador da plataforma, quero ver quando a busca foi concluida, para entender quanto tempo o processamento levou.
16. Como operador da plataforma, quero ver quantos produtos foram encontrados, para medir o retorno bruto da busca.
17. Como operador da plataforma, quero ver quantos produtos foram salvos, para entender o efeito de normalizacao e deduplicacao.
18. Como operador da plataforma, quero visualizar o estado atual da automacao da busca, para saber se ela esta pendente, processando, concluida, parcial, falhou ou exige acao manual.
19. Como operador da plataforma, quero receber atualizacoes de uma busca ativa em tempo real, para acompanhar seu progresso sem recarregar manualmente a pagina.
20. Como operador da plataforma, quero que a interface deixe de acompanhar uma task quando ela atingir um estado terminal, para encerrar o trabalho de sincronizacao que nao e mais necessario.
21. Como operador da plataforma, quero distinguir visualmente estados positivos, em andamento, de alerta e de falha, para interpretar rapidamente a situacao.
22. Como operador da plataforma, quero abrir os detalhes tecnicos da task de origem, para investigar uma busca que falhou ou ficou bloqueada.
23. Como operador da plataforma, quero ver um estado vazio enquanto uma busca ativa ainda nao encontrou produtos, para nao confundir processamento com erro.
24. Como operador da plataforma, quero ver uma explicacao quando uma busca concluida nao possuir produtos, para entender que a execucao terminou sem resultados.
25. Como operador da plataforma, quero ver os produtos na ordem em que foram descobertos, para preservar o contexto retornado pelo marketplace.
26. Como operador da plataforma, quero ver a imagem do produto quando disponivel, para reconhecer oportunidades com mais rapidez.
27. Como operador da plataforma, quero ver o titulo do produto, para identificar o item encontrado.
28. Como operador da plataforma, quero ver o preco formatado, para avaliar a faixa comercial do produto.
29. Como operador da plataforma, quero ver avaliacao e quantidade de reviews quando disponiveis, para ter sinais iniciais de confianca e interesse.
30. Como operador da plataforma, quero ver a quantidade de vendas quando disponivel, para estimar a tracao do produto.
31. Como operador da plataforma, quero ver a categoria do produto quando disponivel, para contextualizar o resultado.
32. Como operador da plataforma, quero identificar o marketplace de cada produto, para evitar ambiguidade ao navegar pelos resultados.
33. Como operador da plataforma, quero abrir a pagina original do produto em uma nova aba, para conferir os dados diretamente no marketplace.
34. Como operador da plataforma, quero que campos ausentes sejam apresentados de forma consistente, para nao interpretar ausencia de dado como zero.
35. Como operador da plataforma, quero navegar entre paginas de produtos, para consultar buscas maiores sem carregar todos os resultados de uma vez.
36. Como operador da plataforma, quero ver o total de produtos e a pagina atual, para entender minha posicao na listagem.
37. Como operador da plataforma, quero que a pagina da listagem seja refletida na URL, para preservar navegacao, recarregamento e compartilhamento do estado.
38. Como operador da plataforma, quero voltar para uma pagina valida quando a quantidade de resultados mudar, para nao permanecer em uma pagina inexistente.
39. Como operador da plataforma, quero iniciar a captura do link afiliado a partir de um produto descoberto, para preparar o produto para monetizacao.
40. Como operador da plataforma, quero que a captura use automaticamente o produto, marketplace, URL original e busca de origem corretos, para evitar preencher novamente dados ja conhecidos.
41. Como operador da plataforma, quero receber confirmacao de que a captura foi enfileirada, para saber que a solicitacao foi aceita.
42. Como operador da plataforma, quero evitar iniciar repetidamente a mesma captura enquanto a primeira solicitacao esta sendo enviada, para reduzir duplicidade acidental.
43. Como operador da plataforma, quero ser informado quando a captura nao puder ser criada, para compreender que o produto ainda nao esta em processamento.
44. Como operador da plataforma, quero consultar as capturas originadas pela busca, para acompanhar o pipeline de monetizacao dos produtos descobertos.
45. Como operador da plataforma, quero ver qual produto corresponde a cada captura, para relacionar a automacao ao item de negocio.
46. Como operador da plataforma, quero ver o estado de cada captura, para distinguir links pendentes, em processamento, concluidos, falhos ou dependentes de acao manual.
47. Como operador da plataforma, quero ver a URL afiliada capturada quando disponivel, para confirmar o resultado da automacao.
48. Como operador da plataforma, quero copiar ou abrir a URL afiliada capturada, para utiliza-la e valida-la com facilidade.
49. Como operador da plataforma, quero ver quando a captura foi criada, iniciada, finalizada e efetivamente capturada, para auditar seu ciclo de vida.
50. Como operador da plataforma, quero navegar pelas paginas de capturas, para acompanhar buscas com muitos produtos processados.
51. Como operador da plataforma, quero abrir a task de uma captura, para diagnosticar falhas sem perder a referencia do produto.
52. Como operador da plataforma, quero identificar capturas que exigem acao manual, para priorizar intervencoes que bloqueiam a monetizacao.
53. Como operador da plataforma, quero ver os detalhes de uma automation task, para compreender seu tipo, marketplace, estado e timestamps.
54. Como operador da plataforma, quero ver o erro atual e sua classificacao quando uma task falhar, para ter uma explicacao acionavel.
55. Como operador da plataforma, quero ver quantas tentativas uma task realizou, para entender se ela sofreu retries.
56. Como operador da plataforma, quero consultar o historico paginado de tentativas, para investigar cada execucao sem carregar dados ilimitados.
57. Como operador da plataforma, quero ver numero, job, estado, erro e timestamps de cada tentativa, para correlacionar a interface com logs operacionais.
58. Como operador da plataforma, quero consultar predecessoras de uma task, para entender quais trabalhos produziram seus insumos.
59. Como operador da plataforma, quero consultar sucessoras de uma task, para entender quais trabalhos foram originados por ela.
60. Como operador da plataforma, quero distinguir dependencias obrigatorias de opcionais, para compreender por que uma task pode estar bloqueada.
61. Como operador da plataforma, quero abrir uma task relacionada diretamente da lista de dependencias, para navegar pelo fluxo assincrono.
62. Como operador da plataforma, quero ver as predecessoras obrigatorias ainda pendentes, para saber o motivo imediato de um bloqueio.
63. Como operador da plataforma, quero consultar as buscas em que um produto apareceu, para avaliar sua recorrencia ao longo das descobertas.
64. Como operador da plataforma, quero ver query, categoria, marketplace e data de descoberta de cada ocorrencia, para entender em quais contextos o produto foi encontrado.
65. Como operador da plataforma, quero navegar de uma ocorrencia para a busca correspondente, para revisar os demais produtos daquele contexto.
66. Como operador da plataforma, quero que a interface informe que associacoes legadas nao comprovadas nao estao incluidas, para nao interpretar o historico como necessariamente completo.
67. Como operador da plataforma, quero retornar da tela tecnica para o fluxo de negocio relacionado quando essa relacao existir, para nao ficar preso em identificadores internos.
68. Como operador da plataforma, quero ver esqueletos de carregamento coerentes com o conteudo esperado, para perceber estabilidade durante as consultas.
69. Como operador da plataforma, quero tentar novamente uma consulta que falhou, para recuperar erros temporarios sem abandonar a pagina.
70. Como operador da plataforma, quero receber uma pagina de nao encontrado quando uma busca, produto, resultado ou task nao existir, para diferenciar ausencia de falha temporaria.
71. Como operador da plataforma, quero que mensagens e rotulos do fluxo estejam em portugues, para utilizar a ferramenta no idioma da operacao.
72. Como operador da plataforma, quero usar o fluxo em telas menores, para acompanhar buscas e capturas fora de um monitor desktop.
73. Como operador que utiliza teclado, quero navegar e acionar controles sem depender do mouse, para ter uma experiencia acessivel.
74. Como operador que utiliza tecnologia assistiva, quero que formularios, estados, tabelas e acoes tenham nomes acessiveis, para compreender e operar a interface.
75. Como operador da plataforma, quero manter tema, fonte e preferencias visuais existentes no template, para conservar uma experiencia consistente.
76. Como operador da plataforma, quero uma navegacao lateral focada no Lead Magnet, para nao confundir telas demonstrativas do template com funcionalidades reais.
77. Como operador da plataforma, quero acessar rapidamente uma nova busca pela navegacao principal, para reduzir o caminho ate a acao mais frequente.
78. Como operador da plataforma, quero que links profundos para busca e task funcionem apos recarregar a pagina, para retomar investigacoes diretamente.
79. Como desenvolvedor da plataforma, quero contratos de API tipados e centralizados, para que mudancas do backend sejam identificadas durante o desenvolvimento.
80. Como desenvolvedor da plataforma, quero schemas de validacao para formularios e respostas relevantes, para impedir que dados inesperados produzam estados silenciosamente incorretos.
81. Como desenvolvedor da plataforma, quero chaves de consulta consistentes por recurso, identificador e paginacao, para evitar colisao ou invalidacao incorreta no cache.
82. Como desenvolvedor da plataforma, quero encapsular a assinatura SSE de automacoes em uma interface reutilizavel, para aplicar a mesma sincronizacao em buscas, capturas e telas futuras.
83. Como desenvolvedor da plataforma, quero encapsular rotulos, cores e transicoes de status, para manter a representacao das automacoes consistente em todas as telas.
84. Como desenvolvedor da plataforma, quero separar componentes de apresentacao das consultas remotas, para testar estados de interface sem depender de uma API real.
85. Como desenvolvedor da plataforma, quero reutilizar os componentes de tabela, paginacao, formulario e layout do template, para manter consistencia e reduzir codigo duplicado.
86. Como desenvolvedor da plataforma, quero que erros HTTP sejam convertidos em mensagens de dominio compreensiveis, para nao expor respostas tecnicas cruas ao operador.
87. Como desenvolvedor da plataforma, quero configurar a URL base da API por variavel de ambiente, para executar o frontend em ambientes diferentes sem alterar o codigo.
88. Como desenvolvedor da plataforma, quero enviar credenciais nas requisicoes quando exigidas pela autenticacao, para integrar o frontend ao Better Auth e ao CORS configurado no backend.
89. Como desenvolvedor da plataforma, quero preservar os parametros de pagina na navegacao, para que voltar e avancar no navegador restaurem a mesma visao.
90. Como desenvolvedor da plataforma, quero que o build e o lint detectem rotas, tipos e imports invalidos, para manter o primeiro fluxo pronto para evolucao.
91. Como operador da plataforma, quero que a interface se reconecte automaticamente quando o stream cair, para continuar recebendo atualizacoes apos uma falha temporaria de rede.
92. Como operador da plataforma, quero que os dados sejam reconciliados ao reconectar, para recuperar mudancas ocorridas enquanto a conexao esteve indisponivel.
93. Como operador da plataforma, quero atualizar os dados manualmente quando a conexao em tempo real estiver indisponivel, para continuar operando durante uma degradacao do stream.
94. Como operador da plataforma, quero identificar quando as atualizacoes em tempo real estiverem desconectadas, para nao interpretar dados antigos como atuais.
95. Como desenvolvedor da plataforma, quero que eventos SSE carreguem identificador, tipo, task e data da mudanca, para processar notificacoes de forma tipada e idempotente.
96. Como desenvolvedor da plataforma, quero que o stream envie heartbeats periodicos, para manter a conexao viva atraves de proxies e detectar interrupcoes.

## Implementation Decisions

- O primeiro percurso funcional sera `Nova busca -> Detalhes da busca -> Produtos descobertos -> Capturas de afiliado`.
- A tela inicial deste incremento priorizara um acesso direto a nova busca. Um dashboard analitico real dependera de endpoints agregados futuros.
- A navegacao demonstrativa do shadcn-admin sera reduzida ou reorganizada para destacar funcionalidades reais do Lead Magnet. Exemplos sem relacao com o produto nao serao apresentados como recursos disponiveis.
- A rota de nova busca sera `/marketplace-searches/new`.
- A rota de detalhes sera `/marketplace-searches/:searchId` e concentrara resumo, produtos e capturas em secoes ou abas da mesma entidade de negocio.
- A rota de diagnostico sera `/automation-tasks/:taskId`.
- O historico de ocorrencias de um produto podera ser apresentado em drawer responsivo ou pagina secundaria. A escolha visual nao alterara o contrato nem a navegacao de dominio.
- A criacao da busca consumira `POST /marketplaces/search` e usara `searchId` e `taskId` retornados para navegar e acompanhar o processamento.
- O resumo da busca consumira `GET /marketplace-searches/:searchId`.
- A listagem de produtos consumira `GET /marketplace-searches/:searchId/products` com `page` e `limit`, respeitando o limite maximo de 100 aceito pelo backend.
- As capturas relacionadas consumirao `GET /marketplace-searches/:searchId/affiliate-link-capture-tasks` com paginacao independente da listagem de produtos.
- A captura sera iniciada com `POST /affiliate-link-capture`, incluindo `searchId`, `productId`, `marketplace` e `originalProductUrl` derivados do resultado selecionado.
- A tela tecnica consumira `GET /automation-tasks/:taskId`, `GET /automation-tasks/:taskId/attempts`, `GET /automation-tasks/:taskId/dependencies`, `GET /automation-tasks/:taskId/dependents` e `GET /automation-tasks/:taskId/dependencies/pending` conforme necessario.
- O historico do produto consumira `GET /marketplace-products/:productId/searches`.
- A navegacao de um resultado para sua origem podera consumir `GET /marketplace-search-results/:resultId/task` quando a interface precisar reconstruir esse vinculo fora do contexto da busca.
- O frontend usara React Query para cache, mutations, invalidacao e reconciliacao dos dados; TanStack Router para rotas e parametros de URL; React Hook Form e Zod para formulario e validacao; `EventSource` para SSE; e os componentes shadcn existentes para apresentacao.
- A camada de acesso remoto sera um modulo profundo com interface pequena: cliente HTTP configurado, contratos tipados, funcoes por recurso, fabricas de query options e regras de invalidacao. Componentes nao montarao URLs nem conhecerao detalhes do Axios.
- Um modulo de eventos de automacoes encapsulara abertura, fechamento, reconexao, validacao dos eventos e integracao com o cache do React Query. Componentes nao instanciarao `EventSource` diretamente.
- Um modulo de ciclo de vida de automacoes centralizara estados terminais, estados ativos, rotulos e variantes visuais. Essa regra sera compartilhada por busca, captura e diagnostico.
- Um modulo de apresentacao de produtos centralizara formatacao de preco, avaliacao, contagens, links externos e ausencia de dados, evitando regras divergentes entre tabela e historico.
- As paginas serao organizadas por feature de dominio, mantendo componentes especificos, schemas, consultas e testes proximos do fluxo correspondente.
- O backend adicionara `GET /automation-tasks/events`, com resposta `text/event-stream`, como stream autenticado e global de eventos das automacoes acessiveis ao usuario atual.
- Uma unica conexao SSE por instancia aberta do frontend autenticado atendera as telas daquela instancia. Nao sera criada uma conexao separada para cada task exibida.
- O stream emitira eventos `task.created` e `task.updated`. O payload minimo contera `eventId`, `eventType`, `taskId`, `type`, `status`, `marketplace`, `updatedAt` e, quando disponiveis, identificadores de dominio como `searchId` e `productId`.
- O PostgreSQL permanecera como fonte da verdade. Eventos SSE serao notificacoes de mudanca e nao substituirao as consultas REST nem transportarao obrigatoriamente o resultado completo da task.
- Ao receber um evento relacionado a uma busca aberta, o frontend atualizara o resumo conhecido da task e invalidara somente as consultas afetadas, como busca, produtos, capturas, tentativas ou dependencias.
- Quando a task da busca atingir `completed`, `partial`, `failed` ou `manual_required`, os dados da busca e seus produtos serao invalidados para refletir contadores e resultados finais.
- A lista de capturas da busca sera atualizada quando o stream informar criacao ou mudanca de uma task de captura relacionada ao `searchId` aberto.
- A tela de diagnostico reagira somente aos eventos da task visualizada e, quando necessario, invalidara seu resumo, tentativas e dependencias.
- Estados `pending` e `processing` serao considerados ativos. Estados `completed`, `partial`, `failed` e `manual_required` serao considerados terminais, mas a conexao global permanecera aberta enquanto houver uma sessao autenticada interessada em outros eventos.
- O servidor enviara heartbeat em intervalo regular, inicialmente a cada 15 segundos, para manter a conexao e permitir deteccao de indisponibilidade.
- O cliente usara a reconexao automatica do `EventSource`, com orientacao inicial de retry de 3 segundos fornecida pelo stream.
- Ao abrir ou reabrir a conexao, o frontend invalidara as consultas ativas de automacoes para reconciliar eventos que possam ter ocorrido durante a desconexao. A consistencia nao dependera de entrega exatamente uma vez pelo stream.
- Cada evento tera um `id` SSE unico. O cliente ignorara eventos duplicados ja processados durante a mesma instancia aberta do frontend.
- A distribuicao dos eventos entre workers e instancias HTTP usara Redis, ja presente na arquitetura por causa do BullMQ. A notificacao sera publicada somente depois da persistencia do novo estado da task.
- Em ambiente com uma ou varias instancias, eventos em memoria local nao serao usados como fonte unica, pois nao alcancariam clientes conectados a outro processo.
- Quando o stream estiver indisponivel, a interface exibira estado de conexao degradada e oferecera atualizacao manual. Polling periodico nao sera o mecanismo normal nem o fallback automatico desta entrega.
- Apos iniciar uma captura, a consulta de capturas da busca sera invalidada ou atualizada para apresentar a nova task.
- Produtos e capturas terao paginacoes independentes e refletidas nos parametros de busca da URL.
- Datas serao apresentadas no locale `pt-BR`; precos serao apresentados em BRL enquanto os contratos nao fornecerem outra moeda.
- Valores numericos ausentes serao exibidos como indisponiveis, nunca convertidos implicitamente em zero.
- Links originais e afiliados serao tratados como destinos externos e abertos com protecoes apropriadas para nova aba.
- A URL base da API sera configuravel por ambiente, com desenvolvimento local apontando para o backend na porta 3000.
- O cliente HTTP enviara credenciais para suportar cookies de sessao. A integracao completa das telas de autenticacao do template com Better Auth sera tratada separadamente caso ainda nao esteja concluida.
- Erros de validacao, nao encontrado, autenticacao e falha interna terao apresentacoes distintas, reutilizando o tratamento global existente sem perder mensagens contextuais na pagina.
- Os endpoints REST apresentados pelo backend permanecem como contratos vigentes e fontes da verdade. Nao serao criados mocks permanentes para substituir capacidades ausentes.
- O fluxo em tempo real exige o novo contrato SSE e a publicacao de eventos apos transicoes persistidas das automation tasks. Nao e necessaria alteracao de schema relacional para essa entrega.

## Testing Decisions

- Bons testes verificarao comportamento externo: o que o usuario ve, envia, navega e consegue acionar. Eles nao dependerao da estrutura interna dos componentes, da ordem de hooks ou de detalhes privados do React Query.
- O cliente e os contratos de API serao testados para URL, metodo, parametros, payload e traducao de respostas e erros relevantes.
- O modulo de ciclo de vida de automacoes sera testado de forma isolada para classificar estados ativos e terminais e escolher rotulos e variantes visuais.
- O modulo de eventos sera testado para abrir uma unica conexao, validar eventos, ignorar duplicatas, filtrar eventos relevantes, fechar a conexao no logout e reconciliar dados apos reconexao.
- O formulario de nova busca sera testado para valores validos, campos opcionais, limites invalidos, estado de envio, bloqueio de duplicidade, falha e navegacao apos sucesso.
- A pagina de detalhes sera testada para carregamento, busca ativa, conclusao, falha, acao manual, ausencia de resultados e recurso inexistente.
- A integracao SSE sera testada com uma fonte de eventos controlada, verificando invalidacoes para busca, produtos, capturas e diagnostico sem depender de temporizadores de polling.
- O backend sera testado para cabecalhos SSE, evento inicial, heartbeat, isolamento por autenticacao, formato dos eventos, publicacao apos persistencia e propagacao por Redis.
- A recuperacao sera testada interrompendo o stream, alterando o estado da task e reconectando, confirmando que as consultas REST restauram o estado atual mesmo quando um evento nao foi recebido.
- A tabela de produtos sera testada para campos completos, campos opcionais ausentes, link externo, paginacao e acao de captura.
- A mutation de captura sera testada para o payload derivado do produto e da busca, feedback de sucesso, erro e invalidacao da lista relacionada.
- A lista de capturas sera testada para estados, URL afiliada, dados temporais, paginacao e navegacao para a task.
- A tela de diagnostico sera testada para resumo, erros, tentativas, dependencias, dependentes, predecessoras pendentes e navegacao entre tasks.
- O historico do produto sera testado para ocorrencias, navegacao para a busca, paginacao e aviso sobre associacoes legadas excluidas.
- Os parametros de pagina na URL serao testados para carregamento inicial, mudanca de pagina, navegacao do browser e correcao de pagina invalida.
- Estados responsivos e acessiveis serao verificados pelos papeis e nomes dos elementos, nao por seletores de classes CSS.
- As suites existentes de formularios do template servirao como referencia para testes de interacao com React Hook Form e componentes shadcn.
- Os testes existentes de dialogs e drawers servirao como referencia caso o historico do produto seja apresentado como painel lateral.
- Os testes de `use-table-url-state` servirao como referencia para sincronizacao de tabela e URL.
- Os testes de `handle-server-error` servirao como referencia para traducao e exibicao de falhas HTTP.
- A verificacao minima incluira testes direcionados das features, suite completa, lint e build do frontend.

## Out of Scope

- Dashboard geral com metricas agregadas de produtos, buscas, links ou performance.
- Listagem global de todas as buscas, pois o backend ainda nao expoe esse contrato.
- Listagem global de todos os produtos, pois o backend ainda nao expoe esse contrato.
- Listagem global de todas as automation tasks.
- Busca, filtro ou ordenacao server-side alem dos parametros atualmente aceitos pelos endpoints existentes.
- Curadoria de produto com estados como em analise, aprovado, descartado ou arquivado.
- Opportunity Score, analise por IA ou recomendacao de canais.
- Edicao dos dados canonicos do produto.
- Captura em lote de links afiliados.
- Retry manual de uma task falha, pois nao existe endpoint publico correspondente no escopo atual.
- Formulario de fallback manual para link afiliado.
- Configuracao de credenciais, cookies ou sessoes dos marketplaces.
- Criacao de conteudo, campanhas, agendamento, publicacao ou acompanhamento de resultados.
- WebSocket e comunicacao bidirecional persistente. O fluxo atual usara SSE para notificacoes servidor-cliente e REST para comandos.
- Garantia de entrega exatamente uma vez ou replay duravel ilimitado de todos os eventos SSE. A reconciliacao com os endpoints REST cobre eventos perdidos.
- Alteracoes no comportamento de dominio dos providers, nas politicas das filas ou no schema de persistencia. A instrumentacao necessaria para publicar transicoes de task no Redis faz parte desta entrega.
- Inferencia de associacoes historicas legadas que o backend deliberadamente exclui.
- Reformulacao completa de autenticacao. O fluxo sera colocado sob o layout autenticado existente, com integracao Better Auth tratada como dependencia adjacente quando necessario.
- Remocao imediata de todos os arquivos demonstrativos do template. Eles podem permanecer no codigo enquanto deixam de aparecer na navegacao principal.

## Further Notes

- `taskId` e `searchId` representam conceitos diferentes. A task acompanha a unidade de trabalho assincrona; a busca representa a execucao de descoberta no dominio. A interface deve preservar ambos internamente, mas favorecer `searchId` na navegacao principal.
- `resultId` representa a ocorrencia de um produto em uma busca. Ele nao deve ser apresentado como se fosse a identidade canonica do produto.
- Um mesmo produto pode aparecer em varias buscas. A tela de historico deve reforcar recorrencia sem duplicar a identidade do produto.
- A API aceita Mercado Livre, Amazon e Shopee no enum, mas a disponibilidade operacional depende dos providers configurados. O formulario deve refletir apenas marketplaces realmente habilitados no ambiente ou apresentar falhas de provider de forma clara.
- O backend diferencia produtos encontrados de produtos salvos. A interface deve manter os dois contadores e evitar rotulos que sugiram que todos os itens encontrados sao necessariamente novos.
- A resposta da task pode incluir um resumo de resultado, mas as telas de negocio devem preferir os endpoints relacionais especificos de busca, produtos e capturas.
- O estado `partial` e terminal, mas nao equivale a sucesso completo. Sua apresentacao deve manter acesso facil a detalhes e erros relacionados.
- O estado `manual_required` indica que a automacao terminou aguardando intervencao humana. Este PRD apenas o sinaliza; a acao manual correspondente depende de contratos futuros.
- O stream SSE e global para evitar uma conexao por task e podera sustentar uma futura listagem geral de automacoes. Essa listagem continua fora do escopo enquanto `GET /automation-tasks` paginado nao existir.
- O `EventSource` nativo usara cookies de sessao com credenciais. Caso a autenticacao futura dependa exclusivamente de bearer token em header customizado, sera necessario adotar um cliente SSE baseado em `fetch` ou revisar o transporte.
- Heartbeat nao representa mudanca de dominio e nao deve invalidar consultas do React Query.
- A primeira entrega recomendada pode ser dividida em dois marcos: nova busca com detalhes e produtos; depois capturas, diagnostico e historico. Ambos permanecem dentro do escopo deste PRD.
