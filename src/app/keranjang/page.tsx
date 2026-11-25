"use client";

import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import CartItem from "@/components/buyer/cart-item";
import CartSummary from "@/components/buyer/cart-summary";
import EmptyState from "@/components/shared/empty-state";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      <Navbar />
      <main className="container-main min-h-[70vh] py-10">
        <h1 className="mb-7 text-2xl font-bold">Keranjang belanja</h1>

        {!items.length ? (
          <EmptyState title="Keranjang masih kosong" description="Pilih menu terlebih dahulu." />
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <div className="card px-5">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            <CartSummary total={total}>
              <Link href="/checkout" className="btn-primary w-full">
                Lanjut checkout
              </Link>
            </CartSummary>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
