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
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-4 font-sans">
      <Card className="w-full max-w-[800px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[28px] bg-white/90 backdrop-blur-md overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          {/* Sisi Kiri: Form Identitas */}
          <div className="flex-1 p-10 md:p-12">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                SIPETRA
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">
                Daftarkan kredensial akses Anda
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                    Nama
                  </Label>
                  <div className="relative group">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      placeholder="Nama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl pl-9 bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 h-11 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                    Username
                  </Label>
                  <Input
                    placeholder="199xxx"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 h-11 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="admin@pajak.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl bg-slate-50 border-slate-100 h-11 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl bg-slate-50 border-slate-100 h-11 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <p className="text-[12px] text-slate-400 font-medium">
                Sudah terdaftar?
                <Link
                  href="/sign-in"
                  className="text-indigo-600 font-bold hover:text-indigo-700 ml-1.5 underline decoration-indigo-200 underline-offset-4"
                >
                  Masuk Sistem
                </Link>
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Hak Akses & Action */}
          <div className="w-full md:w-[320px] bg-slate-50/70 p-10 flex flex-col justify-between border-l border-slate-100">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Akses Kontrol
                  </span>
                </div>

                <div className="space-y-2">
                  <Select onValueChange={setRole} defaultValue={role}>
                    <SelectTrigger className="bg-white border-slate-200 rounded-xl h-11 shadow-sm focus:ring-indigo-500/10 transition-all">
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="min-h-[140px]">
                {role === "operator" ? (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <Label className="text-slate-400 text-[9px] font-bold uppercase tracking-widest ml-1">
                      Cakupan Tahapan
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_STAGES.map((stage) => (
                        <label
                          key={stage.id}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            selectedStages.includes(stage.id)
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                          }`}
                        >
                          <Checkbox
                            id={stage.id}
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
                  <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center group">
                    <Briefcase className="w-5 h-5 text-slate-300 mb-2 group-hover:text-indigo-400 transition-colors" />
                    {role === "admin" ? (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Akses Penuh ke Semua Tahapan
                      </p>
                    ) : (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Akses Terbatas, Tidak Memiliki Tahapan
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 mt-10">
              {error && (
                <div className="bg-red-50 text-red-500 text-[10px] font-bold p-2.5 rounded-lg border border-red-100 text-center animate-in fade-in slide-in-from-bottom-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 group flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <>
                    <span>Buat Akun</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
