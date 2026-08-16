import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/infrastructure/prisma";
import { rateLimit, clientIp } from "@/infrastructure/redis/rate-limit";
import { logSecurity } from "@/lib/logger";

// Timing side-channel önlemi: var olmayan kullanıcılarda da aynı bcrypt maliyeti
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/giris" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Brute-force koruması: IP başına 20 deneme / 15 dk
        // (farklı e-postalara denemeleri de kapsar)
        const ip = request ? clientIp(request) : "unknown";
        const ipLimited = await rateLimit(`login-ip:${ip}`, 20, 900);
        if (!ipLimited.ok) {
          logSecurity("login rate-limited (ip)", { email, ip });
          return null;
        }
        // E-posta + IP başına 10 deneme / 15 dk
        const limited = await rateLimit(
          `login:${email.toLowerCase()}:${ip}`,
          10,
          900
        );
        if (!limited.ok) {
          logSecurity("login rate-limited", { email, ip });
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Timing side-channel önlemi: kullanıcı olmasa da aynı bcrypt maliyetini çalıştır
        const valid = await bcrypt.compare(
          password,
          user?.passwordHash ?? DUMMY_HASH
        );

        if (!user?.passwordHash || !valid) {
          logSecurity("failed login", {
            email,
            ip,
            reason: user ? "bad password" : "no user",
          });
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "CUSTOMER";
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Rolü JWT'ye güvenmek yerine her istekte DB'den taze oku:
        // admin panelden düşürülen kullanıcı, oturum yenilenmeden yetkisini kaybeder.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, name: true, email: true },
        });
        // Kullanıcı silindiyse rolü sıfırla: JWT'deki bayat ADMIN rolüne asla düşme.
        session.user.role = dbUser?.role ?? "CUSTOMER";
        if (dbUser?.name) session.user.name = dbUser.name;
        if (dbUser?.email) session.user.email = dbUser.email;
      }
      return session;
    },
  },
});
