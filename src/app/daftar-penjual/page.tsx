"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    token: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Pendaftaran gagal.");

      router.push("/penjual");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-main flex min-h-screen items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-7">
        <Link href="/login" className="text-sm text-blue-600">← Kembali ke login</Link>

        <div>
          <h1 className="text-2xl font-bold">Daftar sebagai penjual</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pendaftaran membutuhkan token undangan.
          </p>
        </div>

        {[
          ["name", "Nama lengkap", "text"],
          ["email", "Email", "email"],
          ["password", "Password minimal 8 karakter", "password"],
          ["token", "Token undangan", "text"],
        ].map(([key, label, type]) => (
          <div key={key}>
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <input
              type={type}
              className="form-input"
              required
              minLength={key === "password" ? 8 : undefined}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Memproses..." : "Daftar penjual"}
        </button>
      </form>
    </main>
  );
}
