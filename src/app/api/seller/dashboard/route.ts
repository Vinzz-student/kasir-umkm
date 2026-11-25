import { requireSeller } from "@/lib/auth/permissions";
import { getSellerDashboard } from "@/features/orders/order.service";
import { handleError, success } from "@/lib/api-response";

export async function GET() {
  try {
    const seller = await requireSeller();
    return success(await getSellerDashboard(seller.id));
  } catch (error) {
    return handleError(error);
  }
}
