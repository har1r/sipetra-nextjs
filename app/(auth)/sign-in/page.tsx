"use client";

import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";

// ZOD SCHEMA
const signInSchema = z.object({
  email: z
    .email({ message: "Format email tidak valid" })
    .min(1, { message: "Email wajib diisi" }),

  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, { message: "Password minimal 6 karakter" }),
});

export default function SignIn() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setError("");

    // ZOD VALIDATION
    const result = signInSchema.safeParse(form);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError || "Input tidak valid");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signIn.email({
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes("invalid")) {
          setError("Email atau password salah");
        } else {
          setError("Gagal login, coba lagi");
        }
        return;
      }

      router.replace("/dashboard");
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
          <div className="mb-8 flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-foreground uppercase">
              Sipetra
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Masuk ke akun yang sudah terdaftar
          </p>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 text-xs text-red-500 border border-red-200 bg-red-50/50 p-2 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-mongo w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>
                  Masuk <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Belum punya akun?
            <Link href="/sign-up" className="text-primary ml-1">
              Daftar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}