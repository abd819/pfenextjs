"use client";

import { Link } from "@/i18n/routing";

export default function ConducteursPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Conducteurs (Livreurs)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez le personnel assigné à vos véhicules et interventions.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/users/conducteurs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition flex items-center justify-center"
          >
            Add Driver
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Driver management is not yet implemented in the backend API
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Users are managed through the registration and authentication system
        </p>
      </div>
    </div>
  );
}
