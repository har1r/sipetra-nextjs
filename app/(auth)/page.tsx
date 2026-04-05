"use client";

import InfoTabs from "@/components/info-tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">

            <h1 className="mb-8 text-5xl font-black tracking-tight text-foreground md:text-7xl lg:leading-[1.1]">
              Administrasi Perpajakan{" "}
              {/* Menggunakan utility text-fauget */}
              <span className="text-fauget md:inline block">
                Jauh Lebih Mudah.
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-muted-foreground md:text-xl leading-relaxed">
              Kelola layanan perpajakan secara{" "}
              <span className="text-foreground font-bold underline decoration-primary/30 decoration-4 underline-offset-8">
                Efektif, Terpantau, dan Rapi
              </span>{" "}
              dengan platform SIPETRA.
            </p>

            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-fauget hover-fauget h-14 rounded-2xl px-10 text-base font-bold text-white shadow-xl shadow-[#2FB8A9]/20 transition-all hover:-translate-y-1 active:scale-95 border-0"
              >
                Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          {/* Shadow disesuaikan ke warna primer agar lebih menyatu */}
          <div className="rounded-4xl border border-border bg-card p-2 shadow-2xl shadow-primary/5 overflow-hidden">
            <InfoTabs />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative border-t border-border bg-muted/30 py-24 md:py-32 px-6">
        <div className="container mx-auto">

          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Kenapa SIPETRA?
            </h2>
            <p className="text-muted-foreground font-medium mt-2">
              Tiga pilar utama dalam transformasi digital kami.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              { icon: Zap, title: "Pelayanan Efektif" },
              { icon: LayoutDashboard, title: "Terpantau Akurat" },
              { icon: ShieldCheck, title: "Manajemen Rapi" }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-4xl border border-border bg-card p-10 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20"
              >
                {/* Icon Box: Berubah menjadi gradien saat hover */}
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-fauget group-hover:text-white group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-[#2FB8A9]/30">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-4 text-xl font-black text-foreground tracking-tight">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground font-medium text-sm">
                  Sistem modern yang membantu efisiensi kerja dan transparansi data melalui digitalisasi dokumen.
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
    </main>
  );
}