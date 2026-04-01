import ImageTabs from "@/components/image-tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
<section className="relative overflow-hidden px-4 pt-24 pb-20 md:pt-32 md:pb-28">
  <div className="container mx-auto">
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:leading-[1.1]">
        Administrasi Perpajakan{" "}
        <span className="text-primary block md:inline">Jauh Lebih Mudah.</span>
      </h1>
      <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
        Kelola layanan perpajakan secara <strong>Efektif, Terpantau, dan Rapi</strong> dengan <span className="text-foreground font-semibold">SIPETRA</span>. Satu platform untuk efisiensi birokrasi digital.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/sign-up">
          <Button size="lg" className="h-14 rounded-full px-10 text-lg font-semibold shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
            Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Hero Images Section */}
      <section className="pb-24">
        <ImageTabs />
      </section>

      {/* Features Section */}
      <section className="relative border-t bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Pelayanan Efektif */}
            <div className="group relative rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                <Zap className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">Pelayanan Efektif</h3>
              <p className="leading-relaxed text-muted-foreground">
                Optimalkan alur kerja pengarsipan dengan sistem yang responsif 
                dan dirancang untuk meminimalkan hambatan birokrasi digital.
              </p>
            </div>

            {/* Terpantau Real-time */}
            <div className="group relative rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                <LayoutDashboard className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">Terpantau Akurat</h3>
              <p className="leading-relaxed text-muted-foreground">
                Pantau setiap tahapan aplikasi dan dokumen secara real-time melalui 
                visualisasi Kanban yang transparan dan mudah dipahami.
              </p>
            </div>

            {/* Administrasi Rapi */}
            <div className="group relative rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">Manajemen Rapi</h3>
              <p className="leading-relaxed text-muted-foreground">
                Simpan semua informasi dalam satu basis data yang terstruktur, 
                memastikan tidak ada data yang tercecer atau sulit ditemukan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}