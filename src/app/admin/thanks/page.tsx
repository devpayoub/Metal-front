"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { ThanksLetter } from "@/lib/api-client";

const columns: Column<ThanksLetter>[] = [
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
  { key: "subtitle", label: "Sous-titre", render: (r) => <span className="text-gray-500 line-clamp-1">{r.subtitle || "—"}</span> },
  { key: "author", label: "Signature", render: (r) => <span className="text-gray-500">{r.author || "—"}</span> },
  { key: "published", label: "Publié", render: (r) => (r.published ? "✓" : "—") },
];

const fields: Field[] = [
  { name: "title", label: "Titre", required: true, placeholder: "Ex: Lettre de Remerciement" },
  { name: "subtitle", label: "Sous-titre", placeholder: "Ex: Un mot de nos clients partenaires." },
  { name: "body", label: "Corps", type: "textarea", placeholder: "Chère équipe de MIS Metal Construction..." },
  { name: "author", label: "Signature", placeholder: "Ex: Direction Technique — SFBT" },
  { name: "position", label: "Position", type: "number" },
  { name: "published", label: "Publié", type: "boolean" },
  { name: "image_url", label: "Image", type: "image", uploadEndpoint: "/api/thanks/upload" },
];

export default function AdminThanksPage() {
  return (
    <CrudTable<ThanksLetter>
      title="Lettres de remerciement"
      resource="thanks"
      listPath="/api/thanks/all"
      listKey="items"
      itemKey="letter"
      columns={columns}
      fields={fields}
      initialValues={{ position: 0, published: true }}
    />
  );
}
