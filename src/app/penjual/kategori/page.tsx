"use client";

import { useEffect, useState } from "react";
import CategoryForm from "@/components/seller/category-form";

export default function SellerCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  async function load() {
    const response = await fetch("/api/categories");
    const result = await response.json();
    setCategories(result.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm("Hapus kategori ini? Kategori yang masih digunakan produk tidak dapat dihapus.")) return;

    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });

    if (response.ok) load();
    else alert("Kategori tidak dapat dihapus. Pastikan tidak ada produk yang menggunakannya.");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kategori menu</h1>
      <CategoryForm onCreated={load} />

      <div className="card divide-y p-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-xs text-gray-500">{category.product_count} produk</p>
            </div>
            <button onClick={() => remove(category.id)} className="text-sm text-red-600">
              Hapus
            </button>
          </div>
        ))}
        {!categories.length && <p className="py-5 text-center text-sm text-gray-500">Belum ada kategori.</p>}
      </div>
    </div>
  );
}
