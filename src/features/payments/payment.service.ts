import "server-only";
import pool from "@/lib/db";
import { transaction } from "@/lib/db/transaction";
import type { RowDataPacket } from "mysql2";

export async function getPayment(orderId: number, sellerId: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT p.*, o.order_number, o.total_price,
            o.order_status
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     WHERE p.order_id = ? AND o.seller_id = ?
     LIMIT 1`,
    [orderId, sellerId],
  );

  return rows[0] ?? null;
}

export async function completeCashPayment(
  orderId: number,
  sellerId: number,
  cashReceived: number,
) {
  return transaction(async (connection) => {
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT p.method, p.payment_status, o.total_price,
              o.order_status
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE p.order_id = ? AND o.seller_id = ?
       FOR UPDATE`,
      [orderId, sellerId],
    );

    const payment = rows[0];

    if (!payment) throw new Error("ORDER_NOT_FOUND");
    if (payment.method !== "cash") throw new Error("INVALID_PAYMENT_METHOD");
    if (payment.payment_status === "lunas") throw new Error("ALREADY_PAID");
    if (payment.order_status !== "siap_diambil") {
      throw new Error("ORDER_NOT_READY");
    }

    const total = Number(payment.total_price);

    if (cashReceived < total) {
      throw new Error("INSUFFICIENT_CASH");
    }

    const change = cashReceived - total;

    await connection.execute(
      `UPDATE payments
       SET payment_status = 'lunas',
           amount_paid = ?,
           cash_received = ?,
           change_amount = ?,
           verified_at = NOW()
       WHERE order_id = ?`,
      [total, cashReceived, change, orderId],
    );

    await connection.execute(
      "UPDATE orders SET order_status = 'selesai' WHERE id = ?",
      [orderId],
    );

    return { total, cash_received: cashReceived, change };
  });
}

export async function verifyQrisPayment(
  orderId: number,
  sellerId: number,
) {
  return transaction(async (connection) => {
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT p.method, p.payment_status, o.total_price,
              o.order_status
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE p.order_id = ? AND o.seller_id = ?
       FOR UPDATE`,
      [orderId, sellerId],
    );

    const payment = rows[0];

    if (!payment) throw new Error("ORDER_NOT_FOUND");
    if (payment.method !== "qris") throw new Error("INVALID_PAYMENT_METHOD");
    if (payment.payment_status !== "menunggu_verifikasi") {
      throw new Error("INVALID_PAYMENT_STATUS");
    }
    if (payment.order_status !== "siap_diambil") {
      throw new Error("ORDER_NOT_READY");
    }

    const total = Number(payment.total_price);

    await connection.execute(
      `UPDATE payments
       SET payment_status = 'lunas',
           amount_paid = ?,
           cash_received = ?,
           change_amount = ?,
           verified_by = ?,
           verified_at = NOW()
       WHERE order_id = ?`,
      [total, 0, 0, sellerId, orderId],
    );

    await connection.execute(
      "UPDATE orders SET order_status = 'selesai' WHERE id = ?",
      [orderId],
    );

    return true;
  });
}
