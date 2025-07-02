'use client';

import styles from './Label.module.css';
import { LabelInputProps } from '@/types/components';

export default function LabelInput({
  label,
  required = false,
  showCharCount = false,
  showLabel = true,
  className,
  maxLength,
  value,
  ...props
}: LabelInputProps) {

  const charCount = String(value || '').length;
  const inputClassName = props.disabled ? styles.inputDisabled : styles.input;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label_box}>
        <div className={styles.label_text}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </div>
        {/* showCharCount와 maxLength가 모두 있을 때만 글자 수를 표시 */}
        {(showCharCount && maxLength && showLabel) && (
          <span className={styles.char_count}>
            {charCount} / {maxLength}
          </span>
        )}
      </label>
      <input
        value={value}
        maxLength={maxLength}
        className={`${inputClassName} ${className || ''}`}
        {...props}
      />
    </div>
  );
}