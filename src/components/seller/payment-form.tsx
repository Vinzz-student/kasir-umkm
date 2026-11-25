"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function PaymentForm({
  orderId,
  total,
  method,
}: {
  orderId: number;
  total: number;
  method: "cash" | "qris";
}) {
  const [cash, setCash] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        method === "cash"
          ? `/api/seller/payments/${orderId}`
          : `/api/payments/${orderId}/verify`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          method === "cash"
            ? { cash_received: Number(cash) }
            : { confirmed: true },
        ),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Pembayaran gagal.");

      if (method === "cash") {
        setSuccess(
          `Pembayaran berhasil. Kembalian: ${formatCurrency(Number(result.data.change))}`,
        );
      } else {
        setSuccess("Pembayaran QRIS berhasil dikonfirmasi.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pembayaran gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mt-6 space-y-4 p-5">
      {method === "cash" ? (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium">Uang diterima</label>
            <input
              type="number"
              min={total}
              className="form-input"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Masukkan jumlah uang"
            />
          </div>

          {cash && Number(cash) >= total && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm">
              <p>Total: {formatCurrency(total)}</p>
              <p>Diterima: {formatCurrency(Number(cash))}</p>
              <p className="mt-2 font-bold">
                Kembalian: {formatCurrency(Number(cash) - total)}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-600">
          Pastikan pembayaran QRIS benar-benar sudah diterima sebelum mengonfirmasi.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      {!success && (
        <button
          onClick={submit}
          disabled={loading || (method === "cash" && (!cash || Number(cash) < total))}
          className="btn-primary w-full"
        >
          {loading ? "Memproses..." : method === "cash" ? "Selesaikan pembayaran" : "Konfirmasi pembayaran"}
        </button>
      )}
    </div>
  );
}
