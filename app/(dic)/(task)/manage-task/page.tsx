"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Search,
  ChevronRight,
  Loader2,
  Plus,
  Users,
  ChevronDown,
  Info,
  Filter,
  X,
  Calendar,
  ArrowUpDown,
  Type,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  FileEdit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

/* =========================
    TYPES & HELPERS
========================= */

type Task = {
  _id: string;
  serviceType: string;
  nopel: string;
  nop: string;
  baseData: {
    taxpayerName: string;
    taxObjectVillage: string;
    taxObjectSubdistrict: string;
    landArea: number;
    buildingArea: number;
  };
  requestedChanges: Array<{
    fieldName?: string;
    taxpayerName: string;
    landArea: number;
    buildingArea: number;
    status: string;
  }>;
  currentStage: string;
  overallStatus: string;
  uiHelpers: {
    displayStatus: string;
    badgeColor: string;
    isLocked: boolean;
    canAction: boolean;
  };
  createdAt: string;
};

const KECAMATAN_DATA: Record<string, string[]> = {
  Pakuhaji: [
    "Kalibaru",
    "Surya Bahari",
    "Sukawali",
    "Kramat",
    "Kohod",
    "Gaga",
    "Kiara Payung",
    "Buaran Bambu",
    "Paku Alam",
    "Buaran Mangga",
    "Pakuhaji",
    "Bunisari",
    "Laksana",
    "Rawaboni",
  ],
  Kosambi: [
    "Salembaran Jaya",
    "Salembaran Jati",
    "Kosambi Barat",
    "Kosambi Timur",
    "Dadap",
    "Jatimulya",
    "Cengklong",
    "Blimbing",
    "Rawa Burung",
    "Rawa Rengas",
  ],
  Teluknaga: [
    "Bojong Renged",
    "Kebon Cau",
    "Teluknaga",
    "Babakan Asem",
    "Kamp Melayu T",
    "Kamp Melayu B",
    "Kampung Besar",
    "Lemo",
    "Tegal Angus",
    "Pangkalan",
    "Tanjung Burung",
    "Tanjung Pasir",
    "Muara",
  ],
  "Sepatan Timur": [
    "Kedaung Barat",
    "Lebak Wangi",
    "Tanah Merah",
    "Jati Mulya",
    "Gempolsari",
    "Sangiang",
    "Pondok Kelor",
    "Kampung Kelor",
  ],
  Sepatan: [
    "Mekarjaya",
    "Karet",
    "Pondok Jaya",
    "Sepatan",
    "Pisangan Jaya",
    "Sarakan",
    "Kayu Agung",
    "Kayu Bongkok",
  ],
};

const SERVICE_TYPES = [
  "pengaktifan",
  "mutasi habis update",
  "mutasi habis reguler",
  "mutasi sebagian",
  "pembetulan",
  "objek pajak baru",
];

