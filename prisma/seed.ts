import { PrismaClient, Role, MuscleGroup } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BlackGYM...");

  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutDay.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.classBooking.deleteMany();
  await prisma.classSchedule.deleteMany();
  await prisma.fitnessClass.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.strengthRecord.deleteMany();
  await prisma.progressMeasurement.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.membershipFeature.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.branchImage.deleteMany();
  await prisma.branchFacility.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  const superAdmin = await prisma.user.create({
    data: {
      name: "سوپر ادمین",
      email: "admin@blackgym.ir",
      passwordHash,
      role: Role.SUPER_ADMIN,
      phone: "09120000001",
    },
  });

  await prisma.user.create({
    data: {
      name: "مدیر سیستم",
      email: "manager@blackgym.ir",
      passwordHash,
      role: Role.ADMIN,
      phone: "09120000002",
    },
  });

  const branchesData = [
    {
      name: "شعبه سعادت‌آباد",
      slug: "saadatabad",
      description: "پرچمدار BlackGYM با سالن قدرتی حرفه‌ای، کراس‌فیت و ریکاوری.",
      address: "تهران، سعادت‌آباد، میدان کاج، پلاک ۱۲",
      phone: "021-22000001",
      latitude: 35.7865,
      longitude: 51.3752,
      capacity: 180,
      currentOccupancy: 72,
      coverImage: "/images/branch-1.jpg",
    },
    {
      name: "شعبه نیاوران",
      slug: "niavaran",
      description: "فضای آرام با تمرکز روی تمرین شخصی و کوچینگ تخصصی.",
      address: "تهران، نیاوران، خیابان باهنر، پلاک ۴۵",
      phone: "021-22000002",
      latitude: 35.8156,
      longitude: 51.4681,
      capacity: 120,
      currentOccupancy: 95,
      coverImage: "/images/branch-2.jpg",
    },
    {
      name: "شعبه ونک",
      slug: "vanak",
      description: "دسترسی مرکزی، کلاس‌های گروهی پرتقاضا و تجهیزات به‌روز.",
      address: "تهران، ونک، خیابان گاندی، پلاک ۸",
      phone: "021-22000003",
      latitude: 35.7575,
      longitude: 51.4103,
      capacity: 150,
      currentOccupancy: 40,
      coverImage: "/images/branch-3.jpg",
    },
    {
      name: "شعبه پاسداران",
      slug: "pasdaran",
      description: "محیط پرمیوم برای ورزشکاران جدی با زون‌های جداگانه قدرتی و کاردیو.",
      address: "تهران، پاسداران، خیابان گلستان، پلاک ۲۲",
      phone: "021-22000004",
      latitude: 35.7812,
      longitude: 51.4655,
      capacity: 160,
      currentOccupancy: 110,
      coverImage: "/images/branch-4.jpg",
    },
  ];

  const branches = [];
  for (const b of branchesData) {
    const branch = await prisma.branch.create({
      data: {
        ...b,
        workingHours: {
          sat: "06:00-23:00",
          sun: "06:00-23:00",
          mon: "06:00-23:00",
          tue: "06:00-23:00",
          wed: "06:00-23:00",
          thu: "06:00-23:00",
          fri: "08:00-22:00",
        },
        facilities: {
          create: [
            { name: "سالن وزنه آزاد", icon: "dumbbell" },
            { name: "کاردیو زون", icon: "heart" },
            { name: "کلاس گروهی", icon: "users" },
            { name: "رختکن و دوش", icon: "shower" },
          ],
        },
      },
    });
    branches.push(branch);
  }

  const trainerSpecs = [
    { name: "علی رضایی", email: "ali.trainer@blackgym.ir", specialty: "پاورلیفتینگ", years: 8 },
    { name: "سارا محمدی", email: "sara.trainer@blackgym.ir", specialty: "کراس‌فیت", years: 6 },
    { name: "امیر حسینی", email: "amir.trainer@blackgym.ir", specialty: "هایپرتروفی", years: 10 },
    { name: "نیلوفر احمدی", email: "niloufar.trainer@blackgym.ir", specialty: "فانکشنال", years: 5 },
    { name: "رضا کریمی", email: "reza.trainer@blackgym.ir", specialty: "بدنسازی مسابقه‌ای", years: 12 },
    { name: "مریم نوری", email: "maryam.trainer@blackgym.ir", specialty: "کاهش وزن", years: 7 },
    { name: "حسین مرادی", email: "hossein.trainer@blackgym.ir", specialty: "قدرتی", years: 9 },
    { name: "یاسمن قاسمی", email: "yasaman.trainer@blackgym.ir", specialty: "موبilitی و ریکاوری", years: 4 },
    { name: "کیان پارسا", email: "kian.trainer@blackgym.ir", specialty: "کاندیشنینگ", years: 6 },
    { name: "الهام صادقی", email: "elham.trainer@blackgym.ir", specialty: "تمرین بانوان", years: 8 },
  ];

  const trainers = [];
  for (let i = 0; i < trainerSpecs.length; i++) {
    const t = trainerSpecs[i]!;
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        passwordHash,
        role: Role.TRAINER,
        phone: `0912111${String(i).padStart(4, "0")}`,
        trainerProfile: {
          create: {
            specialty: t.specialty,
            experienceYears: t.years,
            bio: `${t.name} مربی تخصصی ${t.specialty} با ${t.years} سال تجربه در BlackGYM.`,
            rating: 4.6 + (i % 4) * 0.1,
            isFeatured: i < 4,
            branchId: branches[i % branches.length]!.id,
          },
        },
      },
      include: { trainerProfile: true },
    });
    trainers.push(user.trainerProfile!);
  }

  const athleteUser = await prisma.user.create({
    data: {
      name: "آرش دمو",
      email: "athlete@blackgym.ir",
      passwordHash,
      role: Role.ATHLETE,
      phone: "09123334455",
      xp: 240,
      level: 3,
      streak: 5,
      athleteProfile: {
        create: {
          heightCm: 178,
          weightKg: 82,
          goal: "افزایش قدرت و ترکیب بدنی",
          preferredBranchId: branches[0]!.id,
          assignedTrainerId: trainers[0]!.id,
        },
      },
      notificationPreference: { create: {} },
    },
    include: { athleteProfile: true },
  });

  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        name: `ورزشکار نمونه ${i}`,
        email: `athlete${i}@blackgym.ir`,
        passwordHash,
        role: Role.ATHLETE,
        athleteProfile: {
          create: {
            assignedTrainerId: trainers[i % trainers.length]!.id,
            preferredBranchId: branches[i % branches.length]!.id,
            weightKg: 70 + i * 2,
            goal: "بهبود عملکرد",
          },
        },
        notificationPreference: { create: {} },
      },
    });
  }

  const plans = [
    {
      name: "بیسیک",
      slug: "basic",
      description: "دسترسی به یک شعبه و امکانات پایه باشگاه.",
      price: 2_500_000,
      durationDays: 30,
      isPopular: false,
      sortOrder: 1,
      features: ["دسترسی به یک شعبه", "سالن وزنه و کاردیو", "کمد اختصاصی"],
    },
    {
      name: "پرمیوم",
      slug: "premium",
      description: "چندشعبه‌ای با کلاس‌های گروهی و برنامه تمرینی پایه.",
      price: 4_200_000,
      durationDays: 30,
      isPopular: true,
      sortOrder: 2,
      features: ["دسترسی به همه شعب", "کلاس‌های گروهی", "برنامه تمرینی پایه", "پایش پیشرفت"],
    },
    {
      name: "وی‌آی‌پی",
      slug: "vip",
      description: "تجربه کامل BlackGYM با اولویت رزرو و خدمات ویژه.",
      price: 6_800_000,
      durationDays: 30,
      isPopular: false,
      sortOrder: 3,
      features: ["همه امکانات پرمیوم", "اولویت رزرو PT", "مشاوره تغذیه", "مهمان ماهانه"],
    },
    {
      name: "تمرین شخصی",
      slug: "personal-training",
      description: "پکیج ترکیبی عضویت + جلسات تمرین شخصی با مربی.",
      price: 9_500_000,
      durationDays: 30,
      isPopular: false,
      sortOrder: 4,
      features: ["عضویت وی‌آی‌پی", "۸ جلسه PT", "برنامه اختصاصی", "پیگیری هفتگی"],
    },
  ];

  const createdPlans = [];
  for (const p of plans) {
    const plan = await prisma.membershipPlan.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        durationDays: p.durationDays,
        isPopular: p.isPopular,
        sortOrder: p.sortOrder,
        features: { create: p.features.map((label) => ({ label })) },
      },
    });
    createdPlans.push(plan);
  }

  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 25);

  const membership = await prisma.membership.create({
    data: {
      userId: athleteUser.id,
      planId: createdPlans[1]!.id,
      branchId: branches[0]!.id,
      status: "ACTIVE",
      startsAt,
      endsAt,
    },
  });

  await prisma.payment.create({
    data: {
      userId: athleteUser.id,
      membershipId: membership.id,
      amount: createdPlans[1]!.price,
      status: "SUCCESS",
      provider: "mock",
      providerRef: "SEED-PAY-001",
      authority: "mock_seed_001",
      paidAt: startsAt,
      description: "خرید عضویت پرمیوم",
    },
  });

  const exercisesData: { name: string; muscleGroup: MuscleGroup; equipment: string; description: string }[] = [
    { name: "اسکوات با هالتر", muscleGroup: "LEGS", equipment: "هالتر", description: "حرکت پایه پایین‌تنه" },
    { name: "ددلیفت", muscleGroup: "BACK", equipment: "هالتر", description: "قدرت خلفی زنجیره" },
    { name: "پرس سینه هالتر", muscleGroup: "CHEST", equipment: "هالتر", description: "حرکت پایه سینه" },
    { name: "پرس سرشانه دمبل", muscleGroup: "SHOULDERS", equipment: "دمبل", description: "تقویت سرشانه" },
    { name: "بارفیکس", muscleGroup: "BACK", equipment: "میله", description: "کشش عمودی" },
    { name: "دیپ پارالل", muscleGroup: "CHEST", equipment: "پارالل", description: "سینه و پشت بازو" },
    { name: "لانگز دمبل", muscleGroup: "LEGS", equipment: "دمبل", description: "تعادل و قدرت پا" },
    { name: "پلانک", muscleGroup: "CORE", equipment: "وزن بدن", description: "ثبات مرکزی" },
    { name: "کرانچ کابلی", muscleGroup: "CORE", equipment: "کابل", description: "شکم" },
    { name: "روئینگ کابل", muscleGroup: "BACK", equipment: "کابل", description: "کشش افقی" },
    { name: "جلو بازو هالتر", muscleGroup: "ARMS", equipment: "هالتر", description: "بایسپس" },
    { name: "پشت بازو سیم‌کش", muscleGroup: "ARMS", equipment: "کابل", description: "ترایسپس" },
    { name: "لگ پرس", muscleGroup: "LEGS", equipment: "دستگاه", description: "چهارسر و سرینی" },
    { name: "هیپ تراست", muscleGroup: "LEGS", equipment: "هالتر", description: "سرینی" },
    { name: "فیس پول", muscleGroup: "SHOULDERS", equipment: "کابل", description: "پشت سرشانه" },
    { name: "کشش لت", muscleGroup: "BACK", equipment: "دستگاه", description: "لتسیموس" },
    { name: "فلای سینه", muscleGroup: "CHEST", equipment: "دمبل", description: "ایزوله سینه" },
    { name: "ساق پا ایستاده", muscleGroup: "LEGS", equipment: "دستگاه", description: "ساق" },
    { name: "برپی", muscleGroup: "FULL_BODY", equipment: "وزن بدن", description: "کاندیشنینگ" },
    { name: "دویدن تردمیل", muscleGroup: "CARDIO", equipment: "تردمیل", description: "کاردیو" },
    { name: "کیettlebell Swing", muscleGroup: "FULL_BODY", equipment: "کتل‌بل", description: "قدرت انفجاری" },
    { name: "فارمر کری", muscleGroup: "FULL_BODY", equipment: "دمبل", description: "قدرت گیر و کور" },
  ];

  const exercises = [];
  for (const e of exercisesData) {
    exercises.push(
      await prisma.exercise.create({
        data: {
          name: e.name,
          muscleGroup: e.muscleGroup,
          equipment: e.equipment,
          description: e.description,
          instructions: "فرم صحیح را حفظ کنید و دامنه کامل حرکت را رعایت کنید.",
        },
      }),
    );
  }

  const plan = await prisma.workoutPlan.create({
    data: {
      title: "برنامه قدرت ۸ هفته‌ای",
      description: "تمرکز روی حرکات ترکیبی و پیشرفت تدریجی.",
      athleteId: athleteUser.athleteProfile!.id,
      trainerId: trainers[0]!.id,
      status: "PUBLISHED",
      startsAt: new Date(),
      days: {
        create: [
          {
            dayIndex: 1,
            title: "روز ۱ — پوش",
            exercises: {
              create: [
                { exerciseId: exercises[2]!.id, sets: 4, reps: "6-8", weightKg: 70, restSeconds: 120, sortOrder: 1 },
                { exerciseId: exercises[3]!.id, sets: 3, reps: "8-10", weightKg: 22, restSeconds: 90, sortOrder: 2 },
                { exerciseId: exercises[11]!.id, sets: 3, reps: "10-12", restSeconds: 60, sortOrder: 3 },
              ],
            },
          },
          {
            dayIndex: 2,
            title: "روز ۲ — پول",
            exercises: {
              create: [
                { exerciseId: exercises[1]!.id, sets: 4, reps: "5", weightKg: 100, restSeconds: 180, sortOrder: 1 },
                { exerciseId: exercises[4]!.id, sets: 3, reps: "6-8", restSeconds: 120, sortOrder: 2 },
                { exerciseId: exercises[9]!.id, sets: 3, reps: "10-12", restSeconds: 75, sortOrder: 3 },
              ],
            },
          },
          {
            dayIndex: 3,
            title: "روز ۳ — پا",
            exercises: {
              create: [
                { exerciseId: exercises[0]!.id, sets: 4, reps: "5-6", weightKg: 90, restSeconds: 180, sortOrder: 1 },
                { exerciseId: exercises[6]!.id, sets: 3, reps: "10", weightKg: 20, restSeconds: 90, sortOrder: 2 },
                { exerciseId: exercises[13]!.id, sets: 3, reps: "12", restSeconds: 90, sortOrder: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  const bookingStart = new Date();
  bookingStart.setDate(bookingStart.getDate() + 2);
  bookingStart.setHours(18, 0, 0, 0);
  const bookingEnd = new Date(bookingStart.getTime() + 60 * 60 * 1000);

  await prisma.booking.create({
    data: {
      athleteId: athleteUser.athleteProfile!.id,
      trainerId: trainers[0]!.id,
      branchId: branches[0]!.id,
      startsAt: bookingStart,
      endsAt: bookingEnd,
      status: "CONFIRMED",
      notes: "جلسه تکنیک اسکوات",
    },
  });

  const fitnessClass = await prisma.fitnessClass.create({
    data: {
      title: "HIIT ۴۵ دقیقه‌ای",
      description: "تمرین تناوبی با شدت بالا",
      branchId: branches[2]!.id,
      trainerId: trainers[1]!.id,
      capacity: 20,
      durationMin: 45,
    },
  });

  const classStart = new Date();
  classStart.setDate(classStart.getDate() + 1);
  classStart.setHours(19, 0, 0, 0);

  await prisma.classSchedule.create({
    data: {
      classId: fitnessClass.id,
      startsAt: classStart,
      endsAt: new Date(classStart.getTime() + 45 * 60 * 1000),
      capacity: 20,
      bookings: {
        create: { athleteId: athleteUser.athleteProfile!.id, status: "CONFIRMED" },
      },
    },
  });

  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i) * 7);
    await prisma.progressMeasurement.create({
      data: {
        athleteId: athleteUser.athleteProfile!.id,
        measuredAt: d,
        weightKg: 86 - i * 0.7,
        bodyFatPct: 18 - i * 0.4,
        waistCm: 88 - i,
        chestCm: 98 + i * 0.3,
      },
    });
  }

  await prisma.strengthRecord.create({
    data: {
      athleteId: athleteUser.athleteProfile!.id,
      exerciseId: exercises[2]!.id,
      weightKg: 80,
      reps: 5,
      isPR: true,
    },
  });

  await prisma.workoutLog.create({
    data: {
      athleteId: athleteUser.athleteProfile!.id,
      exerciseId: exercises[0]!.id,
      sets: 4,
      reps: 6,
      weightKg: 90,
    },
  });

  const achievements = [
    { code: "first_workout", title: "اولین تمرین", description: "اولین جلسه را ثبت کردید", xpReward: 50 },
    { code: "first_pr", title: "اولین رکورد شخصی", description: "یک PR جدید ثبت شد", xpReward: 80 },
    { code: "thirty_sessions", title: "۳۰ جلسه تمرین", description: "۳۰ جلسه ثبت شده", xpReward: 200 },
    { code: "seven_day_streak", title: "۷ روز متوالی", description: "هفت روز تمرین پشت سر هم", xpReward: 100 },
  ];

  for (const a of achievements) {
    await prisma.achievement.create({ data: a });
  }

  await prisma.userAchievement.create({
    data: {
      userId: athleteUser.id,
      achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { code: "first_workout" } })).id,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: athleteUser.id,
        type: "WORKOUT_ASSIGNED",
        title: "برنامه جدید آماده است",
        body: plan.title,
        href: "/athlete/workouts",
      },
      {
        userId: athleteUser.id,
        type: "BOOKING_CONFIRMED",
        title: "رزرو تأیید شد",
        body: "جلسه تمرین شخصی شما تأیید شد.",
        href: "/athlete/bookings",
      },
      {
        userId: athleteUser.id,
        type: "MEMBERSHIP_EXPIRING",
        title: "عضویت رو به اتمام",
        body: "۲۵ روز تا پایان عضویت پرمیوم باقی مانده است.",
        href: "/athlete/membership",
      },
    ],
  });

  for (const branch of branches) {
    await prisma.attendance.create({
      data: {
        userId: athleteUser.id,
        branchId: branch.id,
        checkedInAt: new Date(Date.now() - 30 * 60 * 1000),
        method: "manual",
      },
    });
  }

  const category = await prisma.category.create({
    data: { name: "تمرین و تغذیه", slug: "training-nutrition" },
  });

  await prisma.article.createMany({
    data: [
      {
        title: "چطور برنامه قدرتی را شروع کنیم؟",
        slug: "start-strength-program",
        excerpt: "راهنمای شروع ایمن و مؤثر برای تمرینات قدرتی.",
        content: "شروع با حرکات پایه، پیشرفت تدریجی و ریکاوری کافی کلید موفقیت است...",
        categoryId: category.id,
        authorId: superAdmin.id,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "اهمیت خواب در ریکاوری عضلانی",
        slug: "sleep-and-recovery",
        excerpt: "چرا خواب عمیق بخش جدایی‌ناپذیر پیشرفت شماست.",
        content: "در خواب عمیق هورمون رشد ترشح می‌شود و بافت عضلانی بازسازی می‌شود...",
        categoryId: category.id,
        authorId: superAdmin.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      { question: "چطور عضویت بخرم؟", answer: "از صفحه عضویت پلن را انتخاب کنید، شعبه را مشخص کنید و پرداخت را انجام دهید.", sortOrder: 1 },
      { question: "آیا می‌توانم شعبه را عوض کنم؟", answer: "در پلن‌های پرمیوم و بالاتر امکان استفاده از چند شعبه وجود دارد.", sortOrder: 2 },
      { question: "رزرو تمرین شخصی چگونه است؟", answer: "از پنل ورزشکار، بخش رزرو، مربی و زمان را انتخاب کنید.", sortOrder: 3 },
      { question: "برنامه تمرینی را چه کسی می‌سازد؟", answer: "مربی اختصاصی شما برنامه را طراحی و منتشر می‌کند.", sortOrder: 4 },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      { name: "مهدی ک.", role: "عضو وی‌آی‌پی", content: "از وقتی وارد پنل شدم، تمدید و تمرین و رزرو همه در یک جا جمع شده.", rating: 5, sortOrder: 1 },
      { name: "نگار ر.", role: "عضو پرمیوم", content: "تراکم شعب کمک کرد بدون معطلی زمان درست برای تمرین پیدا کنم.", rating: 5, sortOrder: 2 },
      { name: "سامان ب.", role: "عضو بیسیک", content: "برنامه مربی شفاف است و پیشرفت وزن را دقیق می‌بینم.", rating: 5, sortOrder: 3 },
    ],
  });

  console.log("✅ Seed complete");
  console.log("Demo logins (password: password123):");
  console.log("  admin@blackgym.ir");
  console.log("  athlete@blackgym.ir");
  console.log("  ali.trainer@blackgym.ir");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
