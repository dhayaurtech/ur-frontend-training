import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if(!token){
    redirect('/login')
  }

  return <DashboardShell>{children}</DashboardShell>;
}

