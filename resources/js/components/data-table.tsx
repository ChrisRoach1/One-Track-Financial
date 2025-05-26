import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Input } from "./ui/input"
import { DataTablePagination } from "./data-table-pagination"
import { Button } from "./ui/button"
import {Plus, Building2} from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  addCallback: () => void
}

export function DataTable<TData, TValue>({columns,data, addCallback}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state:{
        columnFilters
    }
  })

  return (
    <div className="p-2">
      <div className="p-2 flex items-center justify-between py-4">
        <Input
          placeholder="Filter merchants..."
          value={(table.getColumn("merchant_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("merchant_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={addCallback} variant={"secondary"}>
            <Plus/>
        </Button>
      </div>
      <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => {
                    if(cell.id.includes('url')){
                        const imageUrl = cell.renderValue() as string | undefined;
                        return (
                            <TableCell key={cell.id}>
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                          </TableCell>
                        )
                    }else{
                        return (
                            <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                    }
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="p-3">
      <DataTablePagination table={table}/>
      </div>
    </div>
    </div>

  )
}

