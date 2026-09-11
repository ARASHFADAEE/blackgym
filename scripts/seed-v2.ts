import { PrismaClient } from "@prisma/client";
import { recomputeAllAthleteHealth } from "../src/features/retention/service";
import { createInvoiceForPayment } from "../src/features/memberships/ops";

const prisma = new PrismaClient();

async function main() {
  const branches = await prisma.branch.findMany({ take: 4 });
  const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });

  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();

  const leads = [
    { name: "سارا کریمی", phone: "09121110001", source: "INSTAGRAM" as const, status: "NEW" as const },
    { name: "رضا نوری", phone: "09121110002", source: "GOOGLE" as const, status: "CONTACTED" as const },
    { name: "مینا احمدی", phone: "09121110003", source: "REFERRAL" as const, status: "QUALIFIED" as const },
    { name: "پویا مرادی", phone: "09121110004", source: "WEBSITE" as const, status: "TRIAL" as const },
    { name: "الهام جعفری", phone: "09121110005", source: "TELEGRAM" as const, status: "PROPOSAL" as const },
    { name: "کیان رضوی", phone: "09121110006", source: "WALK_IN" as const, status: "NEW" as const },
    { name: "نازنین فرهادی", phone: "09121110007", source: "CAMPAIGN" as const, status: "CONTACTED" as const },
    { name: "امیر حسینی", phone: "09121110008", source: "INSTAGRAM" as const, status: "LOST" as const },
  ];

  for (let i = 0; i < leads.length; i++) {
    const l = leads[i]!;
    const overdue = i % 3 === 0;
    await prisma.lead.create({
      data: {
        ...l,
        email: `lead${i + 1}@example.com`,
        branchId: branches[i % branches.length]?.id,
        assignedToId: admin?.id,
        createdById: admin?.id,
        notes: "لید دمو برای پایپلاین فروش",
        nextFollowUpAt: overdue
          ? new Date(Date.now() - 2 * 86_400_000)
          : new Date(Date.now() + (i + 1) * 86_400_000),
        lastContactAt: new Date(Date.now() - i * 86_400_000),
        activities: {
          create: { type: "CREATED", note: "Seed", actorId: admin?.id },
        },
      },
    });
  }

  // Ensure invoices for successful payments
  const payments = await prisma.payment.findMany({
    where: { status: "SUCCESS", invoice: null },
  });
  for (const p of payments) {
    await createInvoiceForPayment(p.id);
  }

  await recomputeAllAthleteHealth();
  console.log("✅ V2 seed extras: leads + invoices + health scores");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
