import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { verifyPaymentSchema } from "@/features/payments/payment.validation";
import { verifyQrisPayment } from "@/features/payments/payment.service";
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

    verifyPaymentSchema.parse(await request.json());

    await verifyQrisPayment(orderId, seller.id);

    return success({ message: "Pembayaran QRIS berhasil dikonfirmasi." });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return failure("Pesanan tidak ditemukan.", 404);
      }

      if (
        error.message === "INVALID_PAYMENT_METHOD" ||
        error.message === "INVALID_PAYMENT_STATUS" ||
        error.message === "ORDER_NOT_READY"
      ) {
        return failure("Pembayaran belum memenuhi syarat untuk dikonfirmasi.", 400);
      }
    }

    return handleError(error);
  }
}
