import { ComponentProps } from 'react';
import { Moment } from 'moment/moment';

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

/* Select */
type Option = {
  value: string | number;
  label: string;
};

export interface SelectProps extends ComponentProps<'select'> {
  options: Option[];
}

/* Input */
export interface SearchBarProps extends ComponentProps<'input'> {
  width?: string | number;
}

/* DatePicker*/
export interface DateRangePickerProps {
  startDate: Moment | null;
  endDate: Moment | null;
  onStartDateChange: (date: Moment | null) => void;
  onEndDateChange: (date: Moment | null) => void;
}