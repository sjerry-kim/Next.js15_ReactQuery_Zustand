'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PROTECTED_PATHS } from '@/_auth/path-auth';
import { useUserStore } from '@/zustand/userStore';
import { useAuthStore } from '@/zustand/authStore';

/* ✅ zustand(클라이언트 메모리)에 Accesstoken을 남겨놓고, 
      전역적으로 페이지 이동 및 로그아웃 처리가 필요한 로직을 위한 provider */
export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized, setAccessToken, setInitialized, clearAccessToken } = useAuthStore();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const pathname = usePathname();

  // 1. 세션 복원(Silent Refresh)을 위한 effect
  // Accesstoken과 현재 로그인한 유저의 정보를 지속적으로 업데이트
  useEffect(() => {
    // 이미 초기화가 완료되었다면 다시 실행하지 않음
    if (useAuthStore.getState().isInitialized) return;

    const initializeAuth = async () => {
      const storedUser = useUserStore.getState().user; // 현재 로그인한 유저

      // 현재 로그인한 유저가 없다면 return
      if (!storedUser) {
        setInitialized(true);
        return;
      }

      try {
        // apiFetch 로직과 통일
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('[AuthInitializer] Refreshtoken이 유효하지 않거나, 만료되었습니다.');

        const { accessToken: newAccessToken, user } = await res.json();

        // 새로 발급받은 Accesstoken과 갱신된 최신 유저 정보를 zustand에 다시 set
        setAccessToken(newAccessToken);
        setUser(user);

      } catch (error) {
        console.error('[AuthInitializer] Silent Refresh 중 에러:', error);
        clearAccessToken();
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // 2. 역할 기반 접근 제어(RBAC)를 위한 effect
  // 인증 상태나 유저 정보, 경로가 변경될 때마다 실행되어 접근 권한을 확인합니다.
  // useEffect(() => {
  //   // 인증 초기화 전이거나, 로그인된 유저가 아니면 실행하지 않습니다.
  //   if (!isInitialized || !user) return;
  //
  //   // 미들웨어와 동일한 권한 체크 로직을 클라이언트에서도 수행하여, UI 깜빡임을 방지합니다.
  //   const sortedProtectedPaths = [...PROTECTED_PATHS].sort((a, b) => b.path.length - a.path.length);
  //   const matchedPath = sortedProtectedPaths.find(({ path }) => pathname.startsWith(path));
  //
  //   // 보호된 경로인데 사용자 역할이 허용 목록에 없는 경우
  //   if (matchedPath && !matchedPath.roles.includes(user.role)) {
  //     console.log(`[AuthGuard] 클라이언트 측 접근 거부: ${user.email}(${user.role}) -> ${pathname}`);
  //     // 접근 불가(403) 페이지로 리디렉션합니다.
  //     router.replace('/403');
  //   }
  // }, [isInitialized, user, pathname, router]);


  // 3. 전역 인증 에러 처리를 위한 effect
  // apiFetch에서 재발급이 최종 실패했을 때 발생하는 'auth-error' 이벤트를 감지
  useEffect(() => {
    const handleAuthError = () => {
      alert('장시간 활동이 없어 로그아웃되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login'; // 페이지를 완전히 새로고침하며 로그인 페이지로 이동
    };

    window.addEventListener('auth-error', handleAuthError);

    // 메모리 누수를 방지
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  // 인증 확인이 끝날 때까지 랜더링되는 로딩 UI
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {/* todo 여기에 멋진 스피너나 로고를 넣을 수 있습니다. */}
        <h1>Loading Application...</h1>
      </div>
    );
  }

  // 초기화가 끝나면 감싸고 있던 자식 컴포넌트(실제 페이지)를 렌더링
  return <>{children}</>;
}