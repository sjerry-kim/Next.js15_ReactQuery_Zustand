'use client';

import { useState, FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import { ButtonProps } from '@/types/components';
import { SearchModalProps } from '@/types/modal';
import Select from '../custom/Select';
import SearchBar from '../inputs/SearchBar';
import Checkbox from '../custom/Checkbox';
import styles from './SearchModal.module.css';
import onInputsChange from '@/utils/onInputsChange';

// T - 제네릭 id가 pk인 모달에서 다룰 데이터
export default function SearchModal<T extends { id: number | string }>({
  modalTitle = "검색",
  selectedItems = [], // 부모에서 선택된 아이템
  multiSelect = false, // 다중 선택 가능 여부
  searchOptions,  // 검색 타입 select에 들어갈 옵션
  tableColumns,   // 결과 테이블의 컬럼 구조
  width,
  maxWidth = "90%",
  minWidth,
  height,
  maxHeight = "90%",
  minHeight,
  queryFn,        // 데이터를 실제로 가져오는 비동기 함수
  onApply,        // '적용' 버튼 클릭 시 선택된 데이터를 부모에게 전달하는 함수
  onClose,
}: SearchModalProps<T>) {
  // 사용자가 입력 중인 검색어와 타입을 저장하는 '임시' 상태
  const [searchFilter, setSearchFilter] = useState({
    type: searchOptions[0]?.value || '',
    keyword: '',
  });
  // '검색' 버튼을 눌렀을 때만 업데이트되는 '실제 적용된' 검색 조건 상태
  const [appliedFilter, setAppliedFilter] = useState({
    type: searchOptions[0]?.value || '',
    keyword: '',
  });
  const [currentSelectedItems, setCurrentSelectedItems] = useState<T[]>(selectedItems);
  const {handleChange} = onInputsChange(searchFilter, setSearchFilter);

  // 개별 체크박스 선택/해제를 처리
  const handleSelectChange = (item: T) => {
    setCurrentSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);

      console.log(multiSelect)

      // 다중 선택 모드
      if (multiSelect) {
        if (isSelected) {
          return prev.filter(selected => selected.id !== item.id); // 선택 해제
        } else {
          return [...prev, item]; // 선택 추가
        }
      }
      // 단일 선택 모드
      else {
        if (isSelected) {
          return []; // 이미 선택된 것을 다시 클릭하면 선택 해제
        } else {
          return [item]; // 새로운 것을 선택하면 기존 선택을 덮어쓰고(갈아치우고) 그것만 선택
        }
      }
    });
  };

  //'전체 선택' 체크박스를 처리
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCurrentSelectedItems(items || []);
    } else {
      setCurrentSelectedItems([]);
    }
  };

  // queryKey에 appliedFilter를 포함시켜, '적용된' 필터가 변경될 때마다 데이터를 새로고침
  const { data: items, isLoading } = useQuery<T[], Error>({
    queryKey: ['searchModalData', modalTitle, appliedFilter],
    queryFn: () => queryFn(appliedFilter), // 부모에게 받은 함수로 실제 API 호출
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // 임시 검색 조건을 실제 적용 필터로 복사. 이로 인해 useQuery가 다시 실행됨.
    setAppliedFilter(searchFilter);
  };

  const handleApply = () => {
    // if (currentSelectedItems.length > 0) {
      onApply(currentSelectedItems); // 부모에게 선택된 항목들의 배열(결과)을 전달
      onClose();              // 모달 닫기
    // } else {
    //   alert('항목을 선택해주세요.');
    // }
  };

  const modalButtons: ButtonProps[] = [
    {
      // text: `적용 (${currentSelectedItems.length})`, // 선택된 항목 수 표시
      text: `적용`,
      variant: 'contained',
      color: 'primary',
      onClick: handleApply,
      // disabled: currentSelectedItems.length === 0, // 선택된 항목이 없으면 비활성화 - 일단 주석 처리 - 선택 안해도 적용 가능
    },
  ];

  return (
    <CommonModal
      modalTitle={modalTitle}
      width={width}
      maxWidth={maxWidth}
      minWidth={minWidth}
      height={height}
      maxHeight={maxHeight}
      minHeight={minHeight}
      buttons={modalButtons}
      onClose={onClose}
    >
      <div className={styles.content_wrapper}>
        {/* 검색 UI */}
        <form className={styles.search_container} onSubmit={handleSearch}>
          <Select
            name="type"
            value={searchFilter.type}
            onChange={handleChange}
            options={searchOptions}
          />
          <SearchBar
            name="keyword"
            value={searchFilter.keyword}
            placeholder="검색어를 입력하세요"
            onChange={handleChange}
            width="100%"
          />
        </form>

        {/* 결과 테이블 */}
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
            <tr>
              {/* 전체 선택 체크박스 */}
              <th style={{ width: '50px' }}>
                {multiSelect ?
                  (<Checkbox
                    label=""
                    checked={items ? items.length > 0 && currentSelectedItems.length === items.length : false}
                    onChange={handleSelectAll}
                  />) : "선택"
                }
              </th>
              {/* 부모로부터 받은 컬럼 정의에 따라 헤더 렌더링 */}
              {tableColumns.map(col => <th key={String(col.key)}>{col.header}</th>)}
            </tr>
            </thead>
            <tbody>
            {isLoading ? (
              <tr><td colSpan={tableColumns.length + 1} className={styles.status_cell}>로딩중...</td></tr>
            ) : items && items.length > 0 ? (
              items.map((item) => (
                // 선택된 행에 하이라이트 스타일 적용
                <tr key={item.id} className={currentSelectedItems.some(s => s.id === item.id) ? styles.selected_row : ''}>
                  {/* 개별 선택 체크박스 */}
                  <td className={styles.checkbox_box}>
                    <Checkbox
                      label=""
                      checked={currentSelectedItems.some(s => s.id === item.id)}
                      onChange={() => handleSelectChange(item)}
                    />
                  </td>
                  {/* 부모로부터 받은 컬럼 정의에 따라 셀 렌더링 */}
                  {tableColumns.map(col => (
                    <td key={`${item.id}-${String(col.key)}`}>
                      {(item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={tableColumns.length + 1} className={styles.status_cell}>데이터가 없습니다.</td></tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </CommonModal>
  );
}