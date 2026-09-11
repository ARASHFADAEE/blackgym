import {
  AdminEmpty,
  AdminKpiCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const [payments, successSum, pendingCount, failedCount] = await Promise.all([
    prisma.payment.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="پرداخت‌ها"
        description="مانیتورینگ درگاه، تسویه و پیگیری تراکنش‌های ناموفق"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminKpiCard
          label="جمع موفق"
          value={formatToman(successSum._sum.amount ?? 0)}
          hint={`${toPersianDigits(successSum._count)} تراکنش`}
          accent
        />
        <AdminKpiCard label="معلق" value={toPersianDigits(pendingCount)} hint="نیاز به بررسی" />
        <AdminKpiCard label="ناموفق" value={toPersianDigits(failedCount)} hint="فرصت بازیابی فروش" />
      </div>

      <AdminPanel title="تراکنش‌ها" description="آخرین ۱۰۰ پرداخت سیستم">
        {payments.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>کاربر</AdminTh>
                <AdminTh>مبلغ</AdminTh>
                <AdminTh>درگاه</AdminTh>
                <AdminTh>وضعیت</AdminTh>
                <AdminTh>زمان</AdminTh>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <AdminTd>
                    <p className="font-medium">{p.user.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.description ?? "—"}</p>
                  </AdminTd>
                  <AdminTd className="font-medium">{formatToman(p.amount)}</AdminTd>
                  <AdminTd className="uppercase text-muted-foreground">{p.provider}</AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={p.status} />
                  </AdminTd>
                  <AdminTd className="text-muted-foreground">
                    {formatJalaliDateTime(p.createdAt)}
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty message="پرداختی ثبت نشده است." />
        )}
      </AdminPanel>
    </div>
  );
}
