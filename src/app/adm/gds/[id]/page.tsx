import React from 'react';
import Modify from '@/adm/_component/board/Modify';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getBoard } from '@/services/boardService';
import ReactQueryProviders from '@/providers/ReactQueryProvider';

type PageParams = { params: { id: string } };

export default async function Page({ params }: PageParams) {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['board', id], queryFn: () => getBoard(id) });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <Modify id={id} />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
