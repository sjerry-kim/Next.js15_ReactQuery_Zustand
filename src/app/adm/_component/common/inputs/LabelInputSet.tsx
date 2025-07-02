'use client';

import React from 'react';
import styles from './LabelInputSet.module.css';
import {LabelInputSetProps} from '@/types/components';

export default function LabelInputSet({ label, children, className }: LabelInputSetProps) {
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <label className={styles.label}>{label}</label>
      <div className={styles.content_set}>
        {children}
      </div>
    </div>
  );
}