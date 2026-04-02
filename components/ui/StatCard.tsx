import { SVGProps } from "react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  trend?: number; // positive or negative percentage
  highlightColor?: string; // e.g., 'blue', 'red', 'green'
}

export default function StatCard({ title, value, icon: Icon, trend, highlightColor = "blue" }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const iconClasses = colorMap[highlightColor] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
        </div>
        <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center", iconClasses)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}
          >
            {trend > 0 ? "+" : ""}{trend}%
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">vs last week</span>
        </div>
      )}
    </div>
  );
}
