'use client';

import React, { useEffect, useState } from 'react';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import styles from './ImageViewer.module.css';
import Loading from '@/adm/_component/common/Loading';
import { ImageViewerProps } from '@/types/files';
import { CommonModalButton } from '@/types/modal';
import useWindowSize from '@/hooks/useWindowSize.';

export default function ImageViewer({
  mode = 'single',
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const currentImage = images[currentIndex];
  const {isMobile} = useWindowSize();

  const goToPrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const goToNext = () => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  const imageUrl = currentImage?.isNew && currentImage.file
    ? URL.createObjectURL(currentImage.file)
    : currentImage?.file_url;

  // images 리스트가 1 초과인 경우에만 버튼 노출
  const carouselButtons: CommonModalButton[] = images.length > 1 && mode === 'carousel' ? [
    {
      text: '이전',
      variant: 'outlined',
      color: 'grey',
      disabled: currentIndex <= 0,
      onClick: goToPrev,
    },
    {
      text: '다음',
      variant: 'outlined',
      color: 'grey',
      disabled: currentIndex >= images.length - 1,
      onClick: goToNext,
    },
  ] : [];

  return (
    <CommonModal
      modalTitle={currentImage?.file_init_name || '이미지 미리보기'}
      buttons={carouselButtons} // 조건부로 생성된 버튼 배열을 전달
      maxWidth={isMobile? '90%': '600px'}
      maxHeight={isMobile? '90%': '600px'}
      buttonsLocation="center"
      currentPage={images.length > 1 && mode === 'carousel' ? currentIndex + 1 : undefined}
      totalPages={images.length > 1 && mode === 'carousel' ? images.length : undefined}
      onClose={onClose}
    >
      <div className={styles.image_viewer_container}>
        {isLoading && <Loading />}
        <img
          src={imageUrl}
          alt={currentImage?.file_init_name}
          className={styles.image}
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </CommonModal>
  );
}