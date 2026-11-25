"use client";

import { useEffect, useState } from "react";

export default function StoreHoursPage() {
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("17:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/store-hours");
        const result = await response.json();

        if (!response.ok) throw new Error();

        setOpenTime(result.data.openTime);
        setCloseTime(result.data.closeTime);
      } catch {
        alert("Gagal memuat jam operasional.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function save() {
    setSaving(true);

    try {
      const response = await fetch("/api/store-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openTime, closeTime }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan jadwal.");
      }

      alert("Jam operasional berhasil disimpan.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Memuat pengaturan...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-bold">Jam operasional</h1>
      <p className="mb-6 text-sm text-gray-500">
        Atur jam buka toko yang berlaku setiap hari.
      </p>

      <div className="card space-y-5 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Jam buka</label>
          <input
            type="time"
            className="form-input"
            value={openTime}
            onChange={(event) => setOpenTime(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Jam tutup</label>
          <input
            type="time"
            className="form-input"
            value={closeTime}
            onChange={(event) => setCloseTime(event.target.value)}
          />
        </div>

        <p className="text-xs text-gray-500">
          Jadwal ini berlaku Senin sampai Minggu. Status toko berubah otomatis
          berdasarkan waktu WIB.
        </p>

        <button
          onClick={save}
          disabled={saving || openTime === closeTime}
          className="btn-primary w-full disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan jam operasional"}
        </button>
      </div>
    </div>
  );
}
