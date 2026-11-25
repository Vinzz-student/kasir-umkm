import Badge from "@/components/ui/badge";

export default function OrderStatus({ status }: { status: string }) {
  const config: Record<string, { label: string; color: "blue" | "green" | "yellow" | "gray" }> = {
    diproses: { label: "Diproses", color: "yellow" },
    siap_diambil: { label: "Siap diambil", color: "blue" },
    selesai: { label: "Selesai", color: "green" },
  };

  const item = config[status] ?? { label: status, color: "gray" as const };

  return <Badge color={item.color}>{item.label}</Badge>;
}
