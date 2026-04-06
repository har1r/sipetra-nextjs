import { NextResponse } from "next/server";
import Task from "@/lib/models/task";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    // Mengambil semua task, diurutkan dari yang terbaru
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        message: "Berhasil mengambil data tugas", 
        count: tasks.length,
        data: tasks 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET_TASKS_ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Gagal mengambil data dari server" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Inisialisasi Approvals sesuai urutan stage di model
    // Ini penting agar middleware 'pre-save' tidak error saat mencari currentStage
    const initialApprovals = [
      { stageOrder: 1, stage: "penginputan", status: "approved", note: "Data masuk dari sistem" },
      { stageOrder: 2, stage: "penelitian", status: "in_progress" },
      { stageOrder: 3, stage: "pemeriksaan", status: "in_progress" },
      { stageOrder: 4, stage: "pengarsipan", status: "in_progress" },
      { stageOrder: 5, stage: "pengiriman", status: "in_progress" },
    ];

    // 2. Mapping data dari Frontend ke struktur Mongoose
    const taskData = {
      ...body,
      approvals: initialApprovals,
      currentStage: "penelitian", // Langsung pindah ke penelitian setelah input selesai
      overallStatus: "in_progress",
      // createdBy: user.id // Jika ada session auth, masukkan di sini
    };

    // 3. Create document (Middleware pre-save akan otomatis jalan di sini)
    const newTask = await Task.create(taskData);

    return NextResponse.json(
      { message: "Tugas berhasil dibuat", data: newTask },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API_ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}