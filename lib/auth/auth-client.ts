import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  inferAdditionalFields: true, 
});

// Export helper langsung
export const { signIn, signUp, signOut, useSession } = authClient;
