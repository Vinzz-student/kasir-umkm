"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Badge from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format-currency";

type Payment = {
  order_number: string;
  total_price: number;
  payment_method: "qris" | "cash";
  payment_status: string;
};

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/payments/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setPayment(result.data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="container-main max-w-xl py-10">
        <div className="card p-6">
          <h1 className="text-2xl font-bold">Pembayaran pesanan</h1>

          {error && <p className="mt-5 text-red-600">{error}</p>}
          {!payment && !error && <p className="mt-5 text-gray-500">Memuat pembayaran...</p>}

          {payment && (
            <>
              <p className="mt-5 text-sm text-gray-500">Nomor pesanan</p>
              <p className="font-semibold">{payment.order_number}</p>

              <p className="mt-5 text-sm text-gray-500">Total pembayaran</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(Number(payment.total_price))}
              </p>

              <div className="mt-5">
                <Badge color={payment.payment_status === "lunas" ? "green" : "yellow"}>
                  {payment.payment_status.replaceAll("_", " ")}
                </Badge>
              </div>

              {payment.payment_method === "qris" ? (
                <div className="mt-6 text-center">
                  <p className="mb-3 font-semibold">Scan QRIS untuk membayar</p>
                  <div className="rounded-xl bg-gray-100 p-5">
                    <img
                      src="/images/qris/merchant-qris.png"
                      alt="QRIS toko"
                      className="mx-auto max-h-72 max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Pembayaran akan dikonfirmasi penjual setelah diperiksa.
                    Jangan tutup pesanan dengan menganggap pembayaran sudah lunas.
                  </p>
                </div>
              ) : (
                <p className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  Silakan bayar tunai kepada penjual saat mengambil pesanan.
                </p>
              )}

              <Link href="/pesanan" className="btn-primary mt-6 w-full">
                Lihat pesanan saya
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
