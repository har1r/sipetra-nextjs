import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL! || "https://sipetra-nextjs.vercel.app",
  // Menggunakan inferAdditionalFields agar sinkron dengan server
  inferAdditionalFields: true,
  // Kita pertegas skema di sisi client agar IntelliSense berjalan sempurna
  schema: {
    user: {
      fields: {
        userName: { type: "string", required: true },
        role: { type: "string" },
        stages: { type: "string[]" },
        isActive: { type: "boolean" },
        lastLogin: { type: "date" },
      },
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
