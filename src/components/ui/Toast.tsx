import { CircleCheck } from 'lucide-react'
import React from 'react'
import Button from './Button'

type ToastProps = {
    fun:() => void;
    message:string;
}
const Toast = ({fun,message}:ToastProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-green-500"><CircleCheck className="w-15 h-15"/></p>
            <p className="text-lg font-semibold text-gray-900">{message}</p>
            <div className="flex gap-3">
              <Button variant="primary" onClick={fun}>Ok</Button>
            </div>
        </div>
    </div>
  )
}

export default Toast
