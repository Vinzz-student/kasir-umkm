import "server-only";
import pool from "@/lib/db";
import { transaction } from "@/lib/db/transaction";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { createHash } from "crypto";

type LoginInput = {
  identifier: string;
  password: string;
};

export async function loginUser(input: LoginInput) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, password, is_active
     FROM users
     WHERE email = ? OR username = ?
     LIMIT 1`,
    [input.identifier, input.identifier],
  );

  const user = rows[0];

  if (!user || !user.is_active) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(input.password, user.password);

  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  await createSession(user.id);
}

export async function registerBuyer(input: {
  name: string;
  nickname: string;
  username: string;
  email: string;
  password: string;
}) {
  const password = await hashPassword(input.password);

  const [existing] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM users
     WHERE email = ? OR username = ?
     LIMIT 1`,
    [input.email, input.username],
  );

  if (existing.length) {
    throw new Error("ACCOUNT_EXISTS");
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users
      (name, nickname, username, email, password, role, is_active)
     VALUES (?, ?, ?, ?, ?, 'buyer', 1)`,
    [
      input.name,
      input.nickname,
      input.username,
      input.email,
      password,
    ],
  );

  await createSession(result.insertId);
}

export async function registerSeller(input: {
  name: string;
  email: string;
  password: string;
  token: string;
}) {
  const password = await hashPassword(input.password);
  const tokenHash = createHash("sha256")
    .update(input.token)
    .digest("hex");

  const sellerId = await transaction(async (connection) => {
    const [invites] = await connection.execute<RowDataPacket[]>(
      `SELECT id, expires_at, used_at
       FROM seller_invites
       WHERE token_hash = ?
       FOR UPDATE`,
      [tokenHash],
    );

    const invite = invites[0];

    if (
      !invite ||
      invite.used_at ||
      new Date(invite.expires_at).getTime() <= Date.now()
    ) {
      throw new Error("INVALID_INVITATION");
    }

    const [existing] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [input.email],
    );

    if (existing.length) {
      throw new Error("ACCOUNT_EXISTS");
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO users
        (name, nickname, username, email, password, role, is_active)
       VALUES (?, NULL, NULL, ?, ?, 'seller', 1)`,
      [input.name, input.email, password],
    );

    await connection.execute(
      `UPDATE seller_invites
       SET used_at = NOW()
       WHERE id = ?`,
      [invite.id],
    );

    return result.insertId;
  });

  await createSession(sellerId);
}
