'use client';

import Radio from './Radio';
import styles from './Set.module.css';
import { RadioSetProps } from '@/types/components';

export default function RadioSet({
                                   label, name, options, value, onChange, direction = 'row'
                                 }: RadioSetProps) {
  return (
    <fieldset className={styles.wrapper}>
      <legend className={styles.label}>{label}</legend>
      <div className={`${styles.container} ${styles[direction]}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}