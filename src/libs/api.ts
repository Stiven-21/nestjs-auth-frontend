import { auth } from "@/auth";

/**
 * Fetch autenticado desde Server Components / Server Actions / Route Handlers
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No hay sesión activa");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...options.headers,
    },
  });
}
