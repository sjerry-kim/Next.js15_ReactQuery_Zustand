// 재발급 잠금 및 큐 로직은 그대로 유지합니다.
let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const awaitTokenRefresh = () => new Promise<void>((resolve) => refreshQueue.push(resolve));
const notifyTokenRefreshed = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // ❌ 헤더에 토큰을 직접 추가하는 모든 로직을 완전히 삭제합니다.
  // 브라우저가 자동으로 모든 관련 쿠키를 요청에 실어 보냅니다.
  let response = await fetch(url, options);

  // 401 에러가 아니라면 그대로 반환합니다.
  if (response.status !== 401) {
    return response;
  }

  // --- 401 처리: Refresh 토큰 시도 ---
  if (isRefreshing) {
    await awaitTokenRefresh();
    return fetch(url, options);
  }

  isRefreshing = true;
  try {
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!refreshRes.ok) throw new Error('Refresh token is invalid');

    // 재발급 성공 시, 대기 중이던 요청들을 깨웁니다.
    notifyTokenRefreshed();

    // 원래 요청을 다시 시도합니다.
    // 이 시점에는 브라우저가 서버로부터 받은 새로운 쿠키들을 가지고 있습니다.
    return fetch(url, options);

  } catch (err) {
    window.dispatchEvent(new Event('auth-error'));
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
