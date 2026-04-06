"use client";

import Link from "next/link";
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
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-14 items-center px-6 justify-between">
        {/* ===== BRAND ===== */}
        <div className="flex items-center gap-2">
          {/* TEXT */}
          <span className="text-base font-semibold tracking-tight text-foreground">
            SIPETR
          </span>

          {/* ICON */}
          <div className="relative h-5 w-5">
            <div className="absolute left-0 top-[-3px] h-full w-px bg-primary/80 rotate-12 origin-top" />
            <div className="absolute left-[1.5px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
            <div className="absolute left-[3px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
            <div className="absolute right-[13px] top-1.5 h-full w-px bg-primary/80 rotate-12 origin-top" />
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {/* Dashboard */}
              <Link href="/dashboard" className="hidden sm:block">
                <button className="text-sm text-muted-foreground hover:text-foreground transition">
                  Dashboard
                </button>
              </Link>

              {/* Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card hover:bg-muted transition">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-medium text-foreground bg-muted">
                        {session.user.name?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                {/* Dropdown */}
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 border border-border bg-card rounded-md p-1"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <div className="h-px bg-border my-1" />

                  <div className="px-1 py-1">
                    <SignOutButton />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login */}
              <Link href="/sign-in">
                <button className="text-sm text-muted-foreground hover:text-foreground transition">
                  Masuk
                </button>
              </Link>

              {/* Register */}
              <Link href="/sign-up">
                <button className="btn-mongo text-sm px-4 py-2">Daftar</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

{
  /* <span className="text-2xl font-black tracking-tight">SIPETR</span>
            <div className="relative w-6 h-6">
              <div className="absolute left-0 top-[-3px] w-0.5 h-full bg-primary rotate-12 origin-top"></div>
              <div className="absolute left-1 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
              <div className="absolute left-2 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
              <div className="absolute right-2 top-2 w-0.5 h-full bg-primary rotate-12 origin-top"></div>
</div> */
}
