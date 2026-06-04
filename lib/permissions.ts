import { Role } from "@prisma/client";

export const PERMISSIONS = {
  // Orders
  "orders:read": [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  "orders:create": [Role.ADMIN, Role.MANAGER],
  "orders:update": [Role.ADMIN, Role.MANAGER],
  "orders:delete": [Role.ADMIN],

  // Products
  "products:read": [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  "products:create": [Role.ADMIN, Role.MANAGER],
  "products:update": [Role.ADMIN, Role.MANAGER],
  "products:delete": [Role.ADMIN],

  // Customers
  "customers:read": [Role.ADMIN, Role.MANAGER, Role.VIEWER],
  "customers:create": [Role.ADMIN, Role.MANAGER],
  "customers:update": [Role.ADMIN, Role.MANAGER],
  "customers:delete": [Role.ADMIN],

  // Users (admin only)
  "users:read": [Role.ADMIN],
  "users:create": [Role.ADMIN],
  "users:update": [Role.ADMIN],
  "users:delete": [Role.ADMIN],

  // Analytics
  "analytics:read": [Role.ADMIN, Role.MANAGER],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: requires ${permission}`);
  }
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
};

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-800",
  MANAGER: "bg-blue-100 text-blue-800",
  VIEWER: "bg-gray-100 text-gray-800",
};
