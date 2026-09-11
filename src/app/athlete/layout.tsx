import { requirePermission } from "@/lib/auth/guards";
import { AthleteShell } from "@/components/layout/athlete-shell";

export const dynamic = "force-dynamic";

export default async function AthleteLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("dashboard:athlete");
  return <AthleteShell>{children}</AthleteShell>;
}
