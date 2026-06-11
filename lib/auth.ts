import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getMembershipTier } from "@/lib/utils";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          points: user.points,
          tier: getMembershipTier(user.points),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!existing) {
          // Create user from Google profile
          const created = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "Tea Lover",
              password: "", // No password for OAuth users
              emailVerified: true,
              points: 50,
            },
          });
          user.id = created.id;
          (user as any).points = created.points;
        } else {
          user.id = existing.id;
          (user as any).points = existing.points;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.points = (user as { points?: number }).points ?? 0;
        token.tier = (user as { tier?: string }).tier ?? "Bronze";
      }

      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.points = dbUser.points;
          token.tier = getMembershipTier(dbUser.points);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.points = token.points as number;
        session.user.tier = token.tier as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
