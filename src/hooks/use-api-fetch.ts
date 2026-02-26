"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useApiFetch() {
  const { data: session } = useSession();

  const accessToken = session?.accessToken;

  const apiFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!accessToken) {
        throw new Error("No hay sesión activa");
      }

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
      });
    },
    [accessToken],
  );

  return { apiFetch };
}
