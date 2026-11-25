import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-6xl font-bold text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-gray-500">
        Halaman yang kamu cari tidak tersedia.
      </p>
      <Link href="/" className="btn-primary mt-6">Kembali ke beranda</Link>
    </main>
  );
}
