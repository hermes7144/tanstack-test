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
import { RowStatus } from '@/hooks/useTanstackBatch' // Adjust import path as needed

type GridProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  onSelectionChange?: (rows: T[]) => void
  rowStatus?: Record<string, RowStatus>
}

export function Grid<T>({ data, columns, onSelectionChange, rowStatus }: GridProps<T>) {
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

  // 선택 변경 시 부모에게 알림
  useEffect(() => {
    if (!onSelectionChange) return
    const selectedRows = table.getSelectedRowModel().rows.map(r => r.original)
    onSelectionChange(selectedRows)
  }, [rowSelection]) // data가 바뀌면 selection이 초기화되거나 유지되어야 하는데, 여기선 선택 상태 변경만 감지

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
            const status = rowStatus?.[row.id]
            const isSelected = rowSelection[row.id]

            // 상태별 스타일 지정
            let rowStyle = ''
            if (status === 'CREATED') rowStyle = 'bg-green-50'
            else if (status === 'MODIFIED') rowStyle = 'bg-yellow-50'
            else if (status === 'DELETED') rowStyle = 'bg-red-50 text-gray-400 line-through'

            // 선택된 행은 약간 더 진하게 (선택+상태 조합도 고려 가능)
            if (isSelected) rowStyle += ' bg-blue-50/50'

            return (
              <tr
                key={row.id}
                className={`transition-colors hover:bg-gray-100 ${rowStyle}`}
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
