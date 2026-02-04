import { render, screen } from '@testing-library/react';
import { UsersTable } from '@/app/components/users-table';
import { DataTable } from '@/components/data-table/data-table';
import userEvent from '@testing-library/user-event';

test('Renderizar el componente Datatable con UserTable', () => {
    render(
        <UsersTable>
            <DataTable />
        </UsersTable>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
});
test('Permitir filtrar por nombre', async () => {
  const user = userEvent.setup();

  render(
    <UsersTable>
      <DataTable />
    </UsersTable>
  );

  const input = screen.getByPlaceholderText('Filtrar por nombre...');
  await user.type(input, 'Omar');

  expect(input).toHaveValue('Omar');
});