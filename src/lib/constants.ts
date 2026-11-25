export const ORDER_STATUS = {
  PROCESSING: "diproses",
  READY: "siap_diambil",
  COMPLETED: "selesai",
} as const;

export const PAYMENT_METHOD = {
  QRIS: "qris",
  CASH: "cash",
} as const;

export const PAYMENT_STATUS = {
  UNPAID: "belum_dibayar",
  WAITING: "menunggu_verifikasi",
  PAID: "lunas",
} as const;

export const SESSION_COOKIE_NAME = "kasir_session";
