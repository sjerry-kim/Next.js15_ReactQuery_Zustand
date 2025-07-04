"use client"

import { useUserStore } from '@/zustand/userStore';
import { useAuthStore } from '@/zustand/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // 서버에서의 로그아웃 요청이 실패하더라도 클라이언트 상태는 정리 = throw 안 함
      if (!res.ok) {
        console.error('[logout] 서버 로그아웃에 실패하였습니다.');
      }

      // 클라이언트의 모든 인증 관련 상태를 정리
      useAuthStore.getState().clearAccessToken();
      useUserStore.getState().setUser(null);

      // React Query에 캐시된 모든 데이터를 삭제
      // 다른 사용자가 로그인했을 때 이전 사용자의 데이터가 보이는 것을 방지
      queryClient.clear();

      // 메인페이지로 이동하여 모든 상태를 완전히 새로고침
      window.location.href = '/';
    } catch (error) {
      // 네트워크 에러 등 fetch 자체가 실패한 경우
      console.error('[logout]', error.message || '로그아웃 오류');
      // 에러가 발생하더라도 사용자 경험을 위해 강제로 상태를 초기화
      showSnackbar('로그아웃 중 문제가 발생하였습니다. 페이지를 새로고침합니다.', 'error')
      window.location.reload();
    }
  };

  return (
    <>
      {user && <p>안녕하세요 {user.name}님!</p>}
      <h1>Hi! I'm the User Page :)</h1>

      {user && <button onClick={handleLogout}>로그아웃</button>}
    </>
  );
}
