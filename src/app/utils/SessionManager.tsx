'use client';

import { useEffect } from 'react';

/**
 * 이 컴포넌트는 UI가 없으며, 보이지 않는 곳에서 두 가지 중요한 임무를 수행합니다.
 * 1. 페이지가 처음 로드될 때, 세션이 유효한지 확인하고 토큰 갱신을 시도합니다.
 * 2. 사용자가 다른 탭에 갔다가 다시 돌아왔을 때, 토큰을 선제적으로 갱신합니다.
 */
export default function SessionManager() {

  // 이 함수는 서버에 조용히 토큰 재발급을 요청합니다.
  // 성공하면 브라우저의 쿠키가 자동으로 갱신되고, 실패해도 아무 일도 일어나지 않습니다.
  const refreshSession = async () => {
    await fetch('/api/auth/refresh', { method: 'POST' });
  };

  useEffect(() => {
    // 페이지가 클라이언트에서 처음 로드될 때 즉시 실행됩니다.
    refreshSession();

    // 사용자가 다른 창을 보다가 우리 탭으로 다시 돌아왔을 때(focus) 실행됩니다.
    // 이를 통해 사용자가 오랫동안 다른 작업을 하다가 돌아와도 토큰이 만료되지 않게 합니다.
    window.addEventListener('focus', refreshSession);

    // 컴포넌트가 사라질 때 이벤트 리스너를 정리하여 메모리 누수를 방지합니다.
    return () => {
      window.removeEventListener('focus', refreshSession);
    };
  }, []); // 이 useEffect는 앱이 처음 시작될 때 단 한 번만 실행됩니다.

  // 화면에는 아무것도 렌더링하지 않습니다.
  return null;
}
