'use client';

import React, { useState, useMemo, useEffect } from 'react';
import moment, { Moment } from 'moment';
import 'moment/locale/ko';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useWindowSize from '@/hooks/useWindowSize.';
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CommonModal from '@/adm/_component/common/CommonModal';
import { CommonModalButton } from '@/types/modal';
import FilterControls, { FilterState } from './FilterControls';
import styles from './Sales.module.css';

interface ChartFrameProps {
  title: string;
  children: (filters: FilterState) => React.ReactNode;
}

export default function ChartFrame({ title, children }: ChartFrameProps) {
  const yearOptions = useMemo(() => {
    const currentYear = moment().year();
    const years = [];
    for (let year = currentYear; year >= 2024; year--) {
      years.push(year);
    }
    return years;
  }, []);

  const initialFilters: FilterState = {
    type: 'monthly', year: moment().year(), month: moment().month() + 1, startDate: null, endDate: null,
  };

  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDesktop } = useWindowSize();

  const handleFilterChange = (name: keyof FilterState, value: any) => {
    setDraftFilters(prev => ({ ...prev, [name]: value }));
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

  const modalButtons: CommonModalButton[] = [{ text: '필터 적용', onClick: handleSearch, color: 'grey' }];

  useEffect(() => { setAppliedFilters(initialFilters); }, []);

  // --- 사용자님의 DatePicker 스타일 (그대로 복원) ---
  const openPickerButtonStyle = {
    disableRipple: true,
    sx: { padding: 1, fontSize: '0.75rem', '&:hover': { backgroundColor: 'transparent' }, '&:focus': { backgroundColor: 'transparent' } },
  };
  const openPickerIconStyle = { sx: { fontSize: '0.55rem' } };
  const commonDatePickerStyle = {
    size: 'small', fullWidth: false, variant: 'outlined', inputProps: { readOnly: false }, InputLabelProps: { shrink: true },
    sx: {
      width: isDesktop ? '105px' : '100%', border: '1px solid #D0D4DA', borderRadius: '0.375rem', padding: '1px 8px', backgroundColor: '#FFF',
      fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', backgroundImage: 'none', backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center', backgroundSize: '12px',
      '& input': { all: 'unset', width: '100%', fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', lineHeight: 1.625 },
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiOutlinedInput-root': { padding: 0 }, '& .MuiInputAdornment-root': { marginLeft: 0 },
    },
  };

  const filterControlsProps = {
    filters: draftFilters,
    onFilterChange: handleFilterChange,
    yearOptions: yearOptions,
    commonDatePickerStyle: commonDatePickerStyle,
    openPickerButtonStyle: openPickerButtonStyle,
    openPickerIconStyle: openPickerIconStyle,
  };

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
              <FilterControls {...filterControlsProps} />
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

      <div className={styles.chartWrapper}>
        {children(appliedFilters)}
      </div>

      { isModalOpen && (
        <CommonModal
          modalTitle="필터"
          buttons={modalButtons}
          width="400px" maxWidth="90%" height="350px"
          onClose={() => setIsModalOpen(false)}
        >
          <div className={styles.content_container}>
            <select name="type" className={styles.select} value={draftFilters.type} onChange={(e) => handleFilterChange('type', e.target.value as keyof FilterState)}>
              <option value="yearly">연도별 보기</option><option value="monthly">월별 보기</option><option value="weekly">주별 보기</option><option value="custom">기간 직접 선택</option>
            </select>
            <div className={styles.filter_bottom_box}>
              <FilterControls {...filterControlsProps} />
            </div>
          </div>
        </CommonModal>
      )}
    </LocalizationProvider>
  );
}