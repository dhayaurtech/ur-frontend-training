"use client";

import type { DataTableProps } from "./data-table.types";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function DataTable<T>({rows,columns,selectedRows=[],onSelectionChange}:DataTableProps<T>){
    const selectedRow = (row:T,checked:boolean) => {
      if(!onSelectionChange) return;

      if(checked){
        onSelectionChange([...selectedRows,row])
      }else{
        onSelectionChange(selectedRows.filter((selected) => selected!==row))
      }
    }
    
    return(
        <table className="w-full min-w-140 text-left text-sm ">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-violet-500">
                <tr>
                    {columns.map((column) => (
                        <th key={String(column.accessor)}  scope="col" className="px-6 py-4 text-left font-semibold">
                            {column.sortable ? (
                              <button type="button" onClick={column.sort} className="inline-flex items-center gap-2 hover:text-violet-800">
                                {column.header} {column.sortDirection === "asc" ? (<ArrowUp size={15}/>) : column.sortDirection === "desc" ? (<ArrowDown size={15}/>) : (<ArrowUpDown size={15}/>)}
                              </button>
                            ) : (
                              column.header
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {rows.map((row,index) => (
                    <tr key={index} className="transition-colors hover:bg-violet-50/40">
                        {columns.map((column) => (
                            <td key={String(column.accessor)} className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {column.selectable && (
                                  <input type="checkbox" checked={selectedRows.includes(row)} onChange={(e) => selectedRow(row,e.target.checked)} aria-label={`Select ${String(row[column.accessor])}`} className="h-4 w-4 accent-violet-600"/>
                                )}
                                {column.cell ? column.cell(row) : String(row[column.accessor])}
                              </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
