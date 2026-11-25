import { NextRequest } from "next/server";
import { registerSchema } from "@/features/auth/auth.validation";
import { registerBuyer } from "@/features/auth/auth.service";
import { success, failure, handleError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    await registerBuyer(body);

    return success({ message: "Pendaftaran berhasil." }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_EXISTS") {
      return failure("Email atau username sudah digunakan.", 409);
    }

    return handleError(error);
  }
}
