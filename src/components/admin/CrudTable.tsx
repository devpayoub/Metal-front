"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { ImageDrop } from "@/components/ImageDrop";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "email" | "select" | "boolean" | "image";
  options?: string[];
  loadOptions?: () => Promise<string[]>;
  uploadEndpoint?: string; // for type === "image"
  required?: boolean;
  group?: string;
  hidden?: boolean; // value carried in form state but not rendered
  placeholder?: string;
  /** Called when a `select` field's value changes. Return extra field
   *  values to merge into the form (for cross-field auto-fill). */
  onSelect?: (
    value: string,
    current: Record<string, unknown>
  ) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
  /** Called when any text/number input changes. Return field values to merge
   *  (e.g. auto-fill a slug from the name). */
  onChange?: (
    value: string,
    current: Record<string, unknown>
  ) => Record<string, unknown> | void;
};

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
};

type Props<T extends { id: string }> = {
  title: string;
  resource: string; // e.g. "products"
  /** Override the list endpoint — defaults to `/api/${resource}`. */
  listPath?: string;
  listKey: "items";
  itemKey: string; // e.g. "product"
  columns: Column<T>[];
  fields: Field[];
  initialValues?: Partial<T>;
};

export function CrudTable<T extends { id: string }>({
  title,
  resource,
  listPath,
  listKey,
  itemKey,
  columns,
  fields,
  initialValues = {},
}: Props<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const path = listPath || `/api/${resource}`;
      const data = await api.get<Record<string, T[]>>(path, true);
      setRows(data[listKey] || []);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, listPath]);

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      const payload = coerce(values, fields);
      if (editing) {
        const data = await api.put<Record<string, T>>(`/api/${resource}/${editing.id}`, payload);
        setRows((r) => r.map((row) => (row.id === editing.id ? data[itemKey] : row)));
        toast.success("Mis à jour");
      } else {
        const data = await api.post<Record<string, T>>(`/api/${resource}`, payload, true);
        setRows((r) => [data[itemKey], ...r]);
        toast.success("Créé");
      }
      setEditing(null);
      setCreating(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet élément ?")) return;
    try {
      await api.delete(`/api/${resource}/${id}`);
      setRows((r) => r.filter((row) => row.id !== id));
      toast.success("Supprimé");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{rows.length} élément(s)</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:brightness-110"
        >
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun élément — cliquez sur <b>Nouveau</b> pour en ajouter un.</div>
        ) : (
          <>
            {/* Desktop table (lg+) */}
            <table className="hidden lg:table w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  {columns.map((c) => (
                    <th key={String(c.key)} className="text-left px-4 py-3 font-medium" style={{ width: c.width }}>
                    {c.label}
                  </th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 text-gray-800">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                    </td>
                  ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                      onClick={() => setEditing(row)}
                      className="text-gray-500 hover:text-primary mr-2"
                      title="Modifier"
                    >
                        <Pencil size={16} />
                      </button>
                      <button
                      onClick={() => handleDelete(row.id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Supprimer"
                    >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards (< lg) */}
            <div className="lg:hidden divide-y divide-gray-100">
              {rows.map((row) => {
                const primaryCol =
                  columns.find((c) => !c.width) ?? columns[0];
                const restCols = columns.filter(
                  (c) => String(c.key) !== String(primaryCol.key)
                );
                const primaryValue = primaryCol.render
                  ? primaryCol.render(row)
                  : String((row as Record<string, unknown>)[primaryCol.key as string] ?? "—");
                return (
                  <div key={row.id} className="p-4 bg-white space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-secondary line-clamp-2 min-w-0">
                        {primaryValue}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditing(row)}
                          className="text-gray-400 hover:text-primary p-1"
                          aria-label="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {restCols.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {restCols.map((c) => (
                          <span key={String(c.key)} className="min-w-0">
                            <span className="text-gray-400">{c.label}:</span>{" "}
                            <span className="text-gray-600">
                              {c.render
                                ? c.render(row)
                                : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {(editing || creating) && (
        <FormModal
          title={editing ? "Modifier" : "Créer"}
          fields={fields}
          initial={editing ? (editing as unknown as Record<string, unknown>) : initialValues}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function FormModal({
  title,
  fields,
  initial,
  onClose,
  onSave,
  saving,
}: {
  title: string;
  fields: Field[];
  initial: Record<string, unknown>;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({ ...initial });
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));
  const [dynOptions, setDynOptions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fields.forEach((f) => {
      if (f.type === "select" && f.loadOptions && !dynOptions[f.name]) {
        f.loadOptions()
          .then((opts) => setDynOptions((d) => ({ ...d, [f.name]: opts })))
          .catch(() => setDynOptions((d) => ({ ...d, [f.name]: [] })));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasGroups = fields.some((f) => f.group);
  const groups: { name: string | null; items: Field[] }[] = [];
  if (hasGroups) {
    const order: string[] = [];
    const map = new Map<string | null, Field[]>();
    for (const f of fields) {
      const k = f.group ?? null;
      if (!map.has(k)) {
        map.set(k, []);
        order.push(k ?? "__none__");
      }
      map.get(k)!.push(f);
    }
    for (const k of order) {
      const key = k === "__none__" ? null : k;
      groups.push({ name: key, items: map.get(key)! });
    }
  } else {
    groups.push({ name: null, items: fields });
  }

  const renderField = (f: Field) => (
    <div key={f.name} className={f.type === "textarea" || f.type === "image" ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {f.label}
        {f.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {f.type === "textarea" ? (
        <textarea
          value={(values[f.name] as string) || ""}
          onChange={(e) => set(f.name, e.target.value)}
          rows={3}
          required={f.required}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      ) : f.type === "select" ? (
        <select
          value={(values[f.name] as string) || ""}
          onChange={async (e) => {
            const v = e.target.value;
            setValues((s) => ({ ...s, [f.name]: v }));
            if (f.onSelect) {
              try {
                const patch = await f.onSelect(v, values);
                if (patch) setValues((s) => ({ ...s, [f.name]: v, ...patch }));
              } catch {
                // ignore — auto-fill is best-effort
              }
            }
          }}
          required={f.required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">—</option>
          {(f.options ?? dynOptions[f.name] ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : f.type === "image" ? (
        <ImageDrop
          value={(values[f.name] as string) || ""}
          onChange={(url) => set(f.name, url || "")}
          endpoint={f.uploadEndpoint || "/api/products/upload"}
        />
      ) : f.type === "boolean" ? (
        <label className="inline-flex items-center gap-2 text-sm py-2">
          <input
            type="checkbox"
            checked={!!values[f.name]}
            onChange={(e) => set(f.name, e.target.checked)}
          />
          Activé
        </label>
      ) : (
        <input
          type={f.type === "number" ? "number" : f.type || "text"}
          step={f.type === "number" ? "any" : undefined}
          value={(values[f.name] as string | number | undefined) ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setValues((s) => {
              const next = { ...s, [f.name]: v };
              if (f.onChange) {
                const patch = f.onChange(v, s);
                if (patch) Object.assign(next, patch);
              }
              return next;
            });
          }}
          required={f.required}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-secondary">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(values);
          }}
          className="p-4 sm:p-6 space-y-6"
        >
          {groups.map((g, gi) => {
            const visible = g.items.filter((f) => !f.hidden);
            if (visible.length === 0) return null;
            return (
              <fieldset key={g.name ?? `__${gi}`} className={g.name ? "border border-gray-200 rounded-lg p-4" : ""}>
                {g.name && (
                  <legend className="px-2 text-sm font-semibold text-secondary">
                    {g.name}
                  </legend>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visible.map(renderField)}
                </div>
              </fieldset>
            );
          })}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-lg hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function coerce(values: Record<string, unknown>, fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    // Skip client-only/private fields (prefixed with __).
    if (f.name.startsWith("__")) continue;
    const v = values[f.name];
    if (v === "" || v === undefined || v === null) continue;
    if (f.type === "number") {
      const n = Number(v);
      if (!Number.isNaN(n)) out[f.name] = n;
    } else if (f.type === "boolean") {
      out[f.name] = !!v;
    } else {
      out[f.name] = v;
    }
  }
  return out;
}
