'use client';

import styles from './Radio.module.css';
import { RadioProps } from '@/types/components';

export default function Radio({ label, ...props }: RadioProps) {
  return (
    <label className={styles.label}>
      <input type="radio" className={styles.input} {...props} />
      <span className={styles.customRadio}></span>
      <span>{label}</span>
    </label>
  );
}