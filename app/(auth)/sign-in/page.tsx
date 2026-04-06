"use client";

import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.toLowerCase().trim(),
        password,
      });

      if (result?.error) {
        setError(result.error.message ?? "Email atau password salah.");
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border border-border bg-card">
        <form onSubmit={handleSubmit} className="p-8 md:p-10">
          {/* ===== LOGO (SAMA DENGAN SIGN UP) ===== */}
          <div className="mb-8 flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-foreground">
              SIPETR
            </span>

            <div className="relative h-5 w-5">
              <div className="absolute left-0 top-[-3px] h-full w-px bg-primary/80 rotate-12 origin-top" />
              <div className="absolute left-[1px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
              <div className="absolute left-[3px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
              <div className="absolute right-[13px] top-1.5 h-full w-px bg-primary/80 rotate-12 origin-top" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Masuk ke akun yang sudah terdaftar
          </p>

          {/* ===== INPUTS (NO PLACEHOLDER) ===== */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-mongo mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-mongo mt-1"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 text-xs text-red-500 border border-red-200 p-2 rounded-md text-center">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <div className="mt-8 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-mongo w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-8 text-sm text-muted-foreground">
            Belum punya akun?
            <Link href="/sign-up" className="text-primary ml-1">
              Daftar
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
