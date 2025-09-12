import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";
import "@/styles/globals.css";

import { getMessages } from "next-intl/server";
import { Jura } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import ConditionalLayout from "./components/ConditionalLayout";

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  let messages;

  try {
    messages = await getMessages({ locale });
    //messages = await getMessages({ locale: params.locale });
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${jura.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Toaster richColors position="bottom-left" />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
