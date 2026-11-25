import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { updateOrderStatusSchema } from "@/features/orders/order.validation";
import { updateOrderStatus } from "@/features/orders/order.service";
import { handleError, failure, success } from "@/lib/api-response";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: Context,
) {
  try {
    const seller = await requireSeller();
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return failure("ID pesanan tidak valid.", 400);
    }

    const body = updateOrderStatusSchema.parse(await request.json());

    await updateOrderStatus(orderId, seller.id, body.status);

    return success({ message: "Status pesanan berhasil diperbarui." });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return failure("Pesanan tidak ditemukan.", 404);
      }

      if (error.message === "INVALID_ORDER_STATUS") {
        return failure("Perubahan status pesanan tidak valid.", 400);
      }
    }

    return handleError(error);
  }
}
