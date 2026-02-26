"use client";

import { clearAllCookies } from "@/action/cookie";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    // authService.logout(session?.accessToken as string);
    clearAllCookies();
    signOut({ callbackUrl: "/" });
  };
  return (
    <button
      onClick={() => handleLogout()}
      className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  );
}
