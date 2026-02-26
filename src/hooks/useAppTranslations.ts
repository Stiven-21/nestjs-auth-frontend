import { useTranslations } from "next-intl";

export const useAppTranslations = () => {
  const t_auth = useTranslations("auth");
  const t_language = useTranslations("language");
  const t_theme = useTranslations("theme");
  return { t_auth, t_language, t_theme };
};
