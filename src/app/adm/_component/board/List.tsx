'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getBoardList } from '@/services/boardService';
import type { Board, PaginatedBoardResponse } from '@/types/board';
import Pagination from '@/adm/_component/common/Pagination';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';
import styles from "./List.module.css";
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import useWindowSize from '@/hooks/useWindowSize.';
import onTextChange from '@/utils/onTextChange';
import Button from '@/adm/_component/common/Button';
import Select from '@/adm/_component/common/inputs/Select';
import SearchBar from '@/adm/_component/common/inputs/SearchBar';

interface JsonData {
  searchType: string;
  searchKeyword: string;
  id: string;
  content: string;
}

export default function BoardListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [jsonData, setJsonData] = useState<JsonData>({
    searchType: "",
    searchKeyword: "",
    id: searchParams.get("id") || "0",
    content: searchParams.get("content") || "",
  });
  const searchOptions = [
    { value: "", label: "전체" },
    { value: "id", label: "게시물코드" },
    { value: "content", label: "내용" },
  ];
  const queryClient = useQueryClient();
  const {handleChange} = onTextChange(jsonData, setJsonData);
  const { isMobile } = useWindowSize();

  const getPageFromUrl = useCallback(() => {
    const pageParam = searchParams.get('page');
    const page = parseInt(pageParam || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  const currentPage = getPageFromUrl();
  const searchTypeFromUrl = searchParams.get('searchType') || "";
  const searchKeywordFromUrl = searchParams.get('searchKeyword') || "";

  const queryKey = ['boardList', currentPage, ITEMS_PER_PAGE, searchTypeFromUrl, searchKeywordFromUrl];

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery<PaginatedBoardResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getBoardList(currentPage, ITEMS_PER_PAGE, {
      searchType: searchTypeFromUrl,
      searchKeyword: searchKeywordFromUrl
    }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    enabled: currentPage > 0,
  });

  // 렌더링할 데이터 준비
  const boardsToDisplay = paginatedData?.boards || [];
  const totalPages = paginatedData?.totalPages || 0;
  const totalItems = paginatedData?.totalItems;

  // Pagination의 onChangePage
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === currentPage) return;

    const currentSearchType = searchParams.get('searchType');
    const currentSearchKeyword = searchParams.get('searchKeyword');
    const newSearchParams = new URLSearchParams();

    // 새로운 페이지 번호를 설정
    newSearchParams.set('page', newPage.toString());

    // 기존 검색 조건이 존재할 경우, 그대로 다시 추가
    if (currentSearchType) newSearchParams.set('searchType', currentSearchType);
    if (currentSearchKeyword) newSearchParams.set('searchKeyword', currentSearchKeyword);

    // 완성된 쿼리 스트링으로 라우터를 push
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [currentPage, pathname, router, searchParams]);

  const handleRowClick = (itemId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const destination = `/adm/board/${itemId}?${newSearchParams.toString()}`;
    router.push(destination);
  };

// 글쓰기 모달 handler
  const handleAddClick = () => {
    const currentParamsString = searchParams.toString();
    const destination = `/adm/board/add?${currentParamsString}`;
    router.push(destination);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    const queryString = new URLSearchParams({
      searchType: jsonData.searchType,
      searchKeyword: jsonData.searchKeyword,
      page: '1',
    }).toString();

    router.push(`${location.pathname}?${queryString}`);
  }

  // 다음 페이지 prefetch용 effect
  useEffect(() => {
    if (
      paginatedData &&
      !isPlaceholderData &&
      currentPage < paginatedData.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: queryKey,
        queryFn: () => getBoardList(currentPage + 1, ITEMS_PER_PAGE, {
          searchType: searchTypeFromUrl,
          searchKeyword: searchKeywordFromUrl
        }),
        staleTime: 60 * 1000,
      });
    }
  }, [paginatedData, currentPage, queryClient, isPlaceholderData, searchTypeFromUrl, searchKeywordFromUrl]);

  // useState(jsonData)를 URL과 동기화하는 effect
  useEffect(() => {
    setJsonData(prev => ({
      ...prev,
      searchType: searchTypeFromUrl,
      searchKeyword: searchKeywordFromUrl
    }));
  }, [searchTypeFromUrl, searchKeywordFromUrl]);

  if (isError && error) {
    // TODO: 커스텀 알림창 또는 에러 페이지 구현
    alert(`에러가 발생하였습니다: ${error.message}. 관리자에게 문의하세요.`);
    return <div>데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</div>;
  }

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

        <form className={styles.search_container} onSubmit={handleSearch}>
          <Select
            name="searchType"
            value={jsonData.searchType}
            onChange={handleChange}
            options={searchOptions}
          />
          <SearchBar
            name="searchKeyword"
            value={jsonData.searchKeyword}
            placeholder="검색어를 입력하세요"
            onChange={handleChange}
          />
          <div title={"초기화"} className={styles.search_reset_box}>
            <MdOutlineReplay />
          </div>
        </form>
      </section>

      <section className={styles.table_wrapper}>
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
          {isLoading ? ( // Initial load
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
                onClick={() => handleRowClick(item.id)}
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
            pageNumbersToShow={isMobile ? 3 : 5}
          />
        )}
        <Button
          text="글쓰기"
          variant="outlined"
          size="sm"
          color="grey"
          onClick={handleAddClick}
        />
      </section>
    </main>
  );
}