"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { listProviderProfiles, type ProviderProfile } from "@/lib/api";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/routing";

export default function PrestatairesPage() {
  const t = useTranslations("Table");
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProviders() {
      const result = await listProviderProfiles();
      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadProviders();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center">
        <span className="animate-pulse">Loading...</span>
      </div>
    );

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="font-bold">Error Loading Providers</h3>
        <p>{error}</p>
      </div>
    );
  }

  const columns = [
    {
      key: "id",
      header: t("id"),
      cell: (row: ProviderProfile) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {row.id}
        </span>
      ),
    },
    {
      key: "name",
      header: "Prestataire",
      cell: (row: ProviderProfile) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">
            {row.provider_first_name} {row.provider_last_name}
          </span>
          <span className="text-xs text-slate-500">{row.provider_phone}</span>
        </div>
      ),
    },
    {
      key: "zone",
      header: "Zone de Service",
      cell: (row: ProviderProfile) => row.service_zone || "—",
    },
    {
      key: "rating",
      header: "Évaluation",
      cell: (row: ProviderProfile) => (
        <div className="flex items-center gap-1 text-amber-500">
          <StarIcon className="w-4 h-4" />
          <span className="font-medium text-slate-700">
            {row.average_rating}
          </span>
        </div>
      ),
    },
    {
      key: "availability",
      header: "Disponibilité",
      cell: (row: ProviderProfile) => (
        <Badge variant={row.is_available ? "success" : "default"}>
          {row.is_available ? "Disponible" : "Occupé"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Prestataires d'Assistance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Entreprises, dépanneuses, et flottes partenaires disponibles.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/users/prestataires/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition flex items-center justify-center"
          >
            {t("addProvider")}
          </Link>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No providers yet</div>
      ) : (
        <Table data={data} columns={columns} keyExtractor={(row) => row.id} />
      )}
    </div>
  );
}
