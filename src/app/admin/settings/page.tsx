"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, MessageCircle, Truck, Building2, DollarSign, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

type Setting = { key: string; value: unknown };

const FIELDS = [
  {
    key: "public.whatsapp_number",
    label: "Numéro WhatsApp (chiffres uniquement, avec indicatif)",
    placeholder: "21612345678",
    icon: <MessageCircle size={16} />,
    type: "text" as const,
  },
  {
    key: "public.delivery_fee",
    label: "Frais de livraison",
    placeholder: "15",
    icon: <Truck size={16} />,
    type: "number" as const,
  },
  {
    key: "public.currency",
    label: "Devise",
    placeholder: "DT",
    icon: <DollarSign size={16} />,
    type: "text" as const,
  },
  {
    key: "public.company_name",
    label: "Nom de la société",
    placeholder: "MIS Metal Construction",
    icon: <Building2 size={16} />,
    type: "text" as const,
  },
  {
    key: "public.thanks_title",
    label: "Lettre de remerciement — Titre",
    placeholder: "Lettre de Remerciement",
    icon: <Mail size={16} />,
    type: "text" as const,
  },
  {
    key: "public.thanks_subtitle",
    label: "Lettre de remerciement — Sous-titre",
    placeholder: "Un mot de nos clients partenaires.",
    icon: <Mail size={16} />,
    type: "text" as const,
  },
  {
    key: "public.thanks_body",
    label: "Lettre de remerciement — Corps (utilisez \\n pour les sauts de ligne)",
    placeholder: "Chère équipe de MIS Metal Construction...",
    icon: <Mail size={16} />,
    type: "textarea" as const,
  },
  {
    key: "public.thanks_author",
    label: "Lettre de remerciement — Signature",
    placeholder: "Direction Technique — SFBT",
    icon: <Mail size={16} />,
    type: "text" as const,
  },
  {
    key: "public.thanks_image",
    label: "Lettre de remerciement — URL de l'image",
    placeholder: "https://...",
    icon: <Mail size={16} />,
    type: "text" as const,
  },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ items: Setting[] }>("/api/settings", true);
        const map: Record<string, string> = {};
        for (const row of data.items) {
          map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
        }
        setValues(map);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items = FIELDS.map((f) => {
        const raw = values[f.key] ?? "";
        const value: unknown = f.type === "number" ? Number(raw) || 0 : raw;
        return { key: f.key, value };
      });
      await api.put("/api/settings", { items });
      toast.success("Paramètres enregistrés");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-secondary mb-1">Paramètres</h1>
      <p className="text-sm text-gray-500 mb-6">
        Configurez le passage en caisse et la lettre de remerciement affichée sur la page d'accueil.
      </p>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              {f.icon} {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y"
              />
            ) : (
              <input
                type={f.type}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          </div>
        ))}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:brightness-110 flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
