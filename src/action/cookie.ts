"use server";

import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function clearAllCookies() {
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    if (cookie.name !== "device_id") {
      cookieStore.delete(cookie.name);
    }
  });
}
