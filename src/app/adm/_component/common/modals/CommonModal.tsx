'use client';

import styles from './CommonModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties, Fragment } from 'react';
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
  buttonsLocation = 'flex-end', // pdf 뷰어의 페이지네이션을 위해서 넣어둠
  currentPage = 0,
  totalPages = 0,
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

        {/* 하단 버튼 (! 일반 모달의 경우) */}
        {(buttons.length > 0  && totalPages <= 0) && (
          <div className={styles.bottom_container} style={{justifyContent: buttonsLocation}}>
            {buttons.map((buttonProps, index) => (
              <Button
                key={`${buttonProps.text}-${index}`}
                {...buttonProps}
                height="100%"
              />
            ))}
          </div>
        )}

        {/* 하단 버튼 (! 페이지네이션-PDF뷰어-의 경우) */}
        {(buttons.length > 0  && totalPages > 0) && (
          <div className={styles.bottom_container} style={{justifyContent: buttonsLocation}}>
            {buttons.map((buttonProps, index) => {
              if (buttons?.length - 1 !== index) {
                return (
                  <Fragment key={`${buttonProps.text}-${index}`}>
                    <Button
                      {...buttonProps}
                      height="100%"
                    />
                    <span className={styles.pagination}>
                      {currentPage} / {totalPages || '...'}
                    </span>
                  </Fragment>
                )
              } else {
                return (
                  <Button
                    key={`${buttonProps.text}-${index}`}
                    {...buttonProps}
                    height="100%"
                  />
                )
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}