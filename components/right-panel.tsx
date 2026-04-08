"use client";

import { Bell, User as UserIcon, MessageSquare } from "lucide-react"; // Tambahkan MessageSquare
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "@/components/sign-out-btn";
import Link from "next/link"; // Import Link untuk navigasi rute

interface RightPanelProps {
  userName?: string;
  className?: string;
}

export default function RightPanel({ userName, className }: RightPanelProps) {
  return (
    <aside
      className={`flex flex-col gap-6 p-6 h-full overflow-y-auto no-scrollbar ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <button className="p-2.5 rounded-xl bg-muted hover:bg-accent/10 transition-all shrink-0">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 group">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground group-hover:text-[#00684A] transition-colors">
                  {userName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>

              <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-mongo-green shadow-lg text-white">
                <UserIcon size={20} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-2xl border border-border bg-card p-2 shadow-xl"
            align="end"
          >
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {userName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">Sesi Aktif</p>
              </div>
            </DropdownMenuLabel>

            <div className="h-px bg-border my-2" />
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SCHEDULE */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Schedule</h3>
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl p-4 text-white shadow-lg bg-mongo-green">
            <p className="text-xs opacity-80">2026</p>
            <p className="text-2xl font-black">20</p>
            <p className="text-xs">Meeting</p>
          </div>

          <div className="flex-1 rounded-2xl p-4 bg-muted text-center">
            <p className="text-xs text-muted-foreground">22</p>
            <p className="text-sm font-bold text-foreground">Review</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[450px] bg-card/50 border border-border rounded-[2rem] p-4 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
          <div className="h-2 w-2 rounded-full bg-mongo-green animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Operator Channel
          </h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-2 mb-2 custom-scrollbar flex flex-col justify-end">
          <div className="space-y-4 pb-2">
            {/* Pesan Masuk */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className="text-[10px] font-bold text-foreground">
                  Admin-B
                </span>
              </div>
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-muted/80 text-foreground border border-border/50 shadow-sm">
                <p className="text-[11px] leading-relaxed">
                  Halo! Berkas NOPEL **2026.001** sudah saya verifikasi. Aman
                  untuk dilanjutkan.
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground ml-1">
                09:41
              </span>
            </div>

            {/* Pesan Keluar */}
            <div className="flex flex-col items-end gap-1">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-none bg-mongo-green text-white shadow-lg shadow-mongo-green/20">
                <p className="text-[11px] leading-relaxed">
                  Siap, segera saya proses. Apakah lampiran sertifikatnya sudah
                  lengkap di Drive?
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground mr-1">
                09:45
              </span>
            </div>

            {/* Pesan Masuk */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className="text-[10px] font-bold text-foreground">
                  Admin-B
                </span>
              </div>
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-muted/80 text-foreground border border-border/50 shadow-sm">
                <p className="text-[11px] leading-relaxed">
                  Sudah lengkap. Cek folder "Lampiran_2026".
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground ml-1">
                09:46
              </span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 pt-1 border-t border-border/50">
          <div className="flex items-end gap-2 p-1.5 bg-background border border-muted rounded-2xl focus-within:border-mongo-green/50 focus-within:ring-2 focus-within:ring-mongo-green/5 transition-all duration-300">
            <textarea
              placeholder="Ketik pesan..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                const newHeight = Math.min(target.scrollHeight, 120);
                target.style.height = `${newHeight}px`;
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] px-2 py-2 placeholder:text-muted-foreground/60 resize-none min-h-[36px] max-h-[120px] leading-normal no-scrollbar"
            />

            <button
              type="button"
              className="h-9 w-9 rounded-xl bg-mongo-green text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-mongo-green/20 shrink-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-4 h-4 rotate-45 -translate-y-0.5 -translate-x-0.5"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
