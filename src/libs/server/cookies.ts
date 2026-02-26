"use server";

import { cookies } from "next/headers";

type CookieOptions<T> = {
  key: string;
  defaultValue: T;
  allowedValues?: readonly T[];
};

export async function getCookieValue<T extends string>({
  key,
  defaultValue,
  allowedValues,
}: CookieOptions<T>): Promise<T> {
  const store = await cookies();
  const value = store.get(key)?.value as T | undefined;

  if (!value) return defaultValue;

  if (allowedValues && !allowedValues.includes(value)) {
    return defaultValue;
  }

  return value;
}

export async function setCookieValue<T extends string>({
  key,
  value,
  allowedValues,
}: {
  key: string;
  value: T;
  allowedValues?: readonly T[];
}): Promise<void> {
  if (allowedValues && !allowedValues.includes(value)) {
    throw new Error(`Invalid cookie value for ${key}`);
  }

  (await cookies()).set({
    name: key,
    value,
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });
}
