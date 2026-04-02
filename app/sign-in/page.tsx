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
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-4 font-sans">
      <Card className="w-full max-w-[420px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[32px] bg-white/90 backdrop-blur-md overflow-hidden p-10 md:p-14">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex justify-center items-center gap-2">
              SIPETRA
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-3">
              Masuk ke akun anda yang sudah terdaftar.
            </p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">
                Email Instansi
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="email"
                  placeholder="nama@pajak.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl pl-11 bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 h-13 transition-all border-none shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl pl-11 bg-slate-50 border-slate-100 h-13 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all border-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 bg-red-50 text-red-500 text-[11px] font-bold p-4 rounded-2xl border border-red-100 text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl mt-10 transition-all active:scale-95 group flex items-center justify-center gap-3 text-base"
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

          {/* Footer Link */}
          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[13px] text-slate-400 font-medium">
              Belum punya akses?
              <Link
                href="/sign-up"
                className="text-indigo-600 font-bold hover:text-indigo-700 ml-2 underline decoration-indigo-100 underline-offset-8 transition-all hover:decoration-indigo-500"
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
