"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PaymentForm from "@/components/seller/payment-form";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function SellerPaymentPage() {
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

  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>Memuat pembayaran...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Pembayaran pesanan</h1>

      <div className="card p-6">
        <p className="text-sm text-gray-500">{order.order_number}</p>
        <h2 className="mt-1 text-lg font-semibold">{order.customer_name}</h2>
        <p className="mt-5 text-sm text-gray-500">Total tagihan</p>
        <p className="text-2xl font-bold">{formatCurrency(Number(order.total_price))}</p>

        {order.payment_status === "lunas" ? (
          <p className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Pembayaran sudah lunas.
          </p>
        ) : order.order_status !== "siap_diambil" ? (
          <p className="mt-5 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
            Pesanan harus berstatus siap diambil sebelum pembayaran diselesaikan.
          </p>
        ) : (
          <PaymentForm
            orderId={Number(id)}
            total={Number(order.total_price)}
            method={order.payment_method}
          />
        )}
      </div>
    </div>
  );
}
