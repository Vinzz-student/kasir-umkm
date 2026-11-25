import { NextRequest } from "next/server";
import { requireSeller } from "@/lib/auth/permissions";
import { getSellerOrders } from "@/features/orders/order.service";
import { handleError, success } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const seller = await requireSeller();
    const status = request.nextUrl.searchParams.get("status") || undefined;

    return success(await getSellerOrders(seller.id, status));
  } catch (error) {
    return handleError(error);
  }
}
