"use client";

import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { getPopulatedDemandes } from "@/lib/mock-data";
import { DevicePhoneMobileIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export default function DemandesPage() {
  const t = useTranslations("Table");
  const requests = getPopulatedDemandes();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "accepted": return "info";
      case "completed": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const columns = [
    {
      key: "id",
      header: t("id"),
      cell: (row: any) => <span className="font-medium text-slate-900">{row.id}</span>
    },
    {
      key: "type",
      header: t("typePanne"),
      cell: (row: any) => row.typePanne
    },
    {
      key: "status",
      header: t("status"),
      cell: (row: any) => (
        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
      )
    },
    {
      key: "driver",
      header: t("conducteur"),
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.conducteur?.name}</span>
          <span className="text-xs text-slate-500">{row.conducteur?.phone}</span>
        </div>
      )
    },
    {
      key: "provider",
      header: t("prestataire"),
      cell: (row: any) => row.prestataire ? (
        <span className="text-slate-700">{row.prestataire.name}</span>
      ) : (
        <span className="text-slate-400 italic">Non assigné</span>
      )
    },
    {
      key: "channel",
      header: t("channel"),
      cell: (row: any) => (
        <div className="flex items-center gap-2">
           {row.channel === "App" ? <DevicePhoneMobileIcon className="w-5 h-5 text-blue-500" /> : <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-emerald-500" />}
           <span>{row.channel}</span>
        </div>
      )
    },
    {
      key: "date",
      header: t("dateCreation"),
      cell: (row: any) => new Date(row.dateCreation).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Demandes d'Assistance</h1>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
              Filtrer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
              Nouvelle Demande
            </button>
        </div>
      </div>

      <Table
        data={requests}
        columns={columns}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}
