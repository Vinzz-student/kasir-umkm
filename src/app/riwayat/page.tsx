"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import OrderCard from "@/components/buyer/order-card";
import EmptyState from "@/components/shared/empty-state";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setOrders(result.data.filter((order: any) => order.order_status === "selesai"));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container-main min-h-[70vh] py-10">
        <h1 className="mb-7 text-2xl font-bold">Riwayat pesanan</h1>

        {loading ? (
          <p>Memuat riwayat...</p>
        ) : !orders.length ? (
          <EmptyState title="Belum ada riwayat pesanan" />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </main>
    </>
  );
}
