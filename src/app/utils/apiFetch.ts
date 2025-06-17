// lib/apiFetch.ts

// 'use client'는 이 파일에 더 이상 필요 없습니다.
// localStorage에 접근하는 로직을 함수 안으로 옮겼기 때문입니다.

// 재발급 로직 실행 여부 추적
let isRefreshing = false;
// 재발급을 기다리는 요청들을 저장하는 큐
let refreshQueue: Array<(token: string) => void> = [];

/**
 * 로그인 성공 시 Access Token을 localStorage에 저장하는 함수
 * @param token 새로운 Access Token
 */
export const setAccessTokenInStorage = (token: string) => {
  localStorage.setItem('accessToken', token);
};

/**
 * 로그아웃 시 Access Token을 localStorage에서 삭제하는 함수
 */
export const clearAccessTokenFromStorage = () => {
  localStorage.removeItem('accessToken');
};

const awaitTokenRefresh = () =>
  new Promise<string>((resolve) => {
    refreshQueue.push(resolve);
  });

const notifyTokenRefreshed = (newToken: string) => {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
};

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // ✅ 함수가 호출되는 시점에 localStorage에서 최신 토큰을 읽어옵니다.
  //    이렇게 하면 서버 렌더링 오류와 상태 불일치 문제가 모두 해결됩니다.
  const accessToken = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetchWithAuth = async (token: string | null) =>
    fetch(url, {
      ...options,
      headers: token ? new Headers({ ...options.headers, 'Authorization': `Bearer ${token}`}) : headers,
    });

  let response = await fetchWithAuth(accessToken);

  if (response.status !== 401) {
    return response;
  }

  console.log('미들웨어를 거쳤다', response.status !== 401)

  // --- 401 처리: Refresh 토큰 시도 ---
  if (isRefreshing) {
    const newToken = await awaitTokenRefresh();
    // 새 토큰으로 재시도
    return fetchWithAuth(newToken);
  }

  isRefreshing = true;
  try {
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!refreshRes.ok) throw new Error('Refresh token is invalid');

    const { accessToken: newAccessToken } = await refreshRes.json();

    // ✅ 재발급된 새 토큰을 localStorage에 저장합니다.
    setAccessTokenInStorage(newAccessToken);

    notifyTokenRefreshed(newAccessToken);

    // 새 토큰으로 원래 요청을 다시 시도합니다.
    return fetchWithAuth(newAccessToken);
  } catch (err) {
    // ✅ 재발급 실패 시 localStorage의 토큰을 삭제합니다.
    clearAccessTokenFromStorage();
    window.dispatchEvent(new Event('auth-error')); // 전역 에러 이벤트 발생
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};