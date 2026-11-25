import { requireSeller } from "@/lib/auth/permissions";
import { createSellerInvitation } from "@/lib/auth/invitation";
import { handleError, success } from "@/lib/api-response";

export async function POST() {
  try {
    const seller = await requireSeller();
    const invitation = await createSellerInvitation(seller.id);

    return success(invitation, 201);
  } catch (error) {
    return handleError(error);
  }
}
