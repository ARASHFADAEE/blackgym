import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { formatJalali } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      createdAt: true,
    },
  });

  const counts = {
    total: users.length,
    athletes: users.filter((u) => u.role === "ATHLETE").length,
    trainers: users.filter((u) => u.role === "TRAINER").length,
    admins: users.filter((u) =>
      ["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"].includes(u.role),
    ).length,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="کاربران"
        description={`مدیریت نقش و وضعیت دسترسی · نمایش ${toPersianDigits(counts.total)} کاربر اخیر`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/80 bg-[#0d0d0d] p-4">
          <p className="text-xs text-muted-foreground">ورزشکار</p>
          <p className="mt-1 text-2xl font-black">{toPersianDigits(counts.athletes)}</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-[#0d0d0d] p-4">
          <p className="text-xs text-muted-foreground">مربی</p>
          <p className="mt-1 text-2xl font-black">{toPersianDigits(counts.trainers)}</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-[#0d0d0d] p-4">
          <p className="text-xs text-muted-foreground">مدیریتی</p>
          <p className="mt-1 text-2xl font-black">{toPersianDigits(counts.admins)}</p>
        </div>
      </div>

      <AdminPanel title="فهرست کاربران" description="نقش‌ها مستقیماً روی دسترسی پنل‌ها اثر می‌گذارند">
        {users.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>نام</AdminTh>
                <AdminTh>ایمیل / موبایل</AdminTh>
                <AdminTh>نقش</AdminTh>
                <AdminTh>وضعیت</AdminTh>
                <AdminTh>عضویت از</AdminTh>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <AdminTd className="font-medium">{u.name}</AdminTd>
                  <AdminTd>
                    <p className="text-muted-foreground" dir="ltr">
                      {u.email}
                    </p>
                    {u.phone ? (
                      <p className="text-[11px] text-muted-foreground" dir="ltr">
                        {u.phone}
                      </p>
                    ) : null}
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={u.role} />
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={u.isActive ? "ACTIVE" : "CANCELLED"} />
                  </AdminTd>
                  <AdminTd className="text-muted-foreground">{formatJalali(u.createdAt)}</AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty message="کاربری ثبت نشده است." />
        )}
      </AdminPanel>
    </div>
  );
}
