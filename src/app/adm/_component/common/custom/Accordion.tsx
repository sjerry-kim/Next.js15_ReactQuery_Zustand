'use client';

import React from 'react';
import styles from './Accordion.module.css';
import { AccordionProps } from '@/types/components';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Accordion({ id, title, children, isOpen, onToggle }: AccordionProps) {
  return (
    <div className={styles.accordion_wrapper}>
      <button type="button" className={styles.accordion_header} onClick={onToggle}>
        <span className={styles.accordion_title}>{title}</span>
        { isOpen ? <ExpandLess /> : <ExpandMore /> }
      </button>
      <div className={`${styles.accordion_content} ${isOpen ? styles.open : ''}`}>
        <div className={styles.content_padding}>
          {children}
        </div>
      </div>
    </div>
  );
}