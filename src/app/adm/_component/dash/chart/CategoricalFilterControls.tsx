'use client';

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FilterState } from '@/adm/_component/dash/chart/TimelineFilterControls';
import styles from './CategoricalFilterControls.module.css';
import Select from '@/adm/_component/common/inputs/Select';
import DateRangePicker from '@/adm/_component/common/inputs/DateRangePicker'; // 1. Select 컴포넌트 import

interface WeekOption {
  value: number;
  label: string;
}

interface CategoricalFilterControlsProps {
  filters: FilterState;
  onFilterChange: (name: keyof FilterState, value: any) => void;
  yearOptions: number[];
  weekOptions: WeekOption[];
  // commonDatePickerStyle: object;
  // openPickerButtonStyle: object;
  // openPickerIconStyle: object;
}

export default function CategoricalFilterControls({
  filters, onFilterChange, yearOptions, weekOptions,
  // commonDatePickerStyle, openPickerButtonStyle, openPickerIconStyle,
}: CategoricalFilterControlsProps) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof FilterState, Number(value));
  };

  // 2. Select에 전달할 options 배열들을 미리 생성합니다.
  const yearSelectOptions = yearOptions.map(year => ({ value: year, label: `${year}년` }));
  const monthSelectOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));
  // weekOptions는 이미 { value, label } 형태이므로 그대로 사용합니다.

  // 조회 단위에 따라 다른 필터를 return
  switch (filters.type) {
    case 'yearly':
      return (
        // 3. 기존 select를 Select 컴포넌트로 교체합니다.
        <Select
          name="year"
          value={filters.year}
          className={styles.select}
          onChange={handleSelectChange}
          options={yearSelectOptions}
        />
      );
    case 'monthly':
      return (
        <>
          <Select
            name="year"
            value={filters.year}
            className={styles.select}
            onChange={handleSelectChange}
            options={yearSelectOptions}
          />
          <Select
            name="month"
            value={filters.month}
            className={styles.select}
            onChange={handleSelectChange}
            options={monthSelectOptions}
          />
        </>
      );
    case 'weekly':
      return (
        <>
          <Select
            name="year"
            value={filters.year}
            className={styles.select}
            onChange={handleSelectChange}
            options={yearSelectOptions}
          />
          <Select
            name="month"
            value={filters.month}
            className={styles.select}
            onChange={handleSelectChange}
            options={monthSelectOptions}
          />
          <Select
            name="week"
            value={filters.week}
            className={styles.select}
            onChange={handleSelectChange}
            disabled={weekOptions.length === 0}
            options={weekOptions}
          />
        </>
      );
    case 'custom':
      return (
        // <div className={styles.datepicker_box}>
        //   <DatePicker
        //     value={filters.startDate}
        //     onChange={(val) => onFilterChange('startDate', val)}
        //     slotProps={{
        //       textField: { placeholder: '시작일 선택', ...commonDatePickerStyle } as any,
        //       openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
        //     }}
        //     desktopModeMediaQuery="@media (min-width: 0px)"
        //   />
        //   <span>~</span>
        //   <DatePicker
        //     value={filters.endDate}
        //     onChange={(val) => onFilterChange('endDate', val)}
        //     slotProps={{
        //       textField: { placeholder: '종료일 선택', ...commonDatePickerStyle } as any,
        //       openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
        //     }}
        //     desktopModeMediaQuery="@media (min-width: 0px)"
        //   />
        // </div>
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(val) => onFilterChange('startDate', val)}
          onEndDateChange={(val) => onFilterChange('endDate', val)}
        />
      );
    default: return null;
  }
}