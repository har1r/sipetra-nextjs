"use client";

import { Search, Menu, UserCircle } from "lucide-react";

interface NavbarProps {
  userName?: string;
  onMenuClick: () => void;
  onRightPanelClick: () => void; // Tambahkan prop ini
}

export default function Navbar({
  userName,
  onMenuClick,
  onRightPanelClick,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 flex h-16 lg:h-20 w-full items-center gap-4 px-4 lg:px-8 bg-background/70 backdrop-blur-xl border-b border-border">
      {/* Tombol Menu Kiri (Sidebar) - Muncul hanya di Mobile/Tablet */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-muted rounded-lg text-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 flex max-w-md items-center gap-3 rounded-xl lg:rounded-2xl bg-muted px-4 py-2 text-muted-foreground border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search size={18} className="shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full text-foreground"
        />
      </div>

      {/* Tombol Pemicu Right Panel - Muncul hanya di layar < XL */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRightPanelClick}
          className="xl:hidden p-2 hover:bg-muted rounded-xl text-foreground transition-all flex items-center gap-2 border border-border bg-card"
        >
          <UserCircle size={22} className="text-primary" />
          <span className="text-xs font-bold pr-1">{userName || "User"}</span>
        </button>
      </div>
    </nav>
  );
}
