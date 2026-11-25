import type { Metadata } from "next";
import { Suspense } from "react";
import { CartProvider } from "@/hooks/use-cart";
import FloatingCart from "@/components/buyer/floating-cart";
import StoreStatus from "@/components/buyer/store-status";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kasir UMKM",
  description: "Pemesanan makanan dan minuman dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          {children}
          <Suspense fallback={null}>
            <FloatingCart />
          </Suspense>
          <StoreStatus />
        </CartProvider>
      </body>
    </html>
  );
}
