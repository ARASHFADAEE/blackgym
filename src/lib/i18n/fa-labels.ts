/** برچسب‌های فارسی برای enumهای نمایشی در UI */

export const LEAD_SOURCE_FA: Record<string, string> = {
  WALK_IN: "مراجعه حضوری",
  WEBSITE: "وب‌سایت",
  INSTAGRAM: "اینستاگرام",
  TELEGRAM: "تلگرام",
  GOOGLE: "گوگل",
  REFERRAL: "معرفی",
  CAMPAIGN: "کمپین",
  OTHER: "سایر",
};

export const LEAD_STATUS_FA: Record<string, string> = {
  NEW: "جدید",
  CONTACTED: "تماس‌گرفته",
  QUALIFIED: "واجد شرایط",
  TRIAL: "آزمایشی",
  PROPOSAL: "پیشنهاد",
  WON: "برنده",
  LOST: "ازدست‌رفته",
};

export const ATTENDANCE_SOURCE_FA: Record<string, string> = {
  MANUAL: "دستی",
  QR: "کد QR",
  RECEPTION: "پذیرش",
  FINGERPRINT: "اثرانگشت",
};

export const CHURN_RISK_FA: Record<string, string> = {
  LOW: "کم",
  MEDIUM: "متوسط",
  HIGH: "بالا",
  CRITICAL: "بحرانی",
};

export const ROLE_FA: Record<string, string> = {
  SUPER_ADMIN: "سوپرادمین",
  ADMIN: "ادمین",
  BRANCH_MANAGER: "مدیر شعبه",
  STAFF: "کارمند",
  TRAINER: "مربی",
  ATHLETE: "ورزشکار",
};

export const ENTITY_STATUS_FA: Record<string, string> = {
  ACTIVE: "فعال",
  PAUSED: "فریز",
  EXPIRED: "منقضی",
  CANCELLED: "لغو شده",
  PENDING: "در انتظار",
  CONFIRMED: "تأیید شده",
  COMPLETED: "تکمیل",
  SUCCESS: "موفق",
  FAILED: "ناموفق",
  REFUNDED: "عودت",
};

export function faLabel(map: Record<string, string>, key: string | null | undefined) {
  if (!key) return "—";
  return map[key] ?? key;
}
