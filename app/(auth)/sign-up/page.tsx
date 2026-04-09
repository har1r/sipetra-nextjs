"use client";

import { Card } from "@/components/ui/card";
import { signUp } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";

// =======================
// VALIDATION
// =======================
const signUpSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

// =======================
// COMPONENT
// =======================
export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpForm, string>>
  >({});

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (name: keyof SignUpForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =======================
  // SUBMIT
  // =======================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setFieldErrors({});
    setLoading(true);

    // VALIDATION
    const result = signUpSchema.safeParse(form);

    if (!result.success) {
      const errors: Partial<Record<keyof SignUpForm, string>> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignUpForm;
        errors[field] = err.message;
      });

      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: result.data.name.trim(),
        email: result.data.email.toLowerCase().trim(),
        password: result.data.password,
      };

      console.log("Payload siap dikirim:", payload);

      const { error: resError } = await signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
      });

      if (resError) {
        setError(resError.message ?? "Gagal mendaftarkan akun.");
        return;
      }

      // SUCCESS
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // UI
  // =======================
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-4xl border border-border bg-card overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* LEFT */}
          <div className="flex-1 p-8 md:p-10 space-y-6">
            <div className="mb-8 flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight uppercase">
                Sipetra
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Buat akun baru untuk mulai menggunakan sistem.
            </p>

            <div className="space-y-4">
              {/* NAME + USERNAME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="my-1">Nama Lengkap</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-mongo"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <Label className="my-1">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="input-mongo"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label className="my-1">Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="input-mongo"
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Masuk
              </Link>
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border p-8 bg-muted/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">
                  Default Access
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Semua akun baru akan terdaftar sebagai <b>Viewer</b>.
                Administrator akan mengatur hak akses lanjutan melalui sistem.
              </p>
            </div>

            {/* SUBMIT */}
            <div className="pt-6 space-y-3">
              {error && (
                <div className="text-xs text-red-500 text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-mongo w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    Daftar <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
