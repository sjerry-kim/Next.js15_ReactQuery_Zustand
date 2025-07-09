import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/services/boardService';
import List from '@/adm/_component/setting/terms/List';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';
import { getTermsList } from '@/services/termsServices';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const queryClient = new QueryClient();
  const queryKey = ['termList'];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => getTermsList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <List />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
