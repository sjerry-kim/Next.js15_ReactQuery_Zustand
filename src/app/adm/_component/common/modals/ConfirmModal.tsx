'use client';

import { useConfirmStore } from '@/zustand/confirmStore';
import styles from './ConfirmModal.module.css';
import { ButtonProps } from '@/types/components';
import Button from '../buttons/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmModal() {
  const { isOpen, options, handleConfirm, handleCancel } = useConfirmStore();

  if (!isOpen || !options) {
    return null;
  }

  const modalButtons: ButtonProps[] = [
    {
      text: options.cancelText || '아니요',
      variant: 'outlined',
      color: 'grey',
      onClick: handleCancel,
    },
    {
      text: options.confirmText || '예',
      variant: 'contained',
      color: 'primary',
      onClick: handleConfirm,
    },
  ];

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper}>
        <div className={styles.top_container}>
          <button className={styles.close_btn} onClick={handleCancel}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content_wrapper}>
          <h4>{options.title}</h4>
          {options.message}
        </div>

        <div className={styles.bottom_container}>
          {modalButtons.map((buttonProps, index) => (
            <Button
              width="100%"
              key={`${buttonProps.text}-${index}`}
              {...buttonProps}
            />
          ))}
        </div>
      </div>
    </div>
  );
}