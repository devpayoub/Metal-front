"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Category } from "@/lib/api-client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const columns: Column<Category>[] = [
  { key: "name", label: "Nom" },
  {
    key: "slug",
    label: "Slug",
    render: (r) => <code className="text-xs text-gray-500">/{r.slug}</code>,
  },
  {
    key: "description",
    label: "Description",
    render: (r) => (
      <span className="line-clamp-1 text-gray-600">{r.description || "—"}</span>
    ),
  },
];

const fields: Field[] = [
  {
    name: "name",
    label: "Nom",
    required: true,
    placeholder: "Ex: Structures Industrielles",
    onChange: (value, current) =>
      // Auto-fill slug only if the user hasn't manually edited it.
      current.__slugTouched
        ? {}
        : { slug: slugify(value) },
  },
  {
    name: "slug",
    label: "Slug",
    placeholder: "auto-généré si vide",
    onChange: (value) => ({ __slugTouched: !!value }),
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Description courte (optionnel)",
  },
  { name: "__slugTouched", label: "", type: "text", hidden: true },
];

export default function AdminCategoriesPage() {
  return (
    <CrudTable<Category>
      title="Catégories"
      resource="categories"
      listPath="/api/categories/all"
      listKey="items"
      itemKey="category"
      columns={columns}
      fields={fields}
    />
  );
}
