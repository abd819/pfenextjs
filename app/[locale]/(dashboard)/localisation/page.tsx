"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getLocations } from "@/lib/api";
import { Localisation } from "@/lib/mock-data";
import { MapPinIcon } from "@heroicons/react/24/solid";

export default function LocalisationPage() {
  const tSidebar = useTranslations("Sidebar");
  const [data, setData] = useState<Localisation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocations().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">{tSidebar("map", { fallback: "Localisation" })}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
          Rafraîchir les positions
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        {loading ? (
           <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
             <span className="text-slate-400 font-medium">Chargement de la carte...</span>
           </div>
        ) : (
           <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
             {/* Mock Map Background Layer */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')]"></div>
             
             {/* Map Pins overlay mapping relative to generic bounding box for 🇸🇦 KSA mock map */}
             <div className="relative w-full h-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-slate-800 bg-slate-800/50 backdrop-blur-sm m-6 flex flex-col">
                <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center text-white bg-slate-900/80">
                   <h3 className="font-semibold">Localisations en Direct</h3>
                   <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">{data.length} Actifs</span>
                </div>
                <div className="flex-1 relative p-8">
                  <div className="absolute inset-0 border border-slate-700 m-8 rounded bg-slate-900/50">
                     {/* Faking random coordinates for UI visual demonstration */}
                     <div className="absolute top-[20%] left-[30%] group">
                        <MapPinIcon className="w-8 h-8 text-rose-500 hover:text-rose-400 hover:-translate-y-1 transition duration-300 transform -translate-x-1/2 -translate-y-full cursor-pointer" />
                        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                           {data[0]?.city} ({data[0]?.latitude}, {data[0]?.longitude}) - En Panne
                        </div>
                     </div>
                     <div className="absolute top-[50%] left-[60%] group">
                        <MapPinIcon className="w-8 h-8 text-blue-500 hover:text-blue-400 hover:-translate-y-1 transition duration-300 transform -translate-x-1/2 -translate-y-full cursor-pointer" />
                        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                           {data[1]?.city} ({data[1]?.latitude}, {data[1]?.longitude}) - Remorquage
                        </div>
                     </div>
                     <div className="absolute top-[80%] left-[80%] group">
                        <MapPinIcon className="w-8 h-8 text-emerald-500 hover:text-emerald-400 hover:-translate-y-1 transition duration-300 transform -translate-x-1/2 -translate-y-full cursor-pointer" />
                        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                           {data[2]?.city} - Libre
                        </div>
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 flex flex-col gap-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Demande (D1)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Intervention (P1)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Libre (P3)</div>
                  </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
