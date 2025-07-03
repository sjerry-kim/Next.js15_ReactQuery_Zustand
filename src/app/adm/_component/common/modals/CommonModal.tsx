'use client';

import styles from './CommonModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties } from 'react';
import { CommonModalProps } from '@/types/modal';
import Button from '@/adm/_component/common/buttons/Button'

export default function CommonModal({
  children,
  modalTitle = "",
  buttons = [],
  width,
  maxWidth = "90%",
  minWidth,
  height,
  maxHeight = "90%",
  minHeight,
  onClose,
}: CommonModalProps) {

  const modalStyle: CSSProperties = {
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper} style={modalStyle}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.child_container}>{children}</div>

        {buttons.length > 0 && (
          <div className={styles.bottom_container}>
            {buttons.map((buttonProps, index) => (
              <Button
                key={`${buttonProps.text}-${index}`}
                {...buttonProps}
                height="100%"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}