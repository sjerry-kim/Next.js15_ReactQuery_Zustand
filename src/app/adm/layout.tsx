"use client"

import { ReactNode } from 'react';
import styles from '@/adm/page.module.css';
import AdmLayout from '@/adm/_component/common/AdmLayout';


type Props = {
  children: ReactNode;
  nav: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, nav, modal }: Props) {
  return (
    <div className={styles.container}>
      {/*{nav}*/}
      <AdmLayout>{children}</AdmLayout>

      {modal}
      {/*{children}*/}
    </div>
  );
}
