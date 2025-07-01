'use client';

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './SingleDatePicker.module.css';
import { SingleDatePickerProps } from '@/types/components';

export default function SingleDatePicker({
  value,
  onChange,
  width,
  borderRight,
  borderLeft,
  placeholder = '날짜 선택', // placeholder를 prop으로 받아 유연성 확보
  ...props // MUI DatePicker의 다른 props(ex: label, disabled)를 받을 수 있도록 처리
}: SingleDatePickerProps) {

  const openPickerButtonStyle = {
    disableRipple: true,
    sx: { padding: 1, fontSize: '0.75rem', '&:hover': { backgroundColor: 'transparent' }, '&:focus': { backgroundColor: 'transparent' } },
  };
  const openPickerIconStyle = { sx: { fontSize: '0.55rem' } };
  const commonDatePickerStyle = {
    size: 'small', fullWidth: false, variant: 'outlined', inputProps: { readOnly: false }, InputLabelProps: { shrink: true },
    sx: {
      display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      width: width, height: "100%",
      border: 'none', borderRight: borderRight && '1px solid #D0D4DA', borderLeft: borderLeft && '1px solid #D0D4DA',
      padding: '1px 8px', backgroundColor: '#FFF',
      fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', backgroundImage: 'none', backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center', backgroundSize: '12px',
      '& input': { all: 'unset', width: '100%', fontSize: '0.75rem', letterSpacing: '-0.35px', color: '#4b4b4b', lineHeight: 1.625 },
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '& .MuiOutlinedInput-root': {
        display: "flex", flexDirection: "row", justifyContent: "space-between", width: "98%", padding: 0 },
      '& .MuiInputAdornment-root': { marginLeft: 0 },
    },
  };

  return (
    <div className={styles.wrapper}>
      <DatePicker
        value={value}
        onChange={onChange}
        slotProps={{
          textField: { placeholder, ...commonDatePickerStyle } as any,
          openPickerButton: openPickerButtonStyle, openPickerIcon: openPickerIconStyle,
        }}
        desktopModeMediaQuery="@media (min-width: 0px)"
        {...props} // 나머지 props 전달
      />
    </div>
  );
}