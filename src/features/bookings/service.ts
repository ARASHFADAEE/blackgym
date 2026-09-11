import { prisma } from "@/lib/db/prisma";
import { BookingStatus } from "@prisma/client";

export async function createPersonalTrainingBooking(params: {
  athleteId: string;
  trainerId: string;
  branchId: string;
  startsAt: Date;
  durationMin?: number;
  notes?: string;
}) {
  const durationMin = params.durationMin ?? 60;
  const endsAt = new Date(params.startsAt.getTime() + durationMin * 60_000);

  const conflict = await prisma.booking.findFirst({
    where: {
      trainerId: params.trainerId,
      status: { in: ["PENDING", "CONFIRMED"] },
      startsAt: { lt: endsAt },
      endsAt: { gt: params.startsAt },
    },
  });

  if (conflict) {
    throw new Error("این بازه زمانی برای مربی قبلاً رزرو شده است");
  }

  try {
    return await prisma.booking.create({
      data: {
        athleteId: params.athleteId,
        trainerId: params.trainerId,
        branchId: params.branchId,
        startsAt: params.startsAt,
        endsAt,
        durationMin,
        notes: params.notes,
        status: "CONFIRMED",
      },
      include: {
        trainer: { include: { user: true } },
        branch: true,
      },
    });
  } catch {
    // unique on trainerId+startsAt handles race
    throw new Error("رزرو همزمان امکان‌پذیر نیست؛ لطفاً زمان دیگری انتخاب کنید");
  }
}

export async function cancelBooking(bookingId: string, athleteId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, athleteId },
  });
  if (!booking) throw new Error("رزرو یافت نشد");
  if (booking.status === "CANCELLED") return booking;

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" satisfies BookingStatus },
  });
}

export async function bookClass(scheduleId: string, athleteId: string) {
  return prisma.$transaction(async (tx) => {
    const schedule = await tx.classSchedule.findUnique({
      where: { id: scheduleId },
      include: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
    });

    if (!schedule) throw new Error("جلسه کلاس یافت نشد");
    if (schedule.bookings.length >= schedule.capacity) {
      throw new Error("ظرفیت کلاس تکمیل شده است");
    }

    const existing = schedule.bookings.find((b) => b.athleteId === athleteId);
    if (existing) throw new Error("قبلاً در این کلاس ثبت‌نام کرده‌اید");

    return tx.classBooking.create({
      data: {
        scheduleId,
        athleteId,
        status: "CONFIRMED",
      },
    });
  });
}
