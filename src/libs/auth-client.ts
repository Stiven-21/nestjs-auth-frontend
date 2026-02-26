"use client";

import { useSession } from "next-auth/react";

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export function usePermission(permission: string): boolean {
  const { data: session } = useSession();

  if (!session?.user?.permissions) return false;

  // "all" otorga acceso total
  if (session.user.permissions.includes("all")) return true;

  return session.user.permissions.includes(permission);
}

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export function useRole(role: string): boolean {
  const { data: session } = useSession();
  return session?.user?.role === role;
}

/**
 * Hook para obtener el accessToken (útil para fetch al backend)
 */
export function useAccessToken(): string | null {
  const { data: session } = useSession();
  return session?.accessToken ?? null;
}
