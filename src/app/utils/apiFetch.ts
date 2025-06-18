let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const awaitTokenRefresh = () => new Promise<void>((resolve) => refreshQueue.push(resolve));
const notifyTokenRefreshed = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const baseOptions: RequestInit = {
    ...options,
    credentials: 'include', // ✅ 항상 쿠키 포함
  };

  let response = await fetch(url, baseOptions);

  if (response.status !== 401) {
    return response;
  }

  // --- 401 처리: Refresh 토큰 시도 ---
  if (isRefreshing) {
    await awaitTokenRefresh();
    return fetch(url, baseOptions); // ✅ 재시도도 쿠키 포함
  }

  isRefreshing = true;
  try {
    console.log("401 처리 시작 - refresh 요청 전");
    const refreshRes = await fetch(`${process.env.PUBLIC_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    console.log("refresh 요청 후 응답 상태:", refreshRes.status)

    if (!refreshRes.ok) throw new Error('Refresh token is invalid');

    notifyTokenRefreshed();

    return fetch(url, baseOptions); // ✅ 재시도도 쿠키 포함

  } catch (err) {
    window.dispatchEvent(new Event('auth-error'));

    // todo 에러 발생 시 dispatchEvent(new Event('auth-error'))은 전역 처리용으로 좋아요.
    // → 이걸 전역 listener로 감지해서 로그아웃 + redirect 처리하면 완성입니다.
    //
    // window.addEventListener('auth-error', () => {
    //   alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    //   window.location.href = '/login';
    // });

    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
