import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { handleError, failure, success } from "@/lib/api-response";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/features/products/product.service";
import { updateProductSchema } from "@/features/products/product.validation";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: Context,
) {
  try {
    const { id } = await params;
    const product = await getProductById(Number(id));

    if (!product) return failure("Produk tidak ditemukan.", 404);

    return success(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Context,
) {
  try {
    await requireSeller();

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
      return failure("ID produk tidak valid.", 400);
    }

    const body = updateProductSchema.parse(await request.json());
    const product = await updateProduct(productId, body);

    if (!product) return failure("Produk tidak ditemukan.", 404);

    return success(product);
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
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
      return failure("ID produk tidak valid.", 400);
    }

    const deleted = await deleteProduct(productId);

    if (!deleted) return failure("Produk tidak ditemukan.", 404);

    return success({ message: "Produk berhasil dihapus." });
  } catch (error) {
    return handleError(error);
  }
}
