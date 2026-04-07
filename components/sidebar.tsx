"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { LayoutDashboard, FileText, Settings, CheckSquare } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname(); // 2. Ambil path saat ini (misal: "/manage-task")

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      name: "Kelola Pelayanan",
      icon: <CheckSquare size={20} />,
      href: "/manage-task",
    },
    {
      name: "Surat Pengantar",
      icon: <FileText size={20} />,
      href: "/recommendations",
    },
  ];

  return (
    <aside
      className={`w-64 border-r border-border bg-card flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-10 px-2 flex items-center gap-2">
          <span className="text-xl lg:text-2xl font-black tracking-tight text-foreground">
            SIPETRA
          </span>
        </div>

        <ul className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${pathname.startsWith(item.href) ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
              >
                {item.icon} {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Footer Settings */}
        <div className="pt-4 border-t border-border">
          <Link
            href="/settings"
            className={`sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              pathname === "/settings"
                ? "active bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Settings size={20} />
            Pengaturan
          </Link>
        </div>
      </div>
    </aside>
  );
}
