'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import styles from './PdfViewer.module.css';
import Loading from '@/adm/_component/common/Loading';

// 1. Worker 파일의 경로를 설정합니다.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;    // 보여줄 PDF 파일의 URL
  onClose: () => void; // 모달을 닫는 함수
}

export default function PdfViewer({ fileUrl, onClose }: PdfViewerProps) {
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // PDF 로딩 성공 시 호출되는 콜백 함수
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setTotalPages(numPages);
    setCurrentPage(1); // 새 파일 로드 시 1페이지로 초기화
  }

  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  const goToNextPage = () => setCurrentPage((prev) => (totalPages && prev < totalPages ? prev + 1 : prev));

  return (
    <CommonModal
      // modalTitle={`PDF 미리보기 (${currentPage} / ${totalPages || '...'})`}
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
      <div className={styles.pdf_viewer_container}>
        {/* PDF 문서 로딩 및 렌더링 */}
        <div className={styles.document_wrapper}>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            scale={1}
            renderMode="canvas"
            loading={<Loading subTitle={"PDF 파일 불러오는 중..."} />}
            error={<p>PDF 파일을 불러오는 데 실패했습니다.</p>}
          >
            <Page pageNumber={currentPage}/>
          </Document>
        </div>

        {/* 페이지네이션 컨트롤러 */}
        {/*<div className={styles.controls}>*/}
        {/*  <button onClick={goToPrevPage} disabled={currentPage <= 1}>*/}
        {/*    이전*/}
        {/*  </button>*/}
        {/*  <span>*/}
        {/*    {currentPage} / {totalPages || '...'}*/}
        {/*  </span>*/}
        {/*  <button onClick={goToNextPage} disabled={!totalPages || currentPage >= totalPages}>*/}
        {/*    다음*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </CommonModal>
  );
}