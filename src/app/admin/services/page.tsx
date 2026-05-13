"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Service } from "@/lib/api-client";

const columns: Column<Service>[] = [
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
    key: "short_desc",
    label: "Description",
    render: (r) => <span className="line-clamp-1 text-gray-600">{r.short_desc || "—"}</span>,
  },
  { key: "published", label: "Publié", render: (r) => (r.published ? "✓" : "—") },
];

const ICONS = [
  "Building2",
  "Factory",
  "Wrench",
  "Zap",
  "ShieldCheck",
  "Hammer",
  "Cog",
  "Package",
];

const fields: Field[] = [
  { name: "title", label: "Titre", required: true },
  { name: "short_desc", label: "Description courte" },
  { name: "long_desc", label: "Description longue", type: "textarea" },
  { name: "icon", label: "Icône (nom lucide)", type: "select", options: ICONS },
  { name: "image_url", label: "Image", type: "image", uploadEndpoint: "/api/services/upload" },
  { name: "position", label: "Position (ordre)", type: "number" },
  { name: "published", label: "Publié", type: "boolean" },
];

export default function AdminServicesPage() {
  return (
    <CrudTable<Service>
      title="Services"
      resource="services"
      listKey="items"
      itemKey="service"
      columns={columns}
      fields={fields}
      initialValues={{ published: true, position: 99 }}
    />
  );
}
