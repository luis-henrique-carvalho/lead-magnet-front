# Frontend Feature Architecture

Este documento descreve o padrão obrigatório para desenvolvimento e refatoração de features no frontend da aplicação `lead-magnet`.

## Objetivo da Arquitetura

O principal objetivo desta arquitetura é promover a modularidade, consistência e separação de responsabilidades na aplicação. Componentes de apresentação de UI devem focar exclusivamente em renderização e controle de visualização simples. Chamadas HTTP, queries, mutations, manipulação de cache e regras de negócio complexas devem ser extraídas para camadas específicas (services e hooks) organizadas de forma granular por tela/subfeature.

---

## Instrução Obrigatória para Agentes de IA e LLMs

> [!IMPORTANT]
> Toda implementação ou refatoração de frontend deve seguir a arquitetura de features documentada neste arquivo.
> Antes de criar ou refatorar uma nova feature/tela, identifique:
> 1. Componentes exclusivos da tela;
> 2. Hooks e regras de negócio da tela;
> 3. Chamadas HTTP utilizadas pela tela;
> 4. Schemas e types necessários;
> 5. Código compartilhado com outras telas da mesma feature;
> 6. Código compartilhado com outras features.
>
> A LLM **não deve** colocar chamadas HTTP, queries, mutations ou regras de negócio diretamente em componentes de apresentação. Tampouco deve agrupar arquivos de diferentes telas em diretórios genéricos globais no nível raiz da feature. A estrutura por tela/subfeature deve ser sempre respeitada.

---

## Estrutura Padrão de uma Feature

Cada feature deve ser organizada por tela ou subfeature. A estrutura deve evitar concentrar todos os hooks, services, schemas ou components no nível raiz da feature, mantendo a seguinte estrutura:

```text
src/features/nome-da-feature/
├── nome-da-tela-1/
│   ├── components/
│   │   ├── componente-exclusivo.tsx
│   │   └── componente-exclusivo.test.tsx
│   ├── hooks/
│   │   └── use-exclusivo-da-tela.ts
│   ├── services/
│   │   └── tela-service.ts
│   ├── schemas/
│   │   ├── tela-schema.ts
│   │   └── tela-types.ts
│   └── index.tsx (entrypoint da tela contendo o componente principal)
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── schemas/
│
└── index.ts (entrypoint público da feature)
```

## Padrão de Composição de Telas (Shadcn Admin)

Para manter a consistência visual e a experiência de usuário baseada no painel Shadcn Admin, todos os componentes principais de tela (localizados no `index.tsx` de cada subfeature/tela) devem seguir rigidamente o padrão de composição de layout descrito abaixo:

1. **Context Provider da Tela**: Encapsula todo o componente da tela, provendo hooks e contextos React para gerenciar estados locais de modais, gavetas de edição, carregamentos específicos e dados temporários.
2. **Componentes Padrão de Layout**:
   - `<Header fixed>`: Renderiza a barra superior fixa que contém o componente de busca global (`Search`), o alternador de temas (`ThemeSwitch`), a gaveta de configurações de visualização (`ConfigDrawer`) e o dropdown do perfil de usuário (`ProfileDropdown`).
   - `<Main className='flex flex-1 flex-col gap-4 sm:gap-6'>`: Container principal de conteúdo que organiza o layout e espaçamento vertical responsivo.
3. **Cabeçalho de Conteúdo Superior**: Div flexível que agrupa o título (`h2`) e a descrição (`p`) à esquerda, e os botões de ação primários (`PrimaryButtons`) alinhados à direita.
4. **Conteúdo Principal**: O formulário (ex: `<SearchForm />`), tabela (ex: `<UsersTable />`) ou grade de dados.
5. **Dialogs**: O controlador centralizado de diálogos, modais e drawers (`Dialogs`) renderizado logo abaixo do `<Main>`.

### Estrutura de Componentes da Tela

Dentro da pasta de componentes específica da tela (`src/features/nome-da-feature/nome-da-tela/components/`), devem ser sempre implementados:
- `nome-da-tela-provider.tsx`: Contexto e hook (`useNomeDaTela`) para o gerenciamento de estados visuais.
- `nome-da-tela-primary-buttons.tsx`: Botões de ações primárias que alteram estados no provider.
- `nome-da-tela-dialogs.tsx`: Gerenciador de modais/drawers da tela.

### Exemplo de Composição (`index.tsx` da Tela)

```typescript
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FeatureDialogs } from './components/feature-dialogs'
import { FeaturePrimaryButtons } from './components/feature-primary-buttons'
import { FeatureProvider } from './components/feature-provider'
import { FeatureContent } from './components/feature-content'

export function FeatureScreen() {
  return (
    <FeatureProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Título da Tela</h2>
            <p className='text-muted-foreground'>
              Descrição detalhada dos recursos da tela.
            </p>
          </div>
          <FeaturePrimaryButtons />
        </div>
        <FeatureContent />
      </Main>

      <FeatureDialogs />
    </FeatureProvider>
  )
}
```

### Regra de Escopo e Decisão de Destino


Para determinar onde colocar um determinado arquivo, utilize a seguinte regra de escopo:

