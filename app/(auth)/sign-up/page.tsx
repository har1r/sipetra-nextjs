"use client";

import { Button } from "@/components/ui/button";
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
        password: password,
        name: name.trim(),
        userName: userName.trim(),
        role: role,
        stages: role === "operator" ? selectedStages : [],
      } as any);

      if (result?.error) {
        setError(result.error.message ?? "Gagal mendaftarkan akun.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[800px] border border-border bg-card shadow-2xl shadow-black/5 rounded-4xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* LEFT */}
          <div className="flex-1 p-10 md:p-12">
            {/* 🔥 LOGO CUSTOM */}
            <div className="mb-8">
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

              <p className="text-muted-foreground text-sm font-medium mt-2">
                Daftarkan kredensial akses Anda
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest ml-1">
                    Nama
                  </Label>
                  <div className="relative group">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Nama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl pl-9 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary/20 h-11 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest ml-1">
                    Username
                  </Label>
                  <Input
                    placeholder="199xxx"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="rounded-xl bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary/20 h-11 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest ml-1">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="admin@pajak.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl bg-muted border-border h-11 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest ml-1">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl bg-muted border-border h-11 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-[12px] text-muted-foreground font-medium">
                Sudah terdaftar?
                <Link
                  href="/sign-in"
                  className="text-primary font-bold ml-1.5 underline underline-offset-4"
                >
                  Masuk Sistem
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-[320px] bg-muted/40 p-10 flex flex-col justify-between border-l border-border">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Akses Kontrol
                  </span>
                </div>

                <Select onValueChange={setRole} defaultValue={role}>
                  <SelectTrigger className="bg-card border-border rounded-xl h-11 shadow-sm focus:ring-primary/20">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    sideOffset={8}
                    className="z-50 rounded-xl border border-border bg-card shadow-xl"
                  >
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[140px]">
                {role === "operator" ? (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <Label className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest ml-1">
                      Cakupan Tahapan
                    </Label>

                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_STAGES.map((stage) => (
                        <label
                          key={stage.id}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            selectedStages.includes(stage.id)
                              ? "text-white shadow-md"
                              : "bg-card border-border text-muted-foreground hover:border-primary/40"
                          }`}
                          style={
                            selectedStages.includes(stage.id)
                              ? {
                                  background:
                                    "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                                }
                              : {}
                          }
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
                  <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-4 text-center">
                    <Briefcase className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {role === "admin"
                        ? "Akses Penuh ke Semua Tahapan"
                        : "Akses Terbatas"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <div className="space-y-4 mt-10">
              {error && (
                <div className="bg-red-50 text-red-500 text-[10px] font-bold p-2.5 rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #2FB8A9, #1F9D94)",
                }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <>
                    <span>Buat Akun</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
