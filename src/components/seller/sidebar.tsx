"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/penjual", label: "Dashboard" },
  { href: "/penjual/pesanan", label: "Pesanan aktif" },
  { href: "/penjual/menu", label: "Menu produk" },
  { href: "/penjual/kategori", label: "Kategori" },
  { href: "/penjual/riwayat", label: "Riwayat transaksi" },
  { href: "/penjual/undangan", label: "Undangan penjual" },
  { href: "/penjual/jam-operasional", label: "Jam operasional" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <Link href="/" className="mb-5 block text-lg font-bold">
        Kasir<span className="text-blue-600">UMKM.</span>
      </Link>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Menu penjual
      </p>

      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm ${
              pathname === link.href
                ? "bg-blue-50 font-semibold text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