1. **Usado em uma única tela** $\rightarrow$ Coloque na pasta da própria tela (`src/features/nome-da-feature/nome-da-tela/`).
2. **Usado em múltiplas telas da mesma feature** $\rightarrow$ Mova para o `shared` interno da feature (`src/features/nome-da-feature/shared/`).
3. **Usado por múltiplas features** $\rightarrow$ Mova para a estrutura global da aplicação (`src/components/`, `src/hooks/`, `src/lib/`, etc.).

---

## Responsabilidades de cada Diretório

### `services`
Contém exclusivamente a comunicação direta com as APIs ou com o backend. Não possui lógica de negócio ou estados do React.
- **Regra**: Utilize o cliente HTTP global configurado em `@/lib/api-client`. Não crie instâncias locais de Axios sem necessidade.

### `hooks`
Contém a integração com a biblioteca de cache/estado remoto (como React Query), regras de negócio da tela, transformação de dados e efeitos colaterais.
- **Regra**: Componentes não devem disparar requisições diretamente do Axios. Eles devem utilizar os hooks criados nesta pasta.

### `index.tsx` (na raiz da tela)
Contém o componente principal da tela que é importado pelas rotas ou pelo entrypoint público da feature. Responsável pela composição final da tela, consumo inicial de hooks/services de carregamento e manipulação de estado local de UI.

### `components`
Contém apenas componentes pequenos de suporte e apresentação exclusivos daquela tela.
- **Regra**: Cada componente deve residir em seu próprio arquivo. Devem focar puramente em renderização, receber propriedades e tratar eventos simples da interface do usuário. Não coloque o componente de tela principal ou queries dentro desta pasta.

### `schemas`
Contém os contratos de dados, validações com Zod e definições de tipos TypeScript.
- **Regra**: Evite duplicar manualmente tipos que podem ser inferidos diretamente através dos schemas Zod usando `z.infer<typeof schema>`.

---

## Padrão de Query Keys

Para evitar conflitos e gerenciar invalidações de cache de forma limpa, cada subfeature deve ter um objeto estruturado de Query Keys exportado em seus hooks.

```typescript
export const marketplaceSearchKeys = {
  all: ['marketplace-search'] as const,
  detail: (id: string) => [...marketplaceSearchKeys.all, id] as const,
}
```

---

## Exemplos Completos

### Exemplo de Service

```typescript
// src/features/marketplace-searches/new-search/services/create-search-service.ts
import { api } from '@/lib/api-client'
import type { CreateSearchPayload, CreateSearchResponse } from '../schemas/search-types'

export const createSearchService = {
  async create(payload: CreateSearchPayload): Promise<CreateSearchResponse> {
    const response = await api.post<CreateSearchResponse>(
      '/marketplaces/search',
      payload
    )
    return response.data
  },
}
```

### Exemplo de Hook (Query)

```typescript
// src/features/marketplace-searches/search-details/hooks/use-search-query.ts
import { useQuery } from '@tanstack/react-query'
import { searchDetailsService } from '../services/search-details-service'

export const marketplaceSearchKeys = {
  all: ['marketplace-search'] as const,
  detail: (id: string) => [...marketplaceSearchKeys.all, id] as const,
}

export function useSearchQuery(searchId: string) {
  return useQuery({
    queryKey: marketplaceSearchKeys.detail(searchId),
    queryFn: () => searchDetailsService.findById(searchId),
  })
}
```

### Exemplo de Hook (Mutation)

```typescript
// src/features/marketplace-searches/new-search/hooks/use-create-search.ts
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { createSearchService } from '../services/create-search-service'
import type { CreateSearchPayload, CreateSearchResponse } from '../schemas/search-types'

export function useCreateSearch(
  options?: UseMutationOptions<CreateSearchResponse, Error, CreateSearchPayload>
) {
  return useMutation<CreateSearchResponse, Error, CreateSearchPayload>({
    mutationFn: (payload) => createSearchService.create(payload),
    ...options,
  })
}
```

---

## Regras de Importação entre Features

- Uma feature **nunca** deve importar arquivos internos (como components, hooks ou services privados) de outra feature diretamente.
- Comunicação inter-feature é permitida **somente** através do `index.ts` raiz da feature que atua como barreira pública do módulo.
- Evite exports do tipo "barrel" (`export *`) quando puderem provocar acoplamento excessivo ou dependências circulares.

---

## Checklist para Criação de uma Nova Feature/Tela

- [ ] Criar pasta correspondente em `src/features/nome-da-feature/nome-da-tela`
- [ ] Definir schemas de validação Zod e tipos TypeScript em `schemas/`
- [ ] Criar funções de API no arquivo correspondente dentro de `services/`
- [ ] Implementar queries/mutations do React Query e controle de negócio em `hooks/`
- [ ] Criar componentes visuais limpos in `components/`
- [ ] Criar testes automatizados para os componentes/hooks
- [ ] Criar index local da subfeature exportando a tela principal
- [ ] Registrar exportações no index público do módulo principal (`src/features/nome-da-feature/index.ts`)
- [ ] Atualizar arquivos de rotas para apontar para o novo entrypoint
