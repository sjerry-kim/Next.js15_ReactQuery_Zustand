import { useAuthStore } from '@/zustand/authStore';
import { useUserStore } from '@/zustand/userStore';

let isRefreshing = false; // isLoading 역할
let refreshQueue: Array<(token: string) => void> = []; // 요청이 쌓이는 큐

// 요청을 큐에 쌓는 함수
const awaitTokenRefresh = () => new Promise<string>((resolve) => {
  refreshQueue.push(resolve);
});

// 토큰이 재발급됨을 알려주는 함수
const notifyTokenRefreshed = (newAccessToken: string) => {
  refreshQueue.forEach((cb) => cb(newAccessToken));
  refreshQueue = [];
};

/* ✅ 토큰 인증이 필요한 api를 랩핑하는 공통 함수 */
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let accessToken = useAuthStore.getState().accessToken;
  
  // fetch 통신 옵션 생성 함수
  const buildOptions = (accessToken: string | null): RequestInit => {
    // new Headers()를 사용하여 헤더 객체를 안전하게 생성
    // options.headers가 어떤 타입이든 (객체, 배열, Headers 인스턴스) 안전하게 처리함
    const headers = new Headers(options.headers);

    // Content-Type이 없는 경우에만 기본값을 설정
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Accesstoken이 있으면 Authorization 헤더를 설정
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

    return {
      ...options,
      headers,
      credentials: 'include',
    };
  };

  // haeder에 Accesstoken을 포함해서 fetch 통신
  let response = await fetch(url, buildOptions(accessToken));

  // 문제 없을 시 response 반환
  if (response.status !== 401) return response;

  // --- 401 처리 로직(middleware.ts에서 받음) ---
  // 첫 번째 요청이 아닌 경우
  if (isRefreshing) {
    // awaitTokenRefresh: Promise를 만들고 resolve 함수를 대기열에 등록한 뒤,
    // 다른 곳에서 그 resolve 함수를 새 토큰 값과 함께 호출해 줄 때까지 기다렸다가,
    // 그 결과값을 newAccessToken 변수에 담음.
    const newAccessToken = await awaitTokenRefresh();
    return fetch(url, buildOptions(newAccessToken));
  }

  // 첫 번째 요청인 경우
  isRefreshing = true;
  try {
    const refreshRes = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    // refresh api에서 터진 에러를 throw함
    // todo 리디렉션 필요한지 검토
    if (!refreshRes.ok) throw new Error('[apiFetch] Refreshtoken이 유효하지 않거나, 만료되었습니다.');

    const { accessToken: newAccessToken, user } = await refreshRes.json();

    // 새로 발급받은 Accesstoken과 갱신된 최신 유저 정보를 zustand에 다시 set
    useAuthStore.getState().setAccessToken(newAccessToken);
    useUserStore.getState().setUser(user);

    // 밀린 요청들에 새 토큰 전달
    notifyTokenRefreshed(newAccessToken);

    // 실패한 fetch 통신 재시도
    return fetch(url, buildOptions(newAccessToken));
  } catch (error) {
    // "인증 에러 발생!"이라고 앱 전체에 방송(dispatch)
    // AuthInitializer에서 로그아웃 페이지로 이동됨.
    window.dispatchEvent(new Event('auth-error'));

    // 내부적으로 상태를 모두 비워 로그아웃 시킴
    console.error('[apiFetch]', error)
    useAuthStore.getState().clearAccessToken();
    useUserStore.getState().setUser(null);

    // 이 fetch를 호출한 useQuery에게 "요청은 최종 실패했다"고 알림
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};
