'use client';

import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import WebPushMessageListener from '@/utils/WebPushMessageListener';
import FcmTokenInitializer from '@/utils/FcmTokenInitializer';

type Props = {
  children: ReactNode;
};

/* ✅ 클라이언트 프로바이더 및 리스너 등을 모아두는 공통 Porvider 컴포넌트 */
export default function ClientProviders({ children }: Props) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {children}
      <WebPushMessageListener /> {/* Firebase 웹푸시 Listener */}
      <FcmTokenInitializer /> {/* 웹푸시 권한 및 토큰 상태 갱신 Initializer */}
    </SnackbarProvider>
  );
}