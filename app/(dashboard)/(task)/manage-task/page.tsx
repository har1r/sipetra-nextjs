"use client";

import React from "react";
import {
  Edit3,
  Trash2,
  Search,
  Filter,
  ChevronRight,
  Database,
  User,
  MapPin,
  Layers,
  Loader2,
  Plus, // Tambahkan ikon Plus
} from "lucide-react";
import Link from "next/link";

// Re-use tipe data yang sama agar konsisten
type Task = {
  _id: string;
  serviceType: string;
  nopel: string;
  nop: string;
  baseData: {
    taxpayerName: string;
    taxObjectVillage: string;
    landArea: number;
  };
  currentStage: string;
  updatedAt: string;
};

interface ManageTasksProps {
  tasks: Task[];
}

export default function ManageTasksTable({ tasks = [] }: ManageTasksProps) {
  // 1. LOADING STATE GUARD
  if (!tasks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">
          Menghubungkan ke database...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-background min-h-screen">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center">
            <Database className="w-6 h-6 mr-3 text-primary/70" />
            Manajemen Data SIPETRA
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola, filter, dan perbarui seluruh antrean pelayanan pajak daerah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* TOMBOL AJUKAN PELAYANAN BARU */}
          <Link
            href="/create-task"
            className="btn-mongo py-2 px-4 flex items-center text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Ajukan Pelayanan
          </Link>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Cari NOPEL atau Nama..."
              className="input-mongo pl-10 w-full md:w-[250px] text-sm py-2"
            />
          </div>
          <button className="btn-mongo-secondary py-2 px-3 flex items-center text-sm font-medium border border-border rounded-lg hover:bg-muted transition-all">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="section-mongo !p-0 overflow-hidden border border-border shadow-md rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-2" /> Identitas & NOPEL
                  </span>
                </th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" /> Objek Pajak & NOP
                  </span>
                </th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center">
                    <Layers className="w-3 h-3 mr-2" /> Layanan & Tahapan
                  </span>
                </th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {/* 2. EMPTY STATE CHECK */}
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {task.baseData?.taxpayerName || "Tanpa Nama"}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground mt-0.5 bg-muted px-1.5 py-0.5 rounded w-fit">
                          {task.nopel}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground italic">
                          {task.baseData?.taxObjectVillage || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                          NOP: {task.nop}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 w-fit">
                          {task.serviceType}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 w-fit">
                          {task.currentStage}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/dashboard/tasks/update/${task._id}`}
                          className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all"
                          title="Edit Data"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all"
                          title="Lihat Detail"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Database className="w-12 h-12 mb-3" />
                      <p className="text-sm font-medium">
                        Data tidak ditemukan.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER TABEL / PAGINATION */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Menampilkan <b>{tasks.length}</b> data pelayanan
          </span>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary disabled:opacity-30" disabled>
              Previous
            </button>
            <span className="font-medium text-foreground">
              Halaman 1 dari 1
            </span>
            <button className="hover:text-primary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
