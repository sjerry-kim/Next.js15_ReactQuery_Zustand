import React from 'react';
import List from '@/adm/_component/board/List';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/lib/queries/boardQuery';

export default async function Page({ searchParams }: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['boardList'], queryFn: () => getBoardList(1 ,10) });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <List />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
