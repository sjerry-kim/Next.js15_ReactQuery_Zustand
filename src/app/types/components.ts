import { ComponentProps } from 'react';
import { Moment } from 'moment/moment';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';

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
  height?: string | number;
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