// lib/apiFetch.ts

// 클라이언트 측 메모리에 Access Token을 저장하는 변수
// 페이지가 새로고침되면 초기화됩니다.
let accessToken: string | null = null;

// 토큰 재발급 로직이 현재 실행 중인지 여부를 나타내는 플래그
let isRefreshing = false;

// 토큰 재발급을 기다리는 요청들을 저장하는 배열 (Queue)
// 각 요소는 재발급된 토큰을 인자로 받는 콜백 함수입니다.
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * 외부(예: 로그인 성공 시)에서 Access Token을 설정하는 함수
 * @param token 새로운 Access Token
 */
export const setAccessToken = (token: string) => {
  accessToken = token;
};

/**
 * 재발급이 진행되는 동안 들어온 다른 API 요청들을 대기 큐에 추가하는 함수
 * @param cb 재발급 성공 후 실행될 콜백 함수
 */
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

/**
 * 토큰 재발급이 성공했을 때, 큐에 대기 중이던 모든 요청을 실행하는 함수
 * @param newToken 재발급된 새로운 Access Token
 */
const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(cb => cb(newToken));
  // 모든 대기 요청을 처리했으므로 큐를 비웁니다.
  refreshSubscribers = [];
};

/**
 * 네이티브 fetch를 래핑하여 자동 토큰 재발급 로직을 추가한 커스텀 fetch 함수
 * @param url 요청할 URL
 * @param options 네이티브 fetch와 동일한 RequestInit 옵션 객체
 * @returns Promise<Response>
 */
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // 1. 기존 옵션을 복사하고, Authorization 헤더를 설정합니다.
  const customOptions = { ...options };
  const headers = new Headers(customOptions.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  customOptions.headers = headers;

  // 2. 설정된 옵션으로 API를 요청합니다.
  let response = await fetch(url, customOptions);

  // 3. 응답 상태가 401(Unauthorized)이면 토큰 재발급 절차를 시작합니다.
  if (response.status === 401) {
    // 이미 다른 요청에 의해 토큰 재발급이 시작되었다면,
    if (isRefreshing) {
      // 현재 요청은 대기 큐에만 추가하고, 새로운 프로미스를 반환하여 기다립니다.
      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          // 재발급이 완료되면, 새로운 토큰으로 헤더를 갱신하여 원래 요청을 재시도합니다.
          headers.set('Authorization', `Bearer ${newAccessToken}`);
          resolve(fetch(url, { ...customOptions, headers }));
        });
      });
    }

    // 재발급 절차를 시작합니다. 플래그를 true로 설정합니다.
    isRefreshing = true;

    try {
      // 만들어둔 토큰 재발급 API(/api/auth/refresh)를 호출합니다.
      const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });

      if (!refreshResponse.ok) {
        // Refresh Token마저 유효하지 않아 재발급에 실패한 경우
        throw new Error('토큰 재발급에 실패했습니다. 다시 로그인해주세요.');
      }

      const { accessToken: newAccessToken } = await refreshResponse.json();

      // 새로 받은 토큰을 메모리에 저장합니다.
      setAccessToken(newAccessToken);

      // 재발급이 완료되었으므로, 대기 중이던 다른 요청들을 깨웁니다.
      onRefreshed(newAccessToken);

      // 현재 실패했던 원래 요청을 새로운 토큰으로 재시도합니다.
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      response = await fetch(url, { ...customOptions, headers });

    } catch (error) {
      // 재발급 과정에서 에러 발생 시, 모든 인증 정보를 초기화하고 로그인 페이지로 보냅니다.
      setAccessToken("");
      console.error(error);
      window.location.href = '/login'; // 로그인 페이지로 리디렉션
      return Promise.reject(error); // 에러를 전파하여 호출 측에서 처리할 수 있게 함

    } finally {
      // 모든 절차가 끝나면 재발급 플래그를 false로 원복합니다.
      isRefreshing = false;
    }
  }

  // 401 에러가 아니거나, 모든 재발급 절차가 완료된 후의 최종 응답을 반환합니다.
  return response;
};