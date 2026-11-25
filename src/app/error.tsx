"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 text-sm text-gray-500">
        Halaman tidak dapat ditampilkan saat ini.
      </p>
      <button onClick={reset} className="btn-primary mt-6">
        Coba lagi
      </button>
    </main>
  );
}
