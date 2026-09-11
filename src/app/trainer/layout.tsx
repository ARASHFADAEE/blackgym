import { requirePermission } from "@/lib/auth/guards";
import { TrainerShell } from "@/components/layout/trainer-shell";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("dashboard:trainer");
  const session = await auth();
  return <TrainerShell name={session?.user?.name}>{children}</TrainerShell>;
}
