'use client';

import Switch from '@/adm/_component/common/custom/Switch';
import styles from './Set.module.css';
import { SwitchSetProps, Option } from '@/types/components';

export default function SwitchSet({
  label,
  options,
  value, // 배열 값으로 주고받음
  onChange,
  direction = 'row',
}: SwitchSetProps) {

  const handleChange = (checkedOptionValue: string | number) => {
    // 현재 값 배열에 체크된 옵션의 값이 포함되어 있는지 확인
    const isChecked = value.includes(checkedOptionValue);

    // 포함되어 있다면 해당 값을 배열에서 제거, 없다면 추가
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
          <div className={styles.switch_set_container} key={option.value}>
            <span className={styles.span}>{option.label}</span>
            <Switch
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
              disabled={option.disabled}
              name={String(option.value)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}