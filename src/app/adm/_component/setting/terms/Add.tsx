'use client'

import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useEffect, useState } from 'react';
import Editor from '@/adm/_component/common/inputs/Editor';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import Button from '@/adm/_component/common/buttons/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '@/types/board';
import { router } from 'next/client';
import { useSnackbar } from '@/hooks/useSnackbar';
import { createTerms } from '@/services/termsServices';
import { TermsResponse } from '@/types/terms';
import LabelEditor from '@/adm/_component/common/inputs/LabelEditor';
import ImageUploader from '@/adm/_component/common/files/ImageUploader';
import { ImageList } from '@/adm/_component/common/files/ImageList';
import { useImageManager } from '@/hooks/useImageManager';
import { downloadImage } from '@/utils/download';
import { ImageListItem } from '@/types/files';

interface JsonData {
  title: string;
  content: string;
  img_list: ImageListItem[];
}

export default function MyPage() {
  const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
    img_list: []
  });
  const { images, deletedImageIds, addImages, deleteImage } = useImageManager({
    initialImages: jsonData.img_list,
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

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
  )
}
