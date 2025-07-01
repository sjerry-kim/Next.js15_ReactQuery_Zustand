'use client';

import { LuSearch } from 'react-icons/lu';
import styles from './SearchBar.module.css';
import {SearchBarProps} from '@/types/components'
import { CSSProperties } from 'react';

export default function SearchBar({ width, height, ...props }: SearchBarProps) {
  const wrapperStyle: CSSProperties = {};
  if (width) {
    wrapperStyle.width = width;
  }

  if (height) {
    wrapperStyle.height = height;
  }

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      <input {...props} />
      <button type="submit" title="검색">
        <LuSearch />
      </button>
    </div>
  );
}