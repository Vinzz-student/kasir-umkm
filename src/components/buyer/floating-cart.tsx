"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils/format-currency";

export default function FloatingCart() {
  const { items } = useCart();
  const pathname = usePathname();
  const [bottom, setBottom] = useState(24);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    function updatePosition() {
      const footer = document.querySelector("footer");

      if (!footer) {
        setBottom(24);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const overlap = window.innerHeight - footerTop;

      setBottom(overlap > 0 ? overlap + 16 : 24);
    }

    updatePosition();

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  if (
    totalItems === 0 ||
    pathname.startsWith("/penjual") ||
    pathname === "/keranjang" ||
    pathname.startsWith("/checkout")
  ) {
    return null;
  }

  return (
    <Link
      href="/keranjang"
      style={{ bottom }}
      className="fixed right-5 z-50 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:bg-white sm:right-8 sm:gap-4 sm:px-5 sm:py-4"
    >
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
        <ShoppingCart size={21} />

        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 px-1 text-[10px] font-bold text-white">
          {totalItems}
        </span>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">
          {totalItems} item di keranjang
        </p>
        <p className="mt-0.5 text-sm font-bold text-gray-900">
          {formatCurrency(totalPrice)}
        </p>
      </div>

      <ArrowRight size={18} className="ml-1 text-blue-600" />
    </Link>
  );
}
