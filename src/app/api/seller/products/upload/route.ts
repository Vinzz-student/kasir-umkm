
import { NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireSeller } from "@/lib/auth/permissions";
import { handleError, success, failure } from "@/lib/api-response";

const MAX_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function isValidImage(buffer: Buffer, type: string) {
  if (type === "image/jpeg") {
    return buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;
  }

  if (type === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
  }

  if (type === "image/webp") {
    return buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    await requireSeller();

    const data = await request.formData();
    const file = data.get("file");

    if (!(file instanceof File)) {
      return failure("Pilih gambar terlebih dahulu.", 400);
    }

    if (!allowedTypes[file.type]) {
      return failure("Format gambar harus JPG, PNG, atau WebP.", 400);
    }

    if (file.size > MAX_SIZE) {
      return failure("Ukuran gambar maksimal 5 MB.", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isValidImage(buffer, file.type)) {
      return failure("File gambar tidak valid.", 400);
    }

    const extension = allowedTypes[file.type];
    const filename = `${randomUUID()}.${extension}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
    );

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return success({
      image: `/uploads/products/${filename}`,
    });
  } catch (error) {
    return handleError(error);
  }
}
