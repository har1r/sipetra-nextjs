"use client";

import { Card } from "@/components/ui/card";
import { signUp } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  userName: z.string().min(3, "Username minimal 3 karakter"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "operator", "viewer"]),
});

type SignUpForm = z.infer<typeof signUpSchema>;

const AVAILABLE_STAGES = [
  { id: "penginputan", label: "Penginputan" },
  { id: "penelitian", label: "Penelitian" },
  { id: "pengarsipan", label: "Pengarsipan" },
  { id: "pengiriman", label: "Pengiriman" },
  { id: "pemeriksaan", label: "Pemeriksaan" },
];

type SignUpPayload = SignUpForm & {
  stages: string[];
};

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpForm, string>>
  >({});

  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    userName: "",
    email: "",
    password: "",
    role: "viewer",
  });

  const handleChange = (name: keyof SignUpForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStageToggle = (stageId: string) => {
    setSelectedStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

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
      const payload: SignUpPayload = {
        ...result.data,
        email: result.data.email.toLowerCase().trim(),
        stages: form.role === "operator" ? selectedStages : [],
      };

      const { error: resError } = await signUp.email(payload);

      if (resError) {
        setError(resError.message ?? "Gagal mendaftarkan akun.");
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-4xl border border-border bg-card overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          
          {/* LEFT PANEL */}
          <div className="flex-1 p-8 md:p-10 space-y-6">
            <div className="mb-8 flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-foreground uppercase">
              Sipetra
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Isi formulir di bawah untuk membuat akun baru.
          </p>

            <div className="space-y-4">
              
              {/* NAME & USERNAME */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-mongo"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input
                    value={form.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    className="input-mongo"
                  />
                  {fieldErrors.userName && (
                    <p className="text-xs text-red-500">
                      {fieldErrors.userName}
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <Label>Email</Label>
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
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="input-mongo"
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.password}
                  </p>
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
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">
                    Otoritas Akses
                  </span>
                </div>

                <Select
                  onValueChange={(val) =>
                    handleChange("role", val as SignUpForm["role"])
                  }
                  defaultValue={form.role}
                >
                  <SelectTrigger className="input-mongo bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border shadow-md">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* STAGES */}
              <div>
                <Label className="text-xs uppercase font-semibold">
                  Tahapan Kerja
                </Label>

                {form.role === "operator" ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_STAGES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleStageToggle(s.id)}
                        className={`px-3 py-1 text-[10px] rounded border ${
                          selectedStages.includes(s.id)
                            ? "bg-primary text-white border-primary"
                            : "bg-card border-border"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground mt-2">
                    Akses otomatis sesuai role
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-6 space-y-3">
              {error && (
                <div className="text-xs text-red-500 text-center" role="alert">
                  {error}
                </div>
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