// grid/types.ts
import { ColumnDef } from '@tanstack/react-table'

export type GridColumn<T> = ColumnDef<T> & {
  align?: 'left' | 'center' | 'right'
}
