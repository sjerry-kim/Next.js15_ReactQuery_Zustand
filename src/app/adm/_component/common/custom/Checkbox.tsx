'use client';

import styles from './Checkbox.module.css';
import { CheckboxProps } from '@/types/components';

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.customCheckbox}>
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
      </span>
      {label && <span className={styles.span}>{label}</span>}
    </label>
  );
}