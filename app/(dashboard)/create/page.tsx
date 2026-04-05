"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  MapPin,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

// --- Types ---
type TaskFormData = {
  serviceType: string;
  nopel: string;
  nop: string;
  baseData: {
    taxpayerName: string;
    taxpayerAddress: string;
    taxpayerVillage: string;
    taxpayerSubdistrict: string;
    taxObjectAddress: string;
    taxObjectVillage: string;
    taxObjectSubdistrict: string;
    landArea: number;
    buildingArea: number;
  };
  requestedData: {
    taxObjectAddress: string;
    taxObjectVillage: string;
    taxObjectSubdistrict: string;
  };
  currentStage: string;
  requestedChanges: {
    taxpayerName: string;
    taxpayerAddress: string;
    taxpayerVillage: string;
    taxpayerSubdistrict: string;
    landArea: number;
    buildingArea: number;
    certificate: string;
    status: "in_progress" | "approved" | "revised" | "rejected";
    note?: string;
  }[];
  attachments: {
    driveLink: string;
    linkName: string;
  }[];
};

export default function TaskForm() {
  const [activeTab, setActiveTab] = useState("info");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      serviceType: "pengaktifan",
      currentStage: "penginputan",
      requestedData: {
        taxObjectAddress: "",
        taxObjectVillage: "",
        taxObjectSubdistrict: "",
      },
      requestedChanges: [],
      attachments: [{ driveLink: "", linkName: "" }],
    },
  });

  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
    control,
    name: "requestedChanges",
  });

  const { fields: attachFields, append: appendAttach, remove: removeAttach } = useFieldArray({
    control,
    name: "attachments",
  });

  const onSubmit = (data: TaskFormData) => {
    console.log("Data SIPETRA:", data);
    alert("Form berhasil divalidasi!");
  };

  // Helper styling - Kontras ditingkatkan pada text-slate-700 & border-slate-300
  const labelStyle = "block text-[13px] font-bold text-slate-700 mb-1.5 ml-1";
  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen font-sans selection:bg-primary/30 text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Form Pengajuan Pelayanan
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Lengkapi semua informasi dengan benar untuk mempercepat proses pelayanan wajib pajak Anda.
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION - Kontras ditingkatkan pada active state */}
      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar border border-slate-200 shadow-inner">
        {[
          { id: "info", label: "Informasi Utama", icon: FileText },
          { id: "base", label: "Data SPPT Lama", icon: User },
          { id: "changes", label: "Data SPPT Baru", icon: AlertCircle },
          { id: "docs", label: "Lampiran Berkas", icon: LinkIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center min-w-[140px] px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200
              ${activeTab === tab.id 
                ? "bg-white text-primary shadow-md ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`}
          >
            <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? "text-primary" : "text-slate-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* SECTION 1: INFORMASI UTAMA */}
        {activeTab === "info" && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center mb-8">
               <div className="p-2.5 bg-primary/10 rounded-xl mr-3">
                  <FileText className="w-5 h-5 text-primary" />
               </div>
               <h3 className="text-lg font-black text-slate-900">Informasi Utama</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Jenis Layanan</label>
                  <select {...register("serviceType")} className={inputStyle}>
                    <option value="pengaktifan">Pengaktifan</option>
                    <option value="mutasi habis update">Mutasi Habis Update</option>
                    <option value="mutasi sebagian">Mutasi Sebagian</option>
                    <option value="pembetulan">Pembetulan</option>
                    <option value="objek pajak baru">Objek Pajak Baru</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Nomor Pelayanan (NOPEL)</label>
                  <input type="text" placeholder="Masukkan NOPEL" {...register("nopel", { required: true })} className={inputStyle} />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Nomor Objek Pajak (18 Digit)</label>
                <input type="text" placeholder="Contoh: 32.73..." {...register("nop", { required: true })} className={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DATA BASE (Lama) */}
        {activeTab === "base" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-black mb-6 text-slate-900 flex items-center">
                <User className="w-5 h-5 mr-3 text-primary" /> Wajib Pajak Lama
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>Nama WP (Sesuai SPPT)</label>
                  <input {...register("baseData.taxpayerName")} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Alamat Domisili</label>
                  <input {...register("baseData.taxpayerAddress")} className={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Desa/Kelurahan</label>
                    <input {...register("baseData.taxpayerVillage")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Kecamatan</label>
                    <input {...register("baseData.taxpayerSubdistrict")} className={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-black mb-6 text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" /> Objek Pajak Lama
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Luas Tanah (m²)</label>
                    <input type="number" {...register("baseData.landArea")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Luas Bangunan (m²)</label>
                    <input type="number" {...register("baseData.buildingArea")} className={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Alamat Letak Objek Pajak</label>
                  <input {...register("baseData.taxObjectAddress")} className={inputStyle} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Desa/Kelurahan</label>
                    <input {...register("baseData.taxObjectVillage")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Kecamatan</label>
                    <input {...register("baseData.taxObjectSubdistrict")} className={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: REQUESTED DATA & CHANGES (Baru) */}
        {activeTab === "changes" && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 border-l-4 border-l-primary">
              <h3 className="text-lg font-black mb-6 text-slate-900">Lokasi Objek Pajak Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className={labelStyle}>Alamat Letak Objek</label>
                  <input {...register("requestedData.taxObjectAddress")} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Desa/Kelurahan</label>
                  <input {...register("requestedData.taxObjectVillage")} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Kecamatan</label>
                  <input {...register("requestedData.taxObjectSubdistrict")} className={inputStyle} />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Rincian Perubahan</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Sesuai data sertifikat atau bukti kepemilikan terbaru</p>
                </div>
                <button
                  type="button"
                  onClick={() => appendReq({ 
                    taxpayerName: "", taxpayerAddress: "", taxpayerVillage: "", taxpayerSubdistrict: "", 
                    landArea: 0, buildingArea: 0, certificate: "", status: "in_progress" 
                  })}
                  className="flex items-center text-xs font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Item
                </button>
              </div>

              <div className="space-y-6">
                {reqFields.map((field, index) => (
                  <div key={field.id} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 relative group transition-all hover:border-primary/40 hover:bg-white">
                    <button 
                      type="button" 
                      onClick={() => removeReq(index)} 
                      className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Nama WP Baru</label>
                        <input {...register(`requestedChanges.${index}.taxpayerName`)} className={inputStyle} />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>No. Sertifikat</label>
                        <input {...register(`requestedChanges.${index}.certificate`)} className={inputStyle} />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Alamat Domisili Baru</label>
                        <input {...register(`requestedChanges.${index}.taxpayerAddress`)} className={inputStyle} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:col-span-2">
                        <div>
                           <label className={labelStyle}>Desa</label>
                           <input {...register(`requestedChanges.${index}.taxpayerVillage`)} className={inputStyle} />
                        </div>
                        <div>
                           <label className={labelStyle}>Kecamatan</label>
                           <input {...register(`requestedChanges.${index}.taxpayerSubdistrict`)} className={inputStyle} />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Luas Tanah (m²)</label>
                        <input type="number" {...register(`requestedChanges.${index}.landArea`)} className={inputStyle} />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Luas Bangunan (m²)</label>
                        <input type="number" {...register(`requestedChanges.${index}.buildingArea`)} className={inputStyle} />
                      </div>
                    </div>
                  </div>
                ))}
                {reqFields.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-slate-300 rounded-3xl text-center bg-slate-50">
                    <p className="text-slate-500 text-sm font-bold tracking-tight">Belum ada rincian perubahan yang ditambahkan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: ATTACHMENTS (Link Drive) */}
        {activeTab === "docs" && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black mb-8 text-slate-900 flex items-center">
              <LinkIcon className="w-5 h-5 mr-3 text-primary" /> Cloud Storage (Drive Link)
            </h3>
            <div className="space-y-4">
              {attachFields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-hover hover:border-primary/30">
                  <div className="flex-1 w-full">
                    <label className={labelStyle}>Keterangan Berkas</label>
                    <input placeholder="Contoh: Scan KTP" {...register(`attachments.${index}.linkName`)} className={inputStyle} />
                  </div>
                  <div className="flex-[2] w-full">
                    <label className={labelStyle}>URL Google Drive</label>
                    <input placeholder="https://drive.google.com/..." {...register(`attachments.${index}.driveLink`)} className={inputStyle} />
                  </div>
                  <button type="button" onClick={() => removeAttach(index)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors mb-0.5">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => appendAttach({ driveLink: "", linkName: "" })} 
                className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 font-black text-[13px] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Tambah Tautan Berkas Baru
              </button>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-200">
          <button 
            type="button" 
            className="px-8 py-3.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-black text-sm transition-all active:scale-95"
          >
            Simpan Draft
          </button>
          <button 
            type="submit" 
            className="px-12 py-3.5 rounded-2xl bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/30 font-black text-sm flex items-center justify-center transition-all active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" /> Ajukan Pelayanan
          </button>
        </div>
      </form>
    </div>
  );
}