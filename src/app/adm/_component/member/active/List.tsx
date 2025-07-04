'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { getBoardList } from '@/services/boardService';
import type { Board, PaginatedBoardResponse } from '@/types/board';
import Pagination from '@/adm/_component/common/Pagination';
import styles from "./List.module.css";
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import useWindowSize from '@/hooks/useWindowSize.';
import onInputsChange from '@/utils/onInputsChange';
import { ITEMS_PER_PAGE } from '@/_constant/pagination';
import Button from '@/adm/_component/common/buttons/Button';
import Select from '@/adm/_component/common/custom/Select';
import SearchBar from '@/adm/_component/common/inputs/SearchBar';
import DateRangePicker from '@/adm/_component/common/custom/DateRangePicker';
import { Moment } from 'moment/moment';
import SingleDatePicker from '@/adm/_component/common/custom/SingleDatePicker';
import ResetButton from '@/adm/_component/common/buttons/ResetButton';
import Checkbox from '@/adm/_component/common/custom/Checkbox';
import CheckboxSet from '@/adm/_component/common/custom/CheckboxSet';
import RadioSet from '../../common/custom/RadioSet';
import SwitchSet from '@/adm/_component/common/custom/SwitchSet';
import { Option } from '@/types/components';
import SearchModal from '@/adm/_component/common/modals/SearchModal';
import moment from 'moment';
import { useConfirm } from '@/hooks/useConfirm';
import { useSnackbar } from '@/hooks/useSnackbar';
import Loading from '@/adm/_component/common/Loading';
// import MenuModal from '@/adm/_component/common/MenuModal';

/* ------ 임시 타입, 함수 등 start ------ */
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

async function searchUsers(filter: { type: string; keyword: string }): Promise<User[]> {
  // console.log('Searching users with filter:', filter);
  // 여기에 실제 fetch 로직을 구현합니다.
  // const res = await fetch(`/api/users?type=${filter.type}&keyword=${filter.keyword}`);
  // return res.json();

  // 임시 목업 데이터 반환
  return [
    { id: 1, name: '홍길동', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 2, name: '김철수', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 3, name: '홍길동', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 4, name: '김철수', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 5, name: '홍길동', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 6, name: '김철수', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 7, name: '홍길동', email: 'hong@example.com', createdAt: moment().format("YYYY.MM.DD")},
    { id: 8, name: '김철수', email: 'kim@example.com', createdAt: moment().format("YYYY.MM.DD")},
  ];
}

/* ------ 임시 타입, 함수 등 end ------ */

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
  const [draftStartDate, setDraftStartDate] = useState<Moment | null>(null);
  const [draftEndDate, setDraftEndDate] = useState<Moment | null>(null);
  const queryClient = useQueryClient();
  const {handleChange} = onInputsChange(jsonData, setJsonData);
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
    const destination = `/adm/member/active/${itemId}?${newSearchParams.toString()}`;
    router.push(destination);
  };

  const handleAddClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    // todo 임시로 board 경로로 넣어둠 추후 변경 필요
    const destination = `/adm/board/add?${newSearchParams.toString()}`;

    console.log(destination);
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

  /* ----- Text Start ----- */

  // checkbox, radio, switch 등
  const fruitOptions : Option[] = [
    { label: '사과', value: 'apple' },
    { label: '바나나', value: 'banana' },
    { label: '오렌지', value: 'orange' },
  ];
  const sortOptions: Option[] = [
    { label: '최신순', value: 'desc' },
    { label: '오래된순', value: 'asc' },
  ];
  const settingOptions: Option[] = [
    { label: '이메일 알림', value: 'email' },
    { label: 'SMS 알림', value: 'sms' },
  ]
  const [selectedFruits, setSelectedFruits] = useState<Option[]>([
    { label: '사과', value: 'apple' }
  ]);
  const [sortOrder, setSortOrder] = useState<Option | null>(sortOptions[0]);
  const [settings, setSettings] = useState<Option[] | []>([{ label: '이메일 알림', value: 'email' },]);

  // useEffect(()=>{
  //   console.log(selectedFruits);
  // }, [selectedFruits])
  //
  // useEffect(()=>{
  //   console.log(sortOrder);
  // }, [sortOrder])
  //
  // useEffect(()=>{
  //   console.log(settings);
  // }, [settings])

  // search modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleApplyUsers = (users: User[]) => {
    // console.log('적용된 유저들:', users);
    setSelectedUsers(users);
  };

  // ConfirmModal
  const openConfirm = useConfirm();
  const handleTempAlert = async () => {
    const userConfirmed = await openConfirm({
      title: "정말 탈퇴하시겠습니까?",
      message: "모든 데이터가 영구적으로 삭제됩니다.",
    });

    if (userConfirmed) {
      console.log("탈퇴 처리 API 호출!");
    } else {
      console.log("탈퇴 작업을 취소했습니다.");
    }
  }

  // Snackbar
  const { showSnackbar } = useSnackbar();
  const handleTempSnackbar = () => {
    showSnackbar('성공적으로 저장되었습니다.', 'success')
    showSnackbar('경고 저장되었습니다.', 'warning')
    showSnackbar('에러 저장되었습니다.', 'error')
    showSnackbar('알림 저장되었습니다.', 'info')
  }

  /* ----- Text End ----- */

  if (isError) {
    // todo 에러처리
    alert(`에러가 발생하였습니다: ${error.message}. 관리자에게 문의하세요.`);
    return <div>데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</div>;
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
                    value={selectedFruits}
                    onChange={setSelectedFruits}
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
                    value={sortOrder}
                    onChange={setSortOrder}
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
                    options={settingOptions}
                    value={settings}
                    onChange={setSettings}
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
                    value={draftStartDate}
                    placeholder="시작일 선택"
                    onChange={setDraftStartDate}
                    borderRight
                  />
                  <SingleDatePicker
                    width="100%"
                    value={draftEndDate}
                    placeholder="종료일 선택"
                    onChange={setDraftEndDate}
                  />
                </div>
              </div>
              <div className={styles.filter_set}>
                <label className={isMobile ? "" : styles.middle_label}>정렬1</label>
                <div>
                  <button onClick={() => setIsModalOpen(true)}>회원 검색</button>
                  {selectedUsers.length > 0 && (
                    <div>
                      <p>선택된 회원: {selectedUsers.map(u => u.name).join(', ')}</p>
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
                    value={draftStartDate}
                    placeholder="시작일 선택"
                    onChange={setDraftStartDate}
                    borderRight
                  />
                  <SingleDatePicker
                    width="100%"
                    value={draftEndDate}
                    placeholder="종료일 선택"
                    onChange={setDraftEndDate}
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
                <li onClick={handleTempAlert}>전체</li>
                <li onClick={handleTempSnackbar}>대기</li>
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
              />
              <ResetButton />
            </div>
          </div>
        </section>

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

      {isModalOpen && (
        <SearchModal
          modalTitle="회원 검색"
          width="600px"
          height="550px"
          // multiSelect={true}
          selectedItems={selectedUsers}
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
          onClose={() => setIsModalOpen(false)}
          onApply={handleApplyUsers}
          queryFn={searchUsers} // dataFetch 함수
        />
      )}
    </>
  );
}