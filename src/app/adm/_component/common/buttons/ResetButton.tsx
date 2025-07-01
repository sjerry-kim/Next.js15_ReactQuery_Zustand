'use client';

import { MdOutlineReplay } from 'react-icons/md';
import styles from './ResetButton.module.css';
import {ResetButtonProps} from '@/types/components'

export default function ResetButton({ className, ...props }: ResetButtonProps) {
  return (
    <button
      title="필터 초기화"
      type="button"
      className={`${styles.button} ${className || ''}`}
      {...props}
    >
      <MdOutlineReplay />
    </button>
  );
}