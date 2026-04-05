"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, Settings, CheckSquare } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Tugas Saya", icon: <CheckSquare size={20} />, href: "/tasks" },
    { name: "Rekomendasi", icon: <FileText size={20} />, href: "/recommendations" },
  ];

  const active = "Dashboard"; // nanti bisa pakai pathname

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col px-4 py-6">

        {/* LOGO */}
        <div className="mb-10 px-2 flex items-center gap-2">
          <div className="flex items-center gap-[7px]">
              <span className="text-2xl font-black tracking-tight text-foreground">
                SIPETR
              </span>
              <div className="relative w-6 h-6">
                <div className="absolute left-0 top-[-3px] w-0.5 h-full bg-primary rotate-12 origin-top"></div>
                <div className="absolute left-1 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
                <div className="absolute left-2 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
                <div className="absolute right-2 top-2 w-0.5 h-full bg-primary rotate-12 origin-top"></div>
              </div>
            </div>
        </div>

        {/* MENU */}
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = item.name === active;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                        }
                      : {}
                  }
                >
                  <span
                    className={`${
                      isActive ? "text-white" : "text-muted-foreground"
                    }`}
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
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted transition-all"
          >
            <Settings size={20} />
            Pengaturan
          </Link>
        </div>
      </div>
    </aside>
  );
}