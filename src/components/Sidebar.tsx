
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

const options = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Settings", href: "/settings", icon: Settings },
];

type SidebarProps = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-5 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      <p
        className={`mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 ${
          isCollapsed ? "text-center" : ""
        }`}
      >
        {isCollapsed ? "Menu" : "Workspace"}
      </p>

      <nav className="flex flex-col gap-1.5">
        {options.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.3 : 1.8}
                className="shrink-0"
              />

              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <p className="px-3 text-xs text-gray-400">
          {!isCollapsed && "ShopDesk Admin"}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

