"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Announcement } from "@/lib/api-client";

const typeColors: Record<string, string> = {
  job: "bg-blue-100 text-blue-700",
  promotion: "bg-orange-100 text-orange-700",
  news: "bg-green-100 text-green-700",
};

const columns: Column<Announcement>[] = [
  { key: "title", label: "Titre" },
  {
    key: "type",
    label: "Type",
    render: (r) =>
      r.type ? (
        <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase ${typeColors[r.type] || ""}`}>
          {r.type}
        </span>
      ) : (
        "—"
      ),
  },
  {
    key: "published",
    label: "Publié",
    render: (r) => (r.published ? "✓" : "—"),
  },
  {
    key: "created_at",
    label: "Créé le",
    render: (r) => new Date(r.created_at).toLocaleDateString(),
  },
];

const fields: Field[] = [
  { name: "title", label: "Titre", required: true },
  { name: "body", label: "Contenu", type: "textarea" },
  { name: "type", label: "Type", type: "select", options: ["job", "promotion", "news"] },
  { name: "image_url", label: "Image", type: "image", uploadEndpoint: "/api/announcements/upload" },
  { name: "published", label: "Publié", type: "boolean" },
];

export default function AdminAnnouncementsPage() {
  return (
    <CrudTable<Announcement>
      title="Annonces"
      resource="announcements"
      listKey="items"
      itemKey="announcement"
      columns={columns}
      fields={fields}
      initialValues={{ published: true }}
    />
  );
}
