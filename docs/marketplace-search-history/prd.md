# Historico de Buscas de Marketplace - Frontend

## Problem Statement

O frontend possui rota `/marketplace-searches` nomeada como "Historico de Buscas", mas a tela ainda esta vazia. O operador consegue criar uma busca e abrir detalhes quando possui o link, porem nao consegue voltar depois para ver todas as buscas ja realizadas.

Como a plataforma e de uso pessoal e operacional, o historico precisa misturar linguagem de negocio e alguns atalhos tecnicos. O operador quer lembrar quais buscas foram feitas, reabrir detalhes, identificar falhas e acessar rapidamente o diagnostico quando uma task falhou ou exige acao manual.

Sem essa tela, a navegacao fica dependente de links diretos e o fluxo "Nova Busca -> Historico -> Detalhes -> Diagnostico" fica incompleto.

## Solution

Implementar a tela `/marketplace-searches` como listagem real de buscas de marketplace. A tela deve consumir `GET /marketplace-searches`, exibir todas as buscas criadas, oferecer filtros por termo, marketplace e status, e usar ordenacao padrao por buscas mais recentes.

A linha da listagem deve tratar a busca como entidade principal. A acao primaria abre `/marketplace-searches/:searchId`. A acao secundaria abre `/automation-tasks/:taskId` para diagnostico. Mesmo buscas falhas, pendentes, em processamento ou sem produtos devem aparecer.

## User Stories

1. As an operador da plataforma, I want abrir `/marketplace-searches`, so that eu veja o historico real de buscas ja feitas.
2. As an operador da plataforma, I want ver todas as buscas criadas, so that tentativas falhas ou pendentes nao sumam do meu acompanhamento.
3. As an operador da plataforma, I want ver marketplace, termo, categoria e limite, so that eu entenda o contexto de cada busca.
4. As an operador da plataforma, I want ver status da automacao, so that eu saiba se a busca esta pendente, processando, concluida, parcial, falhou ou exige acao manual.
5. As an operador da plataforma, I want ver encontrados e salvos, so that eu compare rapidamente o resultado das buscas.
6. As an operador da plataforma, I want ver data de criacao e conclusao, so that eu entenda quando a busca aconteceu.
7. As an operador da plataforma, I want filtrar por termo, so that eu encontre buscas relacionadas a uma palavra-chave.
8. As an operador da plataforma, I want filtrar por marketplace, so that eu foque em um canal especifico.
9. As an operador da plataforma, I want filtrar por status, so that eu priorize falhas ou buscas que exigem acao manual.
10. As an operador da plataforma, I want abrir os detalhes da busca pela acao principal, so that eu veja a tela atual com resumo, produtos e capturas.
11. As an operador da plataforma, I want abrir diagnostico por uma acao secundaria, so that eu investigue a task quando necessario.
12. As an operador da plataforma, I want ver erro resumido em falhas, so that eu saiba se preciso abrir diagnostico.
13. As an operador da plataforma, I want pagina vazia bem resolvida, so that eu entenda que ainda nao existem buscas.
14. As an operador da plataforma, I want estado de carregamento consistente, so that a tela nao pareca quebrada enquanto a API responde.
15. As an operador da plataforma, I want mensagem de erro e opcao de tentar novamente, so that eu recupere falhas temporarias.
16. As an operador da plataforma, I want paginacao no historico, so that muitas buscas nao tornem a tela lenta.
17. As an operador da plataforma, I want preservar filtros e pagina na URL, so that recarregar ou voltar no navegador mantenha a mesma visao.
18. As an operador da plataforma, I want usar a tela em desktop e telas menores, so that eu acompanhe buscas em diferentes contextos.
19. As an operador com teclado, I want navegar por filtros, tabela e acoes sem mouse, so that a tela continue acessivel.
20. As an desenvolvedor, I want schemas tipados para resposta e filtros, so that mudancas no backend sejam detectadas cedo.
21. As an desenvolvedor, I want encapsular o acesso remoto da listagem, so that componentes nao montem URLs manualmente.
22. As an desenvolvedor, I want testes cobrindo interacao e estados da tela, so that o historico nao regrida ao evoluir os componentes.

