'use client';

// import Switch from '@mui/material/Switch'; // ❌ 기존 MUI import를 제거하고
import Switch from '../mui/Switch'; // ✅ 우리가 만든 커스텀 Switch를 import 합니다.

import FormControlLabel from '@mui/material/FormControlLabel';
import styles from './Set.module.css';
import { SwitchSetProps } from '@/types/components';

// 나머지 코드는 이전 답변과 100% 동일합니다.
export default function SwitchSet({
                                    label,
                                    options,
                                    value,
                                    onChange,
                                    direction = 'row',
                                  }: SwitchSetProps) {

  const handleChange = (checkedValue: string | number) => {
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
          <FormControlLabel
            key={option.value}
            control={
              <Switch
                checked={value.includes(option.value)}
                onChange={() => handleChange(option.value)}
                disabled={option.disabled}
                name={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </div>
    </fieldset>
  );
}