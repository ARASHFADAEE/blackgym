import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  Dumbbell,
  Home,
  LogOut,
  TrendingUp,
  CreditCard,
  Settings,
} from "lucide-react";

const links = [
  { href: "/athlete", label: "خانه", icon: Home },
  { href: "/athlete/workouts", label: "تمرین", icon: Dumbbell },
  { href: "/athlete/classes", label: "کلاس", icon: Calendar },
  { href: "/athlete/attendance", label: "حضور", icon: Calendar },
  { href: "/athlete/progress", label: "پیشرفت", icon: TrendingUp },
  { href: "/athlete/leaderboard", label: "رتبه", icon: TrendingUp },
  { href: "/athlete/membership", label: "عضویت", icon: CreditCard },
  { href: "/athlete/bookings", label: "رزرو", icon: Calendar },
  { href: "/athlete/notifications", label: "اعلان", icon: Bell },
  { href: "/athlete/settings", label: "تنظیمات", icon: Settings },
];

export async function AthleteShell({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname?: string;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/athlete" className="text-lg font-black tracking-tight">
            Black<span className="text-primary">GYM</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{session?.user?.name}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="icon" aria-label="خروج">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5 gap-1 px-2 py-2">
          {links.slice(0, 5).map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px]",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className="fixed bottom-6 left-6 hidden md:block">
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-xl">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Icon className="size-4" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
