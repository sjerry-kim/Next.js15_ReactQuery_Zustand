'use client'

import styles from './Terms.module.css';
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
  const [deletedImageIdxList, setDeletedImageIdxList] = useState([]);
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();
  const { images, addImages, deleteImage } = useImageManager({
    initialImages: jsonData.img_list, // jsonData.img_list를 초기값으로 전달
  });

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

  // useEffect(() => {
  //   console.log(jsonData);
  // }, [jsonData]);

  return (
    <main className={styles.main}>
      <section className={styles.page_wrapper}>
        <div className={styles.top}>
          <h3>이용약관</h3>
        </div>
        <div className={styles.bottom}>
          <LabelInput
            label="제목"
            value={jsonData.title}
            name="title"
            maxLength={30}
            placeholder="제목"
            onChange={handleChange}
          />
          <LabelEditor
            label="내용"
            name="content"
            value={jsonData.content}
            onChange={handleCustomChange}
          />
          <Button
            text="수정"
            variant="contained"
            color="primary"
            size="md"
            height="100%"
            onClick={()=> createMutation.mutate()}
          />

          <ImageUploader onCompressedImages={addImages} />
          <ImageList
            images={images}
            editMode={true}
            onDelete={deleteImage}
            onDownload={downloadImage}
          />
        </div>
      </section>
    </main>
  )
}
