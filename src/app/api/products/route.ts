import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { handleError, success } from "@/lib/api-response";
import {
  createProduct,
  getProducts,
} from "@/features/products/product.service";
import { productSchema } from "@/features/products/product.validation";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || undefined;
    const categoryParam = request.nextUrl.searchParams.get("category");
    const category = categoryParam ? Number(categoryParam) : undefined;

    const products = await getProducts(search, category);
    return success(products);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSeller();

    const body = productSchema.parse(await request.json());
    const product = await createProduct(body);

    return success(product, 201);
  } catch (error) {
    return handleError(error);
  }
}
