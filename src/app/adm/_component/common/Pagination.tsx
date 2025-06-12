'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.css'; // Ensure this path is correct
import {
  LuChevronFirst,
  LuChevronLast,
  LuChevronLeft,
  LuChevronRight,
} from 'react-icons/lu';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void; 
  itemsPerPage?: number;
  totalItems?: number;
  pageNumbersToShow?: number; // 페이지네이션에서 보여줄 숫자 개수
}

export const ITEMS_PER_PAGE = 10; // 페이지 당 아이템 수

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageNumbersToShow = 5,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  let startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

  // endPage가 마지막 페이지에 도달했을 경우 startPage 조정
  if (endPage === totalPages) {
    startPage = Math.max(1, totalPages - pageNumbersToShow + 1);
  }

  // startPage가 1일 경우 endPage 조정 (페이지 개수가 부족한 경우)
  if (startPage === 1 && (endPage - startPage + 1) < pageNumbersToShow) {
    endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);
  }

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    const newSearchParams = new URLSearchParams(currentSearchParams.toString());
    newSearchParams.set('page', page.toString());

    // 부모의 핸들러 먼저 트리거
    onPageChange(page);

    // URL 업데이트 & router.push로 navigation을 트리거
    // scroll: false -> 페이지 바뀔 때마다 스크롤이 상단으로 올라가는 동작 막기
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        className={i === currentPage ? styles.on : ''}
        disabled={i === currentPage}
        onClick={() => handlePageClick(i)}
        aria-label={`Go to page ${i}`}
        aria-current={i === currentPage ? 'page' : undefined}
      >
        {i}
      </button>
    );
  }

  if (totalPages <= 1) {
    return null; // 1페이지 이하인 경우, pagination 렌더 안 함.
  }

  return (
    <div className={styles.pagination_container}>
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          title="첫 페이지로 이동"
          onClick={() => handlePageClick(1)}
          aria-label="첫 페이지로 이동"
        >
          <LuChevronFirst />
        </button>
        <button
          disabled={startPage === 1} // 이전 페이지 이동을 고려하면: disabled={currentPage === 1}
          title="이전 블록으로 이동"
          onClick={() => handlePageClick(Math.max(1, startPage - pageNumbersToShow))} // 이전 페이지 이동을 고려하면: handlePageClick(currentPage - 1)
          aria-label="이전 블록으로 이동"
        >
          <LuChevronLeft className={styles.left} />
        </button>

        {pageButtons}

        <button
          disabled={endPage >= totalPages} // 다음 페이지 이동을 고려하면: disabled={currentPage === totalPages}
          title="다음 블록으로 이동"
          onClick={() => handlePageClick(Math.min(totalPages, endPage + 1))} // 다음 페이지 이동을 고려하면: handlePageClick(currentPage + 1)
          aria-label="다음 블록으로 이동"
        >
          <LuChevronRight className={styles.right} />
        </button>
        <button
          disabled={currentPage === totalPages}
          title="마지막 페이지로 이동"
          onClick={() => handlePageClick(totalPages)}
          aria-label="마지막 페이지로 이동"
        >
          <LuChevronLast />
        </button>
      </div>
      {totalItems !== undefined && (
        <div className={styles.pager}>
          <p><span>Page</span> {currentPage} / {totalPages} <span>|</span> <span>Total</span> {totalItems} </p>
        </div>
      )}
    </div>
  );
}