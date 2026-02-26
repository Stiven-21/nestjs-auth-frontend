"use server";

import { Theme, saveTheme } from "@/libs/server/theme";

export async function setThemeAction(theme: Theme) {
  await saveTheme(theme);
}
