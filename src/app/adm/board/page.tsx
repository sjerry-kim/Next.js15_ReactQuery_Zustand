import React from 'react';
import List from '@/adm/_component/board/List';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/lib/queries/boardQuery';

export default async function Page({ searchParams }: any) {
  // 1. 서버에서 사용할 새로운 QueryClient 인스턴스를 생성합니다.
  const queryClient = new QueryClient();
  // 2. 서버에서 데이터를 미리 가져옵니다 (prefetch).
  //    - queryKey: ['boardList'] => 이 키로 데이터를 캐싱합니다.
  //    - queryFn: () => getBoardList(1, 10) => getBoardList 함수를 호출하여
  //                                            첫 번째 페이지의 데이터 10개를 가져옵니다.
  //    - await: 데이터 prefetch가 완료될 때까지 기다립니다.
  await queryClient.prefetchQuery({ queryKey: ['boardList'], queryFn: () => getBoardList(1, 10) });
  // 3. prefetch된 데이터와 QueryClient의 현재 상태를 "탈수(dehydrate)"합니다.
  //    이는 서버에서 가져온 데이터를 클라이언트로 전송 가능한 직렬화된 형태로 만드는 과정입니다.
  const dehydratedState = dehydrate(queryClient);

  // 4. 클라이언트에 렌더링할 JSX를 반환합니다.
  return (
    // ReactQueryProviders는 QueryClient를 제공하는 컨텍스트 프로바이더일 것입니다.
    // (일반적으로 최상위 레이아웃이나 클라이언트 컴포넌트의 루트에 위치합니다.)
    <ReactQueryProviders>
      {/* HydrationBoundary는 서버에서 탈수된 상태(dehydratedState)를
          클라이언트의 QueryClient에 "재수화(rehydrate)"하는 역할을 합니다. */}
      <HydrationBoundary state={dehydratedState}>
        {/* List 컴포넌트를 렌더링합니다. 이 컴포넌트는 클라이언트 컴포넌트이며,
            서버에서 미리 가져온 데이터를 사용하여 초기 렌더링될 수 있습니다. */}
        <List />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
