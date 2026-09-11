import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminCheckInAction,
  enrollBiometricAction,
  qrCheckInAction,
} from "@/features/admin/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { ATTENDANCE_SOURCE_FA } from "@/lib/i18n/fa-labels";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";
import Link from "next/link";

export default async function AdminAttendancePage() {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const [branches, today, openSessions, athletes] = await Promise.all([
    prisma.branch.findMany({ where: { status: "ACTIVE" } }),
    prisma.attendance.findMany({
      where: { checkedInAt: { gte: dayStart } },
      include: { user: true, branch: true },
      orderBy: { checkedInAt: "desc" },
      take: 50,
    }),
    prisma.attendance.findMany({
      where: { checkedOutAt: null },
      include: { user: true, branch: true },
      orderBy: { checkedInAt: "desc" },
      take: 30,
    }),
    prisma.user.findMany({
      where: { role: "ATHLETE", isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="حضور و غیاب"
        description={`حضور امروز ${toPersianDigits(today.length)} · QR · اثرانگشت · پذیرش`}
      />
      <p className="text-sm text-muted-foreground">
        صفحه گیشه عمومی:{" "}
        {branches.map((b) => (
          <Link key={b.id} href={`/kiosk/${b.slug}`} className="ml-2 text-primary hover:underline">
            {b.name}
          </Link>
        ))}
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel title="ثبت ورود پذیرش" description="جستجو با ایمیل، موبایل یا نام">
          <form action={adminCheckInAction} className="grid gap-2 sm:grid-cols-3">
            <Input name="query" placeholder="ایمیل / موبایل / نام" required />
            <select
              name="branchId"
              required
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Button type="submit">ثبت ورود</Button>
          </form>
        </AdminPanel>

        <AdminPanel title="ورود با کد QR" description="کد ۶ کاراکتری ورزشکار">
          <form action={qrCheckInAction} className="grid gap-2 sm:grid-cols-3">
            <Input name="code" placeholder="کد حضور" required dir="ltr" className="uppercase" />
            <select
              name="branchId"
              required
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Button type="submit">اسکن / ثبت</Button>
          </form>
        </AdminPanel>
      </div>

      <AdminPanel
        title="ثبت اثرانگشت (گیشه)"
        description="شناسه قالب دستگاه ذخیره می‌شود — تصویر خام اثرانگشت نگه داشته نمی‌شود"
      >
        <form action={enrollBiometricAction} className="grid gap-2 sm:grid-cols-4">
          <select
            name="userId"
            required
            className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
          >
            <option value="">انتخاب ورزشکار</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <Input
            name="deviceTemplateId"
            placeholder="شناسه قالب دستگاه"
            required
            dir="ltr"
          />
          <Input name="fingerLabel" placeholder="انگشت (اختیاری)" defaultValue="انگشت اشاره راست" />
          <Button type="submit">ثبت اثرانگشت</Button>
        </form>
      </AdminPanel>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel title="جلسات باز" description="هنوز خروج ثبت نشده">
          {openSessions.length ? (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>ورزشکار</AdminTh>
                  <AdminTh>شعبه</AdminTh>
                  <AdminTh>ورود</AdminTh>
                </tr>
              </thead>
              <tbody>
                {openSessions.map((a) => (
                  <tr key={a.id}>
                    <AdminTd>{a.user.name}</AdminTd>
                    <AdminTd>{a.branch.name}</AdminTd>
                    <AdminTd className="text-muted-foreground">
                      {formatJalaliDateTime(a.checkedInAt)}
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          ) : (
            <AdminEmpty message="جلسه بازی نیست." />
          )}
        </AdminPanel>

        <AdminPanel title="حضور امروز" description="آخرین ۵۰ رکورد">
          {today.length ? (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>ورزشکار</AdminTh>
                  <AdminTh>منبع</AdminTh>
                  <AdminTh>زمان</AdminTh>
                </tr>
              </thead>
              <tbody>
                {today.map((a) => (
                  <tr key={a.id}>
                    <AdminTd>{a.user.name}</AdminTd>
                    <AdminTd>{ATTENDANCE_SOURCE_FA[a.source] ?? a.source}</AdminTd>
                    <AdminTd className="text-muted-foreground">
                      {formatJalaliDateTime(a.checkedInAt)}
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          ) : (
            <AdminEmpty message="امروز حضوری ثبت نشده." />
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
