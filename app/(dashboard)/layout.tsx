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
    <div className="min-h-screen flex bg-background">
      {/* SIDEBAR */}
      <Sidebar className="sidebar-mongo" />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen pl-64 pr-[320px]">
        {/* NAVBAR */}
        <Navbar className="navbar-mongo" />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 section-mongo">{children}</main>
      </div>

      {/* RIGHT PANEL */}
      <Suspense fallback={null}>
        <RightPanelWrapper />
      </Suspense>
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
