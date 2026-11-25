"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/seller/order-table";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const query = status ? `?status=${status}` : "";

    fetch(`/api/seller/orders${query}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setOrders(result.data);
      });
  }, [status]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pesanan</h1>

      <select
        className="form-input mb-5 max-w-xs"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Semua pesanan</option>
        <option value="diproses">Diproses</option>
        <option value="siap_diambil">Siap diambil</option>
        <option value="selesai">Selesai</option>
      </select>

      <div className="card p-3">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
