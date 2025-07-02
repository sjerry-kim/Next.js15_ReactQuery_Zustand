'use client';

import Switch from '@/adm/_component/common/custom/Switch';
import styles from './Set.module.css';
import { SwitchSetProps, Option } from '@/types/components';

// 나머지 코드는 이전 답변과 100% 동일합니다.
export default function SwitchSet({
  label,
  options,
  value,
  onChange,
  direction = 'row',
}: SwitchSetProps) {

  const handleChange = (checkedOption: Option) => {
    const isChecked = value.some(item => item.value === checkedOption.value);
    const newValues = isChecked
      ? value.filter((item) => item.value !== checkedOption.value)
      : [...value, checkedOption];

    onChange(newValues);
  };

  return (
    <fieldset className={styles.wrapper}>
      {/*<legend className={styles.label}>{label}</legend>*/}
      <div className={`${styles.container} ${styles[direction]}`}>
        {options.map((option) => (
          <div className={styles.switch_set_container} key={option.value}>
            <span className={styles.span}>{option.label}</span>
            <Switch
              checked={value.some(item => item.value === option.value)}
              onChange={() => handleChange(option)}
              disabled={option.disabled}
              name={String(option.value)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}