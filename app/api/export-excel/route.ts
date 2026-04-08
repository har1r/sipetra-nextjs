import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/lib/models/task";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const nopel = searchParams.get("nopel");
    const currentStage = searchParams.get("currentStage");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const serviceType = searchParams.get("serviceType");
    const taxObjectSubdistrict = searchParams.get("taxObjectSubdistrict");
    const taxObjectVillage = searchParams.get("taxObjectVillage");

    // 1. Membangun Query Object (Sama dengan logic GET All)
    const query: any = {};
    if (serviceType)
      query.serviceType = { $regex: serviceType.trim(), $options: "i" };
    if (nopel) query.nopel = { $regex: nopel.trim(), $options: "i" };
    if (search) {
      query.$or = [
        { "baseData.taxpayerName": { $regex: search, $options: "i" } },
        { nop: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }
    if (currentStage) query.currentStage = currentStage;
    if (taxObjectSubdistrict)
      query["baseData.taxObjectSubdistrict"] = taxObjectSubdistrict;
    if (taxObjectVillage) query["baseData.taxObjectVillage"] = taxObjectVillage;

    if (status) {
      const s = status.toLowerCase();
      const statusMap: Record<string, string> = {
        ditolak: "rejected",
        revisi: "revised",
        selesai: "approved",
        proses: "in_progress",
      };
      if (statusMap[s]) query.overallStatus = statusMap[s];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // 2. Ambil Data
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .lean();

    // 3. Inisialisasi ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Pelayanan SIPETRA");

    // 4. Definisi Header Berdasarkan Model ITask
    worksheet.columns = [
      { header: "NO", key: "no", width: 5 },
      { header: "TGL DAFTAR", key: "createdAt", width: 12 },
      { header: "NO PELAYANAN", key: "nopel", width: 20 },
      { header: "NOP", key: "nop", width: 20 },
      { header: "JENIS LAYANAN", key: "serviceType", width: 20 },

      // Data Wajib Pajak (baseData)
      { header: "NAMA WP", key: "wpName", width: 25 },
      { header: "ALAMAT WP", key: "wpAddress", width: 30 },
      { header: "DESA WP", key: "wpVillage", width: 15 },
      { header: "KEC WP", key: "wpSubdistrict", width: 15 },

      // Data Objek Pajak (baseData)
      { header: "ALAMAT OP", key: "opAddress", width: 30 },
      { header: "DESA OP", key: "opVillage", width: 15 },
      { header: "KEC OP", key: "opSubdistrict", width: 15 },
      { header: "LUAS TANAH", key: "land", width: 12 },
      { header: "LUAS BANGUNAN", key: "building", width: 12 },

      // Status Sistem
      { header: "TAHAPAN SAAT INI", key: "stage", width: 15 },
      { header: "STATUS AKHIR", key: "status", width: 15 },
      { header: "PETUGAS", key: "officer", width: 15 },
    ];

    // Styling Header (Bold & Background Warna)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // 5. Mapping Data ke Baris
    tasks.forEach((task: any, index: number) => {
      worksheet.addRow({
        no: index + 1,
        createdAt: new Date(task.createdAt).toLocaleDateString("id-ID"),
        nopel: task.nopel,
        nop: task.nop,
        serviceType: task.serviceType.toUpperCase(),

        // baseData mapping
        wpName: task.baseData?.taxpayerName || "-",
        wpAddress: task.baseData?.taxpayerAddress || "-",
        wpVillage: task.baseData?.taxpayerVillage || "-",
        wpSubdistrict: task.baseData?.taxpayerSubdistrict || "-",

        opAddress: task.baseData?.taxObjectAddress || "-",
        opVillage: task.baseData?.taxObjectVillage || "-",
        opSubdistrict: task.baseData?.taxObjectSubdistrict || "-",
        land: task.baseData?.landArea || 0,
        building: task.baseData?.buildingArea || 0,

        stage: task.currentStage.toUpperCase(),
        status:
          task.overallStatus === "approved"
            ? "SELESAI"
            : task.overallStatus === "rejected"
              ? "DITOLAK"
              : task.overallStatus === "revised"
                ? "REVISI"
                : "PROSES",
        officer: task.createdBy?.name || "System",
      });
    });

    // Menambahkan border ke seluruh sel yang terisi
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 6. Generate Buffer & Streaming Response
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="LAPORAN_SIPETRA_${new Date().getTime()}.xlsx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error("EXPORT_EXCEL_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal ekspor data excel." },
      { status: 500 },
    );
  }
}
