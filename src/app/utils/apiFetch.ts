/**
 * =======================================================================
 * 클라이언트 측 API 요청 및 인증 상태 관리 모듈 (apiFetch.ts)
 * -----------------------------------------------------------------------
 * 이 파일은 Access Token을 자동으로 관리하는 fetch 래퍼 함수를 제공합니다.
 * - 인증이 필요한 모든 API 요청에 자동으로 Access Token을 헤더에 추가합니다.
 * - Access Token 만료로 401 에러 발생 시, 자동으로 Refresh Token을 사용해 재발급을 시도합니다.
 * - 여러 API 요청이 동시에 발생해도 재발급은 단 한 번만 실행되도록 관리합니다.
 * - 재발급마저 실패하면 강제 로그아웃을 처리합니다.
 * =======================================================================
 */
import { useUserStore } from '@/zustand/userStore';

// --- 전역 상태 변수들 (모듈 스코프) ---

// 현재 'Access Token' 재발급 절차가 실행 중인지를 나타내는 플래그.
// 여러 요청이 동시에 401 에러를 받았을 때, 재발급 요청이 중복 실행되는 것을 방지하는 '잠금(Lock)' 역할을 합니다.
let isRefreshing = false;

// 토큰 재발급이 진행되는 동안 실패한 다른 요청들을 저장하는 대기열(Queue).
// 재발급이 성공하면, 여기에 저장된 요청들을 새로운 'Access Token'으로 다시 실행시켜 줍니다.
let refreshQueue: Array<(newAccessToken: string) => void> = [];


/**
 * 새로운 Access Token을 브라우저의 localStorage에 저장하는 헬퍼 함수.
 * @param token 서버로부터 받은 새로운 Access Token
 */
export const setAccessTokenInStorage = (token: string) => {
  localStorage.setItem('accessToken', token);
};

/**
 * 로그아웃 또는 최종 인증 실패 시 localStorage에서 Access Token을 삭제하는 헬퍼 함수.
 */
export const clearAccessTokenFromStorage = () => {
  localStorage.removeItem('accessToken');
};

/**
 * Access Token 재발급이 완료될 때까지 다른 요청들을 '대기'시키는 Promise.
 * refreshQueue에 resolve 함수를 넣어두고, 재발급이 끝나면 호출되기를 기다립니다.
 */
const awaitTokenRefresh = () =>
  new Promise<string>((resolve) => {
    refreshQueue.push(resolve);
  });

/**
 * Access Token 재발급 성공 시, 대기열에 있던 모든 요청들을 깨워서 새로운 토큰을 전달해주는 함수.
 * @param newAccessToken 새로 발급받은 Access Token
 */
const notifyTokenRefreshed = (newAccessToken: string) => {
  refreshQueue.forEach((cb) => cb(newAccessToken));
  refreshQueue = []; // 큐를 비워서 메모리를 정리합니다.
};


