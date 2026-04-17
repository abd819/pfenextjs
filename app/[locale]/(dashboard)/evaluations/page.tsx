"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { listReviews, type Review } from "@/lib/api";
import { StarIcon } from "@heroicons/react/24/solid";

export default function EvaluationsPage() {
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      const result = await listReviews();
      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadReviews();
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
        <h3 className="font-bold">Error Loading Reviews</h3>
        <p>{error}</p>
      </div>
    );
  }

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: Review) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {row.id}
        </span>
      ),
    },
    {
      key: "request",
      header: "Demande Associée",
      cell: (row: Review) => <Badge variant="info">{row.request}</Badge>,
    },
    {
      key: "rating",
      header: "Note",
      cell: (row: Review) => (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-4 h-4 ${star <= row.rating ? "text-amber-500" : "text-slate-200"}`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "comment",
      header: "Commentaire",
      cell: (row: Review) => (
        <span className="text-slate-600 block max-w-md">
          {row.comment || (
            <span className="text-slate-400 italic">Aucun commentaire</span>
          )}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      cell: (row: Review) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          {tSidebar("evaluations", { fallback: "Évaluations" })}
        </h1>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No reviews yet</div>
      ) : (
        <Table data={data} columns={columns} keyExtractor={(row) => row.id} />
      )}
    </div>
  );
}
