import type { Role } from "@prisma/client";

export type Permission =
  | "dashboard:athlete"
  | "dashboard:trainer"
  | "dashboard:admin"
  | "users:read"
  | "users:write"
  | "users:roles"
  | "branches:read"
  | "branches:write"
  | "memberships:buy"
  | "memberships:manage"
  | "payments:manage"
  | "workouts:own"
  | "workouts:assign"
  | "bookings:own"
  | "bookings:manage"
  | "progress:own"
  | "progress:view_assigned"
  | "notifications:own"
  | "analytics:view"
  | "content:manage"
  | "system:config";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard:admin",
    "users:read",
    "users:write",
    "users:roles",
    "branches:read",
    "branches:write",
    "memberships:manage",
    "payments:manage",
    "workouts:assign",
    "bookings:manage",
    "progress:view_assigned",
    "notifications:own",
    "analytics:view",
    "content:manage",
    "system:config",
  ],
  ADMIN: [
    "dashboard:admin",
    "users:read",
    "users:write",
    "branches:read",
    "branches:write",
    "memberships:manage",
    "payments:manage",
    "workouts:assign",
    "bookings:manage",
    "progress:view_assigned",
    "analytics:view",
    "content:manage",
  ],
  BRANCH_MANAGER: [
    "dashboard:admin",
    "users:read",
    "branches:read",
    "branches:write",
    "memberships:manage",
    "bookings:manage",
    "analytics:view",
  ],
  TRAINER: [
    "dashboard:trainer",
    "workouts:assign",
    "bookings:manage",
    "progress:view_assigned",
    "branches:read",
  ],
  ATHLETE: [
    "dashboard:athlete",
    "memberships:buy",
    "workouts:own",
    "bookings:own",
    "progress:own",
    "notifications:own",
    "branches:read",
  ],
  STAFF: [
    "dashboard:admin",
    "branches:read",
    "bookings:manage",
    "users:read",
    "memberships:manage",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "BRANCH_MANAGER":
      return "/admin";
    case "TRAINER":
      return "/trainer";
    case "STAFF":
      return "/admin";
    default:
      return "/athlete";
  }
}

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"];
