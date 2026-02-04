import { flexRender } from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { dataTableConfig } from "@/config/data-table";

export function DataTable({
  table,
  actionBar,
  children,
  className,
  ...props
}) {
  // Ejemplo de cómo usar dataTableConfig aquí (comentado para evitar warnings)
  // const textOperators = dataTableConfig.textOperators;
  // const numericOperators = dataTableConfig.numericOperators;

  // Función helper para obtener el ancho de columna
  const getColumnWidth = (column) => {
    const size = column.getSize();
    return `${size}px`;
  };

  // Obtener solo las columnas visibles para garantizar alineación
  const visibleColumns = React.useMemo(() => {
    return table.getAllColumns().filter(column => column.getIsVisible());
  }, [table]);

  // Calcular el ancho total de la tabla
  const totalTableWidth = React.useMemo(() => {
    const totalWidth = visibleColumns.reduce((sum, column) => {
      return sum + column.getSize();
    }, 0);
    return `${totalWidth}px`;
  }, [visibleColumns]);

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}

      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table 
            className="table-fixed" 
            style={{ width: totalTableWidth, minWidth: totalTableWidth }}
          >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter(header => header.column.getIsVisible())
                  .map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap"
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                        width: getColumnWidth(header.column),
                        minWidth: getColumnWidth(header.column),
                        maxWidth: getColumnWidth(header.column),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap"
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                        width: getColumnWidth(cell.column),
                        minWidth: getColumnWidth(cell.column),
                        maxWidth: getColumnWidth(cell.column),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />

        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
