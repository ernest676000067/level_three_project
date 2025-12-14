import Image from "next/image";

export default function TestPage() {
  return (
    <div>
      <h1>Test Supabase Image</h1>
      <Image
        src={/images/man.png}
        width={400}
        height={300}
        alt="test"
      />
    </div>
  );
}
