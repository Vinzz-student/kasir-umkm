import { NextRequest } from "next/server";
import { loginSchema } from "@/features/auth/auth.validation";
import { loginUser } from "@/features/auth/auth.service";
import { success, failure, handleError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    await loginUser(body);

    return success({ message: "Login berhasil." });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return failure("Email, username, atau password salah.", 401);
    }

    return handleError(error);
  }
}
