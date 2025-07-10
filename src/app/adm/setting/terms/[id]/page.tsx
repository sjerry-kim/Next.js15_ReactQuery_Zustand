import React from 'react';
import Modify from '@/adm/_component/setting/terms/Modify';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getTerm } from '@/services/termsServices';

type PageParams = { params: { id: string } };

export default async function Page({ params }: PageParams) {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['term', id], queryFn: () => getTerm(id) });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProviders>
      <HydrationBoundary state={dehydratedState}>
        <Modify id={id} />
      </HydrationBoundary>
    </ReactQueryProviders>
  );
}
