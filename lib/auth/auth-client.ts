import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // ANTI-GAGAL: Selalu gunakan origin domain saat ini agar tidak terkena CORS
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL,
  inferAdditionalFields: true,
});

// Export helper langsung
export const { signIn, signUp, signOut, useSession } = authClient;
