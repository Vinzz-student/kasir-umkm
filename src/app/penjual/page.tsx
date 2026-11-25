"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/seller/stat-card";
import Badge from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function SellerDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/seller/dashboard")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setData(result.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Memuat dashboard...</p>;

  const stats = data.stats;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Ringkasan aktivitas toko.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Sedang diproses" value={stats.processing} />
        <StatCard title="Siap diambil" value={stats.ready} />
        <StatCard title="Pesanan selesai" value={stats.completed} />
        <StatCard title="Total pendapatan" value={formatCurrency(Number(stats.revenue))} />
      </div>

      <section className="card mt-8 p-5">
        <div className="mb-5 flex justify-between">
          <h2 className="font-bold">Pesanan terbaru</h2>
          <Link href="/penjual/pesanan" className="text-sm text-blue-600">Lihat semua</Link>
        </div>

        {!data.recent_orders.length ? (
          <p className="text-sm text-gray-500">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {data.recent_orders.map((order: any) => (
              <Link
                href={`/penjual/pesanan/${order.id}`}
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(Number(order.total_price))}</p>
                  <Badge color={order.order_status === "selesai" ? "green" : "yellow"}>
                    {order.order_status.replaceAll("_", " ")}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
