import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type RowStatus = 'ORIGINAL' | 'CREATED' | 'MODIFIED' | 'DELETED'

export interface BatchReturn<T> {
    data: T[]
    rowStatus: Record<string, RowStatus>
    addRow: (template?: Partial<T>) => void
    removeRows: (selectedRows: T[]) => void
    updateCell: (rowKey: string, columnId: string, value: any) => void
    getChanges: () => {
        added: T[]
        modified: T[]
        deleted: T[]
    }
}

export function useTanstackBatch<T extends { _rowKey: string }>(initialData: T[]): BatchReturn<T> {
    const [data, setData] = useState<T[]>(initialData)
    const [rowStatus, setRowStatus] = useState<Record<string, RowStatus>>({})

    // 행 추가
    const addRow = (template: Partial<T> = {}) => {
        const newRowKey = uuidv4()
        // 기본적으로 빈 객체에 _rowKey를 할당하고 template을 덮어씌움
        // 실제 사용 시 T 타입에 맞는 빈 값을 호출자가 보장하거나, Partial로 처리해야 함
        const newRow = { ...template, _rowKey: newRowKey } as T

        setData(prev => [...prev, newRow])
        setRowStatus(prev => ({ ...prev, [newRowKey]: 'CREATED' }))
    }

    // 행 삭제 (다중 선택 지원)
    const removeRows = (selectedRows: T[]) => {
        if (!selectedRows.length) return

        const selectedKeys = new Set(selectedRows.map(r => r._rowKey))

        setData(prev => {
            // CREATED 상태인 행은 아예 배열에서 제거
            const rowsToRemoveCleanly = prev.filter(
                row => selectedKeys.has(row._rowKey) && rowStatus[row._rowKey] === 'CREATED'
            )

            const keysToRemoveCleanly = new Set(rowsToRemoveCleanly.map(r => r._rowKey))

            return prev.filter(row => !keysToRemoveCleanly.has(row._rowKey))
        })

        setRowStatus(prev => {
            const nextStatus = { ...prev }
            selectedRows.forEach(row => {
                const key = row._rowKey
                const currentStatus = prev[key]

                if (currentStatus === 'CREATED') {
                    // 방금 만든건 그냥 상태도 삭제
                    delete nextStatus[key]
                } else {
                    // 기존 데이터는 DELETED 마킹
                    nextStatus[key] = 'DELETED'
                }
            })
            return nextStatus
        })
    }

    // 셀 수정
    const updateCell = (rowKey: string, columnId: string, value: any) => {
        setData(prev =>
            prev.map(row => (row._rowKey === rowKey ? { ...row, [columnId]: value } : row))
        )

        setRowStatus(prev => {
            const currentStatus = prev[rowKey]
            // 이미 CREATED면 상태 유지, 아니면 MODIFIED (DELETED 상태에선 수정 불가 가정)
            if (currentStatus === 'CREATED') return prev
            if (currentStatus === 'DELETED') return prev // 혹은 에러 처리

            return { ...prev, [rowKey]: 'MODIFIED' }
        })
    }

    // 변경분 추출
    const getChanges = () => {
        const added: T[] = []
        const modified: T[] = []
        const deleted: T[] = []

        // data 배열에는 DELETED 처리된 놈도 남아있음 (화면엔 유지하되 스타일만 변경)
        // 혹은 remove logic에서 data는 유지하고 status만 바꿀수도 있음.
        // 위 removeRows 로직: CREATED는 삭제, 나머지는 유지.
        // 따라서 data를 순회하며 status 확인

        data.forEach(row => {
            const status = rowStatus[row._rowKey]
            if (status === 'CREATED') added.push(row)
            else if (status === 'MODIFIED') modified.push(row)
            else if (status === 'DELETED') deleted.push(row)
        })

        return { added, modified, deleted }
    }

    return {
        data,
        rowStatus,
        addRow,
        removeRows,
        updateCell,
        getChanges,
    }
}
