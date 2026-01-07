'use client'

import { EditableCell } from '@/components/grid/EditableCell'
import { Grid } from '@/components/grid/Grid'
import { selectColumn } from '@/components/grid/selectColumn'
import { useTanstackBatch } from '@/hooks/useTanstackBatch'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// 🔹 초기 데이터 (컴포넌트 외부로 이동하여 렌더링 시 재생성 방지하거나 useMemo 사용 권장, 여기선 외부에 둠)
const initialData: any[] = [
  { compCd: '1000', deptCd: 'A', userId: 'A01', userName: '홍길동', userNickname: 'test', _rowKey: uuidv4() },
  { compCd: '1000', deptCd: 'A', userId: 'A02', userName: '김철수', userNickname: 'test', _rowKey: uuidv4() },
]

// 🔹 공통 함수: 컬럼 생성 (updateData를 주입받음)
const createEditableColumn = (key: string, header: string, updateData: Function) => ({
  accessorKey: key,
  header,
  cell: (info: any) => <EditableCell {...info} updateData={updateData} />,
})

const createEmptyRow = (template: Record<string, any>) => {
  // 템플릿 기반으로 빈 값을 만듦 (rowKey나 기타 필수값 제외)
  const empty: Record<string, any> = {}
  Object.keys(template).forEach(key => {
    if (key !== '_rowKey') empty[key] = ''
  })
  return empty
}

export default function AA0010() {
  // 🔹 커스텀 훅 사용
  const { data, rowStatus, addRow, removeRows, updateCell, getChanges } = useTanstackBatch(initialData)

  const [selectedData, setSelectedData] = useState<typeof data>([])

  // 🔹 컬럼 정의
  // React Compiler 사용 시 useMemo 불필요할 수 있지만, 명시적으로 유지해도 무방.
  // updateCell 참조가 hook 내부에서 관리되므로 안전함.
  const columns = [
    selectColumn,
    createEditableColumn('userId', '사용자 ID', updateCell),
    createEditableColumn('userName', '사용자명', updateCell),
    createEditableColumn('userNickname', '별명', updateCell),
  ]

  // 🔹 선택 변경 콜백
  const handleSelectionChange = (rows: typeof data) => {
    setSelectedData(rows)
  }

  // 🔹 버튼 액션: 행 추가
  const handleAddRow = () => {
    // 마지막 행을 템플릿으로 쓰거나, 비어있는 객체 넘김
    // 여기서는 기존 데이터 구조 유지를 위해 마지막 행 구조를 참고하거나, 그냥 타입에 맞게 빈값 넘김
    const template = data.length > 0 ? createEmptyRow(data[data.length - 1]) : { compCd: '1000', deptCd: 'A' }
    addRow(template)
  }

  // 🔹 버튼 액션: 행 삭제 (Soft Delete)
  const handleDeleteRow = () => {
    removeRows(selectedData)
    // 선택 모드 초기화가 필요하면 여기서 처리 (ex: Grid 내부 selection state 리셋 필요할 수 있음)
  }

  // 🔹 버튼 액션: 저장 (Batch 처리 결과 확인)
  const handleSave = () => {
    const changes = getChanges()
    console.log('📌 저장할 데이터 (Batch Result):', changes)

    // API 호출 예시:
    // await saveApi(changes)

    alert(`추가: ${changes.added.length}건, 수정: ${changes.modified.length}건, 삭제: ${changes.deleted.length}건\n상세 내용은 콘솔 확인`)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">AA0010 - 사용자 관리 (Batch Grid)</h2>

      <Grid
        data={data}
        columns={columns}
        onSelectionChange={handleSelectionChange}
        rowStatus={rowStatus}
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          행 추가
        </button>
        <button
          onClick={handleDeleteRow}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          선택 삭제
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          저장 (Batch 상태 확인)
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-600">
        <h3 className="font-bold mb-2">💡 상태 가이드</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="inline-block w-3 h-3 bg-green-200 border border-green-400 mr-2"></span>추가된 행 (Created)</li>
          <li><span className="inline-block w-3 h-3 bg-yellow-200 border border-yellow-400 mr-2"></span>수정된 행 (Modified)</li>
        </ul>
      </div>
    </div>
  )
}
