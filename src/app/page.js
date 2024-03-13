import IndexPage from "@/components/Page/Index";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 lg:px-24">
      <IndexPage />
    </main>
  );
}
