'use client';

import React from 'react';
import { Moment } from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './Sales.module.css';

export interface FilterState {
  type: string;
  year: number;
  month: number;
  startDate: Moment | null;
  endDate: Moment | null;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (name: keyof FilterState, value: any) => void;
  yearOptions: number[];
  commonDatePickerStyle: object;
  openPickerButtonStyle: object;
  openPickerIconStyle: object;
}

export default function FilterControls({
                                         filters, onFilterChange, yearOptions,
                                         commonDatePickerStyle, openPickerButtonStyle, openPickerIconStyle,
                                       }: FilterControlsProps) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof FilterState, Number(value));
  };

  switch (filters.type) {
    case 'yearly': return null;
    case 'monthly':
      return (
        <select name="year" value={filters.year} className={styles.select} onChange={handleSelectChange}>
          {yearOptions.map(year => (<option key={year} value={year}>{year}년</option>))}
        </select>
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
          />
          <span>~</span>
          <DatePicker
            value={filters.endDate}
            onChange={(val) => onFilterChange('endDate', val)}
            slotProps={{
              textField: { placeholder: '종료일 선택', ...commonDatePickerStyle } as any,
              openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
            }}
          />
        </div>
      );
    default: return null;
  }
}