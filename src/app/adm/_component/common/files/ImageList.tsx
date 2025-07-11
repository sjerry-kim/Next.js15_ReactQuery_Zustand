import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import styles from './ImageList.module.css';
import { ImageListItem, ImageListProps } from '@/types/files';
import { FaChevronLeft, FaChevronRight, FaRegImage } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';
import { FreeMode, Navigation  } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import { useRef } from 'react';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

/* ✅ 이미지 목록을 표시하는 컴포넌트 */
export function ImageList({
  images, // 표시할 이미지 리스트
  editMode, // 수정 모드 여부
  onDelete,
  onDownload,
  onImageOpen
} : ImageListProps) {
  if (!images || images.length === 0) {
    return null;
  }
  const swiperRef = useRef<SwiperRef>(null);


  return (
    <div className={styles.image_preview_list}>
      {
        editMode &&
          images.map((img : ImageListItem, index : number) => (
              <div key={index} className={styles.image_preview_item}>
                <p>{img.file_init_name}</p>

                <div className={styles.button_box}>
                  <button
                    type="button"
                    onClick={() => onImageOpen('image', img, index)}
                    className={styles.viewer_button}
                    title="이미지 미리보기"
                  >
                    <FaRegImage />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(img)}
                    className={styles.delete_button}
                    title="삭제"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
          ))
      }

      {
        !editMode &&
          <div className={styles.image_swiper_list}>
            <div className="swiper-button-prev">
              <FaChevronLeft />
            </div>
            <Swiper
              ref={swiperRef}
              slidesPerView={'auto'}
              spaceBetween={10}
              pagination={false}
              freeMode={true}
              modules={[FreeMode, Navigation]}
              loop={false}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}

            >
              {
                images.map((img : ImageListItem, index : number) => {
                  const imageUrl = img?.isNew && img?.file
                    ? URL.createObjectURL(img.file)
                    : img?.file_url;

                  return (
                    <SwiperSlide key={index}>
                      <div className={styles.image_box}>
                        <div className={styles.swiper_button_box}>
                          <button
                            type="button"
                            onClick={() => onImageOpen('image', img, index)}
                            className={styles.swiper_viewer_button}
                            title="이미지 미리보기"
                          >
                            <FaRegImage />
                          </button>

                          <button
                            onClick={() => onDownload(img)}
                            className={styles.download_button}
                            title="다운로드"
                          >
                            <IoMdDownload />
                          </button>

                        </div>

                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={img?.file_init_name}
                            width={150}
                            height={150}
                            objectFit="cover"
                          />
                        ) : (
                          <Skeleton variant="rectangular" width={150} height={150} />
                        )}
                      </div>
                    </SwiperSlide>
                  )
              })
              }
            </Swiper>
            <div className="swiper-button-next">
              <FaChevronRight />
            </div>

          </div>
      }

    </div>
  );
}