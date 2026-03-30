"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { TruckIcon, WrenchScrewdriverIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function UsersOverviewPage() {
  const tSidebar = useTranslations("Sidebar");
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("users", { fallback: "Utilisateurs" })}</h1>
      </div>

      <p className="text-slate-500">
        Gérez tous les acteurs de la plateforme Najda. Sélectionnez une catégorie ci-dessous.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Conducteurs Card */}
        <Link href={`/${locale}/users/conducteurs`} className="block group">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:border-blue-400 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <TruckIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{tSidebar("drivers", { fallback: "Conducteurs" })}</h2>
              <p className="text-slate-500 text-sm flex-1 mb-6">
                 Consultez et gérez la base de données des clients et conducteurs inscrits. Validez les permis et gérez les comptes.
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                 Voir les conducteurs <ArrowRightIcon className="w-4 h-4 ml-2" />
              </div>
           </div>
        </Link>

        {/* Prestataires Card */}
        <Link href={`/${locale}/users/prestataires`} className="block group">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:border-blue-400 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                 <WrenchScrewdriverIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{tSidebar("providers", { fallback: "Prestataires" })}</h2>
              <p className="text-slate-500 text-sm flex-1 mb-6">
                 Gérez le réseau d'intervenants, dépanneurs et garagistes partenaires. Suivez leurs notations et zones d'intervention.
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                 Voir les prestataires <ArrowRightIcon className="w-4 h-4 ml-2" />
              </div>
           </div>
        </Link>
      </div>
    </div>
  );
}
