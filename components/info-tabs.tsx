"use client";

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
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* ===== TAB NAV ===== */}
          <div className="flex flex-wrap gap-1 justify-center mb-8 bg-muted p-1 rounded-md border border-border w-fit mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded-md transition ${
                  activeTab === tab.id
                    ? "bg-card text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== CONTENT ===== */}
          <div className="card-mongo min-h-[420px]">
            <div className="p-6 md:p-8 flex flex-col gap-6">
              {/* HEADER */}
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {activeTab === "OPB" && <FileText className="h-5 w-5" />}
                  {activeTab === "MS" && <GitFork className="h-5 w-5" />}
                  {activeTab === "MH" && <Users className="h-5 w-5" />}
                  {activeTab === "PB" && <AlertTriangle className="h-5 w-5" />}
                </div>

                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {activeTab === "OPB" &&
                      "Pendaftaran Objek Pajak Baru (OPB)"}
                    {activeTab === "MS" && "Mutasi Sebagian"}
                    {activeTab === "MH" && "Mutasi Habis / Balik Nama"}
                    {activeTab === "PB" && "Pembetulan SPPT"}
                  </CardTitle>

                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {activeTab === "OPB" &&
                      "Persyaratan administrasi untuk pendataan PBB pertama kali."}
                    {activeTab === "MS" &&
                      "Pecah SPPT akibat pemecahan sertifikat atau penjualan sebagian."}
                    {activeTab === "MH" &&
                      "Perubahan penuh kepemilikan Objek Pajak."}
                    {activeTab === "PB" &&
                      "Koreksi kesalahan data Nama, Alamat, Luas, atau NJOP."}
                  </CardDescription>
                </div>
              </div>

              {/* LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getContentItems(activeTab).map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-md border border-transparent hover:border-border hover:bg-muted transition"
                  >
                    {/* NUMBER */}
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
                      {index + 1}
                    </span>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== DATA ===== */
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
