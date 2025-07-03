'use client';

import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import WebPushMessageListener from '@/utils/WebPushMessageListener';
import FcmTokenInitializer from '@/utils/FcmTokenInitializer';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ConfirmModal from '@/adm/_component/common/modals/ConfirmModal';
import CustomSnackbar from '@/adm/_component/common/modals/CustomSnackbar';

type Props = {
  children: ReactNode;
};

/* ✅ 클라이언트 프로바이더 및 리스너 등을 모아두는 공통 Porvider 컴포넌트 */
export default function ClientProviders({ children }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
      {/* 커스텀 Snackbar */}
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={3500}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
          warning: CustomSnackbar,
          info: CustomSnackbar,
        }}
      >
        {children}
        <WebPushMessageListener /> {/* Firebase 웹푸시 Listener */}
        <FcmTokenInitializer /> {/* 웹푸시 권한 및 토큰 상태 갱신 Initializer */}
        <ConfirmModal /> {/* 커스텀 confirm 컴포넌트 */}
      </SnackbarProvider>
    </LocalizationProvider>
  );
}