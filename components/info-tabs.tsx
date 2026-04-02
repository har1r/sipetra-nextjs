"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, GitFork } from "lucide-react";

export default function InfoTabs() {
  const [activeTab, setActiveTab] = useState("OPB");

  const tabs = [
    { id: "OPB", label: "Objek Pajak Baru" },
    { id: "MS", label: "Mutasi Sebagian" },
    { id: "MH", label: "Mutasi Habis" },
    { id: "PB", label: "Pembetulan" },
  ];

  return (
    <section className="bg-transparent py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Minimalist Tabs Navigation */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 bg-slate-100/50 p-1.5 rounded-2xl w-fit mx-auto border border-slate-100">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-6 py-2 text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/40 min-h-[450px]">
            <div className="p-8 md:p-12 h-full flex flex-col">
              {/* Content: Objek Pajak Baru */}
              {activeTab === "OPB" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        Pendaftaran Objek Pajak Baru (OPB)
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-medium text-base mt-1">
                        Persyaratan administrasi untuk pendataan PBB pertama
                        kali.
                      </CardDescription>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {[
                      "Mengisi Formulir SPOP & LSPOP (jelas & lengkap).",
                      "Fotokopi KTP/Paspor Wajib Pajak.",
                      "Fotokopi Bukti Kepemilikan Tanah (Sertifikat/Girik/AJB).",
                      "Fotokopi IMB (jika ada bangunan).",
                      "Surat Kuasa (bermeterai jika dikuasakan).",
                      "Fotokopi SPPT PBB Tetangga Terdekat (opsional).",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-colors"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content: Mutasi Sebagian */}
              {activeTab === "MS" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                      <GitFork className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        Mutasi Sebagian
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-medium text-base mt-1">
                        Pecah SPPT akibat pemecahan sertifikat atau penjualan
                        sebagian.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {[
                      "Formulir SPOP & LSPOP ditandatangani.",
                      "Asli SPPT PBB Tahun Berjalan.",
                      "Fotokopi KTP Wajib Pajak Baru dan Lama.",
                      "Fotokopi Bukti Kepemilikan (Sertifikat/AJB).",
                      "Surat Keterangan Pemecahan (Desa/Kelurahan/BPN).",
                      "Sketsa/Denah lokasi pemecahan yang jelas.",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-colors"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content: Mutasi Habis */}
              {activeTab === "MH" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        Mutasi Habis / Balik Nama
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-medium text-base mt-1">
                        Perubahan penuh kepemilikan Objek Pajak.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {[
                      "Formulir SPOP lengkap.",
                      "Asli SPPT PBB Tahun Berjalan.",
                      "Fotokopi KTP Wajib Pajak Baru.",
                      "Fotokopi Bukti Peralihan Hak (AJB/Hibah/Waris).",
                      "Fotokopi Sertifikat Tanah balik nama (jika ada).",
                      "Bukti Lunas PBB (STTS) Tahun Terakhir.",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-colors"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content: Pembetulan */}
              {activeTab === "PB" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        Pembetulan SPPT
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-medium text-base mt-1">
                        Koreksi kesalahan data Nama, Alamat, Luas, atau NJOP.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {[
                      "Surat Permohonan Pembetulan (bermeterai).",
                      "Asli SPPT/SKP PBB yang akan dibetulkan.",
                      "Fotokopi Bukti Pendukung (KTP/Sertifikat/IMB).",
                      "Fotokopi STTS (Bukti Lunas) PBB tahun berjalan.",
                      "Surat Keterangan Kades/Lurah (jika perlu).",
                      "Dokumen pendukung lainnya yang valid.",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-colors"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
