import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { handleError, success } from "@/lib/api-response";
import {
  createCategory,
  getCategories,
} from "@/features/categories/category.service";
import { categorySchema } from "@/features/categories/category.validation";

export async function GET() {
  try {
    return success(await getCategories());
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSeller();

    const body = categorySchema.parse(await request.json());
    const category = await createCategory(body.name);

    return success(category, 201);
  } catch (error) {
    return handleError(error);
  }
}
