import { render, screen } from '@testing-library/react'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { describe, vi, test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual('@/components/ui/select')

  return {
    ...actual,
    Select: ({ children, onValueChange }) => (
      <div>
        <button onClick={() => onValueChange('20')}>mock-select</button>
        {children}
      </div>
    ),
    SelectTrigger: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ children }) => <div>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
  }
})

describe('DataTablePagination', () => {
test('Cambiar el tamaño de página', async ()=> {
    const user = userEvent.setup()

    const mocktable = {
        getFilteredSelectedRowModel: () => ({ rows: [] }),
        getFilteredRowModel: () => ({ rows: [] }),

        getState: () => ({
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        }),

        setPageSize: vi.fn(),

        getPageCount: () => 5,
        getCanPreviousPage: () => false,
        getCanNextPage: () => true,

        previousPage: vi.fn(),
        nextPage: vi.fn(),
        setPageIndex: vi.fn(),
    }

    render(<DataTablePagination table={mocktable} />)

    const mockSelect = screen.getByText('mock-select')
    await user.click(mockSelect)

    expect(mocktable.setPageSize).toHaveBeenCalledWith(20)
})
})