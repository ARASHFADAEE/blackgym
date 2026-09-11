import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, LayoutDashboard, LogOut, Users } from "lucide-react";

const links = [
  { href: "/trainer", label: "داشبورد", icon: LayoutDashboard },
  { href: "/trainer/athletes", label: "ورزشکاران", icon: Users },
  { href: "/trainer/plans", label: "برنامه‌ها", icon: Dumbbell },
  { href: "/trainer/bookings", label: "رزروها", icon: Calendar },
];

export function TrainerShell({
  children,
  name,
}: {
  children: React.ReactNode;
  name?: string | null;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-l border-border p-4 md:block">
          <Link href="/trainer" className="mb-8 block text-xl font-black">
            مربی · Black<span className="text-primary">GYM</span>
          </Link>
          <nav className="space-y-1">
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
          </nav>
          <form action={logoutAction} className="mt-8">
            <Button type="submit" variant="outline" className="w-full gap-2">
              <LogOut className="size-4" />
              خروج
            </Button>
          </form>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <p className="font-bold">{name}</p>
            <form action={logoutAction}>
              <Button type="submit" size="sm" variant="ghost">
                خروج
              </Button>
            </form>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
