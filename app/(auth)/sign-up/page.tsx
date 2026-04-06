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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserCircle2, Briefcase } from "lucide-react";

const AVAILABLE_STAGES = [
  { id: "penginputan", label: "Penginputan" },
  { id: "penelitian", label: "Penelitian" },
  { id: "pengarsipan", label: "Pengarsipan" },
  { id: "pengiriman", label: "Pengiriman" },
  { id: "pemeriksaan", label: "Pemeriksaan" },
];

export default function SignUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleStageChange = (stageId: string) => {
    setSelectedStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId],
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        email: email.toLowerCase().trim(),
        password,
        name: name.trim(),
        userName: userName.trim(),
        role,
        stages: role === "operator" ? selectedStages : [],
      } as any);

      if (result?.error) {
        setError(result.error.message ?? "Gagal mendaftarkan akun.");
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
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-4xl border border-border bg-card">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* ===== LEFT (FORM) ===== */}
          <div className="flex-1 p-8 md:p-10">
            {/* LOGO */}
            <div className="mb-8 flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-foreground">
                SIPETR
              </span>

              {/* ICON */}
              <div className="relative h-5 w-5">
                <div className="absolute left-0 top-[-3px] h-full w-px bg-primary/80 rotate-12 origin-top" />
                <div className="absolute left-[1px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
                <div className="absolute left-[3px] top-1.5 h-2.5 w-px bg-primary/60 rotate-12 origin-top" />
                <div className="absolute right-[13px] top-1.5 h-full w-px bg-primary/80 rotate-12 origin-top" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Daftarkan kredensial akses Anda
            </p>

            {/* INPUTS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nama</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-mongo mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Username
                  </Label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="input-mongo mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-mongo mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-mongo mt-1"
                />
              </div>
            </div>

            {/* LOGIN LINK */}
            <div className="mt-6 text-sm text-muted-foreground">
              Sudah punya akun?
              <Link href="/sign-in" className="text-primary ml-1">
                Masuk
              </Link>
            </div>
          </div>

          {/* ===== RIGHT (ROLE PANEL) ===== */}
          <div className="w-full md:w-[300px] border-t md:border-t-0 md:border-l border-border p-8 flex flex-col justify-between bg-muted">
            <div className="space-y-6">
              {/* ROLE */}
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Role</span>
                </div>

                <Select onValueChange={setRole} defaultValue={role}>
                  <SelectTrigger className="input-mongo">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>

                  <SelectContent className="border border-border bg-card">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* STAGES */}
              {role === "operator" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Tahapan
                  </Label>

                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_STAGES.map((stage) => (
                      <label
                        key={stage.id}
                        className={`px-3 py-1 text-xs border rounded-md cursor-pointer ${
                          selectedStages.includes(stage.id)
                            ? "bg-primary text-black"
                            : "bg-card text-muted-foreground"
                        }`}
                      >
                        <Checkbox
                          checked={selectedStages.includes(stage.id)}
                          onCheckedChange={() => handleStageChange(stage.id)}
                          className="hidden"
                        />
                        {stage.label}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 border border-dashed border-border rounded-md text-xs text-muted-foreground">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {role === "admin" ? "Akses penuh" : "Akses terbatas"}
                </div>
              )}
            </div>

            {/* BUTTON */}
            <div className="mt-8 space-y-3">
              {error && (
                <div className="text-xs text-red-500 border border-red-200 p-2 rounded-md text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-mongo w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                ) : (
                  <>
                    Buat Akun
                    <ArrowRight className="h-4 w-4" />
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
