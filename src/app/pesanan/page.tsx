"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import OrderCard from "@/components/buyer/order-card";
import EmptyState from "@/components/shared/empty-state";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (response) => {
        const result = await response.json();

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) throw new Error(result.message);
        setOrders(result.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container-main min-h-[70vh] py-10">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pesanan saya</h1>
          <Link href="/" className="text-sm text-blue-600">Kembali ke menu</Link>
        </div>

        {loading ? (
          <p>Memuat pesanan...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : !orders.length ? (
          <EmptyState title="Belum ada pesanan" description="Pesanan kamu akan muncul di sini." />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </main>
    </>
  );
}
