import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Generate a secure random token for email verification
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: true, // Enable debug mode to see more details
  logger: {
    error(code, ...message) {
      console.error('[NextAuth Custom Error]', code, ...message);
    },
    warn(code, ...message) {
      console.warn('[NextAuth Custom Warn]', code, ...message);
    },
    debug(code, ...message) {
      console.debug('[NextAuth Custom Debug]', code, ...message);
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        try {
          console.log('[Google Provider] Received profile:', profile);
          return {
            id: profile.sub,
            providers: [
              Google({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                allowDangerousEmailAccountLinking: true,
                profile(profile) {
                  try {
                    console.log('[Google Provider] Received profile:', profile);
                    return {
                      id: profile.sub,
                      name: profile.name,
                      providers: [
                        Google({
                          clientId: process.env.GOOGLE_CLIENT_ID!,
                          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                          allowDangerousEmailAccountLinking: true,
                          profile(profile) {
                            try {
                              console.log('[Google Provider] Received profile:', profile);
                              return {
                                id: profile.sub,
                                name: profile.name,
                                email: profile.email,
                                image: profile.picture,
                                emailVerified: profile.email_verified ? new Date() : null,
                              } as any;
                            } catch (error) {
                              console.error('[Google Provider] Profile error:', error);
                              throw error;
                            }
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
                            // Temporarily disable email verification for testing
                            // if (user.provider === 'credentials' && !user.emailVerified) {
                            //   throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
                            // }
                            const valid = await bcrypt.compare(credentials.password, user.password);
                            if (!valid) return null;
                            return { id: user.id, name: user.name ?? null, email: user.email, image: (user as any).image ?? null } as any;
                          },
                        }),
                      ],
                      callbacks: {
                        async signIn({ user, account, profile, email, credentials }) {
                          console.log('[NextAuth signIn callback]', { user, account, profile, email, credentials });
                          return true;
                        },
                      },
                      secret: process.env.NEXTAUTH_SECRET,
  //       (session.user as any).id = token.id;
  //       (session.user as any).role = token.role;
  //     }
  //     return session;
  //   },
  // },
  // events: {
  //   async signIn({ user, account }) {
  //     if (!user?.email) return;
  //     const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
  //     if (!existingUser) {
  //       const newUser = await prisma.user.create({
  //         data: {
  //           email: user.email,
  //           name: user.name || user.email.split('@')[0],
  //           image: user.image,
  //           provider: account?.provider || 'email',
  //           role: 'customer',
  //         },
  //       });
  //       await prisma.userConfig.create({
  //         data: { userId: newUser.id, phone: null, company: null, preferences: {} },
  //       });
  //     }
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth signIn callback]', { user, account, profile, email, credentials });
      return true;
    },
  },
};

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth signIn callback]', { user, account, profile, email, credentials });
      return true;
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth signIn callback]', { user, account, profile, email, credentials });
      return true;
    },
    // You can add other callbacks here if needed
  },
