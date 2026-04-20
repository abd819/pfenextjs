"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    // Log current locale
    console.log(`[UI] Current locale: ${locale}`);

    // Log current theme
    const currentTheme = localStorage.getItem("theme") || "system";
    setTheme(currentTheme);
    console.log(`[UI] Current theme: ${currentTheme}`);
    console.log(
      `[UI] Dark mode active: ${document.documentElement.classList.contains("dark")}`,
    );
  }, [locale]);

  return (
    <header className="h-[72px] flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSwitcher />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>

        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 translate-x-1/2 -translate-y-1/2"></span>
        </button>
      </div>
    </header>
  );
}