## Implementation Decisions

- A rota `/marketplace-searches` sera a tela de historico de buscas.
- A entidade visual principal sera a busca, nao a task.
- A acao principal de cada item sera abrir `/marketplace-searches/:searchId`.
- A acao secundaria sera abrir `/automation-tasks/:taskId`.
- A tela deve listar todas as buscas retornadas pelo backend, inclusive `pending`, `processing`, `completed`, `partial`, `failed` e `manual_required`.
- A tela deve consumir `GET /marketplace-searches` com `page`, `limit`, `query`, `marketplace` e `status`.
- A ordenacao padrao vem do backend como `createdAt desc`.
- O MVP nao tera filtro por data.
- A tela deve exibir `taskId` apenas de forma secundaria ou abreviada quando util, preservando a linguagem de busca.
- Em estados `failed` e `manual_required`, a tela deve mostrar erro resumido quando a API fornecer essa informacao.
- A tela de detalhes existente continua sendo usada mesmo para buscas vazias ou falhas.
- O historico deve usar os mesmos conceitos visuais de status ja presentes em detalhes e diagnostico.
- A camada de dados deve ficar em feature de `marketplace-searches`, com service, schemas e hooks proprios.
- As chaves do React Query devem se integrar ao namespace existente de `marketplace-searches`.
- Filtros e paginacao devem ser refletidos nos search params da rota.
- Componentes de tabela, botoes, badges, inputs e paginacao devem seguir o design system e os padroes shadcn ja usados no projeto.
- A navegacao lateral ja aponta "Historico de Buscas" para `/marketplace-searches`; essa entrada deve passar a abrir a experiencia real.

## Testing Decisions

- Testar a rota `/marketplace-searches` renderizando a listagem com dados da API.
- Testar estado vazio quando a API retorna `items: []`.
- Testar estado de carregamento.
- Testar estado de erro com acao de tentar novamente.
- Testar filtros por termo, marketplace e status atualizando a URL e chamando a API com parametros corretos.
- Testar paginacao atualizando a URL e recarregando a listagem.
- Testar que cada linha abre detalhes da busca por `/marketplace-searches/:searchId`.
- Testar que a acao secundaria abre diagnostico por `/automation-tasks/:taskId`.
- Testar exibicao de todos os estados de task suportados.
- Testar busca falha ou `manual_required` exibindo erro resumido quando presente.
- Testar acessibilidade por papeis e nomes visiveis para filtros, tabela/lista e acoes.
- Reutilizar como prior art os testes existentes de detalhes de busca, diagnostico de task, paginacao e rotas autenticadas.
- Nao e necessario testar SSE nesta feature, porque o historico pode ser carregado por REST e a atualizacao em tempo real nao faz parte do MVP.

## Out of Scope

- Criar listagem global de automation tasks.
- Implementar retry manual ou reprocessamento de busca.
- Criar filtros por data no MVP.
- Criar acoes em lote.
- Criar dashboard agregado de performance.
- Alterar a tela de detalhes de busca alem do necessario para navegar a partir do historico.
- Alterar a tela de diagnostico de task.
- Criar polling automatico ou integracao SSE especifica para a listagem.
- Criar exportacao CSV ou relatorios.
- Criar curadoria de produtos.

## Further Notes

- Decisao de produto ja tomada: o historico lista todas as buscas criadas.
- Decisao de produto ja tomada: filtros do MVP sao `query`, `marketplace` e `status`.
- Decisao de produto ja tomada: acao principal abre detalhes da busca; diagnostico e acao secundaria.
- Decisao de produto ja tomada: a mesma tela de detalhes continua sendo usada para buscas sem produtos, falhas ou bloqueadas.
- A plataforma e de uso pessoal, entao a tela pode expor atalhos tecnicos sem precisar esconder completamente `taskId`.
- O backend precisa entregar `GET /marketplace-searches` antes da UI poder sair de mock.
- O historico deve reforcar a diferenca entre `searchId` e `taskId`: busca e dominio; task e diagnostico.
