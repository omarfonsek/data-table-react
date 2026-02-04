"use client"

import { useState } from "react"
import { Settings2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function DataTableViewOptions({ table }) {
  const [search, setSearch] = useState("")

  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .filter((column) => {
      const label = column.columnDef?.meta?.label ?? column.id
      return label.toLowerCase().includes(search.toLowerCase())
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 font-normal lg:flex bg-transparent"
        >
          <Settings2 className="text-muted-foreground" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2">
          <Input
            placeholder="Search columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuItem
            key={column.id}
            className="capitalize flex items-center justify-between cursor-pointer"
            onClick={() => column.toggleVisibility(!column.getIsVisible())}
          >
            <span>{column.columnDef?.meta?.label ?? column.id}</span>
            {column.getIsVisible() && <Check className="h-4 w-4 text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
