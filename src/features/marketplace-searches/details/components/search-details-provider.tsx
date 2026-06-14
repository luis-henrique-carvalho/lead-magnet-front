import { createContext, use, type ReactNode } from 'react'

type Pagination = { page: number; limit: number }

type SearchDetailsContextValue = {
  searchId: string
  pagination: Pagination
  onPaginationChange: (pagination: Pagination) => void
}

const SearchDetailsContext = createContext<SearchDetailsContextValue | null>(
  null
)

type SearchDetailsProviderProps = SearchDetailsContextValue & {
  children: ReactNode
}

export function SearchDetailsProvider({
  children,
  searchId,
  pagination,
  onPaginationChange,
}: SearchDetailsProviderProps) {
  return (
    <SearchDetailsContext value={{ searchId, pagination, onPaginationChange }}>
      {children}
    </SearchDetailsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSearchDetailsContext() {
  const context = use(SearchDetailsContext)

  if (!context) {
    throw new Error(
      'useSearchDetailsContext must be used within SearchDetailsProvider'
    )
  }

  return context
}
