
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  product?: any;
};

const MAX_SIZE = 5 * 1024 * 1024;

export default function ProductForm({ product }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || "");
  const [form, setForm] = useState({
    name: product?.name || "",
    category_id: product?.category_id?.toString() || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    is_available: product?.is_available ?? true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((result) => setCategories(result.data || []));
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(product?.image || "");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile, product?.image]);

  function handleImageChange(file: File | undefined) {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      let image = product?.image || null;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadResponse = await fetch(
          "/api/seller/products/upload",
          {
            method: "POST",
            body: uploadData,
          },
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.message || "Gagal mengunggah gambar.",
          );
        }

        image = uploadResult.data.image;
      }

      const response = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            category_id: Number(form.category_id),
            price: Number(form.price),
            image,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menyimpan produk.",
        );
      }

      router.push("/penjual/menu");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan produk.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-5 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Nama produk
        </label>
        <input
          className="form-input"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Kategori
        </label>
        <select
          className="form-input"
          required
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
        >
          <option value="">Pilih kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Deskripsi
        </label>
        <textarea
          className="form-input"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Harga
        </label>
        <input
          className="form-input"
          type="number"
          min="1"
          required
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Gambar produk
        </label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="form-input"
          onChange={(e) =>
            handleImageChange(e.target.files?.[0])
          }
        />

        <p className="mt-1 text-xs text-gray-500">
          JPG, PNG, atau WebP. Maksimal 5 MB.
        </p>

        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview gambar produk"
              className="h-40 w-40 rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={(e) =>
            setForm({
              ...form,
              is_available: e.target.checked,
            })
          }
        />
        Produk tersedia
      </label>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Menyimpan..." : "Simpan produk"}
      </button>
    </form>
  );
}
