import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/lib/models/task";

/**
 * GET: Mengambil detail data berdasarkan ID untuk mengisi form edit
 * Endpoint: /api/task/[id]
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { message: "Data berkas tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error: any) {
    console.error("GET_TASK_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data.", error: error.message },
      { status: 500 },
    );
  }
}

/**
 * PATCH: Mengupdate data tugas berdasarkan ID
 * Endpoint: /api/task/[id]
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // 1. Cari berkas terlebih dahulu
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return NextResponse.json(
        { message: "Data berkas tidak ditemukan." },
        { status: 404 },
      );
    }

    // 2. Cek apakah berkas sudah terkunci (Approved/Rejected)
    const isTerminal = ["approved", "rejected"].includes(
      existingTask.overallStatus,
    );
    if (isTerminal || existingTask.isLocked) {
      return NextResponse.json(
        { message: "Berkas sudah selesai/terkunci dan tidak dapat diubah." },
        { status: 403 },
      );
    }

    // 3. Update data berkas
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Berkas berhasil diperbarui",
        data: updatedTask,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("UPDATE_TASK_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data.", error: error.message },
      { status: 500 },
    );
  }
}
