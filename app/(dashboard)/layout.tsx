import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import RightPanel from "@/components/right-panel";
import { getSession } from "@/lib/auth/auth";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 flex-shrink-0">
        <Sidebar className="sidebar-mongo" />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar className="navbar-mongo" />

        <main className="flex-1 p-8 overflow-hidden">
          {children}
        </main>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[320px] flex-shrink-0">
        <Suspense fallback={null}>
          <RightPanelWrapper />
        </Suspense>
      </div>
    </div>
  );
}

/* =========================
   WRAPPERS (SERVER SIDE)
========================= */

async function RightPanelWrapper() {
  const session = await getSession();
  return (
    <RightPanel userName={session?.user?.name} className="right-panel-mongo" />
  );
}
