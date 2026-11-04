import Navbar from '@/components/Navbar'
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const StoreLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
    const user = await getCurrentUser();
    
    if(user && user.role !== 'user'){
        redirect('/admin/login')
    }
  return (
    <div>
      <Navbar user={user ?? null} isAuthenticated={!!user}/>
      {children}
    </div>
  )
}

export default StoreLayout
