import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isInitialized: boolean; // ✅ 인증 초기화 완료 여부 상태 추가
  setAccessToken: (token: string | null) => void;
  setInitialized: (status: boolean) => void; // ✅ 상태 변경 함수 추가
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitialized: false, // ✅ 초기값은 false
  setAccessToken: (token) => set({ accessToken: token }),
  setInitialized: (status) => set({ isInitialized: status }),
  clearAccessToken: () => set({ accessToken: null, isInitialized: true }), // ✅ 초기화 실패 시에도 완료(true) 처리
}));
