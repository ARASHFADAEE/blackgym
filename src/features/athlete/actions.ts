"use server";

import { auth } from "@/lib/auth";
import { purchaseMembership } from "@/features/memberships/service";
import { createPersonalTrainingBooking, cancelBooking } from "@/features/bookings/service";
import { logWorkoutAndGamify } from "@/features/progress/service";
import { markAllRead, markNotificationRead } from "@/features/notifications/service";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function buyMembershipAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const planId = String(formData.get("planId") ?? "");
  const branchId = String(formData.get("branchId") ?? "");
  if (!planId || !branchId) {
    throw new Error("پلن و شعبه الزامی است");
  }

  const { redirectUrl } = await purchaseMembership({
    userId: session.user.id,
    planId,
    branchId,
  });

  redirect(redirectUrl);
}

export async function bookPtAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل ورزشکار یافت نشد");

  const trainerId = String(formData.get("trainerId") ?? "");
  const branchId = String(formData.get("branchId") ?? "");
  const startsAt = new Date(String(formData.get("startsAt") ?? ""));
  const notes = String(formData.get("notes") ?? "") || undefined;

  await createPersonalTrainingBooking({
    athleteId: profile.id,
    trainerId,
    branchId,
    startsAt,
    notes,
  });

  revalidatePath("/athlete/bookings");
  redirect("/athlete/bookings?booked=1");
}

export async function cancelBookingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل یافت نشد");

  await cancelBooking(String(formData.get("bookingId")), profile.id);
  revalidatePath("/athlete/bookings");
}

export async function logWorkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل یافت نشد");

  await logWorkoutAndGamify({
    athleteId: profile.id,
    userId: session.user.id,
    exerciseId: String(formData.get("exerciseId")),
    sets: Number(formData.get("sets") ?? 3),
    reps: Number(formData.get("reps") ?? 10),
    weightKg: formData.get("weightKg") ? Number(formData.get("weightKg")) : undefined,
    notes: String(formData.get("notes") ?? "") || undefined,
  });

  revalidatePath("/athlete/workouts");
  revalidatePath("/athlete/progress");
  revalidatePath("/athlete");
}

export async function markNotificationsReadAction() {
  const session = await auth();
  if (!session?.user) return;
  await markAllRead(session.user.id);
  revalidatePath("/athlete/notifications");
}

export async function markOneNotificationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  await markNotificationRead(String(formData.get("id")), session.user.id);
  revalidatePath("/athlete/notifications");
}

export async function bookClassAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل یافت نشد");

  const { bookClass } = await import("@/features/classes/service");
  await bookClass(String(formData.get("scheduleId")), profile.id);
  revalidatePath("/athlete/classes");
  redirect("/athlete/classes?booked=1");
}

export async function addMeasurementAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل یافت نشد");

  await prisma.progressMeasurement.create({
    data: {
      athleteId: profile.id,
      weightKg: formData.get("weightKg") ? Number(formData.get("weightKg")) : undefined,
      bodyFatPct: formData.get("bodyFatPct") ? Number(formData.get("bodyFatPct")) : undefined,
      waistCm: formData.get("waistCm") ? Number(formData.get("waistCm")) : undefined,
      notes: String(formData.get("notes") ?? "") || undefined,
    },
  });

  revalidatePath("/athlete/progress");
}
