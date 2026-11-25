"use client";

import { useState } from "react";

export default function SellerInvitationPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    setToken("");

    try {
      const response = await fetch("/api/seller/invites", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Gagal membuat undangan.");

      setToken(result.data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat undangan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-bold">Undangan penjual</h1>
      <p className="mb-6 text-sm text-gray-500">
        Buat token untuk mendaftarkan akun penjual baru. Token berlaku 24 jam dan hanya dapat digunakan sekali.
      </p>

      <div className="card space-y-4 p-6">
        <button onClick={generate} disabled={loading} className="btn-primary">
          {loading ? "Membuat..." : "Buat token undangan"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {token && (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-xs text-gray-500">Token undangan</p>
            <code className="block break-all text-sm">{token}</code>
            <button
              onClick={() => navigator.clipboard.writeText(token)}
              className="mt-3 text-sm font-semibold text-blue-600"
            >
              Salin token
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Simpan token ini. Token tidak ditampilkan kembali setelah halaman ditutup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
