// import { useSnackbarStore } from '@/zustand/snackbarStore';
//
// // 컴포넌트에서 쉽게 호출할 수 있는 커스텀 훅
// export const useSnackbar = () => {
//   return useSnackbarStore((state) => state.showSnackbar);
// };

'use client';

import { useSnackbar as useNotistack, VariantType } from 'notistack';

// notistack의 severity와 우리가 사용하던 variant 이름을 매핑합니다.
const variantMapping: Record<string, VariantType> = {
  error: 'error',
  warning: 'warning',
  default: 'default',
  info: 'info',
  success: 'success',
};

export const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistack();

  const showSnackbar = (message: string, variant: string = 'default') => {
    const snackbarVariant = variantMapping[variant] || 'default';
    enqueueSnackbar(message, { variant: snackbarVariant });
  };

  return { showSnackbar };
};