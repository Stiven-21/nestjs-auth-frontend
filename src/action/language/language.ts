"use server";

import { Language, saveLanguage } from "@/libs/server/language";

export async function setLanguageAction(language: Language) {
  await saveLanguage(language);
}
