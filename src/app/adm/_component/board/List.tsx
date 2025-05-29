'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';

import { getBoardList } from '@/lib/queries/boardQuery';
import type { Board, PaginatedBoardResponse } from '@/types/board';
import Pagination from '@/adm/_component/common/Pagination';
import { ITEMS_PER_PAGE } from '@/adm/_component/common/Pagination';

import styles from "./List.module.css";
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";

export default function BoardListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const getPageFromUrl = useCallback(() => {
    const pageParam = searchParams.get('page');
    const page = parseInt(pageParam || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);
  const [currentPage, setCurrentPage] = useState<number>(getPageFromUrl);

  // Board List GET React Query
  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery<PaginatedBoardResponse, Error>({
    queryKey: ['boardList', currentPage, ITEMS_PER_PAGE],
    queryFn: () => getBoardList(currentPage, ITEMS_PER_PAGE),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // 이전 데이터 유지 (v5+)
    enabled: typeof currentPage === 'number' && !isNaN(currentPage) && currentPage > 0, // currentPage가 유효한 양의 정수일 때만 쿼리를 실행
  });

  // Pagination의 onChangePage
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === currentPage) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [currentPage, pathname, router, searchParams]);

  // URL(searchParams)이 변경될 때 currentPage 상태를 업데이트하는 이펙트
  useEffect(() => {
    const pageFromUrl = getPageFromUrl();

    // 현재 상태와 URL의 페이지가 다를 경우에만 업데이트
    if (currentPage !== pageFromUrl) setCurrentPage(pageFromUrl);

    // currentPage를 의존성에 추가하여, 외부 요인으로 currentPage가 변경되었을 때도 URL과 비교하여 동기화
  }, [getPageFromUrl, currentPage]);

  // 다음 페이지 데이터 미리 가져오기 (Prefetching)
  // "react-query가 (미리 가져온 데이터를) 가지고 있다가
  // 동일한 매개변수(정확히는 useQuery가 동일한 queryKey)로 호출될 때
  // 미리 프리패칭한 것을 가져온다"는 것
  useEffect(() => {
    if (
      paginatedData &&
      !isPlaceholderData &&
      currentPage > 0 && // 현재 페이지가 유효하고
      currentPage < paginatedData.totalPages // 다음 페이지가 존재할 때
    ) {
      queryClient.prefetchQuery({
        queryKey: ['boardList', currentPage + 1, ITEMS_PER_PAGE],
        queryFn: () => getBoardList(currentPage + 1, ITEMS_PER_PAGE),
        staleTime: 60 * 1000,
      });
    }
  }, [paginatedData, currentPage, queryClient, isPlaceholderData, ITEMS_PER_PAGE]); // ITEMS_PER_PAGE가 동적이면 의존성에 추가해야 함

  // 에러 처리 UI
  if (isError && error) {
    // TODO: 커스텀 알림창 또는 에러 페이지 구현
    alert(`에러가 발생하였습니다: ${error.message}. 관리자에게 문의하세요.`);
    // router.push('/error');
    return <div>데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</div>;
  }

  // 렌더링할 데이터 준비
  const boardsToDisplay = paginatedData?.boards || [];
  const totalPages = paginatedData?.totalPages || 0;
  const totalItems = paginatedData?.totalItems;

  return (
    <main>
      <section className={styles.top_wrapper}>
        <div className={styles.status_container}>
          <ul className={styles.status_box}>
            <li>전체</li>
            <li>대기</li>
            <li>예약</li>
            <li>구매</li>
            <li>취소</li>
          </ul>
          <div className={styles.gradient_overlay}></div>
        </div>

        <div className={styles.search_container}>
          <select>
            <option>전체</option>
            <option>상품코드</option>
            <option>상품명</option>
            <option>등록일</option>
          </select>
          <div className={styles.searchbar_box}>
            <input placeholder="검색어를 입력하세요"/> {/* Added placeholder */}
            <LuSearch />
          </div>
          <div className={styles.search_reset_box}>
            <MdOutlineReplay />
          </div>
        </div>
      </section>

      <section className={styles.table_wrapper}>
        {/* Optional: Show a loading indicator when fetching new page data over previous data */}
        {isFetching && isPlaceholderData && <div className={styles.fetching_indicator}>페이지 로딩중...</div>}

        <table className={styles.table}>
          <thead>
          <tr>
            <th>No.</th>
            <th>ID</th>
            <th>제목 (내용)</th>
            <th>금액</th>
            <th>작성일</th>
            <th>수정일</th>
          </tr>
          </thead>
          <tbody>
          {isLoading && !paginatedData ? ( // Initial load
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                <h1>로딩중...</h1>
              </td>
            </tr>
          ) : boardsToDisplay.length > 0 ? (
            boardsToDisplay.map((item: Board) => (
              <tr
                key={item.id.toString()}
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/adm/board/${item.id}`)}
              >
                <td>{item.rn}</td>
                <td>{item.id.toString()}</td>
                <td>{item.content || '내용 없음'}</td>
                <td className={styles.need_right}>10,000원</td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                <td>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                <h1>데이터가 없습니다.</h1>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </section>

      <section className={styles.bottom_wrapper}>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
          />
        )}
        <button
          className={styles.add_btn}
          onClick={() => router.push('/adm/board/add')} // Ensure this route exists
        >
          글쓰기
        </button>
      </section>
    </main>
  );
}