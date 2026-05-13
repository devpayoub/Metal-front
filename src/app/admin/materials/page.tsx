"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Material } from "@/lib/api-client";

const columns: Column<Material>[] = [
  { key: "position", label: "#", width: "60px" },
  {
    key: "image_url",
    label: "",
    width: "70px",
    render: (r) =>
      r.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.image_url} alt={r.title} className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded" />
      ),
  },
  { key: "title", label: "Titre" },
  {
    key: "description",
    label: "Description",
    render: (r) => (
      <span className="line-clamp-1 text-gray-600">{r.description || "—"}</span>
    ),
  },
  {
    key: "published",
    label: "Publié",
    render: (r) => (r.published ? "✓" : "—"),
  },
];

const fields: Field[] = [
  { name: "title", label: "Titre", required: true, placeholder: "Ex: Acier au Carbone" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description du matériau..." },
  { name: "position", label: "Position (ordre)", type: "number" },
  { name: "published", label: "Publié", type: "boolean" },
  { name: "image_url", label: "Image", type: "image", uploadEndpoint: "/api/materials/upload" },
];

export default function AdminMaterialsPage() {
  return (
    <CrudTable<Material>
      title="Matériaux"
      resource="materials"
      listPath="/api/materials/all"
      listKey="items"
      itemKey="material"
      columns={columns}
      fields={fields}
      initialValues={{ position: 0, published: true }}
    />
  );
}
