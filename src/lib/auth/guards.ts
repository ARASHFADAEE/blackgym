import { auth } from "@/lib/auth";
import { getDashboardPath, hasPermission, type Permission } from "@/lib/permissions";
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireSession();
  if (!hasPermission(session.user.role, permission)) {
    redirect(getDashboardPath(session.user.role));
  }
  return session;
}

export async function requireRoles(roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }
  return session;
}
