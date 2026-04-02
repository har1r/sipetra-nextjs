"use client";

import InfoTabs from "@/components/info-tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 bg-[#fdfdfd]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 text-5xl font-[900] tracking-tight text-slate-900 md:text-7xl lg:leading-[1.1]">
              Administrasi Perpajakan{" "}
              <span className="block text-slate-400 md:inline">
                Jauh Lebih Mudah.
              </span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-slate-500 md:text-xl leading-relaxed">
              Kelola layanan perpajakan secara{" "}
              <span className="text-slate-900 font-bold underline decoration-slate-200 underline-offset-8">
                Efektif, Terpantau, dan Rapi
              </span>{" "}
              dengan platform SIPETRA. Solusi modern untuk efisiensi birokrasi
              digital.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl px-10 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Images/Tabs Section */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <div className="rounded-[32px] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-100/50">
            <InfoTabs />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-slate-100 bg-slate-50/50 py-24 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Kenapa SIPETRA?
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Tiga pilar utama dalam transformasi digital kami.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Pelayanan Efektif */}
            <div className="group relative rounded-[32px] border border-slate-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-black text-slate-900 tracking-tight">
                Pelayanan Efektif
              </h3>
              <p className="leading-relaxed text-slate-500 font-medium text-sm">
                Optimalkan alur kerja pengarsipan dengan sistem responsif yang
                dirancang untuk meminimalkan hambatan birokrasi.
              </p>
            </div>

            {/* Terpantau Real-time */}
            <div className="group relative rounded-[32px] border border-slate-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-black text-slate-900 tracking-tight">
                Terpantau Akurat
              </h3>
              <p className="leading-relaxed text-slate-500 font-medium text-sm">
                Pantau setiap tahapan dokumen secara real-time melalui
                visualisasi yang transparan dan mudah dipahami.
              </p>
            </div>

            {/* Administrasi Rapi */}
            <div className="group relative rounded-[32px] border border-slate-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-black text-slate-900 tracking-tight">
                Manajemen Rapi
              </h3>
              <p className="leading-relaxed text-slate-500 font-medium text-sm">
                Simpan semua informasi dalam basis data terstruktur, memastikan
                tidak ada data yang tercecer atau sulit ditemukan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
