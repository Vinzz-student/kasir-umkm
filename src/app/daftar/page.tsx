
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pendaftaran gagal.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Pendaftaran gagal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-main flex min-h-screen items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-7">
        <Link href="/" className="text-sm text-blue-600">
          ← Kembali ke menu
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Buat akun</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar untuk mulai memesan.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {[
          ["name", "Nama lengkap", "text"],
          ["nickname", "Nama panggilan", "text"],
          ["username", "Username", "text"],
          ["email", "Email", "email"],
          ["password", "Password (minimal 8 karakter)", "password"],
        ].map(([key, label, type]) => (
          <div key={key}>
            <label className="mb-2 block text-sm font-medium">
              {label}
            </label>
            <input
              type={type}
              className="form-input"
              required
              minLength={key === "password" ? 8 : undefined}
              value={form[key as keyof typeof form]}
              onChange={(e) => update(key, e.target.value)}
            />
          </div>
        ))}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Memproses..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Ingin bergabung sebagai penjual?{" "}
          <Link href="/daftar/penjual" className="text-blue-600">
            Daftar sebagai penjual
          </Link>
        </p>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600">
            Masuk
          </Link>
        </p>
      </form>
    </main>
  );
}
