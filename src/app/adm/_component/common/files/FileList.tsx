import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import styles from './ImageList.module.css';
import { FileListProps, ImageListItem, ImageListProps } from '@/types/files';


/* ✅ 파일 목록을 표시하는 컴포넌트 */
export function FileList({
  files, // 표시할 파일 리스트
  editMode, // 수정 모드 여부
  onDelete,
  onDownload
} : FileListProps) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={styles.image_preview_list}>
      {files.map((img : ImageListItem, index : number) => (
        <div key={index} className={styles.image_preview_item}>
          <p>{img.file_init_name}</p>

          {/* editMode 값에 따라 삭제 버튼 또는 다운로드 버튼을 조건부로 렌더링 */}
          {editMode ? (
            <button
              type="button"
              onClick={() => onDelete(img)}
              className={styles.delete_button}
              title="삭제"
            >
              <MdDelete />
            </button>
          ) : (
            <button
              onClick={() => onDownload(img)}
              className={styles.download_button}
              title="다운로드"
            >
              <IoMdDownload />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}