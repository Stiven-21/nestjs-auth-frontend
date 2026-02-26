"use client";

import { createContext, useContext } from "react";
import useThemeMode from "@/hooks/shared/useThemeMode";
import { Theme } from "@/libs/server/theme";

const ThemeContext = createContext<ReturnType<typeof useThemeMode> | null>(
  null,
);

export default function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const value = useThemeMode(initialTheme);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
