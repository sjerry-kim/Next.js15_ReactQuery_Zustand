import React from 'react';
import List from '@/adm/_component/board/List';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/lib/boardQuery';

export default async function Page({ searchParams }: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['boardList'], queryFn: getBoardList });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <List />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