/**
 * 인증이 필요한 API를 위한 커스텀 fetch 래퍼 함수
 * @param url 요청할 URL
 * @param options 네이티브 fetch와 동일한 RequestInit 옵션 객체
 * @returns Promise<Response>
 */
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // ✅ 1단계: 현재의 Access Token 가져오기
  // 함수가 호출될 때마다 localStorage에서 가장 최신 Access Token을 읽어옵니다.
  const accessToken = localStorage.getItem('accessToken');

  // 요청 헤더에 'Authorization: Bearer [Access Token]' 형식으로 추가합니다.
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 재시도 로직에서 반복 사용하기 위해 fetch 요청 부분을 함수로 만듭니다.
  // 이 함수는 주어진 Access Token으로 API를 요청합니다.
  const fetchWithAuth = async (tokenForRequest: string | null) =>
    fetch(url, {
      ...options,
      headers: tokenForRequest ? new Headers({ ...options.headers, 'Authorization': `Bearer ${tokenForRequest}`}) : headers,
    });

  // ✅ 2단계: 일단 현재 Access Token으로 API 요청 시도 (성공 케이스)
  let response = await fetchWithAuth(accessToken);

  // ✅ 3단계: 응답 상태 확인
  // 응답이 401(Unauthorized)이 아니라면, 성공(2xx)이든 다른 에러(404, 500 등)든 그대로 반환합니다.
  // 재발급 로직은 오직 'Access Token이 만료되었다'는 신호인 401 에러에만 반응합니다.
  if (response.status !== 401) {
    return response;
  }

  // --- 여기서부터는 Access Token이 만료되어 401 에러가 발생했을 때의 처리 로직 ---

  // ✅ 4단계: 동시 요청 처리
  // 만약 다른 API 요청이 이미 토큰 재발급을 시작했다면? (isRefreshing = true)
  if (isRefreshing) {
    // 나는 재발급을 또 요청하지 않고, 대기열에 들어가서 새 토큰이 나오길 기다립니다.
    const newAccessToken = await awaitTokenRefresh();
    // 마침내 새 토큰을 받으면, 원래 하려던 요청을 다시 시도합니다.
    return fetchWithAuth(newAccessToken);
  }

  // ✅ 5단계: 재발급 절차 시작 (내가 첫 번째 401 에러 요청인 경우)
  isRefreshing = true; // "지금부터 내가 재발급 시작!" 이라고 플래그를 세웁니다(잠금).
  try {
    // ✨ 서버의 재발급 API(/api/auth/refresh)를 호출합니다.
    // 이 요청은 브라우저가 자동으로 'HttpOnly' 쿠키에 담긴 'Refresh Token'을 함께 보냅니다.
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    // 만약 refresh API가 실패했다면 (e.g. Refresh Token도 만료 또는 유효하지 않음)
    if (!refreshRes.ok) throw new Error('Refresh token is invalid');

    // 성공 시, 새로운 Access Token을 JSON 응답에서 추출합니다.
    const { accessToken: newAccessToken } = await refreshRes.json();
    console.log('✨ Access Token 재발급 성공!');

    // 재발급된 새 Access Token을 localStorage에 저장하여 다음 요청부터 사용하도록 합니다.
    setAccessTokenInStorage(newAccessToken);

    // 혹시 대기열에 다른 요청들이 있다면, "새 토큰 나왔다!"고 알려줍니다.
    notifyTokenRefreshed(newAccessToken);

    // 마지막으로, 실패했던 나의 원래 요청을 새로운 Access Token으로 다시 시도합니다.
    return fetchWithAuth(newAccessToken);

  } catch (err) {
    // 🚨 재발급마저 실패한 경우 = 세션이 완전히 만료된 최후의 상황.
    console.error('최종 재발급 실패. 사용자는 로그아웃됩니다.');
    console.error('🚨 Refresh Token이 만료되었거나 유효하지 않아 재발급에 최종 실패했습니다.');
    // 모든 토큰 정보를 삭제하고 강제 로그아웃을 위한 전역 이벤트를 발생시킵니다.
    clearAccessTokenFromStorage();
    useUserStore.getState().clearUser();
    // window.dispatchEvent(new Event('auth-error'));

    // 이 요청이 실패했다는 것을 알려주기 위한 커스텀 에러 응답 객체
    const errorResponse = {
      ok: false,
      status: 401,
      json: async () => ({ error: '세션이 만료되었습니다. 다시 로그인해주세요.' }),
      statusText: 'Unauthorized',
    };

    // 이 요청은 결국 실패했으므로, 에러를 반환하여 useQuery 등이 감지할 수 있도록 합니다.
    return errorResponse as Response;

  } finally {
    // 모든 과정(성공이든 실패든)이 끝나면, 재발급 플래그를 다시 false로 바꿔서
    // 다음 토큰 만료 시 다른 요청이 재발급을 시작할 수 있도록 잠금을 해제합니다.
    isRefreshing = false;
  }
};
