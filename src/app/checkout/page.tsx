"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [method, setMethod] = useState<"qris" | "cash">("qris");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  async function submit() {
    if (!items.length) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          payment_method: method,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error(result.message || "Checkout gagal.");

      clearCart();
      router.push(`/pembayaran/${result.data.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container-main max-w-2xl py-10">
        <Link href="/keranjang" className="text-sm text-blue-600">← Kembali ke keranjang</Link>
        <h1 className="mb-7 mt-4 text-2xl font-bold">Checkout</h1>

        {!items.length ? (
          <p>Keranjang kosong.</p>
        ) : (
          <div className="card space-y-6 p-6">
            <div>
              <h2 className="font-semibold">Ringkasan pesanan</h2>
              {items.map((item) => (
                <div key={item.id} className="mt-3 flex justify-between gap-3 text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="mt-4 flex justify-between border-t pt-4 font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-semibold">Metode pembayaran</h2>
              <label className="mb-2 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input type="radio" checked={method === "qris"} onChange={() => setMethod("qris")} />
                <span>QRIS</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} />
                <span>Tunai / Cash</span>
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button onClick={submit} disabled={loading} className="btn-primary w-full">
              {loading ? "Memproses..." : "Buat pesanan"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
