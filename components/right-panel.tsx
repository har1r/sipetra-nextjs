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
import ChatUI from "@/components/chat-box";

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

      <ChatUI />
    </aside>
  );
}
