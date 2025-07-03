import { create } from 'zustand';
import { ReactNode } from 'react';

// ConfirmModal이 받을 옵션 타입
interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
}

// 스토어의 상태 및 액션 타입
interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolver: ((value: boolean) => void) | null; // Promise의 resolve 함수
  open: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  options: null,
  resolver: null,

  // `await`으로 호출할 수 있도록 Promise를 반환하는 액션
  open: (options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        options,
        resolver: resolve, // resolve 함수를 state에 저장
      });
    });
  },

  // '확인' 액션
  handleConfirm: () => {
    set((state) => {
      state.resolver?.(true); // 저장된 resolve 함수에 true 전달
      return { isOpen: false, resolver: null };
    });
  },

  // '취소' 또는 '닫기' 액션
  handleCancel: () => {
    set((state) => {
      state.resolver?.(false); // 저장된 resolve 함수에 false 전달
      return { isOpen: false, resolver: null };
    });
  },
}));