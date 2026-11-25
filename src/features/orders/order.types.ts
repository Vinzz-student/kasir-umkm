export type OrderStatus =
  | "diproses"
  | "siap_diambil"
  | "selesai";

export type PaymentMethod = "qris" | "cash";

export type PaymentStatus =
  | "belum_dibayar"
  | "menunggu_verifikasi"
  | "lunas";
