'use client'

import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { RiUploadCloudFill } from 'react-icons/ri';
import styles from './ImageUploader.module.css';
import { ImageUploaderProps } from '@/types/files';
import { useSnackbar } from '@/hooks/useSnackbar';
import { DEFAULT_ACCEPT_IMAGE_OBJECT } from '@/_constant/files';
import Loading from '@/adm/_component/common/Loading';

/* ✅ 이미지 업로더 컴포넌트 */
function ImageUploader({
  onCompressedImages,
  maxFiles = 10, // 최대 허용 이미지 갯수
  accept = DEFAULT_ACCEPT_IMAGE_OBJECT,
  maxSizeMB = 1, // 최대 허용 용량
  maxWidthOrHeight = 1024, // 가로,세로 변 중 긴 부분의 최대 길이
} : ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false); // 이미지 로딩 상태
  const { showSnackbar } = useSnackbar();

  // 파일 드롭, 선택 함수
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setIsLoading(true);

    try {
      // 1. 파일 형식 및 개수 유효성 검사
      if (fileRejections.length > 0) {
        showSnackbar(`허용된 형식의 파일만 업로드됩니다.`, 'warning');
      }

      if (acceptedFiles.length === 0) {
        setIsLoading(false);
        return;
      }

      if (acceptedFiles.length > maxFiles) {
        showSnackbar(`이미지는 최대 ${maxFiles}장까지만 등록 가능합니다.`, 'warning');
        setIsLoading(false);
        return;
      }

      // 2. 이미지 압축 로직
      const compressed: File[] = [];
      for (const file of acceptedFiles) {
        const options = {
          maxSizeMB: maxSizeMB, // 최대 파일 크기를 1MB로 제한
          maxWidthOrHeight: maxWidthOrHeight, // 이미지의 가로 또는 세로 중 더 긴 쪽의 최대 크기를 1024px로 제한 (비율은 유지)
          useWebWorker: true, // 웹 워커(Web Worker)를 사용하여 압축 실행 (성능 및 UX 향상)
        };
        // 설정한 옵션에 따라 각 파일을 비동기적으로 압축 (Blob(블롭) 객체로)
        const compressedBlob = await imageCompression(file, options);

        // 압축된 Blob 데이터를 FormData로 보내기 쉬운 File 객체로 다시 변환
        const finalFile = new File(
          [compressedBlob], // 첫 번째 인자: Blob 데이터
          file.name, // 두 번째 인자: 파일 이름 (원본 파일 이름을 그대로 사용)
          // 세 번째 인자: 옵션 객체
          {
            type: compressedBlob.type, // MIME 타입 (e.g., 'image/jpeg')
            lastModified: Date.now(), // 수정 날짜를 현재 시간으로 설정
          }
        );
        // 최종적으로 만들어진 압축 파일을 배열에 추가
        compressed.push(finalFile);
      }

      // 3. 압축된 파일들을 부모 컴포넌트로 전달
      onCompressedImages(compressed);
    } catch (err) {
      console.error('이미지 압축 중 문제가 발생하였습니다: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [onCompressedImages, maxFiles, showSnackbar]);

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
        {
          isLoading ?
          <Loading subTitle="이미지 압축 중입니다." circleSize={33.5} /> :
          <>
            <RiUploadCloudFill size={32} className={styles.upload_icon} />
            <p>이미지를 드래그하거나 클릭하여 업로드</p>
          </>
        }
      </div>
    </div>
  );
}

export default ImageUploader;
