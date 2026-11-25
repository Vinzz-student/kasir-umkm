import "server-only";
import pool from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getCategories() {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT c.id, c.name, COUNT(p.id) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`,
  );

  return rows;
}

export async function createCategory(name: string) {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
  );

  return {
    id: result.insertId,
    name,
  };
}

export async function updateCategory(id: number, name: string) {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
  );

  return result.affectedRows > 0;
}

export async function deleteCategory(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM categories WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}
