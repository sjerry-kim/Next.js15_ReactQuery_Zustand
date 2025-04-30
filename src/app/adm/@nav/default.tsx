import Link from "next/link";

export default function Default() {
  return (
    <nav>
      <Link href="/adm">Admin Home</Link>
      <Link href="/adm/board">Board</Link>
    </nav>
  );
}
