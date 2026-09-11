import { requirePermission } from "@/lib/auth/guards";
import { AdminShell } from "@/components/layout/admin-shell";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("dashboard:admin");
  const session = await auth();
  return (
    <AdminShell name={session?.user?.name} role={session?.user?.role}>
      {children}
    </AdminShell>
  );
}
