"use client";
import { apiClient } from "@/lib/api-client";
import { Bell, UserRound, ChevronDown } from "lucide-react";
import {useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type NavbarProps = {
  isAuthenticated:boolean;
}

export default function Navbar({isAuthenticated}:NavbarProps){
  const router = useRouter();
  type User = {
  name: string;
  email: string;
};

const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  async function fetchUser() {
    try {
      const result = await apiClient.get<User>('/auth');
      setUser(result);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }

  fetchUser();
}, []);
  const handleLogout = async() => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,{
        method:'POST',
        credentials:"include"
      });

      if(!response.ok){
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed : ",error);
    }
  }
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <nav className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <span className="text-lg font-bold">S</span>
          </div>

          <h1 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Shop<span className="text-violet-600">Desk</span>
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2 text-gray-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
          </button>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="flex items-center gap-2">
            {user && isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border-2 border-violet-200 bg-violet-100 px-3 py-1.5 text-sm text-violet-700"
            >
              Logout
            </button>
            ):(
              <button
              type="button"
              onClick={() => router.push('/login')}
              className="rounded-xl border-2 border-violet-200 bg-violet-100 px-3 py-1.5 text-sm text-violet-700"
            >
              Login
            </button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <UserRound size={19} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-gray-800">{user ? user.name : "Admin"}</p>
              <p className="text-xs text-gray-500">Store Manager</p>
            </div>

            <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </div>
        </div>
      </nav>
    </header>
  );
};

