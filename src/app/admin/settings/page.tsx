"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  MessageCircle,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

type Setting = { key: string; value: unknown };

const FIELDS = [
  {
    key: "public.whatsapp_number",
    label: "Numéro WhatsApp (chiffres uniquement, avec indicatif)",
    placeholder: "21612345678",
    icon: <MessageCircle size={16} />,
  },
  {
    key: "public.company_name",
    label: "Nom de la société",
    placeholder: "MIS Metal Construction",
    icon: <Building2 size={16} />,
  },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Change-password state
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

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
      const items = FIELDS.map((f) => ({
        key: f.key,
        value: values[f.key] ?? "",
      }));
      await api.put("/api/settings", { items });
      toast.success("Paramètres enregistrés");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwNew.length < 6) {
      toast.error("Le nouveau mot de passe doit faire au moins 6 caractères");
      return;
    }
    if (pwNew !== pwConfirm) {
      toast.error("La confirmation ne correspond pas");
      return;
    }
    setSavingPw(true);
    try {
      await api.post(
        "/api/auth/change-password",
        { currentPassword: pwOld, newPassword: pwNew },
        true
      );
      toast.success("Mot de passe mis à jour");
      setPwOld("");
      setPwNew("");
      setPwConfirm("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingPw(false);
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
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl xl:max-w-6xl space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-secondary mb-1">Paramètres</h1>
        <p className="text-sm text-gray-500">
          Configurez le numéro WhatsApp affiché sur le site et le nom de la société.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:items-start">
        {/* ----------------------- Site settings ----------------------- */}
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Informations du site
          </h2>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 flex-wrap leading-snug text-sm font-medium text-gray-700 mb-1">
                {f.icon} {f.label}
              </label>
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          ))}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-lg hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer
            </button>
          </div>
        </form>

        {/* ----------------------- Change password ----------------------- */}
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4"
        >
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-secondary" />
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Changer le mot de passe
          </h2>
        </div>

        <PwField
          label="Mot de passe actuel"
          value={pwOld}
          onChange={setPwOld}
          show={showOld}
          onToggle={() => setShowOld((s) => !s)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <PwField
          label="Nouveau mot de passe"
          value={pwNew}
          onChange={setPwNew}
          show={showNew}
          onToggle={() => setShowNew((s) => !s)}
          placeholder="min. 6 caractères"
          autoComplete="new-password"
        />
        <PwField
          label="Confirmer le nouveau mot de passe"
          value={pwConfirm}
          onChange={setPwConfirm}
          show={showConfirm}
          onToggle={() => setShowConfirm((s) => !s)}
          placeholder="ressaisir"
          autoComplete="new-password"
        />

        {pwConfirm && pwNew && pwConfirm !== pwNew && (
          <p className="text-xs text-red-600">Les deux mots de passe ne correspondent pas.</p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={savingPw || !pwOld || !pwNew || !pwConfirm}
            className="w-full sm:w-auto bg-secondary text-white px-5 py-2.5 rounded-lg hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {savingPw ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
            Mettre à jour
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

/** Reusable password input with an eye toggle. */
function PwField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Masquer" : "Afficher"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
