"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { getEvaluations } from "@/lib/api";
import { StarIcon } from "@heroicons/react/24/solid";

export default function EvaluationsPage() {
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluations().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: any) => <span className="font-medium text-slate-900">{row.id}</span>
    },
    {
      key: "demande",
      header: "Demande Associée",
      cell: (row: any) => (
        <Badge variant="info">{row.demande?.id}</Badge>
      )
    },
    {
      key: "rating",
      header: "Note",
      cell: (row: any) => (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon 
              key={star} 
              className={`w-4 h-4 ${star <= row.rating ? "text-amber-500" : "text-slate-200"}`} 
            />
          ))}
        </div>
      )
    },
    {
      key: "comment",
      header: "Commentaire",
      cell: (row: any) => <span className="text-slate-600 block max-w-md">{row.comment || <span className="text-slate-400 italic">Aucun commentaire</span>}</span>
    },
    {
      key: "date",
      header: "Date",
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("evaluations", { fallback: "Évaluations" })}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
          Générer Rapport
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
