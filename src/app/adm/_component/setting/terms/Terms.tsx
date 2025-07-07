'use client'

import styles from './Terms.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useEffect, useState } from 'react';
import Editor from '@/adm/_component/common/inputs/Editor';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';

interface JsonData {
  title: string;
  content: string;
}

export default function MyPage() {
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);


  useEffect(() => {
    console.log(jsonData);
  }, [jsonData]);

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
          <Editor
            name="content"
            value={jsonData.content}
            onChange={handleCustomChange}
          />
        </div>
      </section>
    </main>
  )
}
