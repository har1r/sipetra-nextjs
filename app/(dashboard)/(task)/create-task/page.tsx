"use client";

export const dynamic = "force-dynamic";

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

  const {
    fields: reqFields,
    append: appendReq,
    remove: removeReq,
  } = useFieldArray({
    control,
    name: "requestedChanges",
  });

  const {
    fields: attachFields,
    append: appendAttach,
    remove: removeAttach,
  } = useFieldArray({
    control,
    name: "attachments",
  });

  const onSubmit = (data: TaskFormData) => {
    console.log("Data SIPETRA:", data);
    alert("Form berhasil divalidasi!");
  };

  // Helper styling menggunakan utility dari global.css
  const labelStyle =
    "block text-xs font-semibold text-muted-foreground mb-1.5 ml-1 capitalize tracking-wider";
  const inputStyle =
    "input-mongo w-full focus:ring-2 focus:ring-ring transition-all";

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-background">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          Form Pengajuan Pelayanan
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Lengkapi semua informasi dengan benar untuk mempercepat proses
          pelayanan wajib pajak Anda.
        </p>
      </div>

      {/* TABS NAVIGATION - Mengikuti style sidebar-item/active dari Home */}
      <div className="flex space-x-2 bg-muted p-2 rounded-xl mb-8 overflow-x-auto no-scrollbar border border-border">
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
            className={`sidebar-item min-w-[160px] justify-center py-2.5 transition-all
              ${activeTab === tab.id ? "active bg-card shadow-sm border border-border" : ""}`}
          >
            <tab.icon
              className={`w-4 h-4 mr-2 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}
            />
            <span
              className={
                activeTab === tab.id
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* SECTION 1: INFORMASI UTAMA */}
        {activeTab === "info" && (
          <div className="section-mongo">
            <div className="flex items-center mb-8 border-b border-border pb-4">
              <div className="p-2 bg-primary/10 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Informasi Utama
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Jenis Layanan</label>
                  <select {...register("serviceType")} className={inputStyle}>
                    <option value="pengaktifan">Pengaktifan</option>
                    <option value="mutasi habis update">
                      Mutasi Habis Update
                    </option>
                    <option value="mutasi sebagian">Mutasi Sebagian</option>
                    <option value="pembetulan">Pembetulan</option>
                    <option value="objek pajak baru">Objek Pajak Baru</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Nomor Pelayanan (NOPEL)</label>
                  <input
                    type="text"
                    {...register("nopel", { required: true })}
                    className={inputStyle}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>
                  Nomor Objek Pajak (18 Digit)
                </label>
                <input
                  type="text"
                  {...register("nop", { required: true })}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DATA BASE (Lama) */}
        {activeTab === "base" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="section-mongo">
              <h3 className="text-lg font-semibold mb-6 flex items-center border-b border-border pb-4">
                <User className="w-5 h-5 mr-3 text-primary" /> Wajib Pajak Lama
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>Nama WP (Sesuai SPPT)</label>
                  <input
                    {...register("baseData.taxpayerName")}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Alamat Domisili</label>
                  <input
                    {...register("baseData.taxpayerAddress")}
                    className={inputStyle}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Desa/Kelurahan</label>
                    <input
                      {...register("baseData.taxpayerVillage")}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Kecamatan</label>
                    <input
                      {...register("baseData.taxpayerSubdistrict")}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="section-mongo">
              <h3 className="text-lg font-semibold mb-6 flex items-center border-b border-border pb-4">
                <MapPin className="w-5 h-5 mr-3 text-primary" /> Objek Pajak
                Lama
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Luas Tanah (m²)</label>
                    <input
                      type="number"
                      {...register("baseData.landArea")}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Luas Bangunan (m²)</label>
                    <input
                      type="number"
                      {...register("baseData.buildingArea")}
                      className={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Alamat Letak Objek Pajak</label>
                  <input
                    {...register("baseData.taxObjectAddress")}
                    className={inputStyle}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Desa/Kelurahan</label>
                    <input
                      {...register("baseData.taxObjectVillage")}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Kecamatan</label>
                    <input
                      {...register("baseData.taxObjectSubdistrict")}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: REQUESTED DATA & CHANGES (Baru) */}
        {activeTab === "changes" && (
          <div className="space-y-8">
            <div className="section-mongo !border-l-4 !border-l-primary">
              <h3 className="text-lg font-semibold mb-6 text-foreground">
                Lokasi Objek Pajak Baru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className={labelStyle}>Alamat Letak Objek</label>
                  <input
                    {...register("requestedData.taxObjectAddress")}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Desa/Kelurahan</label>
                  <input
                    {...register("requestedData.taxObjectVillage")}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Kecamatan</label>
                  <input
                    {...register("requestedData.taxObjectSubdistrict")}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="section-mongo">
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Rincian Perubahan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sesuai data sertifikat atau bukti kepemilikan terbaru
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    appendReq({
                      taxpayerName: "",
                      taxpayerAddress: "",
                      taxpayerVillage: "",
                      taxpayerSubdistrict: "",
                      landArea: 0,
                      buildingArea: 0,
                      certificate: "",
                      status: "in_progress",
                    })
                  }
                  className="btn-mongo flex items-center text-xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Item
                </button>
              </div>

              <div className="space-y-6">
                {reqFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="card-mongo p-6 relative group hover-mongo transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => removeReq(index)}
                      className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Nama WP Baru</label>
                        <input
                          {...register(
                            `requestedChanges.${index}.taxpayerName`,
                          )}
                          className={inputStyle}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>No. Sertifikat</label>
                        <input
                          {...register(`requestedChanges.${index}.certificate`)}
                          className={inputStyle}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>
                          Alamat Domisili Baru
                        </label>
                        <input
                          {...register(
                            `requestedChanges.${index}.taxpayerAddress`,
                          )}
                          className={inputStyle}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:col-span-2">
                        <div>
                          <label className={labelStyle}>Desa</label>
                          <input
                            {...register(
                              `requestedChanges.${index}.taxpayerVillage`,
                            )}
                            className={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelStyle}>Kecamatan</label>
                          <input
                            {...register(
                              `requestedChanges.${index}.taxpayerSubdistrict`,
                            )}
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Luas Tanah (m²)</label>
                        <input
                          type="number"
                          {...register(`requestedChanges.${index}.landArea`)}
                          className={inputStyle}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelStyle}>Luas Bangunan (m²)</label>
                        <input
                          type="number"
                          {...register(
                            `requestedChanges.${index}.buildingArea`,
                          )}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {reqFields.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-border rounded-xl text-center bg-muted/30">
                    <p className="text-muted-foreground text-sm font-medium">
                      Belum ada rincian perubahan yang ditambahkan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: ATTACHMENTS (Link Drive) */}
        {activeTab === "docs" && (
          <div className="section-mongo">
            <h3 className="text-lg font-semibold mb-8 flex items-center border-b border-border pb-4">
              <LinkIcon className="w-5 h-5 mr-3 text-primary" /> Cloud Storage
              (Drive Link)
            </h3>
            <div className="space-y-4">
              {attachFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row gap-4 items-end bg-muted/20 p-5 rounded-xl border border-border"
                >
                  <div className="flex-1 w-full">
                    <label className={labelStyle}>Keterangan Berkas</label>
                    <input
                      placeholder="Contoh: Scan KTP"
                      {...register(`attachments.${index}.linkName`)}
                      className={inputStyle}
                    />
                  </div>
                  <div className="flex-[2] w-full">
                    <label className={labelStyle}>URL Google Drive</label>
                    <input
                      placeholder="https://drive.google.com/..."
                      {...register(`attachments.${index}.driveLink`)}
                      className={inputStyle}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttach(index)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendAttach({ driveLink: "", linkName: "" })}
                className="w-full py-6 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Tambah Tautan Berkas Baru
              </button>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-border">
          <button type="button" className="btn-mongo-secondary px-8">
            Simpan Draft
          </button>
          <button
            type="submit"
            className="btn-mongo px-12 flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4 mr-2" /> Ajukan Pelayanan
          </button>
        </div>
      </form>
    </div>
  );
}
