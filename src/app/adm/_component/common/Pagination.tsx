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
  onPageChange: (pageNumber: number) => void; // Callback to parent to update state and trigger refetch
  itemsPerPage?: number; // Optional, if needed for display or other logic
  totalItems?: number; // Optional, for display like "Total X items"
  pageNumbersToShow?: number; // How many page number buttons to display
}

export const ITEMS_PER_PAGE = 10; // 페이지 당 아이템 수 (상수로 정의 또는 설정에서 가져오기)

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageNumbersToShow = 5, // Number of direct page links to show
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or no pages
  }

  // Logic to determine the range of page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

  // Adjust startPage if endPage is at the limit
  if (endPage === totalPages) {
    startPage = Math.max(1, totalPages - pageNumbersToShow + 1);
  }
  // Adjust endPage if startPage is at the beginning
  if (startPage === 1 && (endPage - startPage +1) < pageNumbersToShow) {
    endPage = Math.min(totalPages, startPage + pageNumbersToShow -1);
  }


  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    // Create new search params, preserving existing ones
    const newSearchParams = new URLSearchParams(currentSearchParams.toString());
    newSearchParams.set('page', page.toString());

    // Call the parent's handler first to update state and trigger data fetching
    onPageChange(page);

    // Update the URL. router.push will trigger navigation.
    // Use { scroll: false } if you don't want the page to scroll to top on page change.
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

  return (
    <section className={styles.func_wrap}>
      {totalItems !== undefined && (
        <div className={styles.pager}>
          <p>
            Total {totalItems} | Page {currentPage} / {totalPages}
          </p>
        </div>
      )}
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          title="Go to first page"
          onClick={() => handlePageClick(1)}
          aria-label="Go to first page"
        >
          <LuChevronFirst />
        </button>
        <button
          disabled={currentPage === 1} // Or more complex logic for block navigation: disabled={startPage === 1}
          title="Go to previous page" // "Go to previous block" if using block logic
          onClick={() => handlePageClick(currentPage - 1)} // Or: handlePageClick(Math.max(1, startPage - pageNumbersToShow))}
          aria-label="Go to previous page"
        >
          <LuChevronLeft className={styles.left} />
        </button>

        {pageButtons}

        <button
          disabled={currentPage === totalPages} // Or: disabled={endPage >= totalPages}
          title="Go to next page" // "Go to next block"
          onClick={() => handlePageClick(currentPage + 1)} // Or: handlePageClick(Math.min(totalPages, endPage + 1))}
          aria-label="Go to next page"
        >
          <LuChevronRight className={styles.right} />
        </button>
        <button
          disabled={currentPage === totalPages}
          title="Go to last page"
          onClick={() => handlePageClick(totalPages)}
          aria-label="Go to last page"
        >
          <LuChevronLast />
        </button>
      </div>
    </section>
  );
}