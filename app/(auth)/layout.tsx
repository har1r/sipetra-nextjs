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
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-background py-6 px-6">
        <div className="container mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {year}{" "}
            <span className="font-semibold text-foreground">SIPETRA</span>{" "}
            Muhammad Mufti Harir Sihab.
          </p>
        </div>
      </footer>
    </div>
  );
}
