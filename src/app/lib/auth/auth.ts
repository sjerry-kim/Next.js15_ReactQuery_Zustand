// lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { ROLES } from "@/lib/auth/auth-config";
import { Role } from '@/types/next-auth';


export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt", // JWT 기반
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 실제 인증 로직 - 예시로 간단하게 고정값 사용
        if (
          credentials?.email === "admin@example.com" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: credentials.email,
            role: ROLES.SUPER_ADMIN, // 직접 지정
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // 로그인 페이지 커스터마이징 시
  },
};
