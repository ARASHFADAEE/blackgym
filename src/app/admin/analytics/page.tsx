import {
  AdminEmpty,
  AdminKpiCard,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { prisma } from "@/lib/db/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [byPlan, byBranch, trainers, revenue, activeMembers, articles] = await Promise.all([
    prisma.membership.groupBy({
      by: ["planId"],
      _count: true,
      where: { status: "ACTIVE" },
    }),
    prisma.membership.groupBy({
      by: ["branchId"],
      _count: true,
      where: { status: "ACTIVE" },
    }),
    prisma.trainerProfile.findMany({
      include: {
        user: true,
        _count: { select: { athletes: true, bookings: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endsAt: { gte: new Date() } },
    }),
    prisma.article.count({ where: { isPublished: true } }),
  ]);

  const plans = await prisma.membershipPlan.findMany();
  const branches = await prisma.branch.findMany();
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.name]));
  const branchMap = Object.fromEntries(branches.map((b) => [b.id, b.name]));
  const maxPlan = Math.max(1, ...byPlan.map((r) => r._count));
  const maxBranch = Math.max(1, ...byBranch.map((r) => r._count));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="تحلیل عملکرد"
        description="شاخص‌های کلیدی قابل ارائه به مدیریت و مارکتینگ برای تصمیم‌گیری نگهداشت و فروش"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="درآمد کل موفق"
          value={formatToman(revenue._sum.amount ?? 0)}
          hint={`${toPersianDigits(revenue._count)} تراکنش`}
          accent
        />
        <AdminKpiCard label="عضو فعال" value={toPersianDigits(activeMembers)} />
        <AdminKpiCard label="مربیان" value={toPersianDigits(trainers.length)} />
        <AdminKpiCard label="مقالات منتشر" value={toPersianDigits(articles)} hint="موتور محتوای سئو" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="توزیع پلن‌های فعال" description="کدام پلن بیشتر فروخته/فعال است">
          {byPlan.length ? (
            <div className="space-y-3">
              {byPlan.map((row) => (
                <div key={row.planId}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{planMap[row.planId] ?? row.planId}</span>
                    <span className="text-muted-foreground">{toPersianDigits(row._count)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(row._count / maxPlan) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="داده پلن فعال نیست." />
          )}
        </AdminPanel>

        <AdminPanel title="عضویت فعال بر اساس شعبه" description="سهم هر شعبه از اعضای فعال">
          {byBranch.length ? (
            <div className="space-y-3">
              {byBranch.map((row) => (
                <div key={row.branchId}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{branchMap[row.branchId] ?? row.branchId}</span>
                    <span className="text-muted-foreground">{toPersianDigits(row._count)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${(row._count / maxBranch) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="داده شعبه‌ای نیست." />
          )}
        </AdminPanel>
      </div>

      <AdminPanel title="عملکرد مربیان" description="ورزشکار اختصاصی و حجم رزرو">
        {trainers.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-border/60 bg-white/[0.02] px-3 py-3"
              >
                <p className="font-medium">{t.user.name}</p>
                <p className="text-xs text-muted-foreground">{t.specialty}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ورزشکار {toPersianDigits(t._count.athletes)} · رزرو{" "}
                  {toPersianDigits(t._count.bookings)} · امتیاز{" "}
                  {toPersianDigits(t.rating.toFixed(1))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <AdminEmpty message="مربی ثبت نشده است." />
        )}
      </AdminPanel>
    </div>
  );
}
