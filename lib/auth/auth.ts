import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";
import connectDB from "../db";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  // 1. AKTIFKAN FITUR LOGIN EMAIL & PASSWORD
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Otomatis login setelah pendaftaran berhasil
  },

  // 2. KONFIGURASI SESI (Wajib ada jika menggunakan cookieCache)
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 jam
    },
  },

  // 3. DEFINISI FIELD CUSTOM UNTUK SIPETRA
  user: {
    additionalFields: {
      userName: { type: "string", required: true },
      role: { type: "string", defaultValue: "viewer" },
      stages: { type: "string[]", defaultValue: [] },
      isActive: { type: "boolean", defaultValue: true },
      lastLogin: { type: "date", required: false },
    },
  },

  // 4. LOGIKA OTOMATISASI ROLE & STAGES
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const updatedUser = { ...user };

          if (updatedUser.role === "admin") {
            updatedUser.stages = [
              "penginputan",
              "penelitian",
              "pengarsipan",
              "pengiriman",
              "pemeriksaan",
            ];
          } else if (updatedUser.role === "viewer") {
            updatedUser.stages = [];
          }
          // Untuk Operator, stages tetap sesuai kiriman form dari Client

          return { data: updatedUser };
        },
        after: async (user) => {
          if (user.id) {
            // Jalankan fungsi inisialisasi board aplikasi SIPETRA
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

export async function getSession() {
  // Gunakan await headers() untuk Next.js App Router terbaru
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}
