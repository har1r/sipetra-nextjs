"use client";

import React, { useEffect, useState } from "react";
import {
  Edit3,
  Trash2,
  Search,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";

/* =========================
   HELPER & TYPES
========================= */

const capitalize = (str: string) => {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

type Task = {
  _id: string;
  serviceType: string;
  nopel: string;
  nop: string;
  baseData: {
    taxpayerName: string;
    taxpayerAddress: string;
    taxpayerVillage: string;
    taxpayerSubdistrict: string;
    taxObjectAddress: string;
    taxObjectVillage: string;
    taxObjectSubdistrict: string;
    landArea: number;
    buildingArea: number;
  };
  requestedData: {
    taxObjectAddress: string;
    taxObjectVillage: string;
    taxObjectSubdistrict: string;
  };
  requestedChanges: any[];
  currentStage: string;
  overallStatus: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ManageTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/task");
        const result = await res.json();
        setTasks(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Manajemen Data
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola data pelayanan dengan rapi dan terstruktur
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create-task"
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Ajukan
          </Link>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari..."
              className="pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-background"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-max text-sm">
            {/* HEADER */}
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  No
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Nopel / Nop
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Wajib Pajak
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Lokasi
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Luas
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Tahapan
                </th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className="border-t hover:bg-muted/20 transition-colors"
                  >
                    {/* NO */}
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {index + 1}
                    </td>

                    {/* NOPEL */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {capitalize(task.nopel)}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {task.nop}
                        </span>
                      </div>
                    </td>

                    {/* WAJIB PAJAK */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {capitalize(task.baseData?.taxpayerName)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {capitalize(task.requestedChanges?.[0]?.taxpayerName)}
                        </span>
                      </div>
                    </td>

                    {/* LOKASI */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {capitalize(task.baseData?.taxObjectSubdistrict)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {capitalize(task.baseData?.taxObjectVillage)}
                        </span>
                      </div>
                    </td>

                    {/* LUAS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {task.baseData?.landArea} /{" "}
                          {task.baseData?.buildingArea}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {task.requestedChanges?.[0]?.landArea} /{" "}
                          {task.requestedChanges?.[0]?.buildingArea}
                        </span>
                      </div>
                    </td>

                    {/* STAGE */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs px-2 py-1 rounded bg-muted text-foreground">
                        {capitalize(task.currentStage)}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {capitalize(task.overallStatus)}
                      </span>
                    </td>

                    {/* AKSI */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center items-center gap-1">
                        <Link
                          href={`/dashboard/tasks/update/${task._id}`}
                          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition">
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>Total {tasks.length} data</span>
          <span>Halaman 1</span>
        </div>
      </div>
    </div>
  );
}
