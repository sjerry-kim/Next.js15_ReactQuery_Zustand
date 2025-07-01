'use client';

import React, { useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useWindowSize from '@/hooks/useWindowSize.';
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CommonModal from '@/adm/_component/common/modal/CommonModal';
import { CommonModalButton } from '@/types/modal';
import TimelineFilterControls, { FilterState } from './TimelineFilterControls';
import CategoricalFilterControls from './CategoricalFilterControls';
import styles from './ChartFrame.module.css';

interface ChartFrameProps {
  title: string;
  children: (appliedFilters: FilterState) => React.ReactNode;
  filterUIType: 'timeline' | 'categorical'; // 필터 UI의 종류를 부모로부터 받음
  masterData: {
    date: string;
    sales?: number;
    ageGroup?: string;
  }[];
}

export default function ChartFrame({ title, children, filterUIType }: ChartFrameProps) {
  const yearOptions = useMemo(() => {
    const currentYear = moment().year();
    const years = [];
    for (let year = currentYear; year >= 2024; year--) {
      years.push(year);
    }
    return years;
  }, []);
  const initialFilters: FilterState = { // 필터 기본값
    type: 'monthly', year: moment().year(), month: moment().month() + 1, week: 1, 
    startDate: null, endDate: null,
  };
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters); // 적용 전 필터
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters); // 적용 필터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDesktop } = useWindowSize();
  /* mui datepicker 커스텀 */
  const openPickerButtonStyle = {
    disableRipple: true,
    sx: { padding: 1, fontSize: '0.75rem', '&:hover': { backgroundColor: 'transparent' }, '&:focus': { backgroundColor: 'transparent' } },
  };
  const openPickerIconStyle = { sx: { fontSize: '0.55rem' } };
  const commonDatePickerStyle = {
    size: 'small', fullWidth: false, variant: 'outlined', inputProps: { readOnly: false }, InputLabelProps: { shrink: true },
    sx: {
      width: isDesktop ? '110px' : '100%', border: '1px solid #D0D4DA', borderRadius: '0.375rem', padding: '1px 8px', backgroundColor: '#FFF',
      fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', backgroundImage: 'none', backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center', backgroundSize: '12px',
      '& input': { all: 'unset', width: '100%', fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', lineHeight: 1.625 },
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiOutlinedInput-root': { padding: 0 }, '& .MuiInputAdornment-root': { marginLeft: 0 },
    },
  };

  // '주별 보기' 옵션 계산 (CategoricalFilterControls만 해당됨)
  const weekOptions = useMemo(() => {
    const targetYear = draftFilters.year;
    const targetMonth = draftFilters.month;
    const startOfMonth = moment({ year: targetYear, month: targetMonth - 1, day: 1 });
    const endOfMonth = moment(startOfMonth).endOf('month');
    const weeks = [];
    let currentWeek = 1;
    let currentDay = moment(startOfMonth);

    while(currentDay.isSameOrBefore(endOfMonth)) {
      weeks.push({ value: currentWeek, label: `${currentWeek}주차` });
      currentDay.add(7, 'days');
      currentWeek++;
    }
    return weeks;
  }, [draftFilters.year, draftFilters.month]);

  const handleFilterChange = (name: keyof FilterState, value: any) => {
    // select에서 오는 value는 숫자여야 하므로 변환
    const parsedValue = (name === 'year' || name === 'month' || name === 'week') ? Number(value) : value;
    setDraftFilters(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSearch = () => {
    setAppliedFilters(draftFilters);
    if (isModalOpen) setIsModalOpen(false);
  };
  
  const handleReset = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };
  const handleModalOpen = () => {
    setDraftFilters(appliedFilters);
    setIsModalOpen(true);
  };

  const modalButtons: CommonModalButton[] = [{ text: '필터 적용', onClick: handleSearch, variant: "outlined", color: 'grey' }];

  // filterControls 컴포넌트들에 내려줄 props
  const filterControlsProps = {
    filters: draftFilters,
    onFilterChange: handleFilterChange,
    yearOptions: yearOptions,
    weekOptions: weekOptions,
    commonDatePickerStyle: commonDatePickerStyle,
    openPickerButtonStyle: openPickerButtonStyle,
    openPickerIconStyle: openPickerIconStyle,
  };

  // 타임라인이 있는 차트(ex-꺾은선, 막대그래프 등)와 없는 차트(ex-파이, 도넛차트)를 구분
  // filterUIType을 부모로부터 전달받음: tileline | categorical
  const renderCorrectFilters = () => {
    if (filterUIType === 'timeline') {
      return <TimelineFilterControls {...filterControlsProps} />;
    }
    if (filterUIType === 'categorical') {
      return <CategoricalFilterControls {...filterControlsProps} />;
    }
    return null;
  };

  useEffect(() => { setAppliedFilters(initialFilters); }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
      <div className={styles.chart_top_wrapper}>
        <h4>{title}</h4>
        <div className={styles.filter_container}>
          { isDesktop ? (
            <>
              <select name="type" className={styles.select} value={draftFilters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="yearly">연도별 보기</option><option value="monthly">월별 보기</option><option value="weekly">주별 보기</option><option value="custom">기간 직접 선택</option>
              </select>
              {renderCorrectFilters()}
              <div title={"필터 적용"} className={styles.filter_btn} onClick={handleSearch}><LuSearch /></div>
              <div title={"필터 초기화"} className={styles.filter_btn} onClick={handleReset}><MdOutlineReplay /></div>
            </>
          ) : (
            <>
              <button title={"필터"} className={styles.filter_btn} onClick={handleModalOpen}><FilterAltIcon /></button>
              <div title={"필터 초기화"} className={styles.filter_btn} onClick={handleReset}><MdOutlineReplay /></div>
            </>
          )}
        </div>
      </div>

      <div className={styles.chart_wrapper}>
        {children(appliedFilters)}
      </div>

      { isModalOpen && (
        <CommonModal
          modalTitle="필터"
          buttons={modalButtons}
          width="400px"
          maxWidth="90%"
          height="350px"
          onClose={() => setIsModalOpen(false)}
        >
          <div className={styles.content_container}>
            <select name="type" className={styles.select} value={draftFilters.type} onChange={(e) => handleFilterChange('type', e.target.value as keyof FilterState)}>
              <option value="yearly">연도별 보기</option>
              <option value="monthly">월별 보기</option>
              <option value="weekly">주별 보기</option>
              <option value="custom">기간 직접 선택</option>
            </select>
            <div className={styles.filter_bottom_box}>
              {renderCorrectFilters()}
            </div>
          </div>
        </CommonModal>
      )}
    </LocalizationProvider>
  );
}