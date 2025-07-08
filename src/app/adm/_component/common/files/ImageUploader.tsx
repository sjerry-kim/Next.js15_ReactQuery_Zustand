'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { RiUploadCloudFill } from 'react-icons/ri';
import styles from './ImageUploader.module.css';
import { ImageUploaderProps } from '@/types/files';

function ImageUploader({ onCompressedImages } : ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.heic'];

      const isAllowedExtension = (name: string) =>
        allowedExtensions.some((ext) => name.toLowerCase().endsWith(ext));

      const filteredFiles = acceptedFiles.filter(
        (file) =>
          allowedTypes.includes(file.type) || isAllowedExtension(file.name)
      );

      if (filteredFiles.length === 0) {
        // alert("jpg, jpeg, png, heic 형식의 이미지 파일만 업로드할 수 있습니다.");

        setIsLoading(false);
        return;
      }

      if (filteredFiles.length > 10) {
        // alert("이미지는 최대 10장까지만 등록 가능합니다.");

        setIsLoading(false);
        return;
      }

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

      onCompressedImages(compressed);  // 압축된 파일들을 부모로 전달
    } catch (err) {
      console.error('압축 실패:', err);
      // alert('이미지 압축 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [onCompressedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic']
    },
    multiple: true,
  });

  return (
    <div className={styles.image_uploader_wrapper}>
      <div {...getRootProps()} className={`${styles.dropzone_box} ${isDragActive ? styles.active : ''}`}>
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
