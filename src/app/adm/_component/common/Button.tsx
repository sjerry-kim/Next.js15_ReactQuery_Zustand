'use client';

import styles from './Button.module.css';
import { CSSProperties } from 'react';
import {ButtonProps} from '@/types/components'

export default function Button({
  text,
  variant = 'contained',
  color = 'primary',
  width, // size보다 우선 적용
  height, // size보다 우선 적용
  size = 'md',
  disabled = false,
  ...props
}: ButtonProps) {

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[color],
    styles[size],
    disabled ? styles.disabled : '',
  ].join(' ');

  // width나 height prop이 존재하면 항상 적용
  const customStyle: CSSProperties = {};
  if (width) {
    customStyle.width = width;
  }
  if (height) {
    customStyle.height = height;
  }

  return (
    <button
      className={buttonClasses}
      style={customStyle} // 인라인 스타일이 CSS 클래스보다 우선 적용
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}