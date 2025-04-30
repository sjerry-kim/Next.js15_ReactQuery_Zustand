"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import onTextChange from '@/utils/onTextChange';

const Editor = dynamic(() => import('@/adm/_component/common/Editor'), {
  ssr: false,
  loading: () =>
    <div>
      <p style={{textAlign: "center"}}>로딩이 지속되면 새로고침 해주세요.</p>
    </div>
});

export default function Page() {
  const [jsonData, setJsonData] = useState({
    content: "",
  });
  // const {handleCustomChange} = onTextChange(jsonData, setJsonData);

  return (
    <>
      <h1>Hi! I'm the Admin Page :)</h1>
      {/*<Editor*/}
      {/*  name="content"*/}
      {/*  value={jsonData.content}*/}
      {/*  onChange={handleCustomChange}*/}
      {/*/>*/}
    </>
  );
}
