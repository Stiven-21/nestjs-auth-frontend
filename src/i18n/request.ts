import { getLanguage } from "@/libs/server/language";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getLanguage();

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}/${locale}.json`))
      .default,
  };
});
