import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIPETRA",
  description: "Sistem Informasi Pelayanan Efektif, Terpantau, dan Rapi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans antialiased 
          bg-[#fdfdfd] 
          text-slate-900 
          selection:bg-slate-900 
          selection:text-white
        `}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Header minimalis hitam-putih */}
          <Header />

          {/* Main content area */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
