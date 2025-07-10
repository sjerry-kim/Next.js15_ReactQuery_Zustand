import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { GrDocumentPdf } from "react-icons/gr";
import styles from './FileList.module.css';
import { FileListItem, FileListProps } from '@/types/files';
import { FaRegImage } from 'react-icons/fa';

/* ✅ 파일 목록을 표시하는 컴포넌트 */
export function FileList({
  files, // 표시할 파일 리스트
  editMode, // 수정 모드 여부
  onDelete,
  onDownload,
  onPdfOpen,
  onImageOpen,
} : FileListProps) {
  if (!files || files.length === 0) {
    return null;
  }

  const isImage = (fileName: string = '') => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPdf = (fileName: string = '') => fileName.toLowerCase().endsWith('pdf');

  return (
    <div className={styles.image_preview_list}>
      {files.map((file : FileListItem, index : number) => (
        <div key={index} className={styles.image_preview_item}>
          <p>{file.file_init_name}</p>

          <div className={styles.button_box}>
            {/* 이미지 뷰어 버튼 렌더링 */}
            {isImage(file.file_init_name) && (
              <button
                type="button"
                onClick={() => onImageOpen('file', file, index)}
                className={styles.viewer_button}
                title="이미지 미리보기"
              >
                <FaRegImage />
              </button>
            )}

            {/* PDF 뷰어 버튼 렌더링 */}
            {isPdf(file.file_init_name) && (
              <button
                type="button"
                onClick={() => onPdfOpen(file)}
                className={styles.viewer_button}
                title="PDF 미리보기"
              >
                <GrDocumentPdf />
              </button>
            )}

            {/* editMode 값에 따라 삭제 버튼 또는 다운로드 버튼을 조건부로 렌더링 */}
            {editMode ? (
              <button
                type="button"
                onClick={() => onDelete(file)}
                className={styles.delete_button}
                title="삭제"
              >
                <MdDelete />
              </button>
            ) : (
              <button
                onClick={() => onDownload(file)}
                className={styles.download_button}
                title="다운로드"
              >
                <IoMdDownload />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}