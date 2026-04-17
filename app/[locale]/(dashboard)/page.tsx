"use client";

import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  DocumentTextIcon,
  StarIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { listRequests, listReviews } from "@/lib/api";
import type { ServiceRequestList, Review } from "@/lib/api";

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const [requests, setRequests] = useState<ServiceRequestList[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [reqResult, revResult] = await Promise.all([
          listRequests(),
          listReviews(),
        ]);

        if (!reqResult.ok) {
          setError(reqResult.error);
          setLoading(false);
          return;
        }

        if (!revResult.ok) {
          setError(revResult.error);
          setLoading(false);
          return;
        }

        setRequests(reqResult.data);
        setReviews(revResult.data);
        setError("");
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="font-bold">Dashboard Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const activeRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "accepted",
  ).length;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("dashboard", { default: "Dashboard" })}
        </h1>
        <div className="flex gap-2">
          <Link
            href="/users/conducteurs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition flex items-center justify-center"
          >
            {t("addDriver")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title={t("totalRequests")}
          value={requests.length}
          icon={DocumentTextIcon}
          highlightColor="blue"
        />
        <StatCard
          title={t("activeRequests")}
          value={activeRequests}
          icon={TruckIcon}
          highlightColor="amber"
        />
        <StatCard
          title={t("averageRating")}
          value={averageRating}
          icon={StarIcon}
          highlightColor="green"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {t("recentRequests")}
          </h2>
          <Link
            href="/demandes"
            className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
          >
            View all
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recentRequests.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
              No requests yet
            </p>
          ) : (
            recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {req.service_type}
                  </span>
                  <Badge
                    variant={
                      req.status === "pending"
                        ? "warning"
                        : req.status === "completed"
                          ? "success"
                          : "info"
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {req.customer_first_name} {req.customer_last_name} •{" "}
                  {req.customer_phone}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
