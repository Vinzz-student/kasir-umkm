"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function CartItem({
  item,
}: {
  item: ReturnType<typeof useCart>["items"][number];
}) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-gray-100 py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.image && (
          <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{item.name}</p>
        <p className="mt-1 text-sm text-blue-600">{formatCurrency(item.price)}</p>

        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            <Minus size={16} />
          </button>
          <span className="text-sm">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <Plus size={16} />
          </button>
          <button onClick={() => removeItem(item.id)} className="ml-auto text-red-500">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
