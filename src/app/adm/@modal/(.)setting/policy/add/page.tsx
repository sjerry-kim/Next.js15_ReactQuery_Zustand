import React from "react";
import Add from "@/adm/_component/setting/policy/Add";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: any) {
  let props: any = {};

  return (
    <React.Fragment>
      <Add {...props} />
    </React.Fragment>
  );
}
