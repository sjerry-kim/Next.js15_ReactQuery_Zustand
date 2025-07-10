'use client'

import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useEffect, useRef, useState } from 'react';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import Button from '@/adm/_component/common/buttons/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';
import { createTerms, getTerm, updateTerm } from '@/services/termsServices';
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
import { Board } from '@/types/board';
import { useRouter } from 'next/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';


type PageProps = {
  id: string;
};

interface JsonData {
  title: string;
  content: string;
  img_list: ImageListItem[];
  file_list: FileListItem[];
}

export default function Modify({ id }: PageProps) {
  // const queryClient = useQueryClient();
  const router = useRouter();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useQuery({
    queryKey: ['term', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getTerm(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
    img_list: [],
    file_list: [],
  });
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<FileListItem | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageFileIndex, setImageFileIndex] = useState(0);
  const { images, deletedImageIds, addImages, deleteImage } = useImageManager({
    initialImages: jsonData.img_list,
  });
  const {files, deletedFileIds, addFiles, deleteFile} = useFileManager({
    initialFiles: jsonData.file_list,
  });
  const [fileListImage, setFileListImage] = useState<ImageListItem[]>([]);
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

  // 이미지 Viewer
  const handleImageOpen = (type: string ,img: ImageListItem, index: number) => {
    // type : 'image' | 'file' -> ImageList의 이미지인지, FileList의 이미지인지 구분 위한 로직
    if (type === 'file') {
      setFileListImage([{...img}])
      setImageFileIndex(0); // FileList의 이미지는 단일 이미지이기 때문에 idnex가 무조건 0임
    } else {
      setImageFileIndex(index);
    }

    setIsImageOpen(true);
  }

  // PDF Viewer
  const handlePdfOpen = (file: FileListItem) => {
    setPdfFile(file);
    setIsPdfOpen(true);
  }

  // Viewer를 닫는 핸들러 함수(사용한 상태값들을 모두 정리)
  const handleViewerClose = (type: string) => {
    if (type === 'image') {
      setImageFileIndex(0)
      setFileListImage([])
      setIsImageOpen(false);
    } else {
      setIsPdfOpen(false);
    }
  }

  const updateMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => updateTerm(Number(id), jsonData),
    async onSuccess(res) {
      // // boardList 갱신
      // queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
      //   if (!prevData) return [];
      //
      //   const newList = prevData.map((item) =>
      //     item.id === res.data.id ? { ...res.data, rn: prevData.indexOf(item) + 1 } : item
      //   );
      //
      //   return newList;
      // });
      //
      // // board 갱신
      // queryClient.setQueryData(['board', id], (prevData?: board) => {
      //   return res.data;
      // });

      router.back();
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  useEffect(() => {
    if (data) {
      setJsonData((prevState)=>({
        ...prevState,
        idx: data?.data.idx || 0,
        title: data?.data.title || '',
        content: data?.data.content || '',
      }));
    }
  }, [data]);

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
                <div dangerouslySetInnerHTML={{ __html: jsonData.content }} />
              </li>

              <li className={styles.file_box}>
                <label className={styles.label_box}>
                  <div className={styles.label_text}>
                    이미지 첨부
                    <span className={styles.required}>*</span>
                  </div>
                </label>
                <ImageUploader onCompressedImages={addImages} />
                {/*<ImageList*/}
                {/*  images={images}*/}
                {/*  editMode={true}*/}
                {/*  onDelete={deleteImage}*/}
                {/*  onDownload={downloadImage}*/}
                {/*  onImageOpen={handleImageOpen}*/}
                {/*/>*/}
                
                {/* todo Swiper로 이미지 띄워주기 */}
                <Swiper
                  ref={swiperRef}
                  // slidesPerView={1}
                  // pagination={false}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  // onSwiper={(swiper) => (swiperRef?.current = swiper)}
                  loop={false}

                >
                  <SwiperSlide>
                    <p className={styles.swiper_p}>총 누적 달성 수익</p>
                    <h2>

                    </h2>
                  </SwiperSlide>
                  <SwiperSlide>
                    <p className={styles.swiper_p}>총 누적 미달성 수익</p>
                    <h2>
                    </h2>
                  </SwiperSlide>
                </Swiper>
                
                
                
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
                  onImageOpen={handleImageOpen}
                />
              </li>

              {/*<div className={styles.btn_box}>*/}
              {/*  <Button*/}
              {/*    text="수정"*/}
              {/*    variant="contained"*/}
              {/*    color="primary"*/}
              {/*    size="md"*/}
              {/*    width="fit-content"*/}
              {/*    height="100%"*/}
              {/*    onClick={()=> updateMutation.mutate()}*/}
              {/*  />*/}
              {/*</div>*/}
            </ul>
          </div>
        </section>
      </main>

      {isPdfOpen && (
        <PdfViewer
          file={pdfFile?.file || pdfFile?.file_url}
          onClose={() => handleViewerClose('file')}
        />
      )}

      {isImageOpen && (
        <ImageViewer
          mode='carousel'
          images={fileListImage.length > 0 ? fileListImage : images}
          initialIndex={imageFileIndex}
          onClose={() => handleViewerClose('image')}
        />
      )}
    </>
  )
}
