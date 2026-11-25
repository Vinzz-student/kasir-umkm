"use client";

import { formatCurrency } from "@/lib/utils/format-currency";

export default function CartSummary({
  total,
  children,
}: {
  total: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="card h-fit p-5">
      <h2 className="font-bold">Ringkasan belanja</h2>
      <div className="mt-5 flex justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
