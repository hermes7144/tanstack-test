import { memo, useEffect, useState } from 'react'

export const EditableCell = memo(
  ({ getValue, row, column, updateData }: any) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    // 외부에서 값이 바뀌면(예: API 로드) 동기화
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    const onBlur = () => {
      updateData(row.original._rowKey, column.id, value)
    }

    return (
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        className="w-full px-2 py-1 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors"
      />
    )
  },
  (prev, next) => {
    // 렌더링 방지 조건: 값이 같고 위치가 같으면 리렌더링 안함
    return (
      prev.getValue() === next.getValue() &&
      prev.row.index === next.row.index &&
      prev.column.id === next.column.id
    )
  }
)
