'use client';

import Checkbox from './Checkbox';
import styles from './Set.module.css';
import { CheckboxSetProps } from '@/types/components';

export default function CheckboxSet({
                                      label, options, value, onChange, direction = 'row'
                                    }: CheckboxSetProps) {
  const handleChange = (checkedValue: string | number) => {
    // 이미 선택된 값이면 배열에서 제거, 아니면 추가
    const newValues = value.includes(checkedValue)
      ? value.filter((v) => v !== checkedValue)
      : [...value, checkedValue];
    onChange(newValues);
  };

  return (
    <fieldset className={styles.wrapper}>
      <legend className={styles.label}>{label}</legend>
      <div className={`${styles.container} ${styles[direction]}`}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}