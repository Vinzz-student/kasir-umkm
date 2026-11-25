export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-[min(1280px,calc(100%-32px))] flex-col items-center justify-between gap-2 py-5 text-center text-xs text-gray-500 sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} Kasir UMKM. Semua hak dilindungi.
        </p>

        <p>Dibuat untuk memudahkan pemesanan.</p>
      </div>
    </footer>
  );
}
