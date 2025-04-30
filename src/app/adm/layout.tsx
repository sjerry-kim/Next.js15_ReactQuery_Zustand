import { ReactNode } from 'react';
import styles from '@/adm/page.module.css';

type Props = {
  children: ReactNode;
  nav: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, nav, modal }: Props) {
  return (
    <div className={styles.container}>
      {nav}
      {modal}
      {children}
    </div>
  );
}
