import { NextRequest } from "next/server";
import { requireUser, requireSeller } from "@/lib/auth/permissions";
import { getOrderDetail } from "@/features/orders/order.service";
import { handleError, failure, success } from "@/lib/api-response";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: Context,
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return failure("ID pesanan tidak valid.", 400);
    }

    const user = await requireUser();

    const order = await getOrderDetail(
      orderId,
      user.id,
      user.role,
    );

    if (!order) return failure("Pesanan tidak ditemukan.", 404);

    return success(order);
  } catch (error) {
    return handleError(error);
  }
}
