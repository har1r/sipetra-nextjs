"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  MapPin,
  AlertCircle,
  Link as LinkIcon,
  Loader2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

// --- Data Wilayah ---
const KECAMATAN_DATA: Record<string, string[]> = {
  Pakuhaji: [
    "Kalibaru",
    "Surya Bahari",
    "Sukawali",
    "Kramat",
    "Kohod",
    "Gaga",
    "Kiara Payung",
    "Buaran Bambu",
    "Paku Alam",
    "Buaran Mangga",
    "Pakuhaji",
    "Bunisari",
    "Laksana",
    "Rawaboni",
  ],
  Kosambi: [
    "Salembaran Jaya",
    "Salembaran Jati",
    "Kosambi Barat",
    "Kosambi Timur",
    "Dadap",
    "Jatimulya",
    "Cengklong",
    "Blimbing",
    "Rawa Burung",
    "Rawa Rengas",
  ],
  Teluknaga: [
    "Bojong Renged",
    "Kebon Cau",
    "Teluknaga",
    "Babakan Asem",
    "Kamp Melayu T",
    "Kamp Melayu B",
    "Kampung Besar",
    "Lemo",
    "Tegal Angus",
    "Pangkalan",
    "Tanjung Burung",
    "Tanjung Pasir",
    "Muara",
  ],
  "Sepatan Timur": [
    "Kedaung Barat",
    "Lebak Wangi",
    "Tanah Merah",
    "Jati Mulya",
    "Gempolsari",
    "Sangiang",
    "Pondok Kelor",
    "Kampung Kelor",
  ],
  Sepatan: [
    "Mekarjaya",
    "Karet",
    "Pondok Jaya",
    "Sepatan",
    "Pisangan Jaya",
    "Sarakan",
    "Kayu Agung",
    "Kayu Bongkok",
  ],
};

const LIST_KECAMATAN = Object.keys(KECAMATAN_DATA);

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
    status: string;
    note?: string;
  }[];
  attachments: {
    driveLink: string;
    linkName: string;
  }[];
};

