'use client';

import styles from './Label.module.css';
import { LabelTextareaProps } from '@/types/components';

export default function LabelTextarea({
  label,
  required = false,
  showCharCount = false,
  className,
  maxLength,
  value,
  ...props
}: LabelTextareaProps) {

  const charCount = String(value || '').length;
  const textareaClassName = props.disabled ? styles.inputDisabled : "";

  return (
    <div className={styles.wrapper}>
      <label className={styles.label_box}>
        <div className={styles.label_text}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </div>
        {showCharCount && maxLength && (
          <span className={styles.char_count}>
            {charCount} / {maxLength}
          </span>
        )}
      </label>
      <textarea
        value={value}
        maxLength={maxLength}
        className={`${styles.textarea} ${textareaClassName} ${className || ''}`}
        {...props}
      />
    </div>
  );
}