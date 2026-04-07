// app/(dashboard)/layout.tsx
import { getSession } from "@/lib/auth/auth"; // Sesuaikan path auth Anda
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Proteksi rute: Jika tidak ada sesi, tendang ke login
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayoutClient userName={session.user.name}>
      {children}
    </DashboardLayoutClient>
  );
}
