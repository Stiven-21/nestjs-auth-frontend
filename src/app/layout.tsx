import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import AuthSessionProvider from "@/components/providers/session-provider";
import { ToastContainer } from "react-toastify";
import { getTheme } from "@/libs/server/theme";
import ThemeProvider from "@/provider/theme.provider";
import LanguageProvider from "@/provider/language.provider";
import { Language } from "@/libs/server/language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth Web",
  description: "Next Auth Web with Next.js 14",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const theme = await getTheme();

  const script = `
    (function() {
      const theme = "${theme}";
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (theme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) {
          document.documentElement.setAttribute("data-theme", "dark");
        }
      }
    })();
  `;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col min-h-screen overflow-auto transition-colors`}
      >
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLanguage={locale as Language}>
            <AuthSessionProvider>
              <NextIntlClientProvider>
                <main className="grow h-full">
                  {/* <Navbar /> */}
                  {children}

                  <ToastContainer
                    draggable
                    stacked
                    newestOnTop
                    position="top-right"
                  />
                </main>
                {/* <Footer /> */}
              </NextIntlClientProvider>
            </AuthSessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
