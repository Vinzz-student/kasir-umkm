import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format-currency";
import Badge from "@/components/ui/badge";

export default function OrderTable({ orders }: { orders: any[] }) {
  if (!orders.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Belum ada pesanan.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500">
          <tr>
            <th className="p-3">Nomor</th>
            <th className="p-3">Pelanggan</th>
            <th className="p-3">Total</th>
            <th className="p-3">Uang Dibayar</th>
            <th className="p-3">Kembalian</th>
            <th className="p-3">Status</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0">
              <td className="p-3 font-medium">{order.order_number}</td>

              <td className="p-3">{order.customer_name}</td>

              <td className="p-3">
                {formatCurrency(Number(order.total_price))}
              </td>

              <td className="p-3">
                {formatCurrency(Number(order.cash_received || 0))}
              </td>

              <td className="p-3 font-medium text-green-600">
                {formatCurrency(Number(order.change_amount || 0))}
              </td>

              <td className="p-3">
                <Badge color={order.order_status === "selesai" ? "green" : "yellow"}>
                  {order.order_status.replaceAll("_", " ")}
                </Badge>
              </td>

              <td className="p-3">
                <Link
                  href={`/penjual/pesanan/${order.id}`}
                  className="text-blue-600"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
