import { useState } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ImageListItem, UseImageManagerProps } from '@/types/files';

export const useImageManager = ({ initialImages = [], limit = 10 }: UseImageManagerProps = {}) => {
  const { showSnackbar } = useSnackbar();
  const [images, setImages] = useState<ImageListItem[]>(initialImages);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  // 파일 추가 로직
  const addImages = (newFiles: File[]) => {
    const existingCount = images.length;
    if (existingCount >= limit) {
      showSnackbar( `이미지는 최대 ${limit}장까지만 등록할 수 있습니다.`, 'warning');
      return;
    }

    const availableSpace = limit - existingCount;
    const filesToAdd = newFiles.slice(0, availableSpace);

    if (filesToAdd.length < newFiles.length) {
      showSnackbar(`최대 ${limit}장까지만 등록 가능하여 ${filesToAdd.length}개만 추가되었습니다.`,  'warning');
    }

    const newImageList: ImageListItem[] = filesToAdd.map((file) => ({
      file,
      file_init_name: file.name,
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newImageList]);
  };

  // 파일 삭제 로직
  const deleteImage = (targetImage: ImageListItem) => {
    setImages((prev) =>
      prev.filter((img) =>
        targetImage.isNew
          ? img.file !== targetImage.file
          : img.file_idx !== targetImage.file_idx
      )
    );

    if (!targetImage.isNew && targetImage.file_idx) {
      setDeletedImageIds((prev) => [...prev, targetImage.file_idx!]);
    }
  };

  return { images, setImages, deletedImageIds, addImages, deleteImage };
};