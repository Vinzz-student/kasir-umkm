import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { handleError, failure, success } from "@/lib/api-response";
import {
  updateCategory,
  deleteCategory,
} from "@/features/categories/category.service";
import { categorySchema } from "@/features/categories/category.validation";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: Context,
) {
  try {
    await requireSeller();

    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return failure("ID kategori tidak valid.", 400);
    }

    const body = categorySchema.parse(await request.json());
    const updated = await updateCategory(categoryId, body.name);

    if (!updated) return failure("Kategori tidak ditemukan.", 404);

    return success({ message: "Kategori berhasil diperbarui." });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Context,
) {
  try {
    await requireSeller();

    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return failure("ID kategori tidak valid.", 400);
    }

    const deleted = await deleteCategory(categoryId);

    if (!deleted) return failure("Kategori tidak ditemukan.", 404);

    return success({ message: "Kategori berhasil dihapus." });
  } catch (error) {
    return handleError(error);
  }
}
