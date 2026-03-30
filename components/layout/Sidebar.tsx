"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  HomeIcon,
  QueueListIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  Cog6ToothIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export default function Sidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = useLocale();

  const navItems = [
    { name: t("dashboard"), href: `/${locale}`, icon: HomeIcon, exact: true },
    { name: t("requests"), href: `/${locale}/demandes`, icon: QueueListIcon },
    { name: t("drivers"), href: `/${locale}/users/conducteurs`, icon: TruckIcon },
    { name: t("providers"), href: `/${locale}/users/prestataires`, icon: WrenchScrewdriverIcon },
    { name: t("map"), href: `/${locale}/localisation`, icon: MapIcon },
    { name: t("smsLogs"), href: `/${locale}/messages-sms`, icon: ChatBubbleLeftRightIcon },
    { name: t("evaluations"), href: `/${locale}/evaluations`, icon: StarIcon },
  ];

  const checkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-[260px] bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">Najda</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : checkActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href={`/${locale}/settings`} className="group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
          <Cog6ToothIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          {t("settings")}
        </Link>
        <div className="mt-4 px-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
             <img src="https://ui-avatars.com/api/?name=Ahmed+Mansour&background=1E293B&color=fff" alt="User Avatar" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">Ahmed Mansour</span>
            <span className="text-xs text-slate-500 truncate">Admin Najda</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
