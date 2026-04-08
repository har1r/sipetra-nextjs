import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Task from "@/lib/models/task";

/**
 * GET: Mengambil data tugas dengan filter, pencarian, dan pagination
 * Endpoint: /api/tasks?nopel=...&status=...&page=1&limit=10&sort=newest&serviceType=...
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Ambil Query Parameters dari URL
    const { searchParams } = new URL(req.url);
    const nopel = searchParams.get("nopel");
    const currentStage = searchParams.get("currentStage");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    // --- QUERY TAMBAHAN ---
    const serviceType = searchParams.get("serviceType");
    const taxObjectSubdistrict = searchParams.get("taxObjectSubdistrict");
    const taxObjectVillage = searchParams.get("taxObjectVillage");

    // --- SORTING ---
    const sortOrder = searchParams.get("sort") || "newest";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // 2. Membangun Query Object (Filtering)
    const query: any = {};

    // Filter Title (Case-insensitive partial match)
    if (serviceType) {
      query.serviceType = { $regex: serviceType.trim(), $options: "i" };
    }

    // Filter Nopel (Case-insensitive partial match)
    if (nopel) {
      query.nopel = { $regex: nopel.trim(), $options: "i" };
    }

    // Filter Pencarian Global (Nama Wajib Pajak atau NOP)
    if (search) {
      query.$or = [
        { "baseData.taxpayerName": { $regex: search, $options: "i" } },
        { nop: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } }, // Juga mencari di serviceType jika search global diisi
      ];
    }

    // Filter Tahapan Berkas
    if (currentStage) {
      query.currentStage = currentStage;
    }

    // Filter Wilayah Objek Pajak
    if (taxObjectSubdistrict) {
      query["baseData.taxObjectSubdistrict"] = taxObjectSubdistrict;
    }
    if (taxObjectVillage) {
      query["baseData.taxObjectVillage"] = taxObjectVillage;
    }

    // Filter Status (Mapping dari UI Indonesia ke Enum Model)
    if (status) {
      const s = status.toLowerCase();
      const statusMap: Record<string, string> = {
        ditolak: "rejected",
        revisi: "revised",
        selesai: "approved",
        proses: "in_progress",
      };
      if (statusMap[s]) {
        query.overallStatus = statusMap[s];
      }
    }

    // Filter Rentang Tanggal (CreatedAt)
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // 3. Penentuan Sorting
    const sortValue = sortOrder === "oldest" ? 1 : -1;

    // 4. Execution dengan Pagination & Performa (Lean)
    const skip = (page - 1) * limit;

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: sortValue })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name username")
        .lean(),
      Task.countDocuments(query),
    ]);

    // 5. Data Transformation (UI Helpers)
    const formattedTasks = tasks.map((task: any) => {
      const statusLabels: Record<string, string> = {
        rejected: "DITOLAK",
        approved: "SELESAI",
        revised: "REVISI",
        in_progress: "PROSES",
      };

      const colorMap: Record<string, string> = {
        rejected: "red",
        revised: "orange",
        approved: "green",
        in_progress: "blue",
      };

      const isTerminal = ["approved", "rejected"].includes(task.overallStatus);

      return {
        ...task,
        uiHelpers: {
          displayStatus: statusLabels[task.overallStatus] || "PROSES",
          badgeColor: colorMap[task.overallStatus] || "blue",
          isLocked: isTerminal || task.isLocked,
          canAction: !isTerminal,
        },
      };
    });

    return NextResponse.json(
      {
        success: true,
        pagination: {
          totalData: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit: limit,
          currentSort: sortOrder,
        },
        data: formattedTasks,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET_TASKS_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data tugas.", error: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST: Membuat tugas baru dengan inisialisasi urutan stage
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const initialApprovals = [
      {
        stageOrder: 1,
        stage: "penginputan",
        status: "approved",
        note: "Input sistem berhasil",
      },
      { stageOrder: 2, stage: "penelitian", status: "in_progress" },
      { stageOrder: 3, stage: "pemeriksaan", status: "in_progress" },
      { stageOrder: 4, stage: "pengarsipan", status: "in_progress" },
      { stageOrder: 5, stage: "pengiriman", status: "in_progress" },
    ];

    const taskData = {
      ...body,
      approvals: initialApprovals,
      currentStage: "penelitian",
      overallStatus: "in_progress",
      isLocked: false,
    };

    const newTask = await Task.create(taskData);

    return NextResponse.json(
      {
        success: true,
        message: "Tugas berhasil didaftarkan ke sistem",
        data: newTask,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST_TASK_ERROR:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Nomor Pelayanan (Nopel) sudah terdaftar dalam sistem." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan saat menyimpan data" },
      { status: 500 },
    );
  }
}
