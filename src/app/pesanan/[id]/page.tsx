"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import OrderStatus from "@/components/buyer/order-status";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setOrder(result.data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="container-main max-w-2xl py-10">
        <Link href="/pesanan" className="text-sm text-blue-600">← Kembali</Link>

        {error && <p className="mt-6 text-red-600">{error}</p>}
        {!order && !error && <p className="mt-6">Memuat detail pesanan...</p>}

        {order && (
          <div className="card mt-5 p-6">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Nomor pesanan</p>
                <h1 className="font-bold">{order.order_number}</h1>
              </div>
              <OrderStatus status={order.order_status} />
            </div>

            <div className="mt-6 space-y-4 border-t pt-5">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>{formatCurrency(Number(item.subtotal))}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t pt-5 font-bold">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total_price))}</span>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-600">
              <p>Metode pembayaran: {order.payment_method?.toUpperCase()}</p>
              <p>Status pembayaran: {order.payment_status?.replaceAll("_", " ")}</p>
            </div>

            {order.order_status === "siap_diambil" && (
              <p className="mt-5 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                Pesanan siap diambil. Silakan datang ke toko.
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
