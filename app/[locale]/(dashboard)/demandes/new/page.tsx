"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createRequest, listVehicles, type Vehicle } from "@/lib/api";

export default function NewDemandePage() {
  const router = useRouter();
  const t = useTranslations("Table");

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Fields that map 1:1 to ServiceRequestCreate (schema)
  const [formData, setFormData] = useState({
    vehicle:      "",          // integer id (from vehicle list)
    service_type: "Crevaison", // string, max 100
    description:  "",          // string (optional)
    latitude:     "",          // decimal string, required
    longitude:    "",          // decimal string, required
    address:      "",          // string max 255 (optional)
  });

  // Load driver's vehicles to populate the selector
  useEffect(() => {
    listVehicles().then((result: Awaited<ReturnType<typeof listVehicles>>) => {
      if (result.ok) setVehicles(result.data);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.vehicle) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Les coordonnées GPS (latitude / longitude) sont obligatoires.");
      return;
    }

    setLoading(true);

    const result = await createRequest({
      vehicle:      Number(formData.vehicle),
      service_type: formData.service_type,
      description:  formData.description || undefined,
      latitude:     formData.latitude,
      longitude:    formData.longitude,
      address:      formData.address || undefined,
    });

    if (result.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/demandes"), 1200);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t("newRequest")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cette demande sera diffusée aux prestataires disponibles dans la zone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/demandes")}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800">
            ✓ Demande créée avec succès — redirection en cours…
          </div>
        )}

        {/* ── Section 1: Request info ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-widest">
            Informations de la demande
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle selector */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="vehicle"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Véhicule <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">— Sélectionner un véhicule —</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.display_name} ({v.registration_number})
                  </option>
                ))}
              </select>
              {vehicles.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Aucun véhicule chargé — vérifiez votre session.
                </p>
              )}
            </div>

            {/* Service type */}
            <div className="space-y-2">
              <label
                htmlFor="service_type"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                {t("typePanne")} <span className="text-red-500">*</span>
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="Crevaison">Crevaison (Pneu crevé)</option>
                <option value="Panne de batterie">Panne de batterie</option>
                <option value="Panne moteur">Panne moteur</option>
                <option value="Panne d'essence">Panne d&apos;essence</option>
                <option value="Accident">Accident de la route</option>
                <option value="Problème électronique">Problème électronique</option>
              </select>
            </div>

            {/* Status — readOnly, always pending on create */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Statut initial
              </label>
              <input
                type="text"
                readOnly
                value="pending (automatique)"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Description détaillée
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Ex: Pneu avant droit crevé sur l'autoroute. Véhicule immobilisé sur la bande d'arrêt d'urgence."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* ── Section 2: Location ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-widest">
            {t("location")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Adresse complète
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: Autoroute Est-Ouest, PK 122, Alger"
                maxLength={255}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <label
                htmlFor="latitude"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                id="latitude"
                type="number"
                step="0.000001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                placeholder="36.737232"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <label
                htmlFor="longitude"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                id="longitude"
                type="number"
                step="0.000001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                placeholder="3.086472"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || success}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-70 flex justify-center items-center min-w-[250px]"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Diffuser la demande"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
