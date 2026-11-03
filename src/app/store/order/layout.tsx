import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const OrderLayout = async({children}:Readonly<{children:ReactNode}>) => {
    const user = await getCurrentUser();
        
    if(!user){
        redirect('/login')
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default OrderLayout
