"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { Link } from "@/i18n/routing";
import { listRequests, type ServiceRequestList } from "@/lib/api";

type BadgeVariant = "warning" | "info" | "success" | "error" | "default";

function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "pending":             return "warning";
    case "accepted":            return "info";
    case "provider_on_the_way": return "info";
    case "arrived":             return "info";
    case "completed":           return "success";
    case "cancelled":           return "error";
    default:                    return "default";
  }
}

export default function DemandesPage() {
  const t = useTranslations("Table");
  const router = useRouter();

  const [requests, setRequests] = useState<ServiceRequestList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login on session-expired events from the client
    const handleUnauthorized = () => router.push("/login");
    window.addEventListener("najda:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("najda:unauthorized", handleUnauthorized);
  }, [router]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const result = await listRequests();

      if (result.ok) {
        setRequests(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    }

    load();
  }, []);

  const columns = [
    {
      key: "id",
      header: t("id"),
      cell: (row: ServiceRequestList) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          #{row.id}
        </span>
      ),
    },
    {
      key: "service_type",
      header: t("typePanne"),
      cell: (row: ServiceRequestList) => row.service_type,
    },
    {
      key: "status",
      header: t("status"),
      cell: (row: ServiceRequestList) => (
        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "dispatch_state",
      header: "Dispatch",
      cell: (row: ServiceRequestList) => (
        <Badge variant="default">{row.dispatch_state}</Badge>
      ),
    },
    {
      key: "driver",
      header: t("conducteur"),
      cell: (row: ServiceRequestList) => (
        <div className="flex flex-col">
          <span className="font-medium dark:text-slate-200">
            {row.customer_first_name} {row.customer_last_name}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {row.customer_phone}
          </span>
        </div>
      ),
    },
    {
      key: "provider",
      header: t("prestataire"),
      cell: (row: ServiceRequestList) =>
        row.provider_first_name ? (
          <span className="text-slate-700 dark:text-slate-300">
            {row.provider_first_name} {row.provider_last_name}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 italic">
            Non assigné
          </span>
        ),
    },
    {
      key: "vehicle_name",
      header: "Véhicule",
      cell: (row: ServiceRequestList) => (
        <span className="text-slate-600 dark:text-slate-400">
          {row.vehicle_name || "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: t("dateCreation"),
      cell: (row: ServiceRequestList) =>
        new Date(row.created_at).toLocaleString("fr-DZ", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Demandes d&apos;Assistance
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setLoading(true);
              listRequests().then((r: Awaited<ReturnType<typeof listRequests>>) => {
                if (r.ok) setRequests(r.data);
                else setError(r.error);
                setLoading(false);
              });
            }}
            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            ↺ Actualiser
          </button>
          <Link
            href="/demandes/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition flex items-center justify-center"
          >
            {t("newRequest")}
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Data table */}
      {!loading && !error && (
        <Table
          data={requests}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      )}

      {/* Empty state */}
      {!loading && !error && requests.length === 0 && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          Aucune demande d&apos;assistance trouvée.
        </div>
      )}
    </div>
  );
}
