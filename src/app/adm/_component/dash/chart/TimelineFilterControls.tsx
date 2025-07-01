'use client';

import React from 'react';
import { Moment } from 'moment';
import styles from './TimelineFilterControls.module.css';
import Select from '@/adm/_component/common/inputs/Select';
import DateRangePicker from '@/adm/_component/common/inputs/DateRangePicker';
import useWindowSize from '@/hooks/useWindowSize.';

export interface FilterState {
  type: string;
  year: number;
  month: number;
  week: number;
  startDate: Moment | null;
  endDate: Moment | null;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (name: keyof FilterState, value: any) => void;
  yearOptions: number[];
  // commonDatePickerStyle: object;
  // openPickerButtonStyle: object;
  // openPickerIconStyle: object;
}

export default function TimelineFilterControls({
  filters, onFilterChange, yearOptions,
  // commonDatePickerStyle, openPickerButtonStyle, openPickerIconStyle,
}: FilterControlsProps) {
  const { isDesktop } = useWindowSize();
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof FilterState, Number(value));
  };

  const yearSelectOptions = yearOptions.map(year => ({ value: year, label: `${year}년` }));
  const monthSelectOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));

  // 조회 단위에 따라 다른 필터를 return
  switch (filters.type) {
    case 'yearly': return null;
    case 'monthly':
      return (
        <Select
          name="year"
          value={filters.year}
          className={styles.select}
          onChange={handleSelectChange}
          options={yearSelectOptions}
        />
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
          width={isDesktop ? '110px' : '100%'}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(val) => onFilterChange('startDate', val)}
          onEndDateChange={(val) => onFilterChange('endDate', val)}
        />
      );
    default: return null;
  }
}