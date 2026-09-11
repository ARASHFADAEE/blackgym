"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LeadSource, LeadStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import {
  convertLeadToAthlete,
  createLead,
  updateLeadStatus,
} from "@/features/crm/service";
import {
  cancelMembership,
  extendMembership,
  freezeMembership,
  resumeMembership,
} from "@/features/memberships/ops";
import { checkIn, checkOut } from "@/features/attendance/service";
import { recomputeAllAthleteHealth, persistMemberHealth } from "@/features/retention/service";
import { prisma } from "@/lib/db/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function createLeadAction(formData: FormData) {
  const session = await requireAdmin();
  await createLead({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") || "") || undefined,
    source: (String(formData.get("source") || "WALK_IN") as LeadSource),
    branchId: String(formData.get("branchId") || "") || undefined,
    notes: String(formData.get("notes") || "") || undefined,
    nextFollowUpAt: formData.get("nextFollowUpAt")
      ? new Date(String(formData.get("nextFollowUpAt")))
      : new Date(Date.now() + 2 * 86_400_000),
    createdById: session.user.id,
    assignedToId: session.user.id,
  });
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
}

export async function updateLeadStatusAction(formData: FormData) {
  const session = await requireAdmin();
  await updateLeadStatus(
    String(formData.get("leadId")),
    String(formData.get("status")) as LeadStatus,
    session.user.id,
  );
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
}

export async function convertLeadAction(formData: FormData) {
  const session = await requireAdmin();
  await convertLeadToAthlete(String(formData.get("leadId")), session.user.id);
  revalidatePath("/admin/crm");
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function freezeMembershipAction(formData: FormData) {
  const session = await requireAdmin();
  try {
    await freezeMembership({
      membershipId: String(formData.get("membershipId")),
      startsAt: new Date(String(formData.get("startsAt"))),
      endsAt: new Date(String(formData.get("endsAt"))),
      reason: String(formData.get("reason") || "سفر"),
      approvedById: session.user.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطا در فریز عضویت";
    throw new Error(message.includes("Foreign key") || message.includes("approvedById")
      ? "جلسه ورود نامعتبر است؛ دوباره وارد شوید و فریز را تکرار کنید."
      : message);
  }
  revalidatePath("/admin/memberships");
  revalidatePath("/admin");
}

export async function resumeMembershipAction(formData: FormData) {
  await requireAdmin();
  await resumeMembership(String(formData.get("membershipId")));
  revalidatePath("/admin/memberships");
}

export async function extendMembershipAction(formData: FormData) {
  await requireAdmin();
  await extendMembership(String(formData.get("membershipId")), Number(formData.get("days") || 7));
  revalidatePath("/admin/memberships");
  revalidatePath("/admin");
}

export async function cancelMembershipAction(formData: FormData) {
  await requireAdmin();
  await cancelMembership(String(formData.get("membershipId")));
  revalidatePath("/admin/memberships");
}

export async function adminCheckInAction(formData: FormData) {
  const session = await requireAdmin();
  const phoneOrEmail = String(formData.get("query") ?? "").trim();
  const branchId = String(formData.get("branchId"));
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: phoneOrEmail }, { phone: phoneOrEmail }, { name: { contains: phoneOrEmail } }],
      role: "ATHLETE",
    },
  });
  if (!user) throw new Error("ورزشکار یافت نشد");
  await checkIn({
    userId: user.id,
    branchId,
    source: "RECEPTION",
    staffId: session.user.id,
  });
  await persistMemberHealth(user.id);
  revalidatePath("/admin/attendance");
  revalidatePath("/admin");
}

export async function athleteCheckInAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  await checkIn({
    userId: session.user.id,
    branchId: String(formData.get("branchId")),
    source: "MANUAL",
  });
  await persistMemberHealth(session.user.id);
  revalidatePath("/athlete/attendance");
  revalidatePath("/athlete");
}

export async function athleteCheckOutAction() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  await checkOut(session.user.id);
  revalidatePath("/athlete/attendance");
  revalidatePath("/athlete");
}

export async function recomputeHealthAction() {
  await requireAdmin();
  await recomputeAllAthleteHealth();
  revalidatePath("/admin");
  revalidatePath("/admin/retention");
}

export async function publicLeadAction(formData: FormData) {
  await createLead({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") || "") || undefined,
    source: "WEBSITE",
    notes: String(formData.get("message") || "") || undefined,
    nextFollowUpAt: new Date(Date.now() + 86_400_000),
  });
  redirect("/contact?sent=1");
}

export async function qrCheckInAction(formData: FormData) {
  const session = await requireAdmin();
  const { checkInByCode } = await import("@/features/attendance/kiosk");
  await checkInByCode({
    code: String(formData.get("code") ?? ""),
    branchId: String(formData.get("branchId")),
    source: "QR",
    staffId: session.user.id,
  });
  revalidatePath("/admin/attendance");
  revalidatePath("/admin");
}

export async function enrollBiometricAction(formData: FormData) {
  await requireAdmin();
  const { enrollBiometric } = await import("@/features/attendance/kiosk");
  const userId = String(formData.get("userId") ?? "");
  const deviceTemplateId = String(formData.get("deviceTemplateId") ?? "").trim();
  if (!userId || !deviceTemplateId) throw new Error("کاربر و شناسه قالب الزامی است");
  await enrollBiometric({
    userId,
    deviceTemplateId,
    fingerLabel: String(formData.get("fingerLabel") || "انگشت اشاره راست"),
  });
  revalidatePath("/admin/attendance");
  revalidatePath("/admin/kiosk");
}

export async function notifyExpiringAction() {
  await requireAdmin();
  const { notifyExpiringMemberships } = await import("@/features/notifications/jobs");
  await notifyExpiringMemberships(7);
  revalidatePath("/admin");
  revalidatePath("/athlete/notifications");
}
