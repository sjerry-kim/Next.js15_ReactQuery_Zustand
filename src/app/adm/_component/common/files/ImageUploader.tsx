'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { RiUploadCloudFill } from 'react-icons/ri';
import styles from './ImageUploader.module.css';
import { ImageUploaderProps } from '@/types/files';
import { useSnackbar } from '@/hooks/useSnackbar';

/* ✅ 이미지 업로더 컴포넌트 */
function ImageUploader({
  onCompressedImages,
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/heic'],
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/heic': ['.heic']
  }
} : ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false); // 이미지 로딩 상태
  const { showSnackbar } = useSnackbar();

  // 파일 드롭, 선택 함수
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);

    try {
      // 1. 파일 형식 및 개수 유효성 검사
      const filteredFiles = acceptedFiles.filter(
        (file) => allowedTypes.includes(file.type)
      );

      if (acceptedFiles.length > filteredFiles.length) {
        showSnackbar( `허용된 형식의 파일만 업로드됩니다.`, 'warning');
      }

      if (filteredFiles.length === 0) {
        showSnackbar( `업로드할 수 있는 형식의 파일이 없습니다.`, 'warning');
        setIsLoading(false);
        return;
      }

      if (filteredFiles.length > maxFiles) {
        showSnackbar( `이미지는 최대 ${maxFiles}장까지만 등록 가능합니다.`, 'warning');
        setIsLoading(false);
        return;
      }

      // 2. 이미지 압축 로직
      const compressed = [];
      for (const file of filteredFiles) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);
        const finalFile = new File([compressedBlob], file.name, {
          type: compressedBlob.type,
          lastModified: Date.now(),
        });
        compressed.push(finalFile);
      }

      // 3. 압축된 파일들을 부모 컴포넌트로 전달
      onCompressedImages(compressed);
    } catch (err) {
      console.error('이미지 압축 중 문제가 발생하였습니다: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [onCompressedImages, maxFiles, allowedTypes]);

  // 4. react-dropzone 훅을 사용하여 드래그 앤 드롭 기능 활성화
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: true, // 여러 파일 선택 허용
  });

  return (
    <div className={styles.image_uploader_wrapper}>
      {/* getRootProps: 드롭존 영역에 필요한 props(이벤트 핸들러 등)를 주입 */}
      <div {...getRootProps()} className={`${styles.dropzone_box} ${isDragActive ? styles.active : ''}`}>
        {/* getInputProps: 숨겨진 파일 입력(input)에 필요한 props를 주입 */}
        <input {...getInputProps()} />
        {isLoading ? (
          <>
            <div className={styles.spinner}></div>
            <p className={styles.loading_text}>이미지 압축 중...</p>
          </>
        ) : (
          <>
            <RiUploadCloudFill size={32} className={styles.upload_icon} />
            <p>이미지를 드래그하거나 클릭하여 업로드</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
