// src/i18n.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = locale || "en";

  let messages;
  try {
    messages = (await import(`../messages/${selectedLocale}.json`)).default;
  } catch {
    // Fallback to default if specific locale file is missing
    messages = (await import(`../messages/en.json`)).default;
  }

  return {
    locale: selectedLocale,
    messages,
  };
});
