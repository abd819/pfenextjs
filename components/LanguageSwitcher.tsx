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
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
      <GlobeAltIcon className="w-5 h-5 text-slate-500" />
      <select
        value={locale}
        onChange={handleSwitch}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
      >
        <option value="fr">Français 🇫🇷</option>
        <option value="ar">العربية 🇸🇦</option>
      </select>
    </div>
  );
}
