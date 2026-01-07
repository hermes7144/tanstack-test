import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { RowSelectionState } from '@tanstack/react-table'

export type RowStatus = 'ORIGINAL' | 'CREATED' | 'MODIFIED' | 'DELETED'

export type BatchRow<T> = T & {
    _rowKey: string
    _status?: RowStatus
}

export interface BatchOptions {
    rowKeyField?: string
}

export interface BatchReturn<T> {
    gridProps: {
        data: BatchRow<T>[]
        rowSelection: RowSelectionState
        onRowSelectionChange: (selection: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void
    }
    data: BatchRow<T>[]
    rowSelection: RowSelectionState
    onRowSelectionChange: (selection: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void
    addRow: (template?: Partial<T>) => void
    removeRows: (selectedRows: BatchRow<T>[]) => void
    updateCell: (rowKey: string, columnId: string, value: any) => void
    getChanges: () => {
        added: BatchRow<T>[]
        modified: BatchRow<T>[]
        deleted: BatchRow<T>[]
    }
}

export function useTanstackBatch<T>(
    initialData: T[],
    options: BatchOptions = {}
): BatchReturn<T> {
    const rowKeyField = options.rowKeyField || '_rowKey'

    const [data, setData] = useState<BatchRow<T>[]>(() => {
        return initialData.map(item => ({
            ...item,
            [rowKeyField]: (item as any)[rowKeyField] || uuidv4(),
            _status: 'ORIGINAL' as RowStatus,
        } as BatchRow<T>))
    })

    // 선택 상태를 Hook 내부에서 관리 (Object 형태: { [rowId]: boolean })
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    // 행 추가
    const addRow = useCallback((template: Partial<T> = {}) => {
        const newRowKey = uuidv4()
        const newRow = {
            ...template,
            [rowKeyField]: newRowKey,
            _status: 'CREATED'
        } as BatchRow<T>

        setData(prev => [...prev, newRow])
    }, [rowKeyField])

    // 셀 수정
    const updateCell = useCallback((rowKey: string, columnId: string, value: any) => {
        setData(prev =>
            prev.map(row => {
                if (row._rowKey !== rowKey) return row

                // 이미 DELETED 상태면 수정 불가
                if (row._status === 'DELETED') return row

                const newStatus = row._status === 'CREATED' ? 'CREATED' : 'MODIFIED'

                return {
                    ...row,
                    [columnId]: value,
                    _status: newStatus
                }
            })
        )
    }, [])

    // 행 삭제 (선택된 행 처리)
    // 이 함수는 getChanges에서 처리하지만, 만약 직접 호출이 필요하다면 아래 로직 사용
    const removeRows = useCallback((_selectedRows: BatchRow<T>[]) => {
        // ... (현재는 getChanges 사용을 권장하므로 비워둠)
    }, [])

    // 변경분 추출
    const getChanges = useCallback(() => {
        const added: BatchRow<T>[] = []
        const modified: BatchRow<T>[] = []
        const deleted: BatchRow<T>[] = []

        // Object 형태의 rowSelection을 사용하여 체크된 ID 확인
        const selectedKeys = new Set(Object.keys(rowSelection))

        data.forEach(row => {
            // 1. 체크된 항목 처리
            if (rowSelection[row._rowKey]) {
                if (row._status === 'CREATED') {
                    // 신규 생성 후 체크해서 저장 -> 전송 제외
                } else {
                    // 기존 데이터 -> 삭제 대상
                    deleted.push({ ...row, _status: 'DELETED' })
                }
                return
            }

            // 2. 체크되지 않은 항목 처리
            if (row._status === 'CREATED') {
                added.push(row)
            } else if (row._status === 'MODIFIED') {
                modified.push(row)
            } else if (row._status === 'DELETED') {
                deleted.push(row)
            }
        })

        return { added, modified, deleted }
    }, [data, rowSelection])

    const gridProps = {
        data,
        rowSelection,
        onRowSelectionChange: setRowSelection,
    }

    return {
        gridProps, // 🔹 그리드용 Props 묶음
        data,
        rowSelection,
        onRowSelectionChange: setRowSelection,
        addRow,
        removeRows,
        updateCell,
        getChanges,
    }
}
