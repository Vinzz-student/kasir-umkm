import { randomBytes } from "crypto";

export function generateOrderNumber() {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = randomBytes(3).toString("hex").toUpperCase();

  return `ORD-${datePart}-${randomPart}`;
}
