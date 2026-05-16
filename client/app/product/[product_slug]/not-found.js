import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>The products is not found</p>
      <Link href="/products">Return products page</Link>
    </div>
  );
}
