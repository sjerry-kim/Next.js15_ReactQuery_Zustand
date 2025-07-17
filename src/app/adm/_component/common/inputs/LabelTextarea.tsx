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
  errorMessage,
  ...props
}: LabelTextareaProps) {

  const charCount = String(value || '').length;
  const textareaClassName = `${styles.textarea} ${props.disabled ? styles.inputDisabled : ''} ${errorMessage ? styles.input_error : ''}`;

  return (
    <div className={`${styles.wrapper} ${errorMessage ? styles.error_state : ''}`}>
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
      {errorMessage && <p className={styles.error_message}>{errorMessage}</p>}
    </div>
  );
}