'use client'

import { EditableCell } from '@/components/grid/EditableCell'
import { Grid } from '@/components/grid/Grid'
import { selectColumn } from '@/components/grid/selectColumn'
import { useTanstackBatch, BatchRow } from '@/hooks/useTanstackBatch'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

// 🔹 초기 데이터
const initialData: any[] = [
  { compCd: '1000', deptCd: 'A', userId: 'A01', userName: '홍길동', userNickname: 'test' },
  { compCd: '1000', deptCd: 'A', userId: 'A02', userName: '김철수', userNickname: 'test' },
]

// 🔹 공통 함수: 컬럼 생성
const createEditableColumn = (key: string, header: string, updateData: Function): ColumnDef<BatchRow<any>> => ({
  accessorKey: key,
  header,
  cell: (info: any) => <EditableCell {...info} updateData={updateData} />,
})

const createEmptyRow = (template: Record<string, any>) => {
  const empty: Record<string, any> = {}
  Object.keys(template).forEach(key => {
    if (key !== '_rowKey' && key !== '_status') empty[key] = ''
  })
  return empty
}

export default function AA0010() {
  // 🔹 커스텀 훅: gridProps로 한 번에 받기
  const {
    gridProps,
    addRow,
    updateCell,
    getChanges,
  } = useTanstackBatch(initialData)

  const columns = useMemo<ColumnDef<BatchRow<any>>[]>(() => [
    selectColumn,
    createEditableColumn('userId', '사용자 ID', updateCell),
    createEditableColumn('userName', '사용자명', updateCell),
    createEditableColumn('userNickname', '별명', updateCell),
  ], [updateCell])

  const handleAddRow = () => {
    // gridProps.data를 통해 데이터 접근 가능
    const data = gridProps.data
    const template = data.length > 0 ? createEmptyRow(data[data.length - 1]) : { compCd: '1000', deptCd: 'A' }
    addRow(template)
  }

  const handleSave = () => {
    const changes = getChanges()
    console.log('📌 저장할 데이터 (Batch Result):', changes)
    alert(`[I]추가: ${changes.added.length}건, [U]수정: ${changes.modified.length}건, [D]삭제: ${changes.deleted.length}건\n(체크된 항목은 삭제로 처리됨)`)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">AA0010 - 사용자 관리 (Batch Grid)</h2>

      {/* 🔹 관리 편하게: gridProps 하나만 넘기면 끝 */}
      <Grid
        {...gridProps}
        columns={columns}
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          행 추가
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          저장 (체크된 항목 삭제)
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-600">
        <h3 className="font-bold mb-2">💡 상태 가이드</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="inline-block w-3 h-3 bg-green-200 border border-green-400 mr-2"></span>추가된 행 (Created)</li>
          <li><span className="inline-block w-3 h-3 bg-yellow-200 border border-yellow-400 mr-2"></span>수정된 행 (Modified)</li>
          <li><span className="font-bold">체크된 행</span>: 저장 시 삭제(Deleted) 처리됨</li>
        </ul>
      </div>
    </div>
  )
}
