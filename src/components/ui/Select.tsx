import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export default function Select({children,className="",...props}:SelectProps){
    return(
        <select {...props} className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3.5 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
            {children}
        </select>
    )
}