import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { users } from "../db/schema/auth";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
    //  GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();

  if (!session) redirect("/api/auth/signin");
};
export const checkSuperAuth = async () => {
  "use server";
  const { session } = await getUserAuth();
  if (!session) redirect("/api/auth/signin");
  const CurrentUser = (await db
    .select({
      Admin: users.admin,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)) as { Admin: boolean }[];
  console.log(CurrentUser[0]);
  return CurrentUser[0].Admin;
};
