import { render, screen } from '@testing-library/react'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { vi, test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('DataTableViewOptions', () => {
test('Renderizar el componente correctamente', async() => {
    const user = userEvent.setup()

    const mockTable = {
    getAllColumns: () => [],
} 

    render(<DataTableViewOptions table={mockTable} />)

    const button = screen.getByRole('button', { name: /toggle columns/i });

    await user.click(button);

    expect(screen.getByPlaceholderText(/search columns.../i)).toBeInTheDocument();
});
test('Ocultar una columna al hacer click en el check del dropdown de View', async ()=> {
    const user = userEvent.setup()

    const toggleVisibility = vi.fn()

    const mockTable = {
        getAllColumns: () => [
            {
                id: 'email',
                getCanHide: () => true,
                getIsVisible: () => false,
                toggleVisibility,
                columnDef: {
                    meta: { label: 'Email' },
                },
            },
        ],
    }
    render(<DataTableViewOptions table={mockTable} />)

    const button = screen.getByRole('button', { name: /toggle columns/i });

    await user.click(button);

    await user.click(screen.getByText('Email'))

    expect(toggleVisibility).toHaveBeenCalledWith(true)
});
test('Mostrar columna oculta al hacer click donte estaba el check', async ()=> {
    const user = userEvent.setup()
    
    const mockColumn = {
        id: 'email',
        getCanHide: () => true,
        getIsVisible: () => false,
        toggleVisibility: vi.fn(),
        columnDef: {
            meta: {
                label: 'Email',
            },
        },
    }

    const mockTable = {
        getAllColumns: () => [mockColumn],
    }

    render(<DataTableViewOptions table={mockTable} />)

    const button = screen.getByRole('button', { name: /toggle columns/i });

    await user.click(button);

    const columnItem = screen.getByText('Email')
    await user.click(columnItem)

    expect(mockColumn.toggleVisibility).toHaveBeenCalledWith(true)
});
})
