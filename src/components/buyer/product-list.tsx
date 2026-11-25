import ProductCard from "./product-card";
import EmptyState from "@/components/shared/empty-state";
import type { Product } from "@/features/products/product.types";

export default function ProductList({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        description="Coba gunakan kata kunci atau kategori lain."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
