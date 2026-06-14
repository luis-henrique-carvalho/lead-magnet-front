import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { SearchForm } from './search-form'

describe('SearchForm', () => {
  it('renders all form fields with correct default values', async () => {
    const { getByRole, getByLabelText } = await render(
      <SearchForm onSubmit={vi.fn()} isPending={false} />
    )

    const marketplaceSelect = getByRole('combobox', { name: /Marketplace/i })
    const keywordInput = getByLabelText(/Palavra-chave/i)
    const categoryInput = getByLabelText(/Categoria/i)
    const limitInput = getByLabelText(/Limite de Produtos/i)
    const submitButton = getByRole('button', { name: /Iniciar Busca/i })

    await expect.element(marketplaceSelect).toBeInTheDocument()
    await expect.element(keywordInput).toBeInTheDocument()
    await expect.element(categoryInput).toBeInTheDocument()
    await expect.element(limitInput).toBeInTheDocument()
    await expect.element(submitButton).toBeInTheDocument()

    // Default values
    await expect.element(limitInput).toHaveValue(100)
  })

  it('shows validation errors for invalid data', async () => {
    const onSubmit = vi.fn()
    const { getByRole, getByText, getByLabelText } = await render(
      <SearchForm onSubmit={onSubmit} isPending={false} />
    )

    const submitButton = getByRole('button', { name: /Iniciar Busca/i })
    await userEvent.click(submitButton)

    const keywordError = getByText(/Palavra-chave é obrigatória/i)
    await expect.element(keywordError).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    const limitInput = getByLabelText(/Limite de Produtos/i)
    await userEvent.fill(limitInput, '150')
    await userEvent.click(submitButton)

    const limitError = getByText(/Limite deve ser no máximo 100/i)
    await expect.element(limitError).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn()
    const { getByRole, getByLabelText } = await render(
      <SearchForm onSubmit={onSubmit} isPending={false} />
    )

    const marketplaceSelect = getByRole('combobox', { name: /Marketplace/i })
    await userEvent.click(marketplaceSelect)
    await userEvent.click(getByRole('option', { name: /Mercado Livre/i }))

    const keywordInput = getByLabelText(/Palavra-chave/i)
    await userEvent.fill(keywordInput, 'iphone')

    const categoryInput = getByLabelText(/Categoria/i)
    await userEvent.fill(categoryInput, 'celulares')

    const limitInput = getByLabelText(/Limite de Produtos/i)
    await userEvent.fill(limitInput, '50')

    const submitButton = getByRole('button', { name: /Iniciar Busca/i })
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0][0]).toEqual({
      marketplace: 'MERCADO_LIVRE',
      keyword: 'iphone',
      category: 'celulares',
      limit: 50,
    })
  })

  it('disables inputs and button when pending', async () => {
    const { getByRole, getByLabelText } = await render(
      <SearchForm onSubmit={vi.fn()} isPending={true} />
    )

    const marketplaceSelect = getByRole('combobox', { name: /Marketplace/i })
    const keywordInput = getByLabelText(/Palavra-chave/i)
    const categoryInput = getByLabelText(/Categoria/i)
    const limitInput = getByLabelText(/Limite de Produtos/i)
    const submitButton = getByRole('button', { name: /Iniciando/i })

    await expect.element(marketplaceSelect).toBeDisabled()
    await expect.element(keywordInput).toBeDisabled()
    await expect.element(categoryInput).toBeDisabled()
    await expect.element(limitInput).toBeDisabled()
    await expect.element(submitButton).toBeDisabled()
  })

  it('displays API error message', async () => {
    const { getByText } = await render(
      <SearchForm onSubmit={vi.fn()} isPending={false} error='Falha na conexão' />
    )

    const errorMessage = getByText(/Falha na conexão/i)
    await expect.element(errorMessage).toBeInTheDocument()
  })
})
