import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GitHubProvider from "next-auth/providers/github"; // 예시용, 필요 없으면 지워도 됨
import { SupabaseClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성 (서비스 역할 키로 권한 높은 작업 가능)
const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase 프로젝트 URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 서비스 역할 키(비공개, 강력한 권한)
);

export const authOptions: NextAuthOptions = {
  // 사용할 인증 제공자 설정 (예: 구글, 깃허브, credentials 등)
  providers: [
    // 현재는 빈 배열, 필요 시 Provider 추가 가능
  ],

  // Supabase의 사용자 데이터베이스와 NextAuth 연결을 위한 어댑터 설정
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase URL
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // 서비스 역할 키 (adapter 내부에서 DB 접근용)
  }),

  // 세션 설정 (JWT 기반)
  session: {
    strategy: "jwt", // 세션 정보를 JWT 토큰으로 저장 및 관리
    maxAge: 60 * 60 * 24 * 90, // 세션 만료 기간: 90일 (3개월)
    updateAge: 60 * 60 * 24, // 세션 갱신 간격: 1일마다 토큰 갱신
  },

  // 콜백 함수: 인증 절차 중 추가 동작 처리
  callbacks: {
    // JWT 토큰 생성 또는 갱신 시 호출
    async jwt({ token, user, account }) {
      // 사용자 최초 로그인 시 account, user 정보가 있음
      if (account && user) {
        token.accessToken = account.access_token;   // OAuth 제공자가 준 access token 저장
        token.refreshToken = account.refresh_token; // refresh token 저장
        token.id = user.id;                          // 사용자 고유 ID 저장
        token.role = user.role ?? "user";            // 사용자 역할 저장 (없으면 기본 'user')
      }
      return token; // 수정된 토큰 반환
    },

    // 클라이언트에 세션 정보를 제공할 때 호출
    async session({ session, token }) {
      // JWT 토큰에서 필요한 값을 세션에 할당하여 프론트에 전달
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.role = token.role;

      return session;
    },
  },

  // 로그인 관련 페이지 경로 설정 (커스텀 페이지 사용 시)
  pages: {
    signIn: "/login", // 로그인 페이지 경로
    error: "/404",  // 로그인 실패 시 이동할 페이지
  },

  // JWT 암호화를 위한 시크릿 키 (환경변수로 관리)
  secret: process.env.NEXTAUTH_SECRET,
};

// Next.js app router용 핸들러 export (GET, POST 요청 모두 처리)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
