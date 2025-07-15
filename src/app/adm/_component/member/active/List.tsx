'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { getBoardList } from '@/services/boardService';
import type { Board, PaginatedBoardResponse } from '@/types/board';
import Pagination from '@/adm/_component/common/Pagination';
import styles from "./List.module.css";
import useWindowSize from '@/hooks/useWindowSize.';
import onInputsChange from '@/utils/onInputsChange';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';
import Button from '@/adm/_component/common/buttons/Button';
import Select from '@/adm/_component/common/custom/Select';
import { Moment } from 'moment/moment';
import SingleDatePicker from '@/adm/_component/common/custom/SingleDatePicker';
import ResetButton from '@/adm/_component/common/buttons/ResetButton';
import CheckboxSet from '@/adm/_component/common/custom/CheckboxSet';
import RadioSet from '../../common/custom/RadioSet';
import SwitchSet from '@/adm/_component/common/custom/SwitchSet';
import { Option } from '@/types/components';
import SearchModal from '@/adm/_component/common/modals/SearchModal';
import moment from 'moment';
import Loading from '@/adm/_component/common/Loading';
import Fail from '@/adm/_component/common/Fail';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useSnackbar } from '@/hooks/useSnackbar';

/* ------ 🔽 검색&선택 결과 테스트용 임시 타입 ------ */
export interface Result {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
/* ------ 임시 타입 end ------ */

interface JsonData {
  searchType: string;
  searchKeyword: string;
  startDate: Moment | null;
  endDate: Moment | null;
  sortOrder: string;
  // 🔽 CheckboxSet, SwitchSet 테스트용 type들
  fruit: (string | number)[];
  alrm: (string | number)[];
}

export default function List() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
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
    // 🔽 CheckboxSet, SwitchSet 테스트용 key, value들
    fruit: searchParams.get('fruit')?.split(',') || [],
    alrm: searchParams.get('alrm')?.split(',') || [],
  };
  // UI 필터 상태를 담는 jsonData 변수
  const [jsonData, setJsonData] = useState<JsonData>({
    searchType: searchParams.get('searchType') || '',
    searchKeyword: searchParams.get('searchKeyword') || '',
    startDate: searchParams.get('startDate') ? moment(searchParams.get('startDate')) : null,
    endDate: searchParams.get('endDate') ? moment(searchParams.get('endDate')) : null,
    sortOrder: searchParams.get('sortOrder') || 'desc',
    // 🔽 CheckboxSet, SwitchSet 테스트용 key, value들
    fruit: searchParams.get('fruit')?.split(',') || [],
    alrm: searchParams.get('alrm')?.split(',') || [],
    // results: searchParams.get('results')?.split('') || []
  });
  // 🔽 검색&선택 결과 테스트용 변수
  // - jsonData에 담지 않은 이유 : 상태 관리 & 관심사 분리
  // - 모달을 통해서 상태가 변하기 때문에 useEffect로 상태 동기화 등이 필요 없음
  const [selectedResult, setSelectedResult] = useState<Result[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const searchOptions = [
    { value: "", label: "전체" },
    { value: "id", label: "게시물코드" },
    { value: "content", label: "내용" },
  ];
  const sortOptions: Option[] = [
    { label: '최신순', value: 'desc' },
    { label: '오래된순', value: 'asc' },
  ];
  // 🔽 CheckboxSet, SwitchSet 테스트용 Options 변수들
  const fruitOptions : Option[] = [
    { label: '사과', value: 'apple' },
    { label: '바나나', value: 'banana' },
    { label: '오렌지', value: 'orange' },
  ];
  const alrmOptions: Option[] = [
    { label: '이메일 알림', value: 'email' },
    { label: 'SMS 알림', value: 'sms' },
  ]
  const { isMobile } = useWindowSize();
  const {showSnackbar} = useSnackbar();
  const {handleChange} = onInputsChange(jsonData, setJsonData);

  const getPageFromUrl = useCallback(() => {
    const pageParam = searchParams.get('page');
    const page = parseInt(pageParam || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  const currentPage = getPageFromUrl();
  const queryKey = ['boardList', appliedFilters];

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery<PaginatedBoardResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getBoardList(appliedFilters.page, appliedFilters.pageSize, appliedFilters),
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

    // 기존 searchParams를 그대로 복사하여 사용
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // page 값만 새로운 번호로 설정하거나 변경
    newSearchParams.set('page', newPage.toString());

    // 필터는 유지하고 페이지만 변경
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [currentPage, pathname, router, searchParams]);

  // 상세 이동
  const handleRowClick = (itemId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const destination = `/adm/member/active/${itemId}?${newSearchParams.toString()}`;
    router.push(destination);
  };

  // 등록 이동
  const handleAddClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    const destination = `/adm/member/active/add?${newSearchParams.toString()}`;

    router.push(destination);
  };

  // 검색 모달용 ((임시)) api fetch용 핸들러 함수
  const handleGetResults = (filter: { type: string; keyword: string }): Promise<Result[]> => {
    // 여기에 실제 fetch 로직을 구현
    // const res = await fetch(`/api/users?type=${filter.type}&keyword=${filter.keyword}`);
    // return res.json();

    // 임시 목업 데이터 반환
    // @ts-ignore
    return [
      { id: 1, name: '홍길동', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 2, name: '김철수', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 3, name: '오나라', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 4, name: '도미노', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 5, name: '이재모', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 6, name: '심청이', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 7, name: '천우희', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
      { id: 8, name: '김제니', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
    ];
  }

  // 검색 결과 선택 사항 적용
  const handleApplySelected = (users: Result[]) => {
    setSelectedResult(users)
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

    // 🔽 CheckboxSet, SwitchSet 테스트용
    if (jsonData.fruit.length > 0) {
      newSearchParams.set('fruit', jsonData.fruit.join(','));
    }
    if (jsonData.alrm.length > 0) {
      newSearchParams.set('alrm', jsonData.alrm.join(','));
    }

    // 🔽 검색&선택 결과 테스트용 : id만 넣어서 줌
    const selectedResultsIds = selectedResult.map(user => user.id);

    if (selectedResultsIds.length > 0) {
      newSearchParams.set('results', selectedResultsIds.join(','));
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // 초기화
  const handleResetFilters = () => {
    setJsonData({
      searchType: '',
      searchKeyword: '',
      startDate: null,
      endDate: null,
      sortOrder: 'desc',
      fruit: [],
      alrm: [],
    });
    router.push(pathname);
  };

  // URL이 변경될 때마다 UI 필터 상태(`jsonData`)를 동기화
  useEffect(() => {
    setJsonData((prevState) => ({
      ...prevState,
      searchType: appliedFilters.searchType,
      searchKeyword: appliedFilters.searchKeyword,
      startDate: appliedFilters.startDate ? moment(appliedFilters.startDate) : null,
      endDate: appliedFilters.endDate ? moment(appliedFilters.endDate) : null,
      sortOrder: appliedFilters.sortOrder,
      fruit: appliedFilters.fruit,
      alrm: appliedFilters.alrm,
    }));
  }, [searchParams]);

  // 다음 페이지 prefetch용 effect
  useEffect(() => {
    if (paginatedData && !isPlaceholderData && appliedFilters.page < paginatedData.totalPages) {
      const nextPageFilters = { ...appliedFilters, page: appliedFilters.page + 1 };
      queryClient.prefetchQuery({
        queryKey: ['boardList', nextPageFilters],
        queryFn: () => getBoardList(nextPageFilters.page, nextPageFilters.pageSize, nextPageFilters),
        staleTime: 60 * 1000,
      });
    }
  }, [paginatedData, isPlaceholderData, jsonData, queryClient]);

  // card section 스크롤 최상단 복귀
  useEffect(() => {
    if (cardWrapperRef.current) {
      cardWrapperRef.current.scrollTop = 0;
    }
  }, [boardsToDisplay]);

  if (isError) {
    showSnackbar('통신 오류가 발생하였습니다.', 'error');
    return <Fail />;
  }

  return (
    <>
      <main>
        <section className={styles.top_wrapper}>
          {/* ------ filter_top_container (start) ------ */}
          <ul className={styles.filter_top_container}>
            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label className={styles.first_label}>옵션1</label>
                <div>
                  <CheckboxSet
                    label="좋아하는 과일"
                    options={fruitOptions}
                    value={jsonData.fruit}
                    onChange={(value) => setJsonData(prevState => ({
                      ...prevState, fruit: value }))}
                  />
                </div>
              </div>
            </li>

            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label>옵션2</label>
                <div>
                  <RadioSet
                    label="정렬"
                    name="sortOrder"
                    options={sortOptions}
                    value={jsonData.sortOrder}
                    onChange={(value) => setJsonData(prevState => ({
                      ...prevState, sortOrder: String(value) }))}
                  />
                </div>
              </div>
            </li>

            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label>옵션3</label>
                <div>
                  <SwitchSet
                    label="알림 설정"
                    options={alrmOptions}
                    value={jsonData.alrm}
                    onChange={(value) => setJsonData(prevState => ({
                      ...prevState, alrm: value }))}
                    direction="column"
                  />
                </div>
              </div>
            </li>

            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label>검색어</label>
                <div>
                    <Select
                      name="searchType"
                      value={jsonData.searchType}
                      onChange={handleChange}
                      options={searchOptions}
                    />
                  <input
                      width="100%"
                      height="100%"
                      name="searchKeyword"
                      value={jsonData.searchKeyword}
                      placeholder="검색어를 입력하세요"
                      onChange={handleChange}
                  />
                </div>
              </div>
            </li>

            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label className={styles.double_row_label}>기간1</label>
                <div className={styles.double_row_div}>
                  <SingleDatePicker
                    width="100%"
                    value={jsonData.startDate}
                    placeholder="시작일 선택"
                    onChange={(value) => setJsonData((prevState)=>({
                      ...prevState, startDate: value}))}
                    borderRight
                  />
                  <SingleDatePicker
                    width="100%"
                    value={jsonData.endDate}
                    placeholder="종료일 선택"
                    onChange={(value) => setJsonData((prevState)=>({
                      ...prevState, endDate: value}))}
                  />
                </div>
              </div>
              <div className={styles.filter_set}>
                <label className={isMobile ? "" : styles.middle_label}>정렬1</label>
                <div>
                  <button onClick={() => setIsSearchModalOpen(true)}>회원 검색</button>
                  {selectedResult.length > 0 && (
                    <div>
                      <p>선택된 회원: {selectedResult.map(user => user.name).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>

            <li className={styles.filter_row}>
              <div className={styles.filter_set}>
                <label className={isMobile? styles.double_row_label : styles.last_label}>기간2</label>
                <div className={styles.double_row_div}>
                  <SingleDatePicker
                    width="100%"
                    value={jsonData.startDate}
                    placeholder="시작일 선택"
                    onChange={(value) => setJsonData((prevState)=>({
                      ...prevState, startDate: value}))}
                    borderRight
                  />
                  <SingleDatePicker
                    width="100%"
                    value={jsonData.endDate}
                    placeholder="종료일 선택"
                    onChange={(value) => setJsonData((prevState)=>({
                      ...prevState, endDate: value}))}
                  />
                </div>
              </div>
              <div className={styles.filter_set}>
                <label className={isMobile ? styles.last_label : styles.middle_label}>정렬2</label>
                <div></div>
              </div>
            </li>
          </ul>
          {/* ------ filter_top_container (end) ------ */}

          <div className={styles.filter_bottom_container}>
            <div className={styles.status_box}>
              <ul className={styles.status_set}>
                <li>전체</li>
                <li>대기</li>
                <li>예약</li>
                <li>구매</li>
                <li>취소</li>
              </ul>
              <div className={styles.gradient_overlay}></div>
            </div>
            <div className={styles.btn_box}>
              <Button 
                text="검색"
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
              />
              <ResetButton onClick={handleResetFilters} />
            </div>
          </div>
        </section>

        {
          !isMobile &&
            <section className={styles.table_wrapper}>
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
                { isFetching ? (
                  <tr>
                    <td colSpan={6} className={styles.table_loading} >
                      <Loading type="circle" />
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
        }

        {
          isMobile &&
            <section ref={cardWrapperRef} className={styles.card_wrapper}>
              {
                isFetching ? <Loading type="circle" subTitle="로딩중..."/> :
                  boardsToDisplay.map((item: Board, index) => (
                  <div key={index} className={styles.card}>
                    <ul className={styles.card_top_box}>
                      <li>{item.rn}</li>
                      <li className={styles.card_content}>{item.content}</li>
                    </ul>
                    <ul className={styles.card_bottom_box}>
                      <li className={styles.card_content}>ID: {item.id}</li>
                      <li className={styles.card_content}>금액: 10,000원</li>
                      <li className={styles.card_content}>작성일: {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</li>
                      <li className={styles.card_content}>수정일: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</li>
                    </ul>
                    <button onClick={() => handleRowClick(item.id)}><OpenInNewIcon /> 상세 보기</button>
                  </div>
                )
                )
              }
            </section>
        }

        <section className={styles.bottom_wrapper}>
          {totalPages > 0 && (
            <Pagination
              currentPage={appliedFilters.page}
              totalPages={paginatedData?.totalPages || 0}
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

      {isSearchModalOpen && (
        <SearchModal
          modalTitle="회원 검색"
          width="600px"
          height="550px"
          multiSelect={true}
          selectedItems={selectedResult}
          searchOptions={[
            { value: 'name', label: '이름' },
            { value: 'email', label: '이메일' },
          ]}
          tableColumns={[
            { key: 'id', header: 'ID' },
            { key: 'name', header: '이름' },
            { key: 'email', header: '이메일' },
            { key: 'createdAt', header: '가입일'},
          ]}
          onClose={() => setIsSearchModalOpen(false)}
          onApply={handleApplySelected}
          queryFn={handleGetResults} // dataFetch 함수
        />
      )}
    </>
  );
}