export default function EditTask() {
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading untuk fetch data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Menangkap ID dari URL [id]

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

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

  // --- 1. FETCH DATA LAMA ---
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/task/${id}`);
        const result = await response.json();

        if (response.ok && result.data) {
          // Masukkan data ke form
          reset(result.data);
        } else {
          alert("Gagal mengambil data: " + result.message);
          router.push("/manage-task");
        }
      } catch (error) {
        console.error("FETCH_ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, reset, router]);

  const allFields = watch();

  // --- 2. SUBMIT HANDLER (PATCH) ---
  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal memperbarui data");

      alert("Sukses! Berkas berhasil diperbarui.");
      router.push("/manage-task");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle =
    "block text-xs font-semibold text-muted-foreground mb-1.5 ml-1 capitalize tracking-wider";
  const inputStyle =
    "input-mongo w-full focus:ring-2 focus:ring-ring transition-all disabled:opacity-50";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Memuat data berkas...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-background">
      <datalist id="list-kecamatan">
        {LIST_KECAMATAN.map((k) => (
          <option key={k} value={k} />
        ))}
      </datalist>

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Edit Data Berkas
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            ID Berkas:{" "}
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {id}
            </span>
          </p>
        </div>
      </div>

      {/* TABS */}
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
        className="space-y-8 animate-in fade-in duration-500"
      >
        {/* SECTION 1: INFORMASI UTAMA */}
        {activeTab === "info" && (
          <div className="section-mongo">
            <div className="flex items-center mb-8 border-b border-border pb-4">
              <FileText className="w-5 h-5 text-primary mr-3" />
              <h3 className="text-lg font-semibold">Informasi Utama</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  {...register("nopel", { required: true })}
                  className={inputStyle}
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Nomor Objek Pajak (NOP)</label>
                <input
                  {...register("nop", { required: true })}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DATA BASE */}
        {activeTab === "base" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="section-mongo">
              <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-4">
                <User className="mr-3 text-primary w-5 h-5" /> WP Lama
              </h3>
              <div className="space-y-4">
                <input
                  {...register("baseData.taxpayerName")}
                  placeholder="Nama WP"
                  className={inputStyle}
                />
                <input
                  {...register("baseData.taxpayerAddress")}
                  placeholder="Alamat"
                  className={inputStyle}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    {...register("baseData.taxpayerSubdistrict")}
                    placeholder="Kecamatan"
                    className={inputStyle}
                  />
                  <input
                    {...register("baseData.taxpayerVillage")}
                    placeholder="Desa"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
            <div className="section-mongo">
              <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-4">
                <MapPin className="mr-3 text-primary w-5 h-5" /> Objek Lama
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    {...register("baseData.landArea")}
                    placeholder="Luas Tanah"
                    className={inputStyle}
                  />
                  <input
                    type="number"
                    {...register("baseData.buildingArea")}
                    placeholder="Luas Bangunan"
                    className={inputStyle}
                  />
                </div>
                <input
                  {...register("baseData.taxObjectAddress")}
                  placeholder="Alamat Letak Objek"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CHANGES */}
        {activeTab === "changes" && (
          <div className="space-y-8">
            <div className="section-mongo !border-l-4 !border-l-primary">
              <h3 className="text-lg font-semibold mb-6">
                Lokasi Objek Pajak Baru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  {...register("requestedData.taxObjectAddress")}
                  placeholder="Alamat"
                  className={inputStyle}
                />
                <input
                  {...register("requestedData.taxObjectSubdistrict")}
                  list="list-kecamatan"
                  placeholder="Kecamatan"
                  className={inputStyle}
                />
                <input
                  {...register("requestedData.taxObjectVillage")}
                  placeholder="Desa"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="section-mongo">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h3 className="text-lg font-semibold">
                  Rincian Perubahan (Sertifikat)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendReq({
                      taxpayerName: "",
                      taxpayerAddress: "",
                      taxpayerVillage: "", // Tambahkan ini
                      taxpayerSubdistrict: "", // Tambahkan ini
                      landArea: 0,
                      buildingArea: 0,
                      certificate: "",
                      status: "in_progress",
                      note: "", // Opsional
                    })
                  }
                  className="btn-mongo text-xs"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah Item
                </button>
              </div>
              <div className="space-y-6">
                {reqFields.map((field, index) => (
                  <div key={field.id} className="card-mongo p-6 relative group">
                    <button
                      type="button"
                      onClick={() => removeReq(index)}
                      className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <label className={labelStyle}>Alamat Domisili</label>
                        <input
                          {...register(
                            `requestedChanges.${index}.taxpayerAddress`,
                          )}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Luas Tanah</label>
                        <input
                          type="number"
                          {...register(`requestedChanges.${index}.landArea`)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Luas Bangunan</label>
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
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DOCS */}
        {activeTab === "docs" && (
          <div className="section-mongo">
            <h3 className="text-lg font-semibold mb-8 border-b pb-4">
              <LinkIcon className="inline mr-2 w-5 h-5" /> Google Drive Links
            </h3>
            <div className="space-y-4">
              {attachFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl border"
                >
                  <div className="flex-1">
                    <label className={labelStyle}>Nama Berkas</label>
                    <input
                      {...register(`attachments.${index}.linkName`)}
                      className={inputStyle}
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className={labelStyle}>URL Drive</label>
                    <input
                      {...register(`attachments.${index}.driveLink`)}
                      className={inputStyle}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttach(index)}
                    className="p-2 text-red-600 mb-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendAttach({ driveLink: "", linkName: "" })}
                className="w-full py-4 border-2 border-dashed rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:border-primary hover:text-primary transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Tautan
              </button>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t">
          <button
            type="button"
            className="btn-mongo-secondary text-red-600 border-red-200 hover:bg-red-50"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            <XCircle className="w-4 h-4 mr-2" /> Batalkan Perubahan
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-mongo px-12 shadow-lg shadow-primary/20 min-w-[220px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
