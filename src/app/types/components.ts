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
  color?: 'grey' | 'danger' | 'white' | 'primary' | 'info' | 'warn' | 'success';
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
  value: Option | null;
  onChange: (value: Option | null) => void;
  direction?: 'row' | 'column';
}

export interface CheckboxProps extends ComponentProps<'input'> {
  label: string;
}

export interface CheckboxSetProps {
  label: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  direction?: 'row' | 'column';
}

export interface SwitchSetProps {
  label: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  direction?: 'row' | 'column';
}

/* Textarea */
export interface LabelTextareaProps extends ComponentProps<'textarea'> {
  label: string;
  required?: boolean;
  showCharCount?: boolean;
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
}