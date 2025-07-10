'use client'

import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useState } from 'react';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import Button from '@/adm/_component/common/buttons/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';
import { createTerms } from '@/services/termsServices';
import { TermsResponse } from '@/types/terms';
import LabelEditor from '@/adm/_component/common/inputs/LabelEditor';
import ImageUploader from '@/adm/_component/common/files/ImageUploader';
import { ImageList } from '@/adm/_component/common/files/ImageList';
import { useImageManager } from '@/hooks/useImageManager';
import { downloadImage, downloadFile } from '@/utils/download';
import { FileListItem, ImageListItem } from '@/types/files';
import { useFileManager } from '@/hooks/useFileManager';
import FileUploader from '@/adm/_component/common/files/FileUploader';
import { FileList } from '@/adm/_component/common/files/FileList';
import PdfViewer from '@/adm/_component/common/files/PdfViewer';
import ImageViewer from '@/adm/_component/common/files/ImageViewer';

interface JsonData {
  title: string;
  content: string;
  img_list: ImageListItem[];
  file_list: FileListItem[];
}

export default function MyPage() {
  // const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
    img_list: [],
    file_list: [],
  });
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<FileListItem | null>(null);
  const [imageFileIndex, setImageFileIndex] = useState(0);
  const { images, deletedImageIds, addImages, deleteImage } = useImageManager({
    initialImages: jsonData.img_list,
  });
  const {files, deletedFileIds, addFiles, deleteFile} = useFileManager({
    initialFiles: jsonData.file_list,
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

  const handleImageOpen = (img: ImageListItem, index: number) => {
    setImageFileIndex(index);
    setIsImageOpen(true);
  }

  const handlePdfOpen = (file: FileListItem) => {
    setPdfFile(file);
    setIsPdfOpen(true);
  }

  const createMutation = useMutation<ApiResponse<TermsResponse>, Error>({
    mutationFn: () => createTerms(jsonData),
    onSuccess: (res) => {
      // queryClient.setQueryData(['Term'], (prevData: any) => {
      //   return prevData ? [...prevData, {...res.data, rn: prevData.length+1}] : [res.data];
      // });
      // console.log(res);
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  return (
    <>
      <main className={styles.main}>
        <section className={styles.page_wrapper}>
          <div className={styles.top}>
            <h3>이용약관 등록</h3>
          </div>
          <div className={styles.bottom}>
            <ul className={styles.content_container}>
              <li className={styles.input_box}>
                <LabelInput
                  label="제목"
                  name="title"
                  maxLength={30}
                  placeholder="제목"
                  required={true}
                  value={jsonData.title}
                  onChange={handleChange}
                />
              </li>

              <li className={styles.input_box}>
                <LabelEditor
                  label="내용"
                  name="content"
                  required={true}
                  value={jsonData.content}
                  onChange={handleCustomChange}
                />
              </li>

              <li className={styles.file_box}>
                <label className={styles.label_box}>
                  <div className={styles.label_text}>
                    이미지 첨부
                    <span className={styles.required}>*</span>
                  </div>
                </label>
                <ImageUploader onCompressedImages={addImages} />
                <ImageList
                  images={images}
                  editMode={true}
                  onDelete={deleteImage}
                  onDownload={downloadImage}
                  onImageOpen={handleImageOpen}
                />
              </li>

              <li className={styles.file_box}>
                <label className={styles.label_box}>
                  <div className={styles.label_text}>
                    파일 첨부
                  </div>
                </label>
                <FileUploader onFilesSelected={addFiles} />
                <FileList
                  files={files}
                  editMode={true}
                  onDelete={deleteFile}
                  onDownload={downloadFile}
                  onPdfOpen={handlePdfOpen}
                />
              </li>

              <div className={styles.btn_box}>
                <Button
                  text="등록"
                  variant="contained"
                  color="primary"
                  size="md"
                  width="fit-content"
                  height="100%"
                  onClick={()=> createMutation.mutate()}
                />
              </div>
            </ul>
          </div>
        </section>
      </main>

      {isPdfOpen && (
        <PdfViewer
          file={pdfFile?.file} // 로컬에서 추가한 경우만 적용되어 있음
          onClose={() => setIsPdfOpen(false)}
        />
      )}

      {isImageOpen && (
        <ImageViewer
          mode="single"
          images={images}
          initialIndex={imageFileIndex}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  )
}
