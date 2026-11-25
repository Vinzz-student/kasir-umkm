import "server-only";
import { createHash, randomBytes } from "crypto";
import pool from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export async function createSellerInvitation(sellerId: number) {
  const token = randomBytes(24).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO seller_invites
      (token_hash, expires_at, created_by)
     VALUES (?, DATE_ADD(NOW(), INTERVAL 24 HOUR), ?)`,
    [tokenHash, sellerId],
  );

  return {
    id: result.insertId,
    token,
    expires_in_hours: 24,
  };
}
