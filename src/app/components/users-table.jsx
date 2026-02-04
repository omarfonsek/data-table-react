import * as React from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"

// Definición de columnas
const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    size: 200,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    size: 250,
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Mobile" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("mobile")}</div>,
    size: 150,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Role" />,
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
    size: 120,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString("es-ES")}</div>
    },
    size: 130,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Editar usuario</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    size: 100,
  },
]

export function UsersTable({ data, isLoading, error, onRefresh }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error al cargar los datos</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar 
          table={table} 
          filterColumn="name" 
          placeholder="Filtrar por nombre..."
        >
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          )}
        </DataTableToolbar>
      </DataTable>
    </div>
  )
}
