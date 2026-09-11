"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { createWorkoutPlan, publishWorkoutPlan } from "@/features/workouts/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireTrainerProfile() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("پروفایل مربی یافت نشد");
  return { session, profile };
}

export async function createPlanAction(formData: FormData) {
  const { profile } = await requireTrainerProfile();
  const athleteId = String(formData.get("athleteId"));
  const title = String(formData.get("title") || "برنامه تمرینی جدید");

  const athlete = await prisma.athleteProfile.findFirst({
    where: { id: athleteId, assignedTrainerId: profile.id },
  });
  if (!athlete) throw new Error("ورزشکار مجاز نیست");

  await createWorkoutPlan({
    title,
    description: String(formData.get("description") || ""),
    athleteId,
    trainerId: profile.id,
  });

  revalidatePath("/trainer");
  revalidatePath("/trainer/plans");
}

export async function publishPlanAction(formData: FormData) {
  const { profile } = await requireTrainerProfile();
  await publishWorkoutPlan(String(formData.get("planId")), profile.id);
  revalidatePath("/trainer/plans");
}

export async function updateBookingStatusAction(formData: FormData) {
  const { profile } = await requireTrainerProfile();
  const bookingId = String(formData.get("bookingId"));
  const status = String(formData.get("status")) as "CONFIRMED" | "COMPLETED" | "CANCELLED";

  await prisma.booking.updateMany({
    where: { id: bookingId, trainerId: profile.id },
    data: { status },
  });

  revalidatePath("/trainer/bookings");
}
