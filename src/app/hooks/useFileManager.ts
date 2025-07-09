import { useState } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { FileListItem } from '@/types/files';

interface UseFileManagerProps {
  initialFiles?: FileListItem[];
  limit?: number;
}

export const useFileManager = ({ initialFiles = [], limit = 10 }: UseFileManagerProps = {}) => {
  const { showSnackbar } = useSnackbar();
  const [files, setFiles] = useState<FileListItem[]>(initialFiles);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

  const addFiles = (newFiles: File[]) => {
    const existingCount = files.length;
    if (existingCount >= limit) {
      showSnackbar(`첨부파일은 최대 ${limit}개까지만 등록할 수 있습니다.`, 'warning');
      return;
    }

    const availableSpace = limit - existingCount;
    const filesToAdd = newFiles.slice(0, availableSpace);

    if (filesToAdd.length < newFiles.length) {
      showSnackbar(`최대 ${limit}장까지만 등록 가능하여 ${filesToAdd.length}개만 추가되었습니다.`, 'warning');
    }

    const newFileList: FileListItem[] = filesToAdd.map((file) => ({
      file,
      file_init_name: file.name,
      isNew: true,
    }));

    setFiles((prev) => [...prev, ...newFileList]);
  };

  const deleteFile = (targetFile: FileListItem) => {
    setFiles((prev) =>
      prev.filter((file) =>
        targetFile.isNew
          ? file.file !== targetFile.file
          : file.file_idx !== targetFile.file_idx
      )
    );

    if (!targetFile.isNew && targetFile.file_idx) {
      setDeletedFileIds((prev) => [...prev, targetFile.file_idx!]);
    }
  };

  return { files, deletedFileIds, addFiles, deleteFile };
};