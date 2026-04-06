"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await signOut();
      toast.success("Berhasil keluar");
      router.replace("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Gagal keluar. Silakan coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      aria-disabled={isPending}
      onClick={handleSignOut}
      className="text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center justify-between"
    >
      <span>Keluar</span>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </DropdownMenuItem>
  );
}
