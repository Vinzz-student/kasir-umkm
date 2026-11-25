"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format-currency";
import OrderStatus from "@/components/buyer/order-status";

export default function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadOrder() {
    const response = await fetch(`/api/orders/${id}`);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    setOrder(result.data);
  }

  useEffect(() => {
    loadOrder().catch((err) => setError(err.message));
  }, [id]);

  async function updateStatus(status: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/seller/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      await loadOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui pesanan.");
    } finally {
      setLoading(false);
    }
  }

  if (!order) return <p>{error || "Memuat pesanan..."}</p>;

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="mb-5 text-sm text-blue-600">
        ← Kembali
      </button>

      <div className="card p-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{order.order_number}</h1>
            <p className="mt-1 text-sm text-gray-500">{order.customer_name}</p>
          </div>
          <OrderStatus status={order.order_status} />
        </div>

        <div className="my-6 space-y-4 border-y py-5">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <span>{item.product_name} × {item.quantity}</span>
              <span>{formatCurrency(Number(item.subtotal))}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(Number(order.total_price))}</span>
        </div>

        <p className="mt-4 text-sm">Metode: {order.payment_method?.toUpperCase()}</p>
        <p className="text-sm">Pembayaran: {order.payment_status?.replaceAll("_", " ")}</p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {order.order_status === "diproses" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("siap_diambil")}
            className="btn-primary mt-6 w-full"
          >
            Tandai siap diambil
          </button>
        )}

        {order.order_status === "siap_diambil" && order.payment_method === "cash" && (
          <a href={`/penjual/pembayaran/${order.id}`} className="btn-primary mt-6 w-full">
            Proses pembayaran tunai
          </a>
        )}

        {order.order_status === "siap_diambil" && order.payment_method === "qris" && (
          <a href={`/penjual/pembayaran/${order.id}`} className="btn-primary mt-6 w-full">
            Verifikasi pembayaran QRIS
          </a>
        )}
      </div>
    </div>
  );
}
