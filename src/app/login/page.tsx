"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal.");
      }

      const session = await fetch("/api/auth/session");
      const sessionData = await session.json();

      router.push(
        sessionData.data.user?.role === "seller" ? "/penjual" : "/",
      );
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-main flex min-h-screen items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-7">
        <Link href="/" className="text-sm text-blue-600">← Kembali ke menu</Link>

        <div>
          <h1 className="text-2xl font-bold">Masuk ke akun</h1>
          <p className="mt-1 text-sm text-gray-500">
            Masukkan email atau username kamu.
          </p>
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div>
          <label className="mb-2 block text-sm font-medium">Email atau username</label>
          <input
            className="form-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-semibold text-blue-600">
            Daftar
          </Link>
        </p>
      </form>
    </main>
  );
}
