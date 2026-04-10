"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import RightPanel from "@/components/right-panel";
import { Suspense, useState } from "react";
import "@/app/(dic)/dic-layout.css";

interface Props {
  children: React.ReactNode;
  user?: any;
}

export default function DashboardLayoutClient({ children, user }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="h-full w-full" />
      </aside>

      {/* OVERLAY */}
      {(isMobileMenuOpen || isRightPanelOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsRightPanelOpen(false);
          }}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onRightPanelClick={() => setIsRightPanelOpen(true)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-background">
          <div className="p-4 md:p-8 min-h-full">{children}</div>
        </main>
      </div>

      {/* RIGHT PANEL */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 
          xl:relative xl:translate-x-0 border-l border-border bg-card
          ${isRightPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <Suspense fallback={null}>
          <RightPanel user={user} className="h-full w-full border-none" />
        </Suspense>
      </aside>
    </div>
  );
}
