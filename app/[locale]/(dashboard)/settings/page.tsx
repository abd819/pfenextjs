"use client";

import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const tSidebar = useTranslations("Sidebar");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("settings", { fallback: "Paramètres" })}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Profil Administrateur</h2>
          <p className="text-sm text-slate-500 mb-4">Gérez vos informations de compte et vos préférences.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nom Complet</label>
                <input type="text" defaultValue="Ahmed Mansour" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Email Administratif</label>
                <input type="email" defaultValue="admin@najda.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
             </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Préférences Système</h2>
          <div className="space-y-4 mt-4">
             <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Notifications SMS (Fallback)</h3>
                  <p className="text-xs text-slate-500">Activer le routage automatique par SMS si l'application est hors ligne.</p>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 flex justify-end gap-3">
           <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
              Annuler
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
              Sauvegarder
           </button>
        </div>
      </div>
    </div>
  );
}
