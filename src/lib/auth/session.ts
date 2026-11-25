import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const COOKIE_NAME = "kasir_session";
const SESSION_DAYS = 7;

export type SessionUser = {
  id: number;
  name: string;
  nickname: string | null;
  username: string | null;
  email: string;
  role: "buyer" | "seller";
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  await pool.execute(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [userId, tokenHash, SESSION_DAYS],
  );

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT u.id, u.name, u.nickname, u.username, u.email, u.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?
       AND s.expires_at > NOW()
       AND u.is_active = 1
     LIMIT 1`,
    [hashToken(token)],
  );

  return (rows[0] as SessionUser) ?? null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await pool.execute<ResultSetHeader>(
      "DELETE FROM sessions WHERE token_hash = ?",
      [hashToken(token)],
    );
  }

  cookieStore.delete(COOKIE_NAME);
}
