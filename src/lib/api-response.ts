import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success(data: unknown, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status },
  );
}

export function failure(
  message: string,
  status = 400,
  errors?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status },
  );
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return failure("Data yang dimasukkan tidak valid.", 422, error.flatten());
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return failure("Silakan login terlebih dahulu.", 401);
    }

    if (error.message === "FORBIDDEN") {
      return failure("Kamu tidak memiliki akses.", 403);
    }

    console.error(error);
  }

  return failure("Terjadi kesalahan pada server.", 500);
}
