"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "../../../../../../ckeditor5-40.0.0"; // import 방식 수정
import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadEditorImage } from '@/services/fileService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { MAX_FILE_SIZE_MB} from '@/_constant/file';
// import styles from './Editor.module.css';

interface EditorProps {
  name: string;
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  image?: boolean;
  youtube?: boolean;
  source?: boolean;
}

export default function Editor({
  name,
  value,
  onChange,
  image = true,
  // youtube = true,
  // source = true,
}: EditorProps) {
  const toolbarItems = [
    "undo", "redo", "|",
    // "sourceEditing",
    "fontFamily", "fontSize", "fontColor", "fontBackgroundColor",
    "bold", "underline", "strikethrough", "link", "alignment", "|",
    "insertTable",
    image && "imageInsert",
    // youtube && "mediaEmbed",
    // "|",
    // source && "htmlEmbed",
    "findAndReplace",
  ].filter(Boolean) as string[];
  const [isFocused, setFocused] = useState(false);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const { showSnackbar } = useSnackbar();

  const handleImageUpload = useCallback(async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    // 파일 형식 검사
    if (!allowedTypes.includes(file.type)) {
      showSnackbar("지원하지 않는 파일 형식입니다. (jpg, png, gif, webp)", 'warning');
      return { default: "" };
    }

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showSnackbar(`파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다.`, 'warning');
      return { default: "" };
    }

    try {
      const data = await uploadEditorImage(file);

      return { default: data.fullUrl };
    } catch (error) {
      console.error(error);
      showSnackbar(`이미지 업로드 중 문제가 발생하였습니다.`, 'error');
      return { default: "" };
    }
  }, [showSnackbar]);

  return (
    <CKEditor
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      editor={ClassicEditor as any}
      data={value}
      config={{
        toolbar: toolbarItems,
        ckfinder: {
          uploadUrl: "/api/file/editor-image", // fallback 설정
        },
      }}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange({ target: { name, value: data } });
      }}
      onReady={(editor) => {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return {
            upload: async () => {
              const file = await loader.file;

              if (!file) {
                throw new Error("파일을 찾을 수 없습니다.");
              }

              return await handleImageUpload(file);
            },
          };
        };

        // 실패한 이미지(깨지거나, 업로드가 되지 않은 이미지) 제거
        editor.model.document.on("change:data", () => {
          if (!editor.model.document) return;

          editor.model.change((writer) => {
            const root = editor.model.document.getRoot();
            if (!root) return;

            for (const element of Array.from(root.getChildren())) {
              const imgElement = element as any;
              if (
                imgElement.name === "imageBlock" && // 1. 이 요소가 이미지 블록이고,
                !element.getAttribute("src") && // 2. 최종 주소(src)가 없으면서,
                !element.getAttribute("uploadId") // 3. 현재 업로드 중도 아닐 때
              ) {
                // => 이 세 조건을 모두 만족하는 '진짜 실패한 이미지'만 삭제
                writer.remove(element);
              }
            }
          });
        });
      }}
    />
  );
}
