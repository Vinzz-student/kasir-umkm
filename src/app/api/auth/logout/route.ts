import { deleteSession } from "@/lib/auth/session";
import { success, handleError } from "@/lib/api-response";

export async function POST() {
  try {
    await deleteSession();
    return success({ message: "Logout berhasil." });
  } catch (error) {
    return handleError(error);
  }
}
