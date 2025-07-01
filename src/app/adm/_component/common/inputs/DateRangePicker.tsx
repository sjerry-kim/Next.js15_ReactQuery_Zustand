'use client';

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './DateRangePicker.module.css';
import useWindowSize from '@/hooks/useWindowSize.';
import {DateRangePickerProps} from '@/types/components';

export default function DateRangePicker({
  datePikcerWidth,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {

  // 기존 컴포넌트에 있던 스타일 객체들을 여기로 가져옵니다.
  // isDesktop 같은 의존성도 이 컴포넌트 안에서 처리하여 독립적으로 만듭니다.
  const { isDesktop } = useWindowSize();

  const openPickerButtonStyle = {
    disableRipple: true,
    sx: { padding: 1, fontSize: '0.75rem', '&:hover': { backgroundColor: 'transparent' }, '&:focus': { backgroundColor: 'transparent' } },
  };
  const openPickerIconStyle = { sx: { fontSize: '0.55rem' } };
  const commonDatePickerStyle = {
    size: 'small', fullWidth: false, variant: 'outlined', inputProps: { readOnly: false }, InputLabelProps: { shrink: true },
    sx: {
      // width: isDesktop ? '110px' : '100%', border: '1px solid #D0D4DA', borderRadius: '0.375rem', padding: '1px 8px', backgroundColor: '#FFF',
      width: datePikcerWidth, border: '1px solid #D0D4DA', borderRadius: '0.375rem', padding: '1px 8px', backgroundColor: '#FFF',
      fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', backgroundImage: 'none', backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center', backgroundSize: '12px',
      '& input': { all: 'unset', width: '100%', fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', lineHeight: 1.625 },
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiOutlinedInput-root': { padding: 0 }, '& .MuiInputAdornment-root': { marginLeft: 0 },
    },
  };

  return (
    <div className={styles.wrapper}>
      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        slotProps={{
          textField: { placeholder: '시작일 선택', ...commonDatePickerStyle } as any,
          openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
        }}
        desktopModeMediaQuery="@media (min-width: 0px)"
      />
      <span>~</span>
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        slotProps={{
          textField: { placeholder: '종료일 선택', ...commonDatePickerStyle } as any,
          openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
        }}
        desktopModeMediaQuery="@media (min-width: 0px)"
      />
    </div>
  );
}