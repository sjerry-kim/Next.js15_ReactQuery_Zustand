'use client';

import styles from './MenuModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useEffect, useState } from 'react';

interface Tab {
  key: string;
  label: string;
}

interface ModalProps {
  modalTitle?: string;
  submitText?: string;
  showSubmit?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  children: ReactNode;
  tabs: Tab[];                     // 사이드 탭으로 쓸 데이터
  defaultTabKey?: string;
  onTabChange?: (key: string) => void;
}

export default function MenuModal({
  modalTitle = "",
  submitText = '확인',
  showSubmit = true,
  onClose,
  onSubmit,
  children,
  tabs,
  defaultTabKey,
  onTabChange,
}: ModalProps) {
  const [activeKey, setActiveKey] = useState(defaultTabKey || tabs[0]?.key);

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  useEffect(() => {
    console.log(activeKey);
  }, [activeKey]);

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.middle_container}>
          <ul className={styles.sidebar}>
            {tabs.map((tab) => (
              <li
                key={tab.key}
                className={activeKey === tab.key ? styles.active : styles.inactive}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
          <div className={styles.content_box}>
            {children}
          </div>
        </div>
        {showSubmit && (
          <div className={styles.bottom_container}>
            <button className={styles.submit_btn} onClick={onSubmit}>
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
