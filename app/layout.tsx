import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SIPETRA",
  description: "Sistem Informasi Pelayanan Efektif, Terpantau, dan Rapi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Toaster position="top-right"/>
        {children}
      </body>
    </html>
  );
}
