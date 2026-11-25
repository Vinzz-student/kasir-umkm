import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/permissions";
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
    const user = await requireUser();
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return failure("ID pesanan tidak valid.", 400);
    }

    const order = await getOrderDetail(orderId, user.id, user.role);

    if (!order) return failure("Pesanan tidak ditemukan.", 404);

    return success({
      order_number: order.order_number,
      total_price: order.total_price,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      amount_paid: order.amount_paid,
      cash_received: order.cash_received,
      change_amount: order.change_amount,
    });
  } catch (error) {
    return handleError(error);
  }
}
