'use client';

import { SelectProps } from '@/types/components'

export default function Select({ options, ...props }: SelectProps) {
  return (
    <select {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}