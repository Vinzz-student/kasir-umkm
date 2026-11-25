import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(
  date: string | Date,
  pattern = "dd MMMM yyyy, HH:mm",
) {
  return format(new Date(date), pattern, { locale: id });
}
