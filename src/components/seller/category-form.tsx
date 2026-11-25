"use client";

import { useState } from "react";

export default function CategoryForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Gagal menambah kategori.");
      return;
    }

    setName("");
    onCreated();
  }

  return (
    <form onSubmit={submit} className="mb-6 flex flex-wrap gap-3">
      <input
        className="form-input max-w-sm"
        placeholder="Nama kategori"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="btn-primary">Tambah kategori</button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
