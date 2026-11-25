"use client";

import { useRouter } from "next/navigation";

export default function SellerHeader() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-5 py-4">
      <div>
        <p className="font-semibold">Panel Penjual</p>
        <p className="text-xs text-gray-500">Kelola toko dan pesanan</p>
      </div>
      <button onClick={logout} className="text-sm text-red-600">
        Keluar
      </button>
    </header>
  );
}
