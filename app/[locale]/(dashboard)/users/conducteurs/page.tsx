"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { getConducteurs } from "@/lib/api";
import { Conducteur } from "@/lib/mock-data";

export default function ConducteursPage() {
  const t = useTranslations("Table");
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<Conducteur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConducteurs().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: "id",
      header: t("id"),
      cell: (row: Conducteur) => <span className="font-medium text-slate-900">{row.id}</span>
    },
    {
      key: "name",
      header: "Nom",
      cell: (row: Conducteur) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.name}</span>
          <span className="text-xs text-slate-500">{row.email}</span>
        </div>
      )
    },
    {
      key: "phone",
      header: "Téléphone",
      cell: (row: Conducteur) => row.phone
    },
    {
      key: "license",
      header: "Permis",
      cell: (row: Conducteur) => row.licenseNumber
    },
    {
      key: "status",
      header: t("status"),
      cell: (row: Conducteur) => (
        <Badge variant={row.status === 'active' ? 'success' : 'error'}>{row.status}</Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("drivers", { fallback: "Conducteurs" })}</h1>
      </div>

      {loading ? (
        <div className="animate-pulse bg-slate-200 h-64 rounded-xl w-full"></div>
      ) : (
        <Table data={data} columns={columns} keyExtractor={(row) => row.id} />
      )}
    </div>
  );
}
