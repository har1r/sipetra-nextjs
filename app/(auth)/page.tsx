"use client";

import InfoTabs from "@/components/info-tabs";
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <Header />

      {/* HERO */}
      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Administrasi Perpajakan
              <span className="block text-[#00684A]">
                Lebih Mudah dan Terstruktur
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
              Kelola layanan perpajakan secara efisien, terpantau, dan rapi
              dengan sistem digital terintegrasi.
            </p>

            <Link href="/sign-up">
              <button className="btn-mongo flex items-center gap-2 mx-auto">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="pb-20 px-6">
        <div className="container mx-auto">
          <div className="section-mongo p-2">
            <InfoTabs />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border bg-muted py-20 px-6">
        <div className="container mx-auto">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-foreground">
              Kenapa SIPETRA?
            </h2>
            <p className="text-muted-foreground mt-2">
              Tiga pilar utama dalam transformasi digital.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Pelayanan Efektif" },
              { icon: LayoutDashboard, title: "Terpantau Akurat" },
              { icon: ShieldCheck, title: "Manajemen Rapi" },
            ].map((feature, i) => (
              <div key={i} className="card-mongo p-6 hover:bg-muted transition">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Sistem modern untuk meningkatkan efisiensi dan transparansi
                  melalui digitalisasi layanan.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
