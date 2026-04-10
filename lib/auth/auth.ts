import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { customSession } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "../db";
import type { Db } from "mongodb";
import { ObjectId as MongoObjectId } from "mongodb";

// =======================
// TYPES
// =======================
export type Role = "admin" | "operator" | "viewer";

export type Stage =
  | "penginputan"
  | "penelitian"
  | "pengarsipan"
  | "pengiriman"
  | "pemeriksaan";

const ALL_STAGES: Stage[] = [
  "penginputan",
  "penelitian",
  "pengarsipan",
  "pengiriman",
  "pemeriksaan",
];

// INTERNAL USER TYPE (SOLVE UNKNOWN ISSUE)
type InternalUser = {
  email: string;
  name: string;
  role: Role;
  stages: Stage[];
  isActive: boolean;
  lastLogin: Date;
};

// =======================
// SESSION TYPE
// =======================
type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  stages: Stage[];
  isActive: boolean;
  lastLogin: Date | null;
};

type SessionCallbackParams = {
  session: any;
  user: any;
};

// =======================
// DB CONNECTION
// =======================
let dbPromise: Promise<Db> | null = null;

async function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const mongooseInstance = await connectDB();
      const client = mongooseInstance.connection.getClient();
      return client.db();
    })();
  }

  return dbPromise;
}

// =======================
// ENV
// =======================
const BASE_URL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

if (!BASE_URL) throw new Error("Missing BETTER_AUTH_URL or VERCEL_URL");
if (!process.env.BETTER_AUTH_SECRET)
  throw new Error("Missing BETTER_AUTH_SECRET");

// =======================
// INIT AUTH
// =======================
const db = await getDb();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    "https://sipetra-nextjs.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "viewer" },
      stages: { type: "string[]", defaultValue: [] },
      isActive: { type: "boolean", defaultValue: true },
      lastLogin: { type: "date", required: false },
    },
  },

  plugins: [
    customSession(async ({ user, session }: SessionCallbackParams) => ({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        stages: (user.stages || []) as Stage[],
        isActive: user.isActive,
        lastLogin: user.lastLogin ?? null,
      } satisfies SessionUser,
      session,
    })),
  ],

  databaseHooks: {
    user: {
      create: {
        before: async (rawUser) => {
          const user = rawUser as unknown as InternalUser;

          // VALIDATION (WAJIB - PRODUCTION SAFE)
          if (!user.email) {
            throw new Error("Email is required");
          }

          if (!user.name) {
            throw new Error("Name is required");
          }

          const role: Role = "viewer";

          return {
            data: {
              ...user,
              email: user.email.toLowerCase().trim(),
              role,
              stages: [],
              isActive: true,
              lastLogin: null,
            },
          };
        },
      },

      update: {
        before: async (rawUser) => {
          const user = rawUser as unknown as InternalUser;

          let stages = user.stages;

          if (user.role === "operator" && Array.isArray(stages)) {
            stages = stages.slice(0, 2);
          }

          return {
            data: {
              ...user,
              email: user.email?.toLowerCase().trim(),
              ...(stages ? { stages } : {}),
            },
          };
        },
      },
    },

    session: {
      create: {
        after: async (session) => {
          await db.collection("user").updateOne(
            { _id: new MongoObjectId(session.userId) }, // FIX ObjectId
            {
              $set: { lastLogin: new Date() },
            },
          );
        },
      },
    },
  },
});

// =======================
// ACCESS CONTROL
// =======================
export function getUserStages(user: { role: Role; stages?: Stage[] }): Stage[] {
  if (user.role === "admin" || user.role === "viewer") {
    return ALL_STAGES;
  }
  return user.stages || [];
}

export function canAccessStage(
  user: { role: Role; stages?: Stage[] },
  stage: Stage,
) {
  return getUserStages(user).includes(stage);
}

export function canModifyStage(
  user: { role: Role; stages?: Stage[] },
  stage: Stage,
) {
  if (user.role === "viewer") return false;
  if (user.role === "admin") return true;
  return user.stages?.includes(stage) ?? false;
}

// =======================
// SESSION
// =======================
export const getSession = async () => {
  const h = await headers();
  return auth.api.getSession({ headers: h });
};

// =======================
// SIGN OUT
// =======================
export const signOutServer = async () => {
  const h = await headers();
  const res = await auth.api.signOut({ headers: h });

  if (!res.success) throw new Error("Sign out failed");

  redirect("/sign-in");
};
