"use client";

import { useTranslations } from "next-intl";

export default function LocalisationPage() {
  const tSidebar = useTranslations("Sidebar");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          {tSidebar("map", { fallback: "Localisation" })}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Real-time location tracking will be available with WebSocket
          integration
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Awaiting backend location streaming API implementation
        </p>
      </div>
    </div>
  );
}
