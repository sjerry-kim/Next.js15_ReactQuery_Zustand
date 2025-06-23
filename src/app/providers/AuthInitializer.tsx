'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/zustand/userStore';
import { useAuthStore } from '@/zustand/authStore'; // ✅ auth 스토어 import

// ✅ AuthInitializer는 더 이상 children을 감쌀 필요가 없습니다. 레이아웃에 직접 넣습니다.
function AuthInitializer() {
  // ✅ 로컬 useState 대신 전역 상태 변경 함수를 가져옵니다.
  const { setAccessToken, setInitialized, clearAccessToken } = useAuthStore.getState();
  const { setUser, user } = useUserStore.getState();

  useEffect(() => {
    const initializeAuth = async () => {
      // ✅ 새로고침 시 localStorage에 유저 정보가 있는지 먼저 확인
      const storedUser = useUserStore.getState().user;
      if (!storedUser) {
        setInitialized(true); // 로그인 안 한 상태로 초기화 완료
        return;
      }

      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const { accessToken, user: refreshedUser } = await res.json();
          setAccessToken(accessToken);
          setUser(refreshedUser);
        } else {
          // refresh 실패 시 모든 인증 정보 클리어
          clearAccessToken();
          setUser(null);
        }
      } catch (error) {
        console.error('Silent Refresh 중 에러:', error);
        clearAccessToken();
        setUser(null);
      } finally {
        // ✅ 성공하든 실패하든 전역 상태를 '초기화 완료'로 변경
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // ✅ 이 컴포넌트는 UI를 렌더링하지 않으므로 null 반환
  return null;
}

export default AuthInitializer;
