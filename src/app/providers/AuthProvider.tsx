'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// SessionProvider를 감싸는 간단한 클라이언트 컴포넌트
export default function AuthProvider({ children }: Props) {
  
  // todo: 추후에 페이지 로드 시마다 accessToken을 인증하는 로직을 여기에 추가하면 보안이 강화됨
  
  return <SessionProvider>{children}</SessionProvider>;
}