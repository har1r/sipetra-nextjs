import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "../db";

let dbInstance: any;

async function getDb() {
  if (!dbInstance) {
    const mongooseInstance = await connectDB();
    const client = mongooseInstance.connection.getClient();
    dbInstance = client.db();
  }
  return dbInstance;
}

type Role = "admin" | "viewer";

type Stage =
  | "penginputan"
  | "penelitian"
  | "pengarsipan"
  | "pengiriman"
  | "pemeriksaan";

const ROLE_STAGES: Record<Role, Stage[]> = {
  admin: [
    "penginputan",
    "penelitian",
    "pengarsipan",
    "pengiriman",
    "pemeriksaan",
  ],
  viewer: [],
};

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("Missing BETTER_AUTH_URL");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing BETTER_AUTH_SECRET");
}

export const auth = betterAuth({
  database: mongodbAdapter(await getDb()),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 3600, // 1 jam
    },
  },

  user: {
    additionalFields: {
      userName: { type: "string", required: true },
      role: { type: "string", defaultValue: "viewer" },
      stages: { type: "string[]", defaultValue: [] },
      isActive: { type: "boolean", defaultValue: true },
      lastLogin: { type: "date", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role as Role;

          return {
            data: {
              ...user,
              stages: ROLE_STAGES[role] ?? [],
            },
          };
        },
      },
    },
  },
});

// Reuse headers (lebih efisien)
export const getSession = async () => {
  const h = await headers();
  return auth.api.getSession({ headers: h });
};

export const signOutServer = async () => {
  const h = await headers();
  const result = await auth.api.signOut({ headers: h });

  if (!result.success) {
    throw new Error("Failed to sign out");
  }

  redirect("/sign-in");
};