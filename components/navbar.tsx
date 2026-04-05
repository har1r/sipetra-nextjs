"use client";

import { Search } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-30 flex h-20 w-full items-center px-8 bg-background/70 backdrop-blur-xl border-b border-border">

      {/* SEARCH ONLY */}
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-muted px-5 py-2 text-muted-foreground border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

    </nav>
  );
}