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
      className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card ${className || ""}`}
    >
      <div className="flex h-full flex-col px-4 py-6">
        {/* LOGO */}
        <div className="mb-10 px-2 flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-foreground">
            SIPETRA
          </span>
          {/* Logo dekorasi tetap di sini */}
        </div>

        {/* MENU */}
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => {
            // 3. Logika pengecekan aktif:
            // Menggunakan startsWith agar sub-route (misal /manage-task/update/1) tetap aktif
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "active bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={
                      isActive ? "text-primary" : "text-muted-foreground"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* FOOTER */}
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
