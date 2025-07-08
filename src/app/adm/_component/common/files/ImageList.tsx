import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import styles from './ImageList.module.css';
import { ImageListItem, ImageListProps } from '@/types/files';

export function ImageList({ images, editMode, onDelete, onDownload } : ImageListProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.image_preview_list}>
      {images.map((img : ImageListItem, index : number) => (
        <div key={index} className={styles.image_preview_item}>
          <p>{img.file_init_name}</p>
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