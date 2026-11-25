import "server-only";
import pool from "@/lib/db";
import { transaction } from "@/lib/db/transaction";
import { generateOrderNumber } from "@/lib/utils/generate-order-number";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

type OrderDetailRow = RowDataPacket & {
  order_number: string;
  total_price: number;
  payment_method: "qris" | "cash" | null;
  payment_status: "belum_dibayar" | "menunggu_verifikasi" | "lunas" | null;
  amount_paid: number | null;
  cash_received: number | null;
  change_amount: number | null;
};

type OrderItemInput = {
  product_id: number;
  quantity: number;
};

export async function createOrder(
  buyerId: number,
  items: OrderItemInput[],
  paymentMethod: "qris" | "cash",
) {
  return transaction(async (connection) => {
    const [sellers] = await connection.execute<RowDataPacket[]>(
      `SELECT id FROM users
       WHERE role = 'seller' AND is_active = 1
       ORDER BY id ASC LIMIT 1`,
    );

    if (!sellers.length) {
      throw new Error("SELLER_NOT_FOUND");
    }

    const sellerId = sellers[0].id;
    const orderNumber = generateOrderNumber();

    let total = 0;
    const orderProducts = [];

    for (const item of items) {
      const [products] = await connection.execute<RowDataPacket[]>(
        `SELECT id, name, price, is_available
         FROM products
         WHERE id = ?
         FOR UPDATE`,
        [item.product_id],
      );

      const product = products[0];

      if (!product || !product.is_available) {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      const price = Number(product.price);
      const subtotal = price * item.quantity;

      total += subtotal;

      orderProducts.push({
        product_id: product.id,
        product_name: product.name,
        product_price: price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const [buyers] = await connection.execute<RowDataPacket[]>(
      `SELECT name, nickname FROM users WHERE id = ? LIMIT 1`,
      [buyerId],
    );

    const buyer = buyers[0];

    const [orderResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO orders
        (order_number, buyer_id, seller_id, customer_name,
         order_status, total_price)
       VALUES (?, ?, ?, ?, 'diproses', ?)`,
      [
        orderNumber,
        buyerId,
        sellerId,
        buyer.nickname || buyer.name,
        total,
      ],
    );

    const orderId = orderResult.insertId;

    for (const item of orderProducts) {
      await connection.execute(
        `INSERT INTO order_items
          (order_id, product_id, product_name, product_price,
           quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.subtotal,
        ],
      );
    }

    const paymentStatus =
      paymentMethod === "qris"
        ? "menunggu_verifikasi"
        : "belum_dibayar";

    await connection.execute(
      `INSERT INTO payments
        (order_id, method, payment_status, amount_paid,
         cash_received, change_amount)
       VALUES (?, ?, ?, 0, 0, 0)`,
      [orderId, paymentMethod, paymentStatus],
    );

    return {
      id: orderId,
      order_number: orderNumber,
      total_price: total,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    };
  });
}

export async function getBuyerOrders(buyerId: number) {
  const [orders] = await pool.execute<RowDataPacket[]>(
    `SELECT o.*, p.method AS payment_method,
            p.payment_status, p.amount_paid,
            p.cash_received, p.change_amount
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.buyer_id = ?
     ORDER BY o.created_at DESC`,
    [buyerId],
  );

  return orders;
}

export async function getOrderDetail(
  orderId: number,
  userId: number,
  role: "buyer" | "seller",
) {
  let sql = `
    SELECT o.*, p.method AS payment_method,
           p.payment_status, p.amount_paid,
           p.cash_received, p.change_amount
    FROM orders o
    LEFT JOIN payments p ON p.order_id = o.id
    WHERE o.id = ?
  `;

  const values: number[] = [orderId];

  if (role === "buyer") {
    sql += " AND o.buyer_id = ?";
    values.push(userId);
  } else {
    sql += " AND o.seller_id = ?";
    values.push(userId);
  }

  const [orders] = await pool.execute<OrderDetailRow[]>(sql, values);

  if (!orders.length) return null;

  const [items] = await pool.execute<RowDataPacket[]>(
    `SELECT id, product_id, product_name, product_price,
            quantity, subtotal
     FROM order_items
     WHERE order_id = ?`,
    [orderId],
  );

  return {
    ...orders[0],
    items,
  };
}

export async function getSellerOrders(
  sellerId: number,
  status?: string,
) {
  let sql = `
    SELECT o.*,
           p.method AS payment_method,
           p.payment_status,
           p.amount_paid,
           p.cash_received,
           p.change_amount
    FROM orders o
    LEFT JOIN payments p ON p.order_id = o.id
    WHERE o.seller_id = ?
  `;

  const values: (number | string)[] = [sellerId];

  if (status) {
    sql += " AND o.order_status = ?";
    values.push(status);
  }

  sql += " ORDER BY o.created_at DESC";

  const [orders] = await pool.execute<RowDataPacket[]>(sql, values);
  return orders;
}

export async function updateOrderStatus(
  orderId: number,
  sellerId: number,
  status: "diproses" | "siap_diambil",
) {
  return transaction(async (connection) => {
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT o.order_status, p.payment_status, p.method
       FROM orders o
       JOIN payments p ON p.order_id = o.id
       WHERE o.id = ? AND o.seller_id = ?
       FOR UPDATE`,
      [orderId, sellerId],
    );

    const order = rows[0];

    if (!order) throw new Error("ORDER_NOT_FOUND");

    if (order.order_status === "selesai") {
      throw new Error("ORDER_COMPLETED");
    }

    if (status === "siap_diambil" && order.order_status !== "diproses") {
      throw new Error("INVALID_ORDER_STATUS");
    }

    if (status === "diproses" && order.order_status !== "diproses") {
      throw new Error("INVALID_ORDER_STATUS");
    }

    await connection.execute(
      "UPDATE orders SET order_status = ? WHERE id = ?",
      [status, orderId],
    );

    return true;
  });
}

export async function getSellerDashboard(sellerId: number) {
  const [stats] = await pool.execute<RowDataPacket[]>(
    `SELECT
      COUNT(CASE WHEN order_status = 'diproses' THEN 1 END) AS processing,
      COUNT(CASE WHEN order_status = 'siap_diambil' THEN 1 END) AS ready,
      COUNT(CASE WHEN order_status = 'selesai' THEN 1 END) AS completed,
      COALESCE(SUM(
        CASE WHEN order_status = 'selesai' THEN total_price ELSE 0 END
      ), 0) AS revenue
     FROM orders
     WHERE seller_id = ?`,
    [sellerId],
  );

  const [recentOrders] = await pool.execute<RowDataPacket[]>(
    `SELECT o.id, o.order_number, o.customer_name,
            o.total_price, o.order_status, o.created_at,
            p.method AS payment_method,
            p.payment_status
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.seller_id = ?
     ORDER BY o.created_at DESC
     LIMIT 5`,
    [sellerId],
  );

  return {
    stats: stats[0],
    recent_orders: recentOrders,
  };
}
