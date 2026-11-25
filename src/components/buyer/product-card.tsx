"use client";

import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Product } from "@/features/products/product.types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-950/[0.06]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Tidak ada gambar
          </div>
        )}

        {!product.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-gray-800 backdrop-blur">
              Tidak tersedia
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-2 text-xs font-medium text-blue-600">
          {product.category_name}
        </p>

        <h3 className="line-clamp-1 font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="font-bold text-gray-900">
            {formatCurrency(Number(product.price))}
          </p>

          <button
            type="button"
            disabled={!product.is_available}
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
              })
            }
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
