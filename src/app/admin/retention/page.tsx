import Link from "next/link";
import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { calculateMemberHealthScore, listHighRiskMembers } from "@/features/retention/service";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminRetentionPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const sp = await searchParams;
  const highRisk = await listHighRiskMembers(30);
  const selectedId = sp.user ?? highRisk[0]?.id;
  const detail = selectedId ? await calculateMemberHealthScore(selectedId) : null;
  const selectedUser = highRisk.find((u) => u.id === selectedId) ?? highRisk[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="موتور نگهداشت اعضا"
        description="امتیاز سلامت عضو، خطر ریزش و پیشنهاد اقدام برای کاهش ریزش"
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <AdminPanel className="xl:col-span-2" title="اعضای در خطر" description="مرتب‌شده بر اساس امتیاز سلامت">
          {highRisk.length ? (
            <div className="space-y-2">
              {highRisk.map((m) => (
                <Link
                  key={m.id}
                  href={`/admin/retention?user=${m.id}`}
                  className="block rounded-xl border border-border/60 px-3 py-2.5 hover:border-primary/30 hover:bg-primary/[0.05]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        امتیاز {toPersianDigits(m.healthScore)}
                      </p>
                    </div>
                    <AdminStatusBadge status={m.churnRisk} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <AdminEmpty message="ابتدا از داشبورد مدیریت، محاسبه نگهداشت را اجرا کنید." />
          )}
        </AdminPanel>

        <AdminPanel
          className="xl:col-span-3"
          title={selectedUser ? selectedUser.name : "پروفایل نگهداشت"}
          description={
            detail
              ? `خطر ریزش: ${
                  detail.churnRisk === "CRITICAL"
                    ? "بحرانی"
                    : detail.churnRisk === "HIGH"
                      ? "بالا"
                      : detail.churnRisk === "MEDIUM"
                        ? "متوسط"
                        : "کم"
                } · امتیاز ${toPersianDigits(detail.score)}`
              : "عضوی انتخاب نشده"
          }
        >
          {detail && selectedUser ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[11px] text-muted-foreground">روز از آخرین حضور</p>
                  <p className="text-xl font-black">
                    {detail.daysSinceLastVisit != null
                      ? toPersianDigits(detail.daysSinceLastVisit)
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[11px] text-muted-foreground">روز تا انقضا</p>
                  <p className="text-xl font-black">
                    {detail.membershipDaysLeft != null
                      ? toPersianDigits(detail.membershipDaysLeft)
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[11px] text-muted-foreground">حضور ماه</p>
                  <p className="text-xl font-black">{toPersianDigits(detail.visitsThisMonth)}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">دلایل</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {detail.reasons.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                  {!detail.reasons.length ? <li>• عامل بحرانی ثبت نشده</li> : null}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">اقدام پیشنهادی</p>
                <ol className="list-decimal space-y-1 pr-5 text-sm text-muted-foreground">
                  {detail.recommendations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/admin/memberships">پیشنهاد تمدید</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/users">تماس با عضو</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/crm">ارسال یادآور</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/admin/attendance">مشاهده حضور</Link>
                </Button>
              </div>
            </div>
          ) : (
            <AdminEmpty message="داده‌ای برای نمایش نیست." />
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
