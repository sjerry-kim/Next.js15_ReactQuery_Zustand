"use client"

import { ReactNode } from 'react';
import './adm.css'
import styles from '@/adm/page.module.css';
import AdmLayout from '@/adm/_component/common/AdmLayout';


type Props = {
  children: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className={styles.container}>
      <AdmLayout>{children}</AdmLayout>
      {modal}
    </div>
  );
};