---
title: "Formulário de Criação de Nova Busca"
status: "completed"
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

- [x] A rota `/marketplace-searches/new` exibe um formulário funcional com validação via React Hook Form e Zod.
- [x] O select de Marketplace exibe opções configuradas do backend (Mercado Livre, Amazon, Shopee), tratando limitações de providers se aplicável.
- [x] Validações imediatas impedem o envio de limites fora da faixa aceita pela API. Indica claramente campos opcionais e obrigatórios.
- [x] Exibe feedback de "loading/processando" ao enviar e desabilita o botão para evitar submissões repetidas.
- [x] Trata erros HTTP convertendo-os em mensagens de domínio claras em português.
- [x] Após o sucesso na API (`POST /marketplaces/search`), o operador é redirecionado para `/marketplace-searches/:searchId`.
- [x] A seção `Result` documenta o comportamento entregue, os contratos HTTP e schemas de validação usados, e as validações automatizadas/manuais efetuadas.

## Result

### Comportamento Entregue
Implementada a rota e página `/marketplace-searches/new` contendo o componente `<SearchForm>`.
- **Validação e Tipagem**: Integramos React Hook Form com Zod, garantindo que o limite do produto seja um número do tipo `number` diretamente no estado do formulário (usando conversão customizada no `onChange` com `Number(e.target.value)`), prevenindo conflitos de coerção de tipo com o Zod.
- **Acessibilidade & Interface**: Os campos e selects são acessíveis por teclado, os rótulos e as mensagens de validação estão todos traduzidos para português (pt-BR).
- **Mutação e Navegação**: Implementamos o hook `useMutation` do React Query que dispara a requisição e redireciona o operador para a rota `/marketplace-searches/$searchId` após a criação com sucesso. Bloqueia múltiplos cliques e exibe estado de loading ("Iniciando...").

### Arquivos Criados / Modificados
- `src/features/marketplace-searches/new/components/search-form.tsx`: Componente de apresentação do formulário.
- `src/features/marketplace-searches/new/components/search-form.test.tsx`: Testes unitários do formulário.
- `src/features/marketplace-searches/new/index.tsx`: Componente wrapper da página e lógica da mutação.
- `src/lib/api-client.ts`: Contratos e handler Axios.
- `src/routes/_authenticated/marketplace-searches/new/index.tsx`: Rota TanStack Router.

## Blocked by

None - can start immediately.
