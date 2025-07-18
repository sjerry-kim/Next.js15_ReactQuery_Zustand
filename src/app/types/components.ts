import React, { ComponentProps } from 'react';
import { Moment } from 'moment/moment';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TabsProps } from '@mui/material';

/* Option */
export type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

/* Button */
export interface ButtonProps extends ComponentProps<'button'> {
  text: string;
  variant?: 'outlined' | 'contained';
  color?: 'grey' | 'error' | 'white' | 'primary' | 'info' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  onClick?: () => void;
}

export interface ResetButtonProps extends ComponentProps<'button'> {}

/* Select */
export interface SelectProps extends ComponentProps<'select'> {
  options: Option[];
}

/* Input */
export interface SearchBarProps extends ComponentProps<'input'> {
  width?: string | number;
  height?: string | number;
}

export interface LabelInputProps extends ComponentProps<'input'> {
  label?: string;
  required?: boolean;
  showCharCount?: boolean;
  showLabel?: boolean;
  errorMessage?: string;
}

export interface LabelInputSetProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export interface RadioProps extends ComponentProps<'input'> {
  label: string;
}

export interface RadioSetProps {
  label: string;
  name: string;
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  direction?: 'row' | 'column';
}

export interface CheckboxProps extends ComponentProps<'input'> {
  label: string;
}

export interface CheckboxSetProps {
  label: string;
  options: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  direction?: 'row' | 'column';
}

export interface SwitchSetProps {
  label: string;
  options: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  direction?: 'row' | 'column';
}

/* Textarea */
export interface LabelTextareaProps extends ComponentProps<'textarea'> {
  label: string;
  required?: boolean;
  showCharCount?: boolean;
  errorMessage?: string;
}

/* DatePicker*/
export interface DateRangePickerProps {
  width: string | number;
  startDate: Moment | null;
  endDate: Moment | null;
  onStartDateChange: (date: Moment | null) => void;
  onEndDateChange: (date: Moment | null) => void;
}

export interface SingleDatePickerProps extends Omit<DatePickerProps<Moment>, 'value' | 'onChange' | 'slotProps'> {
  value: Moment | null;
  onChange: (date: Moment | null) => void;
  width?: string | number;
  borderRight?: boolean;
  borderLeft?: boolean;
  placeholder?: string;
}

/* Tab */
export interface TabItem {
  key: string;
  label: string;
}

export interface CustomTabsProps extends Omit<TabsProps, 'value' | 'onChange'> {
  tabs: TabItem[];
  activeTabKey: string;
  onTabChange: (key: string) => void;
  variant?: 'fullWidth' | 'scrollable'
}

/* Accordion */
export interface AccordionProps {
  id: string;                 // ✅ 어떤 아코디언인지 식별하기 위한 고유 ID
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;            // ✅ 부모로부터 열림 상태를 전달받음
  onToggle?: () => void;       // ✅ 헤더 클릭 시 부모에게 알릴 함수
}

export interface AccordionGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean; // 여러 개를 열 수 있는지 여부
  defaultOpenId?: string | string[]; // 처음부터 열려있을 아코디언 ID
}


/* Loading */
export interface LoadingProps {
  type?: 'line' | 'circle';
  circleSize?: number;
  title?: string;
  subTitle?: string;
}

/* Fail */
export interface FailProps {
  title?: string;
  subTitle?: string;
  height? : string | number;
  showButton?: boolean;
}