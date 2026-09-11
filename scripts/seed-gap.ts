/**
 * Seed gap-fill: attendance codes, biometrics demo, class schedules, occupancy snapshots
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function code() {
  return randomBytes(3).toString("hex").toUpperCase();
}

async function main() {
  const athletes = await prisma.user.findMany({ where: { role: "ATHLETE" } });
  for (const u of athletes) {
    if (!u.attendanceCode) {
      try {
        await prisma.user.update({
          where: { id: u.id },
          data: { attendanceCode: code() },
        });
      } catch {
        /* unique retry skip */
      }
    }
  }

  const demoAthlete = await prisma.user.findFirst({
    where: { email: "athlete@blackgym.ir" },
  });
  if (demoAthlete) {
    await prisma.biometricTemplate.upsert({
      where: { deviceTemplateId: "DEMO-FP-ATHLETE-01" },
      create: {
        userId: demoAthlete.id,
        deviceTemplateId: "DEMO-FP-ATHLETE-01",
        fingerLabel: "انگشت اشاره راست",
      },
      update: { isActive: true },
    });
  }

  const branches = await prisma.branch.findMany({ where: { status: "ACTIVE" } });
  const trainer = await prisma.trainerProfile.findFirst();
  if (trainer && branches.length) {
    for (const branch of branches.slice(0, 2)) {
      let fitnessClass = await prisma.fitnessClass.findFirst({
        where: { branchId: branch.id, title: "کراس‌فیت گروهی" },
      });
      if (!fitnessClass) {
        fitnessClass = await prisma.fitnessClass.create({
          data: {
            title: "کراس‌فیت گروهی",
            description: "جلسه گروهی شدت متوسط",
            branchId: branch.id,
            trainerId: trainer.id,
            capacity: 12,
            durationMin: 60,
          },
        });
      }

      const existing = await prisma.classSchedule.count({
        where: { classId: fitnessClass.id, startsAt: { gte: new Date() } },
      });
      if (existing < 3) {
        for (let i = 1; i <= 3; i++) {
          const startsAt = new Date();
          startsAt.setDate(startsAt.getDate() + i);
          startsAt.setHours(18, 0, 0, 0);
          const endsAt = new Date(startsAt.getTime() + 60 * 60_000);
          await prisma.classSchedule.create({
            data: {
              classId: fitnessClass.id,
              startsAt,
              endsAt,
              capacity: 12,
            },
          });
        }
      }

      await prisma.occupancySnapshot.create({
        data: {
          branchId: branch.id,
          occupancy: branch.currentOccupancy,
          capacity: branch.capacity,
        },
      });
    }
  }

  console.log("seed-gap: attendance codes, demo fingerprint, classes, occupancy ok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
