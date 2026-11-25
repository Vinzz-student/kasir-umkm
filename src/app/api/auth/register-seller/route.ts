import { NextRequest } from "next/server";
import { registerSellerSchema } from "@/features/auth/auth.validation";
import { registerSeller } from "@/features/auth/auth.service";
import { success, failure, handleError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = registerSellerSchema.parse(await request.json());
    await registerSeller(body);

    return success({ message: "Akun penjual berhasil dibuat." }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_INVITATION") {
        return failure("Token undangan tidak valid atau sudah kedaluwarsa.", 400);
      }

      if (error.message === "ACCOUNT_EXISTS") {
        return failure("Email sudah digunakan.", 409);
      }
    }

    return handleError(error);
  }
}
