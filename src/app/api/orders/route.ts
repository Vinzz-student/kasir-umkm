import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/permissions";
import { createOrderSchema } from "@/features/orders/order.validation";
import {
  createOrder,
  getBuyerOrders,
} from "@/features/orders/order.service";
import { handleError, success, failure } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await requireUser();

    if (user.role !== "buyer") {
      return failure("Akses hanya untuk pembeli.", 403);
    }

    return success(await getBuyerOrders(user.id));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    if (user.role !== "buyer") {
      return failure("Akun penjual tidak dapat membuat pesanan.", 403);
    }

    const body = createOrderSchema.parse(await request.json());

    const order = await createOrder(
      user.id,
      body.items,
      body.payment_method,
    );

    return success(order, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SELLER_NOT_FOUND") {
        return success({ message: "Toko belum memiliki akun penjual." }, 400);
      }

      if (error.message === "PRODUCT_UNAVAILABLE") {
        return success({ message: "Ada produk yang sudah tidak tersedia." }, 400);
      }
    }

    return handleError(error);
  }
}
