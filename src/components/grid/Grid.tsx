// components/grid/Grid.tsx
'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

type GridProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  onSelectionChange?: (rows: T[]) => void
  dirtyMap?: Record<string, boolean> // 변경된 행 표시
}

export function Grid<T>({ data, columns, onSelectionChange, dirtyMap }: GridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row: any) => row._rowKey,
  })

  useEffect(() => {
    if (!onSelectionChange) return
    const selectedRows = table.getSelectedRowModel().rows.map(r => r.original)
    onSelectionChange(selectedRows)
  }, [rowSelection])

 return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    {{
                      asc: '🔼',
                      desc: '🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => {
            const isDirty = dirtyMap?.[row.id]
            const isSelected = rowSelection[row.id]

            return (
              <tr
                key={row.id}
                className={`transition-colors ${
                  isDirty ? 'bg-yellow-50' : ''
                } hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}