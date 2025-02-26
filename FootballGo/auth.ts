import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
    error: "/auth/error",
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Inscription",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Vous devez remplir les deux champs");
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true, 
            accounts: true
          }
        });

        if (!user) {
          throw new Error("Utilisateur introuvable");
        }

        if (user.accounts && user.accounts.length > 0) {
          const provider = user.accounts[0].provider;
          throw new Error(`Ce compte est lié à ${provider}. Veuillez vous connecter avec ${provider}.`);
        }

        if (!user.password) {
          throw new Error("Utilisateur introuvable");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Le mot de passe est invalide");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email || "" },
            include: {
              accounts: true,
            },
          });

          if (existingUser && existingUser.accounts.length === 0 && existingUser.password) {
            return '/auth/error?error=EmailExists';
          }

          if (existingUser && existingUser.accounts.some(acc => acc.provider === account.provider)) {
            return true;
          }

          if (!existingUser) {
            const nameExists = await prisma.user.findFirst({
              where: { name: user.name || "" }
            });
            
            if (nameExists) {
              return '/auth/error?error=NameExists';
            }
          }

        } catch (error) {
          console.error('Erreur lors de la vérification:', error);
          return '/auth/error?error=Default';
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
});