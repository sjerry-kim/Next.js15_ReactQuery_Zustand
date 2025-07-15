'use client';

import Checkbox from './Checkbox';
import styles from './Set.module.css';
import { CheckboxSetProps, Option } from '@/types/components';

export default function CheckboxSet({
  label, options, value, onChange, direction = 'row'
}: CheckboxSetProps) {
  const handleChange = (checkedOptionValue: string | number) => {
    // 이미 선택되었는지 확인
    const isChecked = value.includes(checkedOptionValue);
    const newValues = isChecked
      ? value.filter((itemValue) => itemValue !== checkedOptionValue)
      : [...value, checkedOptionValue];

    onChange(newValues);
  };

  return (
    <fieldset className={styles.wrapper}>
      {/*<legend className={styles.label}>{label}</legend>*/}
      <div className={`${styles.container} ${styles[direction]}`}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={String(option.value)}
            checked={value.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}