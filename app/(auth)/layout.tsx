"use client";

import { useEffect, useState } from "react";

export default function AuthMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [year, setYear] = useState<number | string>("2026");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      
      {/* Soft Gradient Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Menggunakan opacity rendah dari warna tema */}
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-[#2FB8A9]/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-[#1F9D94]/5 blur-[120px]" />
      </div>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-background py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-xs font-medium text-muted-foreground">
            &copy; {year}{" "}
            <span className="text-fauget font-bold tracking-tight">
              SIPETRA
            </span>{" "}
            Sistem Informasi Perpajakan Terintegrasi.
          </p>
        </div>
      </footer>
    </div>
  );
}