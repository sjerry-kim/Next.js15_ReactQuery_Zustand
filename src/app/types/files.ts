/* Image */
export interface ImageListItem {
  file_idx?: number;
  file?: File;
  file_init_name: string;
  file_url?: string;
  isNew: boolean;
}

export interface UseImageManagerProps {
  initialImages?: ImageListItem[];
  limit?: number;
}

export interface ImageUploaderProps {
  onCompressedImages: (files: File[]) => void;
}

export interface ImageListProps {
  images: ImageListItem[];
  editMode: boolean;
  onDelete: (image: ImageListItem) => void;
  onDownload: (image: ImageListItem) => void;
}