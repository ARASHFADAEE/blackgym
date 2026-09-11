import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

export function formatJalali(date: Date | string, pattern = "d MMMM yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: faIR });
}

export function formatJalaliDateTime(date: Date | string): string {
  return formatJalali(date, "d MMMM yyyy · HH:mm");
}

export function occupancyLabel(percent: number): string {
  if (percent < 35) return "خلوت";
  if (percent < 60) return "متوسط";
  if (percent < 85) return "شلوغ";
  return "بسیار شلوغ";
}

export function occupancyLevel(percent: number): "QUIET" | "MODERATE" | "BUSY" | "VERY_BUSY" {
  if (percent < 35) return "QUIET";
  if (percent < 60) return "MODERATE";
  if (percent < 85) return "BUSY";
  return "VERY_BUSY";
}
