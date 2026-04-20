import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Awini - Admin Dashboard",
  description: "Smart Roadside Assistance Platform",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className="bg-slate-50 antialiased text-slate-800"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme before rendering to prevent flash
              const savedTheme = localStorage.getItem('theme');
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
              if (isDark) {
                document.documentElement.classList.add('dark');
              }
              console.log('[THEME] Initialized:', isDark ? 'dark' : 'light');
              console.log('[LOCALE] Initialized: ${locale}');
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
