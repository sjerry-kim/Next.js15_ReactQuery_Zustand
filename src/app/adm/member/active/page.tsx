import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReactQueryProviders from '@/providers/ReactQueryProvider';
import { getBoardList } from '@/services/boardService';
import List from '@/adm/_component/member/active/List';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';

export const dynamic = 'force-dynamic';

// 1. searchParams에서 값을 안전하게 추출하는 헬퍼 함수
const getSearchParam = (param: string | string[] | undefined, defaultValue: string = '') => {
  const value = Array.isArray(param) ? param[0] : param;
  return value || defaultValue;
};

export default async function Page({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const queryClient = new QueryClient();

  // 2. 모든 필터 관련 파라미터를 하나의 객체로 관리
  const sp = await searchParams;
  const pageParam = parseInt(getSearchParam(sp.page, '1'), 10);
  const filters = {
    page: isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
    pageSize: ITEMS_PER_PAGE,
    searchType: getSearchParam(sp.searchType),
    searchKeyword: getSearchParam(sp.searchKeyword),
    startDate: getSearchParam(sp.startDate),
    endDate: getSearchParam(sp.endDate),
    sortOrder: getSearchParam(sp.sortOrder, 'desc'),
    // 🔽 CheckboxSet, SwitchSet 테스트용
    fruit: getSearchParam(sp.fruit),
    alrm: getSearchParam(sp.alrm),
  };

  // 3. queryKey 선언
  // - React Query는 객체를 자동으로 비교하여 쿼리를 구별
  const queryKey = ['boardList', filters];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    // 4. queryFn도 filters 객체를 사용하여 간결하게 호출
    queryFn: () => getBoardList(filters.page, filters.pageSize, filters),
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
