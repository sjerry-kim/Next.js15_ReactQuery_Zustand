'use client';

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FilterState } from '@/adm/_component/dash/chart/TimelineFilterControls';
import styles from './CategoricalFilterControls.module.css';

interface WeekOption {
  value: number;
  label: string;
}

interface CategoricalFilterControlsProps {
  filters: FilterState;
  onFilterChange: (name: keyof FilterState, value: any) => void;
  yearOptions: number[];
  weekOptions: WeekOption[];
  // DatePicker 스타일 props는 custom 기간에만 필요
  commonDatePickerStyle: object;
  openPickerButtonStyle: object;
  openPickerIconStyle: object;
}

export default function CategoricalFilterControls({
  filters, onFilterChange, yearOptions, weekOptions,
  commonDatePickerStyle, openPickerButtonStyle, openPickerIconStyle,
}: CategoricalFilterControlsProps) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof FilterState, Number(value));
  };

  // 조회 단위에 따라 다른 필터를 return
  switch (filters.type) {
    case 'yearly':
      return (
        <select name="year" value={filters.year} className={styles.select} onChange={handleSelectChange}>
          {yearOptions.map(year => (<option key={year} value={year}>{year}년</option>))}
        </select>
      );
    case 'monthly':
      return (
        <>
          <select name="year" value={filters.year} className={styles.select} onChange={handleSelectChange}>
            {yearOptions.map(year => (<option key={year} value={year}>{year}년</option>))}
          </select>
          <select name="month" value={filters.month} className={styles.select} onChange={handleSelectChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}월</option>
            ))}
          </select>
        </>
      );
    case 'weekly':
      return (
        <>
          <select name="year" value={filters.year} className={styles.select} onChange={handleSelectChange}>
            {yearOptions.map(year => (<option key={year} value={year}>{year}년</option>))}
          </select>
          <select name="month" value={filters.month} className={styles.select} onChange={handleSelectChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}월</option>
            ))}
          </select>
          {/* 주차 선택 Select Box */}
          <select name="week" value={filters.week} className={styles.select} onChange={handleSelectChange} disabled={weekOptions.length === 0}>
            {weekOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </>
      );
    case 'custom':
      return (
        <div className={styles.datepicker_box}>
          <DatePicker
            value={filters.startDate}
            onChange={(val) => onFilterChange('startDate', val)}
            slotProps={{
              textField: { placeholder: '시작일 선택', ...commonDatePickerStyle } as any,
              openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
            }}
            desktopModeMediaQuery="@media (min-width: 0px)"
          />
          <span>~</span>
          <DatePicker
            value={filters.endDate}
            onChange={(val) => onFilterChange('endDate', val)}
            slotProps={{
              textField: { placeholder: '종료일 선택', ...commonDatePickerStyle } as any,
              openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
            }}
            desktopModeMediaQuery="@media (min-width: 0px)"
          />
        </div>
      );
    default: return null;
  }
}