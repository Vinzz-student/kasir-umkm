"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] w-[min(1280px,calc(100%-32px))] items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900">
          Kasir<span className="text-blue-600">UMKM.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/pesanan" className="transition hover:text-blue-600">
            Pesanan
          </Link>

          <Link
            href="/akun"
            aria-label="Akun"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <UserRound size={19} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
