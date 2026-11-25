"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type StoreHours = {
  openTime: string;
  closeTime: string;
  isOpen: boolean;
};

export default function StoreStatus() {
  const [hours, setHours] = useState<StoreHours | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Periksa session terlebih dahulu.
        const sessionResponse = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!sessionResponse.ok) return;

        const sessionData = await sessionResponse.json();
        const user = sessionData.data?.user;

        // Pengunjung dan seller tidak mendapatkan overlay.
        if (!user || user.role !== "buyer") return;

        // Ambil jadwal terbaru hanya untuk buyer.
        const hoursResponse = await fetch("/api/store-hours", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!hoursResponse.ok) return;

        const hoursData = await hoursResponse.json();
        const storeHours = hoursData.data as StoreHours;

        if (cancelled || !storeHours) return;

        setHours(storeHours);
        setIsClosed(!storeHours.isOpen);
      } catch {
        // Overlay tidak ditampilkan jika data gagal dimuat.
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isClosed) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isClosed]);

  if (!isClosed || !hours) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Toko sedang tutup"
      className="fixed inset-0 z-[100] flex min-h-screen touch-none items-center justify-center overscroll-none bg-slate-950/35 px-6 backdrop-blur-2xl"
    >
      <div className="pointer-events-none flex flex-col items-center text-center">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-[8px] border-red-500/90 sm:h-80 sm:w-80">
          <div className="absolute inset-3 rounded-full border border-red-400/50" />

          <span className="text-6xl font-black tracking-[0.12em] text-red-600 sm:text-7xl">
            TUTUP
          </span>
        </div>

        <h1 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Toko sedang tutup
        </h1>

        <p className="mt-3 text-sm text-slate-700 sm:text-base">
          Kami akan kembali melayani pesanan pada jam operasional.
        </p>

        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 px-6 py-4 shadow-lg backdrop-blur-xl">
          <Clock size={22} className="text-blue-600" />

          <div className="text-left">
            <p className="text-xs font-medium text-slate-500">
              Jam operasional setiap hari
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {hours.openTime} – {hours.closeTime} WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
