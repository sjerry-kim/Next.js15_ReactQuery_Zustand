'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import styles from './PdfViewer.module.css';
import Loading from '@/adm/_component/common/Loading';
import useWindowSize from '@/hooks/useWindowSize.';
import Fail from '@/adm/_component/common/Fail';

// Worker 파일의 경로를 설정
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string | File | Blob | undefined| null; // URL 문자열 외에 File, Blob 객체도 허용
  onClose: () => void; // 모달을 닫는 함수
}

export default function PdfViewer({ file, onClose }: PdfViewerProps) {
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0); // (기본값 100%)
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  const goToNextPage = () => setCurrentPage((prev) => (totalPages && prev < totalPages ? prev + 1 : prev));
  // const zoomIn = () => setScale((prev) => (prev < 2.0 ? +(prev + 0.1).toFixed(1) : 2.0)); // 최대 200%
  // const zoomOut = () => setScale((prev) => (prev > 0.5 ? +(prev - 0.1).toFixed(1) : 0.5)); // 최소 50%
  const {isMobile} = useWindowSize();

  // PDF 로딩 성공 시 호출되는 콜백 함수
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setTotalPages(numPages);
    setCurrentPage(1); // 새 파일 로드 시 1페이지로 초기화
  }


  useEffect(() => {
    // 컨테이너의 너비를 감지하여 상태에 저장
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, [containerRef]);

  return (
    <CommonModal
      modalTitle={`PDF 미리보기`}
      buttons={[
        {
          text: '이전',
          variant: 'outlined',
          color: 'grey',
          disabled: currentPage <= 1,
          onClick: goToPrevPage
        },
        {
          text: '다음',
          variant: 'outlined',
          color: 'grey',
          disabled: !totalPages || currentPage >= totalPages,
          onClick: goToNextPage,
        }
      ]}
      buttonsLocation="center"
      currentPage={currentPage || 0}
      totalPages={totalPages || 0}
      onClose={onClose}
    >
      <div ref={containerRef} className={styles.pdf_viewer_container}>
        {/* PDF 문서 로딩 및 렌더링 */}
        <div className={styles.document_wrapper}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            renderMode="canvas"
            scale={scale}
            loading={<div className={styles.exception_wrapper}><Loading subTitle={"PDF 파일 불러오는 중..."} /></div>}
            error={<div className={styles.exception_wrapper}><Fail subTitle={"다시 시도하거나 관리자에게 문의해 주세요."} height="100%" showButton={false}/></div>}
            noData={<div className={styles.exception_wrapper}><Fail title="데이터를 찾을 수 없습니다!" subTitle={"다시 시도하거나 관리자에게 문의해 주세요."} height="100%" showButton={false}/></div>}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              width={isMobile? containerWidth : undefined}
              loading={<div className={styles.exception_wrapper}><Loading subTitle={"PDF 파일 불러오는 중..."} /></div>}
              error={<div className={styles.exception_wrapper}><Fail subTitle={"다시 시도하거나 관리자에게 문의해 주세요."} height="100%" showButton={false}/></div>}
              noData={<div className={styles.exception_wrapper}><Fail title="데이터를 찾을 수 없습니다!" subTitle={"다시 시도하거나 관리자에게 문의해 주세요."} height="100%" showButton={false}/></div>}
            />
          </Document>
        </div>
      </div>
      
      {/* 확대, 축소 버튼 -주석 처리- */}
      {/*<button onClick={zoomOut}>-</button>*/}
      {/*<span>{Math.round(scale * 100)}%</span>*/}
      {/*<button onClick={zoomIn}>+</button>*/}
    </CommonModal>
  );
}