"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "../../../../../ckeditor5-40.0.0/build/ckeditor"; // import 방식 수정
import { useCallback } from "react";

interface EditorProps {
  name: string;
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  image?: boolean;
  youtube?: boolean;
  source?: boolean;
}

const MAX_FILE_SIZE_MB = 100;

export default function Editor({
  name,
  value,
  onChange,
  image = true,
  youtube = true,
  source = true,
}: EditorProps) {
  const toolbarItems = [
    "undo", "redo", "|",
    "fontFamily", "fontSize", "fontColor", "fontBackgroundColor",
    "bold", "underline", "strikethrough", "link", "alignment", "|",
    "insertTable",
    image && "imageInsert",
    youtube && "mediaEmbed",
    "|",
    source && "htmlEmbed",
    "findAndReplace",
  ].filter(Boolean) as string[];

  const handleImageUpload = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다.`);
      return { default: "" };
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/file/editor-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("업로드 실패");
      }

      const data = await res.json();
      return { default: data.url }; // 백엔드 응답이 { url: '...' } 형태라고 가정
    } catch (err) {
      alert("이미지 업로드 실패. 관리자에게 문의해주세요.");
      return { default: "" };
    }
  }, []);

  return (
    <CKEditor
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

        // 비어 있는 이미지 제거
        editor.model.document.on("change:data", () => {
          if (!editor.model.document) return;

          editor.model.change((writer) => {
            const root = editor.model.document.getRoot();
            if (!root) return;

            for (const element of Array.from(root.getChildren())) {
              const imgElement = element as any;
              if (imgElement.name === "imageBlock" && !element.getAttribute("src")) {
                writer.remove(element);
              }
            }
          });
        });
      }}
    />
  );
}
