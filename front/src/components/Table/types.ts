export interface TableHeader {
  label: string
  key: string
  colspan?: number
  rowspan?: number
  sortable?: boolean
  sort?: TableSortDirection
}

export interface TableProps {
  headers: TableHeader[]
  subHeaders?: TableHeader[]
}

export enum TableSortDirection {
  Asc = 1,
  Desc = -1
}
