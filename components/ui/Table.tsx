import { ReactNode } from "react";
import { clsx } from "clsx";

interface Column<T> {
  key: string;
  header: string | ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function Table<T>({ data, columns, keyExtractor, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  "px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 text-sm">
                Aucune donnée disponible.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx(
                  "bg-white transition-colors",
                  onRowClick ? "cursor-pointer hover:bg-slate-50" : "hover:bg-slate-50/50"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx("px-6 py-4 whitespace-nowrap text-sm text-slate-700", col.className)}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {data.length > 0 && (
         <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
            <span>Affichage de 1 à {data.length} sur {data.length} résultats</span>
            <div className="flex gap-2">
               <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50">Précédent</button>
               <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50">Suivant</button>
            </div>
         </div>
      )}
    </div>
  );
}
