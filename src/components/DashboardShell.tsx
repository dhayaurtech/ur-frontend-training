"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Mobile backdrop */}
        {isMobileOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-gray-900/40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed bottom-0 left-0 top-16 z-50 h-[calc(100dvh-4rem)] transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        {/* Main area */}
        <div className="min-w-0 flex-1">
          {/* Page toolbar */}
          <div className="sticky top-16 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 md:hidden"
              aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden rounded-lg p-2 text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 md:inline-flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            <div className="h-5 w-px bg-gray-200" />

            <p className="text-sm font-medium text-gray-500">
              ShopDesk / <span className="text-gray-900">Workspace</span>
            </p>
          </div>

          {/* Page content */}
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}