import { create } from 'zustand';

// 스낵바의 종류 (색상과 아이콘을 결정)
export type SnackbarVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

interface SnackbarState {
  isOpen: boolean;
  message: string;
  variant: SnackbarVariant;
  showSnackbar: (message: string, variant?: SnackbarVariant) => void;
  closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isOpen: false,
  message: '',
  variant: 'default',

  showSnackbar: (message, variant = 'default') => {
    set({
      isOpen: true,
      message,
      variant,
    });
  },

  closeSnackbar: () => {
    set({
      isOpen: false,
    });
  },
}));