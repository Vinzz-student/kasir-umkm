import "server-only";
import pool from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getProducts(search?: string, category?: number) {
  let sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE 1 = 1
  `;

  const values: (string | number)[] = [];

  if (search) {
    sql += " AND p.name LIKE ?";
    values.push(`%${search}%`);
  }

  if (category) {
    sql += " AND p.category_id = ?";
    values.push(category);
  }

  sql += " ORDER BY p.created_at DESC";

  const [rows] = await pool.execute<RowDataPacket[]>(sql, values);
  return rows;
}

export async function getProductById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT p.*, c.name AS category_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function createProduct(data: {
  category_id: number;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  is_available: boolean;
}) {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO products
      (category_id, name, description, price, image, is_available)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.category_id,
      data.name,
      data.description ?? null,
      data.price,
      data.image ?? null,
      data.is_available,
    ],
  );

  return getProductById(result.insertId);
}

export async function updateProduct(
  id: number,
  data: {
    category_id?: number;
    name?: string;
    description?: string | null;
    price?: number;
    image?: string | null;
    is_available?: boolean;
  },
) {
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);

  if (!fields.length) {
    return getProductById(id);
  }

  const columns: Record<string, string> = {
    category_id: "category_id",
    name: "name",
    description: "description",
    price: "price",
    image: "image",
    is_available: "is_available",
  };

  const assignments = fields.map(([key]) => `${columns[key]} = ?`);
  const values = fields.map(([, value]) => value);

  await pool.execute(
    `UPDATE products SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id],
  );

  return getProductById(id);
}

export async function deleteProduct(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}
