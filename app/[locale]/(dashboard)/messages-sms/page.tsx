"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { getSmsLogs } from "@/lib/api";
import { MessageSMS } from "@/lib/mock-data";

export default function SmsLogsPage() {
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<MessageSMS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSmsLogs().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: MessageSMS) => <span className="font-medium text-slate-900">{row.id}</span>
    },
    {
      key: "phone",
      header: "Numéro de Téléphone",
      cell: (row: MessageSMS) => row.phoneNumber
    },
    {
      key: "content",
      header: "Contenu du Message",
      cell: (row: MessageSMS) => <span className="text-slate-600 truncate max-w-md block">{row.content}</span>
    },
    {
      key: "status",
      header: "Statut",
      cell: (row: MessageSMS) => {
        const variantMap: Record<string, "success" | "warning" | "error" | "default"> = {
           delivered: "success",
           sent: "warning",
           failed: "error"
        };
        return <Badge variant={variantMap[row.status] || "default"}>{row.status}</Badge>;
      }
    },
    {
      key: "sentAt",
      header: "Envoyé le",
      cell: (row: MessageSMS) => new Date(row.sentAt).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("smsLogs", { fallback: "Journaux SMS" })}</h1>
        <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
          Exporter CSV
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
