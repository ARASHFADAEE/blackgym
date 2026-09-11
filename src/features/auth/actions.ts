"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { getDashboardPath } from "@/lib/permissions";
import { generateAttendanceCode } from "@/features/attendance/kiosk";
import { redirect } from "next/navigation";

export type ActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "داده نامعتبر" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    });

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { role: true },
    });

    return {
      success: true,
      redirectTo: user ? getDashboardPath(user.role) : "/athlete",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "ایمیل یا رمز عبور اشتباه است" };
    }
    throw error;
  }
}

export async function registerAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "داده نامعتبر" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "این ایمیل قبلاً ثبت شده است" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone || null,
      passwordHash,
      role: "ATHLETE",
      attendanceCode: generateAttendanceCode(),
      athleteProfile: { create: {} },
      notificationPreference: { create: {} },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    return { success: true, redirectTo: "/login" };
  }

  return { success: true, redirectTo: "/athlete" };
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) {
    redirect("/forgot-password?error=1");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/forgot-password?sent=1");
  }

  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  // دمو: بدون SMTP مستقیم به صفحه تنظیم رمز می‌رویم
  redirect(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
}

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8 || password !== confirmPassword) {
    redirect(`/reset-password?token=${token}&email=${encodeURIComponent(email)}&error=1`);
  }

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email, token },
  });
  if (!record || record.expires < new Date()) {
    redirect("/forgot-password?error=expired");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash } }),
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
  ]);

  redirect("/login?reset=1");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
