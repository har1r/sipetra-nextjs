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
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center px-6 justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <div className="flex items-center gap-[7px]">
            <span className="text-2xl font-black tracking-tight">SIPETR</span>
            <div className="relative w-6 h-6">
              <div className="absolute left-0 top-[-3px] w-0.5 h-full bg-primary rotate-12 origin-top"></div>
              <div className="absolute left-1 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
              <div className="absolute left-2 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
              <div className="absolute right-2 top-2 w-0.5 h-full bg-primary rotate-12 origin-top"></div>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {session?.user ? (
            <>
              {/* Dashboard Button */}
              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-sm font-extrabold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl px-5 transition-all"
                >
                  Dashboard
                </Button>
              </Link>

              {/* Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-11 w-11 rounded-2xl border border-border bg-card p-0 hover:bg-muted transition-all shadow-sm"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className="text-white text-xs font-black"
                        style={{
                          background:
                            "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                        }}
                      >
                        {session.user.name?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                {/* Dropdown */}
                <DropdownMenuContent
                  className="w-64 rounded-3xl border border-border bg-card p-3 shadow-2xl shadow-black/5"
                  align="end"
                  sideOffset={12}
                >
                  <DropdownMenuLabel className="font-normal px-3 py-3">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-black leading-none text-foreground">
                        {session.user.name}
                      </p>
                      <p className="text-[12px] leading-none text-muted-foreground font-bold">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <div className="h-px bg-border my-2 mx-1" />

                  <div className="p-1">
                    <SignOutButton />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login */}
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-sm font-extrabold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl px-6 transition-all"
                >
                  Masuk
                </Button>
              </Link>

              {/* Register */}
              <Link href="/sign-up">
                <Button
                  className="rounded-2xl px-8 h-11 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 border-0"
                  style={{
                    background: "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                  }}
                >
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
