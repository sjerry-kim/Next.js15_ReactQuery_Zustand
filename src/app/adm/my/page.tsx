import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import MyPage from '@/adm/_component/my/MyPage';
import { getUser } from '@/services/myService';
import { cookies } from 'next/headers';
import { verifyRefreshToken } from '@/lib/jwt';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = new QueryClient();

  // try-catch가 들어간 이유 : 인증 실패시, redirect을 해주어야하기 때문
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      // Refresh Token이 없으면 로그인되지 않은 상태
      throw new Error('No refresh token found');
    }

    // Refresh Token을 검증하여 사용자 ID와 같은 정보를 추출
    const payload = await verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    if (!userId) {
      throw new Error('Invalid token payload');
    }

    // 얻어낸 ID로 데이터를 미리 가져옴(prefetch).
    await queryClient.prefetchQuery({
      queryKey: ['user', userId], // 쿼리 키에 고유한 userId를 포함
      queryFn: () => getUser(userId),
    });

  } catch (error) {
    console.error('[MyPage Server Component] Auth Error:', error);
    //어떤 단계든 인증에 실패하면 로그인 페이지로 redirect
    return redirect('/login?from=/my');
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <MyPage />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
