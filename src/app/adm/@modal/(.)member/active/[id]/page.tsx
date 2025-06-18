import React from 'react';
import Detail from '@/adm/_component/member/active/Detail';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getBoard } from '@/lib/queries/boardQuery';
import ReactQueryProviders from '@/providers/ReactQueryProvider';

type PageParams = { params: { id: string } };

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['board'], queryFn: () => getBoard(id) });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <Detail id={id} />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
