import React from 'react';
import Add from '@/adm/_component/board/Add';

export default async function Page() {
  let props: any = {};

  return (
    <React.Fragment>
      <Add {...props} />
    </React.Fragment>
  );
}
