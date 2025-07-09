import { useState } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ImageListItem, UseImageManagerProps } from '@/types/files';

/* ✅ 이미지 추가, 삭제 훅 */
export const useImageManager = ({
  initialImages = [], // 초기 이미지 목록 (서버에서 받아온 데이터)
  limit = 10 // 최대 업로드 가능한 이미지 개수
}: UseImageManagerProps = {}) => {
  // 현재 화면에 보여줄 전체 이미지 리스트 (기존 + 신규)
  const [images, setImages] = useState<ImageListItem[]>(initialImages);
  //  사용자가 삭제한 '기존' 이미지들의 ID 목록 (서버에 삭제 요청을 보내기 위함)
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const { showSnackbar } = useSnackbar();
  
  // 1. 이미지 추가
  const addImages = (newFiles: File[]) => {
    const existingCount = images.length;
    if (existingCount >= limit) {
      showSnackbar( `이미지는 최대 ${limit}장까지만 등록할 수 있습니다.`, 'warning');
      return;
    }

    // 추가 가능한 공간만큼만 새 파일들을 잘라냄
    const availableSpace = limit - existingCount;
    const filesToAdd = newFiles.slice(0, availableSpace);

    // 제한에 걸려 일부 파일만 추가될 경우
    if (filesToAdd.length < newFiles.length) {
      showSnackbar(`최대 ${limit}장까지만 등록 가능하여 ${filesToAdd.length}개만 추가되었습니다.`,  'warning');
    }

    // 새로 추가된 파일들을 ImageListItem 형식으로 변환
    const newImageList: ImageListItem[] = filesToAdd.map((file) => ({
      file,
      file_init_name: file.name,
      isNew: true,
    }));

    // 기존 목록에 새로운 파일 목록을 합쳐서 상태 업데이트
    setImages((prev) => [...prev, ...newImageList]);
  };

  // 2. 이미지 삭제
  const deleteImage = (targetImage: ImageListItem) => {
    // 화면에 보여지는 목록에서 해당 이미지 제거
    setImages((prev) =>
      prev.filter((img) =>
        // isNew 플래그를 이용해 신규/기존 이미지를 다른 방식으로 필터링
        targetImage.isNew
          ? img.file !== targetImage.file // 새 파일은 고유 ID가 없으므로 파일 객체 자체를 비교
          : img.file_idx !== targetImage.file_idx // 기존 파일은 고유 ID(file_idx)로 비교
      )
    );

    // 만약 삭제한 것이 '기존' 이미지(서버에서 받아온)라면, 그 ID를 deletedImageIds 배열에 추가
    if (!targetImage.isNew && targetImage.file_idx) {
      setDeletedImageIds((prev) => [...prev, targetImage.file_idx!]);
    }
  };

  return { images, setImages, deletedImageIds, addImages, deleteImage };
};