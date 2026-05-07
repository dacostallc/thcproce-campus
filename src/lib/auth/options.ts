import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { moodleOAuthProvider } from "@/lib/auth/moodleOAuth";

const moodleOAuth = moodleOAuthProvider();

/**
 * Auth mínima para dev + Credenciais; SSO opcional (OpenID Discovery ou OAuth2 manual).
 * Credenciais: inscrição no campus (hash em `Profile.passwordHash`) ou senha demo (CAMPUS_DEMO_PASSWORD).
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "dev-insecure-change-me",
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    ...(moodleOAuth ? [moodleOAuth] : []),
    Credentials({
      name: "Campus",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(creds) {
        const email = creds?.email?.trim().toLowerCase();
        if (!email || !email.includes("@")) return null;

        const row = await prisma.profile.findUnique({ where: { email } });
        if (row?.passwordHash) {
          const ok = await bcrypt.compare(creds?.password ?? "", row.passwordHash);
          if (!ok) return null;
          return {
            id: row.id,
            email,
            name: row.displayName ?? email.split("@")[0]?.replace(/\./g, " ") ?? "Aluno"
          };
        }

        const demoPass = process.env.CAMPUS_DEMO_PASSWORD ?? "demo";
        if (creds?.password === demoPass) {
          return {
            id: email,
            email,
            name: email.split("@")[0]?.replace(/\./g, " ") ?? "Aluno"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user?.email) token.email = user.email;
      else if (profile && typeof profile === "object" && "email" in profile) {
        const e = (profile as { email?: string }).email;
        if (typeof e === "string" && e.includes("@")) token.email = e;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email)
        session.user.email = token.email as string;
      return session;
    }
  },
  pages: {
    signIn: "/entrar"
  }
};
