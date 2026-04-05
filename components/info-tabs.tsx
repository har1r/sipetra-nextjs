"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
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

          {/* 🔥 TAB NAVIGATION (lebih soft & clean) */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 bg-muted/50 p-1.5 rounded-2xl w-fit mx-auto border border-border backdrop-blur-sm">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-6 py-2 text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-card/50"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* 🔥 CONTENT CONTAINER */}
          <div className="relative overflow-hidden rounded-4xl border border-border bg-card shadow-2xl shadow-black/5 min-h-[450px]">
            <div className="p-8 md:p-12 h-full flex flex-col">

              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  
                  {/* 🔥 ICON (gradient, bukan emerald lagi) */}
                  <div
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                    }}
                  >
                    {activeTab === "OPB" && <FileText className="h-8 w-8" />}
                    {activeTab === "MS" && <GitFork className="h-8 w-8" />}
                    {activeTab === "MH" && <Users className="h-8 w-8" />}
                    {activeTab === "PB" && <AlertTriangle className="h-8 w-8" />}
                  </div>

                  <div>
                    <CardTitle className="text-2xl font-black text-foreground tracking-tight">
                      {activeTab === "OPB" && "Pendaftaran Objek Pajak Baru (OPB)"}
                      {activeTab === "MS" && "Mutasi Sebagian"}
                      {activeTab === "MH" && "Mutasi Habis / Balik Nama"}
                      {activeTab === "PB" && "Pembetulan SPPT"}
                    </CardTitle>

                    <CardDescription className="text-muted-foreground font-medium text-base mt-1">
                      {activeTab === "OPB" && "Persyaratan administrasi untuk pendataan PBB pertama kali."}
                      {activeTab === "MS" && "Pecah SPPT akibat pemecahan sertifikat atau penjualan sebagian."}
                      {activeTab === "MH" && "Perubahan penuh kepemilikan Objek Pajak."}
                      {activeTab === "PB" && "Koreksi kesalahan data Nama, Alamat, Luas, atau NJOP."}
                    </CardDescription>
                  </div>
                </div>

                {/* 🔥 LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {getContentItems(activeTab).map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-border hover:bg-card hover:shadow-md transition-all duration-300"
                    >
                      
                      {/* NUMBER BADGE */}
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                        }}
                      >
                        {index + 1}
                      </span>

                      <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// helper tetap sama
function getContentItems(tab: string) {
  const data: Record<string, string[]> = {
    OPB: [
      "Mengisi Formulir SPOP & LSPOP (jelas & lengkap).",
      "Fotokopi KTP/Paspor Wajib Pajak.",
      "Fotokopi Bukti Kepemilikan Tanah (Sertifikat/Girik/AJB).",
      "Fotokopi IMB (jika ada bangunan).",
      "Surat Kuasa (bermeterai jika dikuasakan).",
      "Fotokopi SPPT PBB Tetangga Terdekat (opsional).",
    ],
    MS: [
      "Formulir SPOP & LSPOP ditandatangani.",
      "Asli SPPT PBB Tahun Berjalan.",
      "Fotokopi KTP Wajib Pajak Baru dan Lama.",
      "Fotokopi Bukti Kepemilikan (Sertifikat/AJB).",
      "Surat Keterangan Pemecahan (Desa/Kelurahan/BPN).",
      "Sketsa/Denah lokasi pemecahan yang jelas.",
    ],
    MH: [
      "Formulir SPOP lengkap.",
      "Asli SPPT PBB Tahun Berjalan.",
      "Fotokopi KTP Wajib Pajak Baru.",
      "Fotokopi Bukti Peralihan Hak (AJB/Hibah/Waris).",
      "Fotokopi Sertifikat Tanah balik nama (jika ada).",
      "Bukti Lunas PBB (STTS) Tahun Terakhir.",
    ],
    PB: [
      "Surat Permohonan Pembetulan (bermeterai).",
      "Asli SPPT/SKP PBB yang akan dibetulkan.",
      "Fotokopi Bukti Pendukung (KTP/Sertifikat/IMB).",
      "Fotokopi STTS (Bukti Lunas) PBB tahun berjalan.",
      "Surat Keterangan Kades/Lurah (jika perlu).",
      "Dokumen pendukung lainnya yang valid.",
    ],
  };
  return data[tab] || [];
}