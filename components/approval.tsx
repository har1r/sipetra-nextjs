"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileEdit,
  Loader2,
  X,
  Info,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  currentUser: { _id: string; role: string };
  onSuccess: () => void;
}

const STAGE_ORDER = [
  "penginputan",
  "penelitian",
  "pemeriksaan",
  "pengarsipan",
  "pengiriman",
];

export default function ApprovalModal({
  isOpen,
  onClose,
  task,
  currentUser,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [localItems, setLocalItems] = useState(task?.requestedChanges || []);

  // Sinkronisasi data saat task berubah
  useEffect(() => {
    if (task?.requestedChanges) {
      setLocalItems(task.requestedChanges);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  /** * PERBAIKAN LOGIKA IZIN (canApprove):
   * Sebelumnya operator hanya dikunci di stage 'penginputan'.
   * Sekarang operator diberikan akses lebih luas agar textarea & tombol bisa muncul.
   */
  const canApprove =
    currentUser.role === "admin" || currentUser.role === "operator";

  const isTerminal =
    ["approved", "rejected"].includes(task.overallStatus) || task.isLocked;

  console.log(isTerminal);

  // AUTO-SAVE ITEM LOGIC
  const handleItemStatusChange = async (index: number, newStatus: string) => {
    if (isTerminal || !canApprove) return;

    const updated = [...localItems];
    updated[index].status = newStatus;
    setLocalItems(updated);

    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          userRole: currentUser.role,
          isPartialUpdate: true,
          itemUpdates: [{ index, status: newStatus }],
        }),
      });
    } catch (err) {
      console.error("Gagal menyimpan perubahan item secara otomatis");
    }
  };

  // FINAL SUBMIT LOGIC
  const handleFinalAction = async (
    action: "approved" | "rejected" | "revised",
  ) => {
    if (action !== "approved" && !note) {
      alert("Catatan wajib diisi untuk Revisi atau Penolakan.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          userRole: currentUser.role,
          action,
          note,
          itemUpdates: localItems.map((it: any, idx: number) => ({
            index: idx,
            status: it.status,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Z-Index dinaikkan ke 60 untuk memastikan berada di atas elemen lain */
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Update Approval
            </h2>
            <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">
              Stage: {task.currentStage}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status Alert if Locked */}
          {isTerminal && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
              <Info size={20} className="shrink-0" />
              <p>
                Berkas ini sudah <strong>Final ({task.overallStatus})</strong>.
                Perubahan data sudah tidak diizinkan.
              </p>
            </div>
          )}

          {/* Checklist Item (Only for Pemeriksaan Stage) */}
          {task.currentStage === "pemeriksaan" && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileEdit size={16} className="text-blue-600" /> Verifikasi Item
              </label>
              <div className="space-y-2">
                {localItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 group transition-all hover:border-blue-200"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {item.fieldName || `Item #${idx + 1}`}
                    </span>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border shadow-sm">
                      <button
                        type="button"
                        disabled={isTerminal || !canApprove}
                        onClick={() => handleItemStatusChange(idx, "approved")}
                        className={`p-1.5 rounded-md transition-all ${
                          item.status === "approved"
                            ? "bg-green-600 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={isTerminal || !canApprove}
                        onClick={() => handleItemStatusChange(idx, "rejected")}
                        className={`p-1.5 rounded-md transition-all ${
                          item.status === "rejected"
                            ? "bg-red-600 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                        }`}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Catatan Konfirmasi
            </label>
            <textarea
              className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              placeholder={
                canApprove
                  ? "Berikan alasan persetujuan, revisi, atau penolakan..."
                  : "Anda tidak memiliki izin akses"
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isTerminal || !canApprove}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
          {!isTerminal && canApprove ? (
            <>
              <button
                onClick={() => handleFinalAction("approved")}
                disabled={loading}
                className="flex-1 min-w-[120px] h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Approve
              </button>

              <button
                onClick={() => handleFinalAction("revised")}
                disabled={loading}
                className="flex-1 min-w-[120px] h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <FileEdit size={18} /> Revisi
              </button>

              <button
                onClick={() => handleFinalAction("rejected")}
                disabled={loading}
                className="flex-1 min-w-[120px] h-11 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <XCircle size={18} /> Tolak
              </button>
            </>
          ) : (
            <div className="w-full space-y-3">
              {!canApprove && !isTerminal && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-semibold">
                  <AlertCircle size={14} />
                  Role {currentUser.role} tidak diizinkan memproses data ini.
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full h-11 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-all"
              >
                Tutup Panel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
