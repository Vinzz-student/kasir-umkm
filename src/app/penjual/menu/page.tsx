"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function SellerMenuPage() {
  const [products, setProducts] = useState<any[]>([]);

  async function load() {
    const response = await fetch("/api/products");
    const result = await response.json();
    setProducts(result.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm("Hapus produk ini?")) return;

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) load();
    else alert("Produk gagal dihapus.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Menu produk</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola menu toko.</p>
        </div>
        <Link href="/penjual/menu/tambah" className="btn-primary">
          Tambah produk
        </Link>
      </div>

      <div className="card overflow-x-auto p-3">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Produk</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Ketersediaan</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category_name}</td>
                <td className="p-3">{formatCurrency(Number(product.price))}</td>
                <td className="p-3">{product.is_available ? "Tersedia" : "Habis"}</td>
                <td className="space-x-3 p-3">
                  <Link href={`/penjual/menu/${product.id}`} className="text-blue-600">
                    Edit
                  </Link>
                  <button onClick={() => remove(product.id)} className="text-red-600">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!products.length && <p className="p-5 text-center text-gray-500">Belum ada produk.</p>}
      </div>
    </div>
  );
}
