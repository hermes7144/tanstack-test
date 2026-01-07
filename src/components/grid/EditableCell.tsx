import { memo, useEffect, useState } from 'react'

export function EditableCell({ getValue, row, column, updateData }: any) {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  console.log(`[Rendering] Cell(${row.index}, ${column.id})`)

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
}
