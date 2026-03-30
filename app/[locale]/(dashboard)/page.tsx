"use client";

import { useTranslations } from "next-intl";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { UsersIcon, TruckIcon, DocumentTextIcon, StarIcon } from "@heroicons/react/24/outline";
import { getPopulatedDemandes, mockConducteurs, mockPrestataires } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const chartData = [
  { name: "Mon", requests: 12 },
  { name: "Tue", requests: 19 },
  { name: "Wed", requests: 15 },
  { name: "Thu", requests: 22 },
  { name: "Fri", requests: 28 },
  { name: "Sat", requests: 35 },
  { name: "Sun", requests: 30 },
];

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const requests = getPopulatedDemandes();
  
  const totalUsers = mockConducteurs.length + mockPrestataires.length;
  const activeRequests = requests.filter(r => r.status === "pending" || r.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t("dashboard", { default: "Dashboard" })}</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
             {t("addDriver")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t("totalUsers")} value={totalUsers + 12842} icon={UsersIcon} highlightColor="blue" trend={12} />
        <StatCard title={t("totalDrivers")} value={mockConducteurs.length + 842} icon={TruckIcon} highlightColor="amber" trend={3} />
        <StatCard title={t("activeRequests")} value={activeRequests + 47} icon={DocumentTextIcon} highlightColor="red" trend={-2} />
        <StatCard title={t("averageRating")} value={"4.82"} icon={StarIcon} highlightColor="green" trend={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Demandes par Jour</h2>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="requests" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-[400px]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t("recentRequests")}</h2>
             <button className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">Voir tout</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {requests.map((req) => (
                <div key={req.id} className="flex flex-col gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition">
                  <div className="flex justify-between items-start">
                     <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{req.typePanne}</span>
                     <Badge variant={req.status === 'pending' ? 'warning' : req.status === 'completed' ? 'success' : 'info'}>{req.status}</Badge>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{req.location?.city} • {req.conducteur?.name}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
