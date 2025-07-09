'use client'

import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { RiUploadCloudFill } from 'react-icons/ri';
import styles from './ImageUploader.module.css';
import { FileUploaderProps } from '@/types/files';
import { useSnackbar } from '@/hooks/useSnackbar';
import { DEFAULT_ACCEPT_FILE_OBJECT } from '@/_constant/files';
import Loading from '@/adm/_component/common/Loading';

/* ✅ 파일 업로더 컴포넌트 */
function FileUploader({
  onFilesSelected,
  maxFiles = 10,
  accept = DEFAULT_ACCEPT_FILE_OBJECT
} : FileUploaderProps) {
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
        showSnackbar(`파일은 최대 ${maxFiles}장까지만 등록 가능합니다.`, 'warning');
        setIsLoading(false);
        return;
      }

      // 2. 파일 처리 로직 (이미지 파일만 압축)
      const processedFiles: File[] = []; // 변수 이름을 더 명확하게 변경
      for (const file of acceptedFiles) {
        // 파일 타입이 'image/'로 시작하는 경우에만 압축을 실행
        if (file.type.startsWith('image/')) {
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
          processedFiles.push(finalFile);
        } else {
          // 이미지가 아닌 다른 파일(PDF, DOCX 등)은 압축 안 함
          processedFiles.push(file);
        }
      }

      // 3. 처리된 파일들을 부모 컴포넌트로 전달
      onFilesSelected(processedFiles);
    } catch (err) {
      console.error('파일 압축 중 문제가 발생하였습니다: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [onFilesSelected, maxFiles, showSnackbar]);

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
            <Loading subTitle="파일 처리 중입니다." circleSize={33.5} /> :
            <>
              <RiUploadCloudFill size={32} className={styles.upload_icon} />
              <p>파일을 드래그하거나 클릭하여 업로드</p>
            </>
        }
      </div>
    </div>
  );
}

export default FileUploader;
