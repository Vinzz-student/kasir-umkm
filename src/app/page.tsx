"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ArrowDown,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ProductList from "@/components/buyer/product-list";
import CategoryFilter from "@/components/buyer/category-filter";
import LoadingSpinner from "@/components/shared/loading-spinner";

import type { Product } from "@/features/products/product.types";
import type { Category } from "@/features/categories/category.types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (!productResponse.ok || !categoryResponse.ok) {
          throw new Error("Gagal memuat katalog.");
        }

        const productData = await productResponse.json();
        const categoryData = await categoryResponse.json();

        setProducts(productData.data);
        setCategories(categoryData.data);
      } catch {
        setError("Katalog gagal dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selected === null || product.category_id === selected;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-[75vh] w-[min(1280px,calc(100%-32px))] pb-16 pt-7 sm:pt-10">
        <section className="relative isolate mb-14 overflow-hidden rounded-[28px] bg-[#102c58] px-7 py-12 text-white shadow-xl shadow-blue-950/10 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -right-20 -top-28 -z-10 h-96 w-96 rounded-full border-[55px] border-blue-400/10" />
          <div className="absolute -bottom-48 right-32 -z-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-12 top-10 -z-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-blue-100 backdrop-blur-md">
              <Sparkles size={14} />
              Pilihan menu untukmu
            </div>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Temukan menu
              <span className="block text-blue-300">
                favoritmu.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
              Pilih makanan dan minuman kesukaanmu. Pesan dengan mudah
              tanpa perlu antre lama.
            </p>

            <a
              href="#menu"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Lihat menu
              <ArrowDown size={17} />
            </a>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[40%] items-center justify-center lg:flex">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
              <div className="absolute h-56 w-56 rounded-full border border-white/15" />
              <div className="absolute h-40 w-40 rounded-full border border-white/15" />

              <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
                <span className="text-5xl">🍽️</span>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="scroll-mt-24">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Katalog
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Jelajahi menu
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Temukan pilihan yang cocok untukmu.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Cari makanan atau minuman..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="rounded-2xl border border-red-100 bg-red-50 py-10 text-center text-sm text-red-600">
              {error}
            </p>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {filteredProducts.length} menu ditemukan
                </p>
              </div>

              <ProductList products={filteredProducts} />
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
