import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin") {
    redirect("/store/product");
  }

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}