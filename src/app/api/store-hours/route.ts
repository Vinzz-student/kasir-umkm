import { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { requireSeller } from "@/lib/auth/permissions";
import { success, handleError } from "@/lib/api-response";

type StoreHoursRow = RowDataPacket & {
  open_time: string;
  close_time: string;
};

function getCurrentTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

function getIsOpen(openTime: string, closeTime: string) {
  const currentTime = getCurrentTime();

  const [currentHour, currentMinute] = currentTime.split(":").map(Number);
  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const current = currentHour * 60 + currentMinute;
  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;

  if (open === close) return false;

  return open < close
    ? current >= open && current < close
    : current >= open || current < close;
}

export async function GET() {
  try {
    const [rows] = await pool.execute<StoreHoursRow[]>(
      "SELECT open_time, close_time FROM store_hours WHERE id = 1",
    );

    if (!rows.length) {
      throw new Error("Jadwal operasional belum tersedia.");
    }

    const openTime = String(rows[0].open_time).slice(0, 5);
    const closeTime = String(rows[0].close_time).slice(0, 5);

    return success({
      openTime,
      closeTime,
      currentTime: getCurrentTime(),
      isOpen: getIsOpen(openTime, closeTime),
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireSeller();

    const body = await request.json();
    const { openTime, closeTime } = body;

    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      typeof openTime !== "string" ||
      typeof closeTime !== "string" ||
      !timePattern.test(openTime) ||
      !timePattern.test(closeTime) ||
      openTime === closeTime
    ) {
      return Response.json(
        { success: false, message: "Jam operasional tidak valid." },
        { status: 400 },
      );
    }

    const [result] = await pool.execute(
      `UPDATE store_hours
       SET open_time = ?, close_time = ?
       WHERE id = 1`,
      [`${openTime}:00`, `${closeTime}:00`],
    );

    return success({
      message: "Jam operasional berhasil disimpan.",
    });
  } catch (error) {
    return handleError(error);
  }
}
