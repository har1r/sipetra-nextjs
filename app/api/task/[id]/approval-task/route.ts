import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/lib/models/task";
import mongoose from "mongoose";

const STAGE_ORDER = [
  "penginputan",
  "penelitian",
  "pemeriksaan",
  "pengarsipan",
  "pengiriman",
];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // User data dari body (pastikan di produksi ini datang dari session/token yang valid)
    const user = { _id: body.userId, role: body.userRole };

    const { action, note, itemUpdates, isPartialUpdate } = body;

    // 1. Cari Task
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { message: "Berkas tidak ditemukan." },
        { status: 404 },
      );
    }

    // 2. Proteksi Status Terminal & Viewer
    // Viewer tidak boleh melakukan PATCH sama sekali
    if (user.role === "viewer") {
      return NextResponse.json(
        { message: "Akses ditolak. Viewer hanya boleh melihat data." },
        { status: 403 },
      );
    }

    if (
      ["approved", "rejected"].includes(task.overallStatus) ||
      task.isLocked
    ) {
      return NextResponse.json(
        { message: `Berkas sudah final atau terkunci.` },
        { status: 400 },
      );
    }

    // 3. Validasi Otoritas Role Berdasarkan Aturan Baru
    const currentStage = task.currentStage;

    /**
     * LOGIKA ROLE:
     * - Admin: Bisa semua stage.
     * - Operator: Hanya bisa stage "penginputan".
     * - Viewer: Sudah ditolak di atas.
     */
    if (user.role !== "admin") {
      if (user.role === "operator" && currentStage !== "penginputan") {
        return NextResponse.json(
          {
            message: `Operator hanya diizinkan mengelola tahap 'penginputan'. Tahap saat ini: ${currentStage}`,
          },
          { status: 403 },
        );
      }

      // Jika ada role lain yang tidak dikenal
      if (user.role !== "operator") {
        return NextResponse.json(
          { message: "Role tidak dikenali." },
          { status: 403 },
        );
      }
    }

    // 4. LOGIKA AUTO-SAVE (Update item di requestedChanges)
    if (Array.isArray(itemUpdates) && itemUpdates.length > 0) {
      itemUpdates.forEach((upd: any) => {
        const item = task.requestedChanges[upd.index];
        if (item) {
          item.status = upd.status;
          if (upd.note !== undefined) item.note = upd.note;
        }
      });

      task.markModified("requestedChanges");

      if (isPartialUpdate) {
        await task.save();
        return NextResponse.json({
          success: true,
          message: "Progress item berhasil disimpan.",
          data: { overallStatus: task.overallStatus },
        });
      }
    }

    // 5. Cari Record Approval Aktif
    const approvalRecord = task.approvals.find((a) => a.stage === currentStage);
    if (!approvalRecord) {
      return NextResponse.json(
        { message: "Data workflow stage tidak sinkron." },
        { status: 500 },
      );
    }

    const now = new Date();

    // 6. SWITCH ACTION (Finalisasi Stage)
    switch (action) {
      case "revised":
        task.revisedHistories.push({
          revisedAct: currentStage,
          revisedBy: new mongoose.Types.ObjectId(user._id),
          revisedNote: note || "Perbaikan diperlukan.",
          revisedAt: now,
          stageAtRevision: currentStage,
          isResolved: false,
        });
        approvalRecord.status = "revised";
        approvalRecord.note = note;
        approvalRecord.approvedBy = new mongoose.Types.ObjectId(user._id);
        approvalRecord.approvedAt = now;
        break;

      case "rejected":
        approvalRecord.status = "rejected";
        approvalRecord.note = note || "Ditolak permanen.";
        approvalRecord.approvedBy = new mongoose.Types.ObjectId(user._id);
        approvalRecord.approvedAt = now;
        task.isLocked = true;
        break;

      case "approved":
        // Validasi Stage Pemeriksaan: Semua item requestedChanges wajib approved
        if (currentStage === "pemeriksaan") {
          const isAllItemsApproved = task.requestedChanges.every(
            (i) => i.status === "approved",
          );
          if (!isAllItemsApproved) {
            return NextResponse.json(
              {
                message:
                  "Semua item perubahan harus 'Approved' sebelum tahap ini selesai.",
              },
              { status: 400 },
            );
          }
        }

        // Validasi Stage Pengarsipan: Wajib ada reportId
        if (currentStage === "pengarsipan" && !task.reportId) {
          return NextResponse.json(
            {
              message:
                "Gagal: Berkas belum dimasukkan ke dalam Report/Laporan.",
            },
            { status: 400 },
          );
        }

        approvalRecord.status = "approved";
        approvalRecord.note = note || "Disetujui.";
        approvalRecord.approvedBy = new mongoose.Types.ObjectId(user._id);
        approvalRecord.approvedAt = now;

        // Tutup history revisi yang aktif di stage ini
        task.revisedHistories.forEach((rh) => {
          if (!rh.isResolved && rh.stageAtRevision === currentStage) {
            rh.isResolved = true;
          }
        });

        // Transisi Stage
        const currentIdx = STAGE_ORDER.indexOf(currentStage);
        const nextStage = STAGE_ORDER[currentIdx + 1];

        if (nextStage) {
          task.currentStage = nextStage as any;
          const nextApproval = task.approvals.find(
            (a) => a.stage === nextStage,
          );
          if (nextApproval) nextApproval.status = "in_progress";
        } else {
          // Jika sudah di pengiriman (stage terakhir)
          task.isLocked = true;
        }
        break;

      default:
        return NextResponse.json(
          { message: "Aksi tidak valid." },
          { status: 400 },
        );
    }

    await task.save();

    return NextResponse.json({
      success: true,
      message: `Berhasil memperbarui tahap ${currentStage}.`,
      data: {
        currentStage: task.currentStage,
        overallStatus: task.overallStatus,
      },
    });
  } catch (error: any) {
    console.error("APPROVAL_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem.", error: error.message },
      { status: 500 },
    );
  }
}
