"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/navbar";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((result) => setUser(result.data.user))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="container-main max-w-2xl py-10">
        <h1 className="mb-7 text-2xl font-bold">Akun saya</h1>

        {loading ? (
          <p>Memuat akun...</p>
        ) : !user ? (
          <div className="card p-6">
            <p className="mb-4">Kamu belum login.</p>
            <Link href="/login" className="btn-primary">Masuk</Link>
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>

            <div className="mt-6 space-y-3 border-t pt-5 text-sm">
              <p>Nama panggilan: {user.nickname || "-"}</p>
              <p>Username: {user.username || "-"}</p>
              <Link href="/pesanan" className="block text-blue-600">Pesanan saya</Link>
              <Link href="/riwayat" className="block text-blue-600">Riwayat pesanan</Link>
            </div>

            <button onClick={logout} className="btn-secondary mt-7 w-full text-red-600">
              Keluar dari akun
            </button>
          </div>
        )}
      </main>
    </>
  );
}
