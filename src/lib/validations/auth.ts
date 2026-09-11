import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z.string().min(10, "شماره موبایل معتبر نیست").optional().or(z.literal("")),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "تکرار رمز عبور مطابقت ندارد",
  path: ["confirmPassword"],
});

export const bookingSchema = z.object({
  trainerId: z.string().min(1),
  branchId: z.string().min(1),
  startsAt: z.string().datetime(),
  durationMin: z.number().int().min(30).max(180).default(60),
  notes: z.string().max(500).optional(),
});

export const progressSchema = z.object({
  weightKg: z.number().positive().optional(),
  bodyFatPct: z.number().min(1).max(60).optional(),
  chestCm: z.number().positive().optional(),
  waistCm: z.number().positive().optional(),
  hipsCm: z.number().positive().optional(),
  armCm: z.number().positive().optional(),
  thighCm: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
