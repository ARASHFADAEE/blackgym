"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { ROLE_FA } from "@/lib/i18n/fa-labels";

import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "مرکز کنترل",
    items: [
      { href: "/admin", label: "داشبورد مدیریت", icon: LayoutDashboard, exact: true },
      { href: "/admin/retention", label: "نگهداشت اعضا", icon: BarChart3 },
      { href: "/admin/analytics", label: "تحلیل", icon: BarChart3 },
    ],
  },
  {
    title: "فروش",
    items: [
      { href: "/admin/crm", label: "مدیریت لیدها", icon: Users },
      { href: "/admin/memberships", label: "عضویت‌ها", icon: CreditCard },
      { href: "/admin/payments", label: "پرداخت‌ها", icon: Wallet },
    ],
  },
  {
    title: "عملیات",
    items: [
      { href: "/admin/attendance", label: "حضور و غیاب", icon: Calendar },
      { href: "/admin/users", label: "کاربران", icon: Users },
      { href: "/admin/branches", label: "شعب", icon: Building2 },
      { href: "/admin/bookings", label: "رزروها", icon: Calendar },
    ],
  },
  {
    title: "تجربه و محتوا",
    items: [{ href: "/admin/content", label: "محتوا", icon: FileText }],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  name,
  role,
}: {
  children: React.ReactNode;
  name?: string | null;
  role?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <>
      <div className="mb-6 px-1">
        <Link href="/admin" className="block text-lg font-black tracking-tight">
          Black<span className="text-primary">GYM</span>
          <span className="mt-0.5 block text-[11px] font-medium tracking-normal text-muted-foreground">
            مرکز کنترل عملیات
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto pb-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-primary/15 text-primary shadow-[inset_3px_0_0_0_var(--primary)]"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-border/80 pt-4">
        <div className="mb-3 rounded-xl border border-border/80 bg-white/[0.03] px-3 py-2.5">
          <p className="truncate text-sm font-medium">{name ?? "مدیر"}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {(role && ROLE_FA[role]) || "ادمین"}
          </p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="w-full justify-start gap-2">
            <LogOut className="size-4" />
            خروج از پنل
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#070707] text-foreground">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 100% 0%, rgba(184,255,60,0.08), transparent 55%), radial-gradient(ellipse 50% 30% at 0% 100%, rgba(255,255,255,0.03), transparent 50%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-border/80 bg-[#0a0a0a]/80 p-4 backdrop-blur-xl lg:flex">
          {Nav}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label="بستن منو"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col border-l border-border bg-[#0a0a0a] p-4 shadow-2xl">
              <button
                type="button"
                className="mb-4 self-start rounded-lg border border-border p-2 text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </button>
              {Nav}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-[#070707]/85 px-4 backdrop-blur-xl md:px-6">
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="منوی ادمین"
            >
              <Menu className="size-4" />
            </button>

            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border border-border/70 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground sm:flex">
              <Search className="size-4 shrink-0" />
              <span className="truncate">جستجوی سریع کاربران، پرداخت‌ها، شعب…</span>
            </div>

            <div className="mr-auto flex items-center gap-2 sm:mr-0">
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link href="/" target="_blank">
                  مشاهده سایت
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/memberships">عضویت جدید</Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
