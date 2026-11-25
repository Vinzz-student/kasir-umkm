"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/seller/order-table";

export default function SellerHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/seller/orders?status=selesai")
      .then((response) => response.json())
      .then((result) => setOrders(result.data || []));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Riwayat transaksi</h1>
      <div className="card p-3">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
