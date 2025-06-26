'use client';

import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import FirebaseMessageHandler from '@/adm/_component/common/FirebaseMessageHandler';

type Props = {
  children: ReactNode;
};

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
      {/* FirebaseMessageHandler도 클라이언트 훅(useEffect)을 사용하므로 여기에 두는 것이 좋습니다. */}
      <FirebaseMessageHandler />
    </SnackbarProvider>
  );
}