const capitalize = (str: string) => {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/* =========================
    INTERNAL MODAL COMPONENT
========================= */

function ApprovalModalContent({
  task,
  currentUser,
  onSuccess,
  onClose,
}: {
  task: Task;
  currentUser: any;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [localItems, setLocalItems] = useState(task.requestedChanges || []);

  const canApprove =
    currentUser?.role === "admin" || currentUser?.role === "operator";

  const isTerminal =
    ["approved", "rejected"].includes(task.overallStatus) ||
    task.uiHelpers.isLocked;

  const handleItemStatusChange = async (index: number, newStatus: string) => {
    const updated = [...localItems];
    updated[index].status = newStatus;
    setLocalItems(updated);

    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          userRole: currentUser.role,
          isPartialUpdate: true,
          itemUpdates: [{ index, status: newStatus }],
        }),
      });
    } catch (err) {
      console.error("Gagal auto-save", err);
    }
  };

  const handleFinalAction = async (
    action: "approved" | "rejected" | "revised",
  ) => {
    if (action !== "approved" && !note) {
      alert("Mohon isi catatan untuk revisi atau penolakan.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          userRole: currentUser.role,
          action,
          note,
          itemUpdates: localItems.map((it, idx) => ({
            index: idx,
            status: it.status,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Current Stage Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Tahap Saat Ini
            </p>
            <h4 className="text-lg font-black text-blue-900">
              {task.currentStage.toUpperCase()}
            </h4>
          </div>
          <Info className="text-blue-400" size={24} />
        </div>

        {/* Verification Items */}
        {task.currentStage === "pemeriksaan" && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileEdit size={16} className="text-primary" /> Verifikasi Item
              Perubahan
            </label>
            <div className="grid gap-2">
              {localItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-xl bg-slate-50 group hover:border-primary/30 transition-all"
                >
                  <span className="text-xs font-medium text-slate-600">
                    {item.taxpayerName || `Item ${idx + 1}`}
                  </span>
                  <div className="flex gap-1.5 bg-white p-1 rounded-lg border shadow-sm">
                    <button
                      onClick={() => handleItemStatusChange(idx, "approved")}
                      className={`p-1.5 rounded-md transition-all ${item.status === "approved" ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-100"}`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => handleItemStatusChange(idx, "rejected")}
                      className={`p-1.5 rounded-md transition-all ${item.status === "rejected" ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-100"}`}
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note Area */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Catatan / Alasan
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan tindak lanjut di sini..."
            className="w-full min-h-[120px] p-4 text-sm border rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
            disabled={isTerminal || !canApprove}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50 border-t flex flex-wrap gap-3">
        {!isTerminal && canApprove ? (
          <>
            <button
              disabled={loading}
              onClick={() => handleFinalAction("approved")}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-600/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
              Setujui
            </button>
            <button
              disabled={loading}
              onClick={() => handleFinalAction("revised")}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <FileEdit size={20} /> Revisi
            </button>
            <button
              disabled={loading}
              onClick={() => handleFinalAction("rejected")}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition-all"
            >
              <XCircle size={20} /> Tolak
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-all"
          >
            {isTerminal ? "Berkas Selesai / Terkunci" : "Tutup Panel"}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
    MAIN COMPONENT
========================= */

export default function ManageTask() {
  const { data: session } = authClient.useSession();
  console.log("Current Session:", session?.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeQuery, setServiceTypeQuery] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterDesa, setFilterDesa] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [pagination, setPagination] = useState({
    totalData: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams({
        search: searchQuery,
        serviceType: serviceTypeQuery,
        status: filterStatus,
        currentStage: filterStage,
        taxObjectSubdistrict: filterKecamatan,
        taxObjectVillage: filterDesa,
        startDate: startDate,
        endDate: endDate,
      });
      window.open(`/api/export?${params.toString()}`, "_blank");
    } catch (err) {
      console.error("Export Error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        serviceType: serviceTypeQuery,
        status: filterStatus,
        currentStage: filterStage,
        taxObjectSubdistrict: filterKecamatan,
        taxObjectVillage: filterDesa,
        sort: sortOrder,
        startDate: startDate,
        endDate: endDate,
        page: pagination.currentPage.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/task?${params.toString()}`);
      const result = await res.json();

      if (result.success) {
        setTasks(result.data || []);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    serviceTypeQuery,
    filterStatus,
    filterStage,
    filterKecamatan,
    filterDesa,
    sortOrder,
    startDate,
    endDate,
    pagination.currentPage,
  ]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchTasks]);

  const resetFilters = () => {
    setFilterStatus("");
    setFilterStage("");
    setFilterKecamatan("");
    setFilterDesa("");
    setSortOrder("newest");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setServiceTypeQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getBadgeClass = (color: string) => {
    const colors: Record<string, string> = {
      red: "bg-red-100 text-red-700 border-red-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      green: "bg-green-100 text-green-700 border-green-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return `text-[10px] px-2 py-0.5 rounded-full border font-semibold ${colors[color] || colors.blue}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full overflow-hidden min-h-screen bg-background">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Data Berkas
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistem Pemantauan dan Pengarsipan Tugas (SIPETRA)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            disabled={isExporting || tasks.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Excel
          </button>
          <Link
            href="/create-task"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Baru
          </Link>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="w-4 h-4 text-primary" /> Filter Data
          </div>
          {(filterStatus ||
            filterStage ||
            filterKecamatan ||
            filterDesa ||
            searchQuery ||
            serviceTypeQuery ||
            startDate ||
            endDate) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-red-500 hover:underline font-medium"
            >
              <X className="w-3 h-3" /> Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari Nama / NOP / Nopel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background"
            />
          </div>

          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <select
              value={serviceTypeQuery}
              onChange={(e) => setServiceTypeQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background appearance-none"
            >
              <option value="">Semua Jenis Layanan</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <select
            value={filterKecamatan}
            onChange={(e) => {
              setFilterKecamatan(e.target.value);
              setFilterDesa("");
            }}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background"
          >
            <option value="">Semua Kecamatan</option>
            {Object.keys(KECAMATAN_DATA).map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>

          <select
            value={filterDesa}
            onChange={(e) => setFilterDesa(e.target.value)}
            disabled={!filterKecamatan}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background disabled:opacity-50"
          >
            <option value="">Semua Desa/Kelurahan</option>
            {filterKecamatan &&
              KECAMATAN_DATA[filterKecamatan].map((desa) => (
                <option key={desa} value={desa}>
                  {desa}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-dashed">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background"
          >
            <option value="">Semua Status</option>
            <option value="proses">PROSES</option>
            <option value="selesai">SELESAI</option>
            <option value="revisi">REVISI</option>
            <option value="ditolak">DITOLAK</option>
          </select>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-xs border rounded-lg outline-none bg-background"
              />
            </div>
            <span className="text-muted-foreground text-xs font-bold"> - </span>
            <div className="relative flex-1">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-xs border rounded-lg outline-none bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/50 text-muted-foreground border-b text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Judul & Nopel</th>
                <th className="px-6 py-4">Wajib Pajak (Pemohon)</th>
                <th className="px-6 py-4">Rincian Perubahan</th>
                <th className="px-6 py-4">Tahapan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground animate-pulse">
                      Memuat data...
                    </p>
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {index + 1 + (pagination.currentPage - 1) * 10}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-xs uppercase truncate max-w-[150px]">
                          {task.serviceType || "Tanpa Jenis Layanan"}
                        </span>
                        <span className="text-[10px] text-primary font-semibold">
                          {task.nopel}
                        </span>
                        <span className="text-[10px] text-muted-foreground tracking-tighter">
                          {task.nop}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {capitalize(task.baseData?.taxpayerName)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {task.baseData?.taxObjectSubdistrict},{" "}
                          {task.baseData?.taxObjectVillage}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 relative">
                      {task.requestedChanges?.length > 1 ? (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              setOpenDetailId(
                                openDetailId === task._id ? null : task._id,
                              )
                            }
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-fit text-xs font-semibold"
                          >
                            <Users className="w-3.5 h-3.5" />{" "}
                            {task.requestedChanges.length} Data
                            <ChevronDown
                              className={`w-3 h-3 transition-transform ${openDetailId === task._id ? "rotate-180" : ""}`}
                            />
                          </button>
                          {openDetailId === task._id && (
                            <div className="absolute z-[100] mt-2 left-0 w-72 bg-white border border-slate-200 shadow-2xl p-4 rounded-xl">
                              <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45"></div>
                              <p className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                Rincian Perubahan
                              </p>
                              <div className="space-y-3 max-h-60 overflow-y-auto text-xs">
                                {task.requestedChanges.map((change, i) => (
                                  <div
                                    key={i}
                                    className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg"
                                  >
                                    <div className="font-bold text-slate-900 mb-0.5">
                                      {capitalize(change.taxpayerName)}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        L: {change.landArea}m²
                                      </span>
                                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        B: {change.buildingArea}m²
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : task.requestedChanges?.length === 1 ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">
                            {capitalize(task.requestedChanges[0].taxpayerName)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            L: {task.requestedChanges[0].landArea} / B:{" "}
                            {task.requestedChanges[0].buildingArea}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Tidak ada rincian
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-secondary-foreground text-[11px] font-medium border border-border">
                        {task.currentStage?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={getBadgeClass(task.uiHelpers?.badgeColor)}
                      >
                        {task.uiHelpers?.displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/update-task/${task._id}`}
                          className={`p-2 rounded-lg transition-colors ${task.uiHelpers?.canAction ? "text-blue-600 hover:bg-blue-50" : "text-muted-foreground/40 cursor-not-allowed"}`}
                          title="Edit Berkas"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          disabled={!task.uiHelpers?.canAction}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsApprovalOpen(true);
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-muted-foreground/20" />
                      <p className="text-muted-foreground text-sm">
                        Data tidak ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground font-medium">
            Menampilkan{" "}
            <span className="text-foreground font-bold">{tasks.length}</span>{" "}
            dari{" "}
            <span className="text-foreground font-bold">
              {pagination.totalData}
            </span>{" "}
            data
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              className="px-3 py-1 text-xs border rounded bg-background hover:bg-muted disabled:opacity-50 transition-all font-medium"
            >
              Sebelumnya
            </button>
            <div className="flex items-center px-4 text-xs font-bold text-primary">
              {pagination.currentPage} / {pagination.totalPages}
            </div>
            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              className="px-3 py-1 text-xs border rounded bg-background hover:bg-muted disabled:opacity-50 transition-all font-medium"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      <Dialog open={isApprovalOpen} onOpenChange={setIsApprovalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border shadow-2xl flex flex-col rounded-2xl border-none">
          <DialogHeader className="px-6 py-4 bg-slate-50 border-b">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">
              Proses Persetujuan
            </DialogTitle>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              ID Berkas: {selectedTask?.nopel}
            </p>
          </DialogHeader>

          {selectedTask && (
            <ApprovalModalContent
              task={selectedTask}
              currentUser={session?.user}
              onClose={() => setIsApprovalOpen(false)}
              onSuccess={() => {
                setIsApprovalOpen(false);
                fetchTasks(); // Refresh data tanpa reload halaman penuh
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
