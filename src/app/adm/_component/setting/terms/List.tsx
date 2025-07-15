'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import Pagination from '@/adm/_component/common/Pagination';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';
import styles from "./List.module.css";
import { MdOutlineReplay } from "react-icons/md";
import useWindowSize from '@/hooks/useWindowSize.';
import onInputsChange from '@/utils/onInputsChange';
import Button from '@/adm/_component/common/buttons/Button';
import Select from '@/adm/_component/common/custom/Select';
import SearchBar from '@/adm/_component/common/inputs/SearchBar';
import moment, { Moment } from 'moment';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import DateRangePicker from '@/adm/_component/common/custom/DateRangePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Loading from '@/adm/_component/common/Loading';
import Fail from '@/adm/_component/common/Fail';
import { useSnackbar } from '@/hooks/useSnackbar';
import { getTermsList } from '@/services/termsServices';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Option } from '@/types/components';
import RadioSet from '@/adm/_component/common/custom/RadioSet';

interface JsonData {
  searchType: string;
  searchKeyword: string;
  startDate: Moment | null;
  endDate: Moment | null;
  sortOrder: string;
}

export default function List() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const queryClient = useQueryClient();
  const cardWrapperRef = useRef<HTMLElement>(null);
  // URL 파라미터를 기반으로 필터의 '적용된' 상태를 객체로 관리 (useQuery용)
  const appliedFilters = {
    page: parseInt(searchParams.get('page') || '1', 10),
    pageSize: ITEMS_PER_PAGE,
    searchType: searchParams.get('searchType') || '',
    searchKeyword: searchParams.get('searchKeyword') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  };
  // UI 필터 상태를 담는 jsonData 변수
  const [jsonData, setJsonData] = useState<JsonData>({
    searchType: appliedFilters.searchType,
    searchKeyword: appliedFilters.searchKeyword,
    startDate: appliedFilters.startDate ? moment(appliedFilters.startDate) : null,
    endDate: appliedFilters.endDate ? moment(appliedFilters.endDate) : null,
    sortOrder: appliedFilters.sortOrder,
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const searchOptions = [
    { value: "", label: "전체" },
    { value: "id", label: "게시물코드" },
    { value: "content", label: "내용" },
  ];
  const sortOptions: Option[] = [
    { label: '최신순', value: 'desc' },
    { label: '오래된순', value: 'asc' },
  ];
  const { isMobile, isLaptop } = useWindowSize();
  const {showSnackbar} = useSnackbar();
  const {handleChange} = onInputsChange(jsonData, setJsonData);

  const getPageFromUrl = useCallback(() => {
    const pageParam = searchParams.get('page');
    const page = parseInt(pageParam || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  const currentPage = getPageFromUrl();
  const searchTypeFromUrl = searchParams.get('searchType') || "";
  const searchKeywordFromUrl = searchParams.get('searchKeyword') || "";
  const startDateFromUrl = searchParams.get('startDate') || "";
  const endDateFromUrl = searchParams.get('endDate') || "";
  const sortOrderFromUrl = searchParams.get('sortOrder') || 'desc';

  const queryKey = ['termList', appliedFilters];

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery<any, Error>({
    queryKey: queryKey,
    queryFn: () => getTermsList(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData: any) => previousData,
    enabled: currentPage > 0,
  });

  // 렌더링할 데이터 준비
  const termsToDisplay = paginatedData?.data || [];
  // const totalPages = paginatedData?.totalPages || 0;
  // const totalItems = paginatedData?.totalItems;

  // Pagination의 onChangePage
  // const handlePageChange = useCallback((newPage: number) => {
  //   if (newPage === currentPage) return;
  //
  //   // 기존 searchParams를 그대로 복사하여 사용
  //   const newSearchParams = new URLSearchParams(searchParams.toString());
  //
  //   // page 값만 새로운 번호로 설정하거나 변경
  //   newSearchParams.set('page', newPage.toString());
  //
  //   // 필터는 유지하고 페이지만 변경
  //   router.push(`${pathname}?${newSearchParams.toString()}`);
  // }, [currentPage, pathname, router, searchParams]);

  // 상세 이동
  const handleRowClick = (itemId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const destination = `/adm/setting/terms/${itemId}?${newSearchParams.toString()}`;
    router.push(destination);
  };

  // 등록 이동
  const handleAddClick = () => {
    const currentParamsString = searchParams.toString();
    const destination = `/adm/setting/terms/add`;
    router.push(destination);
  };

  // 검색 및 필터 적용
  const handleApplyFilters = (e?: FormEvent) => {
    e?.preventDefault();

    if ((jsonData.startDate && !jsonData.endDate) || (!jsonData.startDate && jsonData.endDate)) {
      showSnackbar('시작일과 종료일을 모두 선택해주세요.', 'warning');
      return;
    }

    const newSearchParams = new URLSearchParams();

    // 현재 UI 상태인 `jsonData`를 기준으로 URL 파라미터를 생성
    if (jsonData.searchKeyword) {
      newSearchParams.set('searchType', jsonData.searchType);
      newSearchParams.set('searchKeyword', jsonData.searchKeyword);
    }
    if (jsonData.startDate) newSearchParams.set('startDate', jsonData.startDate.format('YYYY-MM-DD'));
    if (jsonData.endDate) newSearchParams.set('endDate', jsonData.endDate.format('YYYY-MM-DD'));
    newSearchParams.set('sortOrder', jsonData.sortOrder);
    newSearchParams.set('page', '1');

    router.push(`${pathname}?${newSearchParams.toString()}`);
    setIsDateModalOpen(false); // 모달 필터의 경우 모달 닫음
  };

  // 8. 기간 필터 모달을 여는 핸들러
  // const handleOpenDateModal = () => {
  //   // 모달을 열 때, 현재 URL에 적용된 날짜를 임시 상태의 초기값으로 설정
  //   setDraftStartDate(startDateFromUrl ? moment(startDateFromUrl) : null);
  //   setDraftEndDate(endDateFromUrl ? moment(endDateFromUrl) : null);
  //   setDraftSortOrder(sortOrderFromUrl);
  //   setIsDateModalOpen(true);
  // };

  // 초기화 (바깥 초기화 버튼만)
  const handleResetFilters = () => {
    router.push(pathname);
  };

  // URL이 변경될 때마다 UI 필터 상태(`jsonData`)를 동기화
  useEffect(() => {
    setJsonData({
      searchType: appliedFilters.searchType,
      searchKeyword: appliedFilters.searchKeyword,
      startDate: appliedFilters.startDate ? moment(appliedFilters.startDate) : null,
      endDate: appliedFilters.endDate ? moment(appliedFilters.endDate) : null,
      sortOrder: appliedFilters.sortOrder,
    });
  }, [searchParams]);

  // 다음 페이지 prefetch용 effect
  // useEffect(() => {
  //   if (paginatedData && !isPlaceholderData && appliedFilters.page < paginatedData.totalPages) {
  //     const nextPageFilters = { ...appliedFilters, page: appliedFilters.page + 1 };
  //     queryClient.prefetchQuery({
  //       queryKey: ['boardList', nextPageFilters],
  //       queryFn: () => getBoardList(nextPageFilters.page, nextPageFilters.pageSize, nextPageFilters),
  //       staleTime: 60 * 1000,
  //     });
  //   }
  // }, [paginatedData, isPlaceholderData, appliedFilters, queryClient]);

  // card section 스크롤 최상단 복귀
  useEffect(() => {
    if (cardWrapperRef.current) {
      cardWrapperRef.current.scrollTop = 0;
    }
  }, [termsToDisplay]);

  if (isError) {
    showSnackbar('통신 오류가 발생하였습니다.', 'error');
    return <Fail />;
  }

  return (
    <>
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

          <form className={styles.search_container} onSubmit={handleApplyFilters}>
            <Select
              name="searchType"
              value={jsonData.searchType}
              onChange={handleChange}
              options={searchOptions}
            />
            <SearchBar
              width={isLaptop || isMobile ? "100%" : ""}
              name="searchKeyword"
              value={jsonData.searchKeyword}
              placeholder="검색어를 입력하세요"
              onChange={handleChange}
            />
            <div title={"초기화"} className={styles.search_reset_box} onClick={handleResetFilters}>
              <MdOutlineReplay />
            </div>
            <div title={"필터 추가"} className={styles.search_reset_box} onClick={() => setIsDateModalOpen(true)}>
              <FilterAltIcon />
            </div>
          </form>
        </section>

        {
          !isMobile &&
            <section className={styles.table_wrapper}>
              <table className={styles.table}>
                <thead>
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>제목</th>
                </tr>
                </thead>
                <tbody>
                { isFetching ? (
                  <tr>
                    <td colSpan={6} className={styles.table_loading} >
                      <Loading type="circle" />
                    </td>
                  </tr>
                ) : termsToDisplay.length > 0 ? (
                  termsToDisplay.map((item: any) => (
                    <tr
                      key={item.idx.toString()}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRowClick(item.idx)}
                    >
                      <td>-</td>
                      <td>{item.idx.toString()}</td>
                      <td>{item.title || '제목 없음'}</td>
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
        }

        {
          isMobile &&
          <section ref={cardWrapperRef} className={styles.card_wrapper}>
            {
              isFetching ? <Loading type="circle" subTitle="로딩중..."/> :
              termsToDisplay.map((item: any, index: number) => (
                  <div key={index} className={styles.card}>
                    <ul className={styles.card_top_box}>
                      <li>{item.rn ? item.rn : '-'}</li>
                      <li className={styles.card_content}>{item.title}</li>
                    </ul>
                    <ul className={styles.card_bottom_box}>
                      <li className={styles.card_content}>ID: {item.id ? item.id : '-'}</li>
                      <li className={styles.card_content}>금액: 10,000원</li>
                      <li className={styles.card_content}>작성일: {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</li>
                      <li className={styles.card_content}>수정일: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</li>
                    </ul>
                    <button onClick={() => handleRowClick(item.idx)}><OpenInNewIcon /> 상세 보기</button>
                  </div>
                )
              )
            }
          </section>
        }

        <section className={styles.bottom_wrapper}>
          {/*{totalPages > 0 && (*/}
          {/*  <Pagination*/}
          {/*    currentPage={currentPage}*/}
          {/*    totalPages={totalPages}*/}
          {/*    onPageChange={handlePageChange}*/}
          {/*    totalItems={totalItems}*/}
          {/*    pageNumbersToShow={isMobile ? 3 : 5}*/}
          {/*  />*/}
          {/*)}*/}
          <Button
            text="글쓰기"
            variant="outlined"
            size="sm"
            color="grey"
            onClick={handleAddClick}
          />
        </section>
      </main>

      {isDateModalOpen && (
        <CommonModal
          modalTitle="필터 추가"
          onClose={() => setIsDateModalOpen(false)}
          buttons={[
            {
              text: '초기화',
              variant: 'outlined',
              color: 'grey',
              onClick: () => {
                setJsonData(prev => ({
                  ...prev,
                  startDate: null,
                  endDate: null,
                  sortOrder: 'desc',
                }));
              }
            },
            {
              text: '적용',
              variant: 'contained',
              color: 'primary',
              onClick: handleApplyFilters,
            }
          ]}
          width="400px"
          maxWidth="90%"
          height="350px"
        >
          <ul className={styles.content_container}>
            <li className={styles.modal_row}>
              <label className={styles.modal_label}>옵션</label>
              <RadioSet
                label="정렬"
                name="sortOrder"
                options={sortOptions}
                value={jsonData.sortOrder}
                onChange={(value) => setJsonData(prevState => ({
                  ...prevState, sortOrder: String(value) }))}
              />
            </li>
            <li className={styles.modal_row}>
              <label className={styles.modal_label}>작성일</label>
              <DateRangePicker
                width='100%'
                startDate={jsonData.startDate}
                endDate={jsonData.endDate}
                onStartDateChange={(date) => setJsonData(prev => ({ ...prev, startDate: date }))}
                onEndDateChange={(date) => setJsonData(prev => ({ ...prev, endDate: date }))}
              />
            </li>
          </ul>
        </CommonModal>
      )}
    </>
  );
}