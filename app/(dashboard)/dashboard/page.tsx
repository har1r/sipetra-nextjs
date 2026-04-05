import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(userId: string) {
  "use cache";

  await connectDB();

  // const boardDoc = await Board.findOne({
  //   userId: userId,
  //   name: "Job Hunt",
  // }).populate({
  //   path: "columns",
  //   populate: {
  //     path: "jobApplications",
  //   },
  // });

  // if (!boardDoc) return null;

  // const board = JSON.parse(JSON.stringify(boardDoc));

  // return board;
}

async function DashboardPage() {
  const session = await getSession();
  
  // Proteksi Route
  if (!session?.user) {
    redirect("/sign-in");
  }

  const board = await getBoard(session.user.id);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Papan Tugas</h1>
        <p className="text-slate-500 mt-1">Pantau status permohonan wajib pajak secara real-time.</p>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* <KanbanBoard board={board} userId={session.user.id} />
        <KanbanBoard board={board} userId={session.user.id} /> */}
      </div>
    </div>
  );
}

export default async function Dashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat data papan...</div>}>
      <DashboardPage />
    </Suspense>
  );
}