import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Flame,
  PhoneCall,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  AdminEmpty,
  AdminKpiCard,
  AdminPageHeader,
  AdminPanel,
  AdminQuickLink,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { recomputeHealthAction, notifyExpiringAction } from "@/features/admin/actions";
import { getCommandCenterData } from "@/features/admin/command-center";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { LEAD_SOURCE_FA } from "@/lib/i18n/fa-labels";
import { formatToman, toPersianDigits } from "@/lib/utils";
import { auth } from "@/lib/auth";

export default async function AdminCommandCenterPage() {
  const session = await auth();
  const data = await getCommandCenterData();
  const { kpis, alerts } = data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صبح بخیر" : hour < 18 ? "ظهر بخیر" : "عصر بخیر";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="مرکز کنترل بلک‌جیم"
        description={`${greeting}، ${session?.user?.name ?? "مدیر"} — نمای عملیاتی فروش، عملیات و تجربه عضو`}
        actions={
          <>
            <form action={recomputeHealthAction}>
              <Button type="submit" variant="outline" size="sm">
                <RefreshCw className="size-4" />
                محاسبه نگهداشت
              </Button>
            </form>
            <form action={notifyExpiringAction}>
              <Button type="submit" variant="outline" size="sm">
                اعلان انقضا
              </Button>
            </form>
            <Button asChild size="sm">
              <Link href="/admin/crm">
                <Users className="size-4" />
                مدیریت لیدها
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        <AdminKpiCard
          label="درآمد این ماه"
          value={formatToman(kpis.monthlyRevenue)}
          hint={`${kpis.revenueDelta >= 0 ? "+" : ""}${toPersianDigits(kpis.revenueDelta)}٪ نسبت به ماه قبل`}
          accent
        />
        <AdminKpiCard
          label="اعضای فعال"
          value={toPersianDigits(kpis.activeMembers)}
          hint={`عضو جدید ۳۰ روز: ${toPersianDigits(kpis.newMembers)} (${kpis.membersDelta >= 0 ? "+" : ""}${toPersianDigits(kpis.membersDelta)}٪)`}
        />
        <AdminKpiCard
          label="حضور امروز"
          value={toPersianDigits(kpis.todayAttendance)}
          hint={`هفتگی: ${toPersianDigits(kpis.weeklyAttendance)}`}
        />
        <AdminKpiCard
          label="لیدهای جدید"
          value={toPersianDigits(kpis.newLeads)}
          hint={`نرخ تبدیل: ${toPersianDigits(kpis.conversionRate)}٪`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard label="درآمد کل" value={formatToman(kpis.totalRevenue)} />
        <AdminKpiCard
          label="میانگین ارزش عضویت"
          value={formatToman(kpis.averageMembershipValue)}
        />
        <AdminKpiCard
          label="نرخ نگهداشت"
          value={`${toPersianDigits(kpis.retentionRate)}٪`}
          hint={`نرخ ریزش تقریبی: ${toPersianDigits(kpis.churnRate)}٪`}
        />
        <AdminKpiCard
          label="عضویت منقضی"
          value={toPersianDigits(kpis.expiredMemberships)}
          hint={`انقضا ۷ روز: ${toPersianDigits(kpis.expiringMemberships)}`}
        />
      </div>

      <AdminPanel
        title="نیازمند توجه"
        description="اقدامات فوری برای کاهش ریزش و افزایش درآمد"
      >
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-semibold text-destructive">
                  <Flame className="size-4" />
                  {toPersianDigits(alerts.highRiskCount)} عضو در خطر ریزش بالا
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  امتیاز سلامت پایین + غیبت یا انقضای نزدیک
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/retention">مشاهده اعضا</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-semibold text-amber-200">
                  <AlertTriangle className="size-4" />
                  {toPersianDigits(alerts.expiringCount)} عضویت تا ۷ روز منقضی می‌شود
                </p>
                <p className="mt-1 text-xs text-muted-foreground">فرصت کمپین تمدید</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/memberships">شروع کمپین</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <PhoneCall className="size-4 text-amber-200" />
                  {toPersianDigits(alerts.overdueLeads)} لید نیازمند پیگیری
                </p>
                <p className="mt-1 text-xs text-muted-foreground">پیگیری عقب‌افتاده</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/crm">پیگیری کن</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {toPersianDigits(alerts.unusedTrainers)} مربی با ظرفیت استفاده‌نشده
                </p>
                <p className="mt-1 text-xs text-muted-foreground">فرصت فروش تمرین شخصی</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/retention">مشاهده مربیان</Link>
              </Button>
            </div>
          </div>
        </div>
      </AdminPanel>

      <div className="grid gap-4 xl:grid-cols-5">
        <AdminPanel
          className="xl:col-span-3"
          title="اعضای پرریسک"
          description="پیشنهاد اقدام نگهداشت"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/retention">
                همه
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          }
        >
          {data.highRisk.length ? (
            <div className="space-y-2">
              {data.highRisk.slice(0, 6).map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/[0.02] px-3 py-2.5"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      امتیاز {toPersianDigits(m.healthScore)} ·{" "}
                      {m.memberships[0]?.plan.name ?? "بدون عضویت"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge status={m.churnRisk} />
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/retention?user=${m.id}`}>مشاهده پروفایل</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="عضو پرریسکی ثبت نشده — دکمه محاسبه نگهداشت را بزنید." />
          )}
        </AdminPanel>

        <AdminPanel className="xl:col-span-2" title="اقدامات سریع" description="میان‌برهای سامانه باشگاه">
          <div className="grid gap-2">
            <AdminQuickLink href="/admin/crm" title="مسیر فروش" description="لید به مشتری" />
            <AdminQuickLink href="/admin/attendance" title="حضور و غیاب" description="ثبت ورود پذیرش" />
            <AdminQuickLink href="/admin/memberships" title="عملیات عضویت" description="فریز / تمدید / لغو" />
            <AdminQuickLink href="/admin/payments" title="درآمد و فاکتور" description="پرداخت‌های اخیر" />
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel title="تراکم شعب" description="عملیات روزانه شعب">
          <div className="space-y-3">
            {data.branchOccupancy.map((b) => (
              <div key={b.id} className="rounded-xl border border-border/60 p-3">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-muted-foreground">
                    {b.occupancy.label} · {toPersianDigits(b.occupancy.percent)}٪
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(b.occupancy.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="منبع لیدها" description="وب‌سایت، اینستاگرام، معرفی و سایر کانال‌ها">
          {data.sourceStats.length ? (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>منبع</AdminTh>
                  <AdminTh>لید</AdminTh>
                  <AdminTh>مشتری</AdminTh>
                  <AdminTh>نرخ</AdminTh>
                </tr>
              </thead>
              <tbody>
                {data.sourceStats.map((s) => (
                  <tr key={s.source}>
                    <AdminTd>{LEAD_SOURCE_FA[s.source] ?? s.source}</AdminTd>
                    <AdminTd>{toPersianDigits(s.leads)}</AdminTd>
                    <AdminTd>{toPersianDigits(s.customers)}</AdminTd>
                    <AdminTd>{toPersianDigits(s.conversionRate)}٪</AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          ) : (
            <AdminEmpty message="هنوز لیدی ثبت نشده." />
          )}
        </AdminPanel>
      </div>

      <AdminPanel title="پرداخت‌های اخیر" description="تراکنش‌های مالی">
        {data.recentPayments.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>کاربر</AdminTh>
                <AdminTh>مبلغ</AdminTh>
                <AdminTh>فاکتور</AdminTh>
                <AdminTh>وضعیت</AdminTh>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((p) => (
                <tr key={p.id}>
                  <AdminTd>
                    <p className="font-medium">{p.user.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatJalaliDateTime(p.createdAt)}
                    </p>
                  </AdminTd>
                  <AdminTd>{formatToman(p.amount)}</AdminTd>
                  <AdminTd>
                    {p.invoice ? (
                      <Link className="text-primary hover:underline" href={`/admin/invoices/${p.invoice.id}`}>
                        {p.invoice.number}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={p.status} />
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty message="پرداختی نیست." />
        )}
      </AdminPanel>
    </div>
  );
}
