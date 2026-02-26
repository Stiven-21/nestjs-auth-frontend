"use client";

import { useEffect, useState, useTransition } from "react";
import { Theme } from "@/libs/server/theme";
import { setThemeAction } from "@/action/theme";

export default function useThemeMode(initialTheme: Theme) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const html = document.documentElement;

    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    const appliedTheme = theme === "system" ? getSystemTheme() : theme;

    if (appliedTheme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);

    startTransition(() => {
      setThemeAction(newTheme);
    });
  };

  return [theme, updateTheme, isPending] as const;
}
