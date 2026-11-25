import { getSessionUser } from "@/lib/auth/session";
import { success, handleError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getSessionUser();
    return success({ user });
  } catch (error) {
    return handleError(error);
  }
}
