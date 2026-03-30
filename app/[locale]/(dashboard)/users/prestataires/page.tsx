"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { getPrestataires } from "@/lib/api";
import { Prestataire } from "@/lib/mock-data";
import { StarIcon } from "@heroicons/react/24/solid";

export default function PrestatairesPage() {
  const t = useTranslations("Table");
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrestataires().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: "id",
      header: t("id"),
      cell: (row: Prestataire) => <span className="font-medium text-slate-900">{row.id}</span>
    },
    {
      key: "name",
      header: "Prestataire",
      cell: (row: Prestataire) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.name}</span>
          <span className="text-xs text-slate-500">{row.phone}</span>
        </div>
      )
    },
    {
      key: "zone",
      header: "Zone de Service",
      cell: (row: Prestataire) => row.serviceZone
    },
    {
      key: "rating",
      header: "Évaluation",
      cell: (row: Prestataire) => (
        <div className="flex items-center gap-1 text-amber-500">
           <StarIcon className="w-4 h-4" />
           <span className="font-medium text-slate-700">{row.rating}</span>
        </div>
      )
    },
    {
      key: "availability",
      header: "Disponibilité",
      cell: (row: Prestataire) => (
        <Badge variant={row.availability ? 'success' : 'default'}>
          {row.availability ? 'Disponible' : 'Occupé'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("providers", { fallback: "Prestataires" })}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
          Nouveau Prestataire
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse bg-slate-200 h-64 rounded-xl w-full"></div>
      ) : (
        <Table data={data} columns={columns} keyExtractor={(row) => row.id} />
      )}
    </div>
  );
}
