import 'server-only';

import { cookies } from 'next/headers';

export type AuthUser = {
    _id:string;
    name:string;
    email:string;
    role:'admin' | 'user';
}

export async function getCurrentUser():Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if(!accessToken){
        return null;
    }
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`,{
            headers:{
                Cookie:`accessToken=${accessToken}`,
            },
            cache:'no-store'
        })

        console.log('Auth API status:', response.status);

        if(!response.ok){
            return null;
        }

        const user:AuthUser = await response.json();


        if(user.role !== 'admin' && user.role !== 'user'){
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}

export async function getAllUsers():Promise<AuthUser[] | null>{
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if(!accessToken){
        return null;
    }
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`,{
            headers:{
                Cookie:`accessToken=${accessToken}`,
            },
            cache:'no-store'
        })



        if(!response.ok){
            return null;
        }

        const users:AuthUser[] = await response.json();

        if(!users) return null;


        return users;
    } catch (error) {
        return null;
    }
}