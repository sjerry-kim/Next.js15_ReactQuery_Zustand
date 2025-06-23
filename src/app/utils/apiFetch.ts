import { useAuthStore } from '@/zustand/authStore';
import { useUserStore } from '@/zustand/userStore';

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const awaitTokenRefresh = () => new Promise<string>((resolve) => {
  refreshQueue.push(resolve);
});

const notifyTokenRefreshed = (newAccessToken: string) => {
  refreshQueue.forEach((cb) => cb(newAccessToken));
  refreshQueue = [];
};

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let accessToken = useAuthStore.getState().accessToken;

  // ✅ buildOptions 함수 수정
  const buildOptions = (token: string | null): RequestInit => {
    // 1. new Headers()를 사용하여 헤더 객체를 안전하게 생성합니다.
    //    options.headers가 어떤 타입이든 (객체, 배열, Headers 인스턴스) 안전하게 처리합니다.
    const headers = new Headers(options.headers);

    // 2. Content-Type이 없는 경우에만 기본값을 설정합니다.
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // 3. 토큰이 있으면 Authorization 헤더를 설정합니다.
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 4. 최종 옵션 객체를 반환합니다.
    return {
      ...options,
      headers, // ✅ 이제 안전한 Headers 객체입니다.
      credentials: 'include',
    };
  };

  let response = await fetch(url, buildOptions(accessToken));

  if (response.status !== 401) {
    return response;
  }

  // --- 401 처리 로직 (이하 동일) ---

  if (isRefreshing) {
    const newAccessToken = await awaitTokenRefresh();
    return fetch(url, buildOptions(newAccessToken));
  }

  isRefreshing = true;
  try {
    const refreshRes = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      throw new Error('Refresh token is invalid or expired.');
    }

    const { accessToken: newAccessToken, user } = await refreshRes.json();

    useAuthStore.getState().setAccessToken(newAccessToken);
    useUserStore.getState().setUser(user);

    notifyTokenRefreshed(newAccessToken);

    return fetch(url, buildOptions(newAccessToken));

  } catch (err) {
    window.dispatchEvent(new Event('auth-error'));
    useAuthStore.getState().clearAccessToken();
    useUserStore.getState().setUser(null);
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
