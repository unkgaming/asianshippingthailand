import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== 'production',
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        } as any;
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, name: user.name ?? null, email: user.email, image: (user as any).image ?? null } as any;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist email onto token when available
      if (user && (user as any).email) {
        (token as any).email = (user as any).email;
      }

      // Always resolve role/id from database using email
      const email = ((user as any)?.email) || ((token as any)?.email);
      if (email) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser) {
            (token as any).id = dbUser.id;
            (token as any).role = dbUser.role || 'customer';
          }
        } catch (_) {
          // ignore lookup errors; fall back to existing token values
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass user id and role from token to session
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Save user to database on first sign-in
      if (!user?.email) return;
      
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      
      if (!existingUser) {
        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || user.email.split('@')[0],
            image: user.image,
            provider: account?.provider || 'email',
            role: 'customer',
          },
        });
        
        // Create default config
        await prisma.userConfig.create({
          data: {
            userId: newUser.id,
            phone: null,
            company: null,
            preferences: {},
          },
        });
      }
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
