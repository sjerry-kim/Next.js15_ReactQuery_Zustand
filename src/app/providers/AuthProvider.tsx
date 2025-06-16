'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// SessionProvider를 감싸는 간단한 클라이언트 컴포넌트
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}