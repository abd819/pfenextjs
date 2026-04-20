"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ChangeEvent } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as "fr" | "ar";
    console.log(`[LOCALE] Switching from ${locale} to ${nextLocale}`);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <GlobeAltIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      <select
        value={locale}
        onChange={handleSwitch}
        className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
        aria-label="Change language"
      >
        <option value="fr">Français 🇫🇷</option>
        <option value="ar">العربية 🇸🇦</option>
      </select>
    </div>
  );
}
