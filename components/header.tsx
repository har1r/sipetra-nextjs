"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className="relative top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-6 justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            SIPETRA
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-slate-200 p-0 hover:bg-slate-50 transition-all"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-900 text-white text-xs font-black">
                        {session.user.name?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-2xl border-slate-100 p-2 shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-slate-900">
                        {session.user.name}
                      </p>
                      <p className="text-[11px] leading-none text-slate-400 font-medium">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <div className="h-px bg-slate-50 my-2" />
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-5"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 text-sm font-bold shadow-sm transition-all active:scale-95">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
