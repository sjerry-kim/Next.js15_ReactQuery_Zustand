'use client';

import styles from './CommonModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

interface ModalProps {
  modalTitle?: string;
  submitText?: string;
  showSubmit?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  children: ReactNode;
}

export default function CommonModal({
  modalTitle = "",
  submitText = '확인',
  showSubmit = true,
  onClose,
  onSubmit,
  children,
}: ModalProps) {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content_container}>{children}</div>
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
