"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

// Resusable toggle switch
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={clsx(
        "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out flex-shrink-0",
        checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
      )}
    >
      <div 
        className={clsx(
           "w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ease-in-out",
           checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0.5 rtl:-translate-x-0.5"
        )} 
      />
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("Settings");

  // A. Notifications state
  const [smsFallback, setSmsFallback] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  // B. System Configuration state
  const [autoAssign, setAutoAssign] = useState(false);
  const [defaultPriority, setDefaultPriority] = useState("high");

  // C. Providers Settings
  const [minRating, setMinRating] = useState("4.0");
  const [maxRadius, setMaxRadius] = useState("15");

  // D. Security
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // E. Localization
  const [language, setLanguage] = useState("ar");

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("pageTitle")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("pageDescription")}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 transition-colors duration-300">
        
        {/* A. Notifications */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("notifications.title")}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("notifications.appNotifications")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("notifications.appNotificationsDesc")}</p>
              </div>
              <ToggleSwitch checked={appNotifications} onChange={setAppNotifications} />
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("notifications.smsFallback")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("notifications.smsFallbackDesc")}</p>
              </div>
              <ToggleSwitch checked={smsFallback} onChange={setSmsFallback} />
            </div>
          </div>
        </div>

        {/* B. System Configuration */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("systemConfig.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("systemConfig.defaultPriority")}</label>
              <select 
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg h-[74px]">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("systemConfig.autoAssign")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("systemConfig.autoAssignDesc")}</p>
              </div>
              <ToggleSwitch checked={autoAssign} onChange={setAutoAssign} />
            </div>
          </div>
        </div>

        {/* C. Providers Settings */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("providers.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("providers.minRating")}</label>
              <input 
                type="number" 
                step="0.1" 
                min="1.0" 
                max="5.0"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
               />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("providers.maxRadius")}</label>
              <input 
                type="number" 
                min="1"
                value={maxRadius}
                onChange={(e) => setMaxRadius(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
               />
            </div>
          </div>
        </div>

        {/* D. Security & E. Localization */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("security.title")}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("security.sessionTimeout")}</label>
                <input 
                  type="number" 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                />
              </div>
              <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                {t("security.changePassword")}
              </button>
            </div>
          </div>

          <div>
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("localization.title")}</h2>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("localization.language")}</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                >
                  <option value="ar">{t("localization.arabic")}</option>
                  <option value="fr">{t("localization.french")}</option>
                </select>
             </div>
          </div>
        </div>

        {/* Save/Action Block */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl border-t border-slate-200 dark:border-slate-800">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              {t("cancel")}
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
              {t("save")}
           </button>
        </div>
      </div>
    </div>
  );
}
