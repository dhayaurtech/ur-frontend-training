export interface Column<T>{
    header:string;
    accessor:keyof T;
    cell?:(row:T) => React.ReactNode;
    sortable?:boolean;
    sort?:() => void;
    sortDirection:"asc" | "desc" | null;
    selectable:boolean;
}

export interface DataTableProps<T>{
    rows:T[];
    columns:Column<T>[];
    selectedRows?:T[];
    onSelectionChange?:(rows:T[]) => void;
}