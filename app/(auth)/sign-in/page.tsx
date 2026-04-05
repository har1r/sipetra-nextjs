"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";

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
        password: password,
      });

      if (result?.error) {
        setError(result.error.message ?? "Email atau password salah.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[420px] border border-border bg-card shadow-2xl shadow-black/5 rounded-4xl overflow-hidden p-10 md:p-14">
        <form onSubmit={handleSubmit}>
          {/* 🔥 HEADER */}
          <div className="mb-12 text-center">
            {/* LOGO CUSTOM */}
            <div className="flex items-center gap-[7px]">
              <span className="text-2xl font-black tracking-tight text-foreground">
                SIPETR
              </span>
              <div className="relative w-6 h-6">
                <div className="absolute left-0 top-[-3px] w-0.5 h-full bg-primary rotate-12 origin-top"></div>
                <div className="absolute left-1 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
                <div className="absolute left-2 top-2 w-0.5 h-3 bg-primary rotate-12 origin-top"></div>
                <div className="absolute right-2 top-2 w-0.5 h-full bg-primary rotate-12 origin-top"></div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm font-medium mt-3">
              Masuk ke akun anda yang sudah terdaftar.
            </p>
          </div>

          {/* 🔥 INPUT */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em] ml-1">
                Email Instansi
              </Label>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

                <Input
                  type="email"
                  placeholder="nama@pajak.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl pl-11 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary/20 h-12 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em] ml-1">
                Password
              </Label>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl pl-11 bg-muted border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 bg-red-50 text-red-500 text-[11px] font-bold p-4 rounded-2xl border border-red-100 text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* 🔥 BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-white font-bold rounded-2xl shadow-xl mt-10 transition-all active:scale-95 flex items-center justify-center gap-3 text-base"
            style={{
              background: "linear-gradient(135deg, #2FB8A9, #1F9D94)",
            }}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {/* FOOTER */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-[13px] text-muted-foreground font-medium">
              Belum punya akses?
              <Link
                href="/sign-up"
                className="text-primary font-bold ml-2 underline underline-offset-4"
              >
                Daftar Akun
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
