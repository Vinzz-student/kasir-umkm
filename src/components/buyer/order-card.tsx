import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format-currency";
import OrderStatus from "./order-status";

type Props = {
  order: {
    id: number;
    order_number: string;
    total_price: number;
    order_status: string;
    created_at: string;
  };
};

export default function OrderCard({ order }: Props) {
  return (
    <Link href={`/pesanan/${order.id}`} className="card block p-5 transition hover:border-blue-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{order.order_number}</p>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString("id-ID")}
          </p>
        </div>
        <OrderStatus status={order.order_status} />
      </div>

      <div className="mt-5 flex justify-between border-t pt-4">
        <span className="text-sm text-gray-500">Total pesanan</span>
        <strong>{formatCurrency(Number(order.total_price))}</strong>
      </div>
    </Link>
  );
}
