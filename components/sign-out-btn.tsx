"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function SignOutButton() {
  return (
    <DropdownMenuItem
      onClick={async () => {
        const result = await signOut();
        if (result.data) {
          // 🔥 Hard redirect supaya back button tidak menampilkan dashboard
          window.location.replace("/sign-in");
        } else {
          alert("Error signing out");
        }
      }}
    >
      Log Out
    </DropdownMenuItem>
  );
}
