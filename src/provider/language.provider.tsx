"use client";

import { createContext, useContext } from "react";
import useLanguageMode from "@/hooks/shared/useLanguageMode";
import { Language } from "@/libs/server/language";

const LanguageContext = createContext<ReturnType<
  typeof useLanguageMode
> | null>(null);

export default function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: React.ReactNode;
}) {
  const value = useLanguageMode(initialLanguage);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
