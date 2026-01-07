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
  Updater,
} from '@tanstack/react-table'
import { useState } from 'react'
import { BatchRow } from '@/hooks/useTanstackBatch'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

type GridProps<T> = {
  data: BatchRow<T>[]
  columns: ColumnDef<BatchRow<T>, any>[]
  rowSelection: RowSelectionState
  onRowSelectionChange: (updater: Updater<RowSelectionState>) => void
}

export function Grid<T>({
  data,
  columns,
  rowSelection,
  onRowSelectionChange
}: GridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    // Controlled Mode: state를 props로 주입
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: onRowSelectionChange, // Hook의 setter를 바로 연결
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row: any) => row._rowKey,
  })

  // useEffect 동기화 로직 제거됨 (이제 Props로 직접 제어)

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => {
                const isSorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      <span className="text-gray-400">
                        {isSorted === 'asc' ? (
                          <ArrowUp className="w-4 h-4 text-gray-900" />
                        ) : isSorted === 'desc' ? (
                          <ArrowDown className="w-4 h-4 text-gray-900" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => {
            const status = row.original._status
            const isSelected = row.getIsSelected() // table 인스턴스에서 바로 확인

            // 상태별 스타일 지정
            let rowStyle = ''
            if (status === 'CREATED') rowStyle = 'bg-green-50'
            else if (status === 'MODIFIED') rowStyle = 'bg-yellow-50'
            else if (status === 'DELETED') rowStyle = 'bg-red-50 text-gray-400 line-through'

            // 선택된 행 등각 (선택+상태 조합)
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
