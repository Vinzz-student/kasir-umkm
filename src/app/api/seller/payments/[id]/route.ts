import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { cashPaymentSchema } from "@/features/payments/payment.validation";
import { completeCashPayment } from "@/features/payments/payment.service";
import { handleError, failure, success } from "@/lib/api-response";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(
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

    const body = cashPaymentSchema.parse(await request.json());

    const result = await completeCashPayment(
      orderId,
      seller.id,
      body.cash_received,
    );

    return success({
      message: "Pembayaran tunai berhasil.",
      ...result,
    });
  } catch (error) {
    if (error instanceof Error) {
      const messages: Record<string, string> = {
        ORDER_NOT_FOUND: "Pesanan tidak ditemukan.",
        INVALID_PAYMENT_METHOD: "Metode pembayaran bukan tunai.",
        ALREADY_PAID: "Pesanan sudah dibayar.",
        ORDER_NOT_READY: "Pesanan belum siap diambil.",
        INSUFFICIENT_CASH: "Uang yang diterima kurang.",
      };

      if (messages[error.message]) {
        return failure(messages[error.message], 400);
      }
    }

    return handleError(error);
  }
}
