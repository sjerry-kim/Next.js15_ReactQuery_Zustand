import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/services/boardService';
import List from '@/adm/_component/board/List';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const queryClient = new QueryClient();
  const sp = await searchParams;
  const pageParam = sp?.page;
  const searchTypeParam = sp?.searchType;
  const searchKeywordParam = sp?.searchKeyword;
  const startDateParam = sp?.startDate;
  const endDateParam = sp?.endDate;
  const sortOrderParam = sp?.sortOrder;
  const searchType = Array.isArray(searchTypeParam) ? searchTypeParam[0] : searchTypeParam || '';
  const searchKeyword = Array.isArray(searchKeywordParam) ? searchKeywordParam[0] : searchKeywordParam || '';
  const startDate = Array.isArray(startDateParam) ? startDateParam[0] : startDateParam || '';
  const endDate = Array.isArray(endDateParam) ? endDateParam[0] : endDateParam || '';
  const sortOrder = Array.isArray(sortOrderParam) ? sortOrderParam[0] : sortOrderParam || '';
  const currentPage = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || '1', 10);
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const queryKey = ['boardList', currentPage, ITEMS_PER_PAGE, searchType, searchKeyword, startDate, endDate, sortOrder];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => getBoardList(page, ITEMS_PER_PAGE, { searchType, searchKeyword, startDate, endDate, sortOrder }),
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
