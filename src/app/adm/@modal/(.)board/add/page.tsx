import React from "react";
import Add from "@/adm/_component/board/Add";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: any) {
  let props: any = {};

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return redirect("/404");
  }

  props.data = await res.json();

  return (
    <React.Fragment>
      <Add {...props} />
    </React.Fragment>
  );
}
