import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  nav: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children }: Props) {
  return <div>{children}</div>;
}
