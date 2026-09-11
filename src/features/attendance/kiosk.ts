import { randomBytes } from "crypto";
import type { AttendanceSource } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { checkIn, checkOut, refreshBranchOccupancy } from "@/features/attendance/service";

export function generateAttendanceCode() {
  return randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
}

export async function ensureAttendanceCode(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, attendanceCode: true },
  });
  if (!user) throw new Error("کاربر یافت نشد");
  if (user.attendanceCode) return user.attendanceCode;

  for (let i = 0; i < 5; i++) {
    const code = generateAttendanceCode();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { attendanceCode: code },
      });
      return code;
    } catch {
      // unique collision — retry
    }
  }
  throw new Error("ساخت کد حضور ناموفق بود");
}

export async function findUserByAttendanceCode(code: string) {
  return prisma.user.findFirst({
    where: { attendanceCode: code.trim().toUpperCase(), isActive: true },
  });
}

export async function checkInByCode(params: {
  code: string;
  branchId: string;
  source?: AttendanceSource;
  staffId?: string;
}) {
  const user = await findUserByAttendanceCode(params.code);
  if (!user) throw new Error("کد حضور نامعتبر است");
  if (user.role !== "ATHLETE") throw new Error("فقط ورزشکار قابل چک‌این است");

  const open = await prisma.attendance.findFirst({
    where: { userId: user.id, checkedOutAt: null },
  });
  if (open) {
    await checkOut(user.id);
    return { user, action: "checkout" as const, attendance: open };
  }

  const attendance = await checkIn({
    userId: user.id,
    branchId: params.branchId,
    source: params.source ?? "QR",
    staffId: params.staffId,
  });
  return { user, action: "checkin" as const, attendance };
}

export async function enrollBiometric(params: {
  userId: string;
  deviceTemplateId: string;
  fingerLabel?: string;
}) {
  return prisma.biometricTemplate.upsert({
    where: { deviceTemplateId: params.deviceTemplateId },
    create: {
      userId: params.userId,
      deviceTemplateId: params.deviceTemplateId,
      fingerLabel: params.fingerLabel ?? "انگشت اشاره راست",
    },
    update: {
      userId: params.userId,
      isActive: true,
      fingerLabel: params.fingerLabel ?? "انگشت اشاره راست",
    },
  });
}

export async function checkInByFingerprint(params: {
  deviceTemplateId: string;
  branchId: string;
}) {
  const template = await prisma.biometricTemplate.findFirst({
    where: { deviceTemplateId: params.deviceTemplateId, isActive: true },
    include: { user: true },
  });
  if (!template) throw new Error("اثرانگشت ثبت‌نشده است");

  await prisma.biometricTemplate.update({
    where: { id: template.id },
    data: { lastUsedAt: new Date() },
  });

  const open = await prisma.attendance.findFirst({
    where: { userId: template.userId, checkedOutAt: null },
  });
  if (open) {
    await checkOut(template.userId);
    return { user: template.user, action: "checkout" as const };
  }

  await checkIn({
    userId: template.userId,
    branchId: params.branchId,
    source: "FINGERPRINT",
  });
  return { user: template.user, action: "checkin" as const };
}

export async function getOccupancyHistory(branchId: string, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return prisma.occupancySnapshot.findMany({
    where: { branchId, capturedAt: { gte: since } },
    orderBy: { capturedAt: "asc" },
  });
}

export async function recordOccupancySnapshot(branchId: string) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) return null;

  const recent = await prisma.occupancySnapshot.findFirst({
    where: { branchId },
    orderBy: { capturedAt: "desc" },
  });
  // throttle: حداقل ۱۰ دقیقه بین اسنپ‌شات‌ها
  if (recent && Date.now() - recent.capturedAt.getTime() < 10 * 60_000) {
    return recent;
  }

  return prisma.occupancySnapshot.create({
    data: {
      branchId,
      occupancy: branch.currentOccupancy,
      capacity: branch.capacity,
    },
  });
}

/** پس از به‌روزرسانی تراکم، اسنپ‌شات هم ثبت شود */
export async function refreshOccupancyWithHistory(branchId: string) {
  await refreshBranchOccupancy(branchId);
  return recordOccupancySnapshot(branchId);
}
